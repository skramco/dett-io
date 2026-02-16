'use client';

import { useState, useCallback, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import {
  Box,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Share,
  Email,
  PictureAsPdf,
  ContentCopy,
  Check,
  Close,
} from '@mui/icons-material';

export interface ActionBarProps {
  /** Calculator name for email subject and PDF title */
  calculatorName: string;
  /** Summary text from calculator result */
  summary: string;
  /** Details record from calculator result */
  details: Record<string, number | string>;
  /** Insights array from calculator result */
  insights: string[];
  /** Current calculator inputs to encode in share URL */
  inputs: Record<string, unknown>;
  /** The results container ref for PDF capture */
  resultsRef?: React.RefObject<HTMLElement | null>;
}

export function ActionBar({
  calculatorName,
  summary,
  details,
  insights,
  inputs,
  resultsRef,
}: ActionBarProps) {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareURL, setShareURL] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // --- SHARE URL ---
  const handleShareURL = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    setShareURL(url);
    setLinkCopied(false);
    setShareDialogOpen(true);
  }, [inputs]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setLinkCopied(true);
      trackEvent('calculator_link_shared', { calculator_slug: calculatorName });
      setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      setSnackbar({ open: true, message: 'Failed to copy. Select the link and copy manually.', severity: 'error' });
    }
  }, [shareURL]);

  // --- EMAIL RESULTS ---
  const handleEmailSend = useCallback(async () => {
    if (!emailAddress) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'error' });
      return;
    }

    setEmailSending(true);
    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailAddress,
          calculatorName,
          summary,
          details,
          insights,
          inputs,
          calculatorPath: window.location.pathname,
        }),
      });

      if (response.ok) {
        trackEvent('calculator_result_emailed', { calculator_slug: calculatorName });
        setSnackbar({ open: true, message: `Results sent to ${emailAddress}!`, severity: 'success' });
        setEmailDialogOpen(false);
        setEmailAddress('');
      } else {
        const data = await response.json();
        setSnackbar({ open: true, message: data.error || 'Failed to send email.', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to send email. Please try again.', severity: 'error' });
    } finally {
      setEmailSending(false);
    }
  }, [emailAddress, calculatorName, summary, details, insights]);

  // --- PDF DOWNLOAD ---
  const handlePDFDownload = useCallback(async () => {
    setPdfGenerating(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      // Capture the results area — try ref first, then the right-side results column (lg:7 grid), then the full calculator content
      const element = resultsRef?.current
        || document.querySelector('[data-pdf-capture]') as HTMLElement
        || document.querySelector('.MuiGrid2-root:last-child .MuiStack-root') as HTMLElement
        || document.querySelector('.MuiContainer-root .MuiGrid2-root') as HTMLElement;
      if (!element) {
        setSnackbar({ open: true, message: 'Could not find results to export.', severity: 'error' });
        setPdfGenerating(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // A4 width minus margins
      const pageHeight = 277; // A4 height minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(15, 23, 42); // slate-900
      pdf.text('Dett', 15, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text('Free Mortgage Calculators | dett.io', 15, 22);

      // Calculator name
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.text(calculatorName, 15, 35);

      // Date
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 42);

      // Results image
      let yPosition = 48;
      let remainingHeight = imgHeight;

      if (imgHeight <= pageHeight - yPosition) {
        // Fits on one page
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      } else {
        // Multi-page
        let sourceY = 0;
        const sourceWidth = canvas.width;
        const sourceHeight = canvas.height;

        while (remainingHeight > 0) {
          const availableHeight = yPosition === 48 ? pageHeight - yPosition : pageHeight - 10;
          const sliceHeight = Math.min(remainingHeight, availableHeight);
          const sourceSliceHeight = (sliceHeight / imgHeight) * sourceHeight;

          // Create a slice canvas
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = sourceWidth;
          sliceCanvas.height = sourceSliceHeight;
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, sourceY, sourceWidth, sourceSliceHeight, 0, 0, sourceWidth, sourceSliceHeight);
            const sliceData = sliceCanvas.toDataURL('image/png');
            pdf.addImage(sliceData, 'PNG', 10, yPosition, imgWidth, sliceHeight);
          }

          remainingHeight -= sliceHeight;
          sourceY += sourceSliceHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
            yPosition = 10;
          }
        }
      }

      // Footer on last page
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text('This is an educational tool. Results are estimates and should not be considered financial advice.', 15, 290);
        pdf.text(`dett.io | Page ${i} of ${pageCount}`, 170, 290);
      }

      // Download
      const filename = `${calculatorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dett.pdf`;
      pdf.save(filename);
      trackEvent('calculator_pdf_downloaded', { calculator_slug: calculatorName });
      setSnackbar({ open: true, message: 'PDF downloaded!', severity: 'success' });
    } catch (err) {
      console.error('PDF generation error:', err);
      setSnackbar({ open: true, message: 'Failed to generate PDF. Please try again.', severity: 'error' });
    } finally {
      setPdfGenerating(false);
    }
  }, [calculatorName, resultsRef]);

  return (
    <>
      {/* Action Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          py: 2,
          px: 3,
          borderRadius: 3,
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tooltip title={linkCopied ? 'Link copied!' : 'Copy shareable link'}>
          <Button
            variant="outlined"
            size="small"
            startIcon={linkCopied ? <Check /> : <Share />}
            onClick={handleShareURL}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: linkCopied ? 'success.main' : 'text.secondary',
              borderColor: linkCopied ? 'success.main' : 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            {linkCopied ? 'Copied!' : 'Share'}
          </Button>
        </Tooltip>

        <Tooltip title="Email results to yourself">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Email />}
            onClick={() => setEmailDialogOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            Email
          </Button>
        </Tooltip>

        <Tooltip title="Download results as PDF">
          <Button
            variant="outlined"
            size="small"
            startIcon={pdfGenerating ? <CircularProgress size={16} /> : <PictureAsPdf />}
            onClick={handlePDFDownload}
            disabled={pdfGenerating}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            {pdfGenerating ? 'Generating...' : 'PDF'}
          </Button>
        </Tooltip>
      </Box>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Share Your Results
            </Typography>
            <IconButton size="small" onClick={() => setShareDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Anyone with this link will see the calculator pre-filled with your inputs.
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              value={shareURL}
              slotProps={{ input: { readOnly: true } }}
              onFocus={(e) => (e.target as HTMLInputElement).select()}
              variant="outlined"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace', fontSize: '0.85rem' } }}
            />
            <Tooltip title={linkCopied ? 'Copied!' : 'Copy link'}>
              <IconButton
                onClick={handleCopyLink}
                color={linkCopied ? 'success' : 'default'}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                {linkCopied ? <Check /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleCopyLink}
            startIcon={linkCopied ? <Check /> : <ContentCopy />}
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            {linkCopied ? 'Copied!' : 'Copy Link'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Email Your Results
            </Typography>
            <IconButton size="small" onClick={() => setEmailDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We&apos;ll send your {calculatorName} results to your inbox. No spam, no marketing — just your numbers.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Email Address"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEmailSend()}
            placeholder="you@example.com"
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setEmailDialogOpen(false)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEmailSend}
            disabled={emailSending || !emailAddress}
            startIcon={emailSending ? <CircularProgress size={16} color="inherit" /> : <Email />}
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            {emailSending ? 'Sending...' : 'Send Results'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
