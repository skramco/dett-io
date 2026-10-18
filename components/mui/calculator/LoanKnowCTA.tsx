'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Rocket, ArrowForward, CheckCircle } from '@mui/icons-material';
import { trackEvent } from '@/lib/analytics';
import { getLoanKnowCtaCopy } from '@/lib/loanknow/ctaCopy';

const CONSENT_TEXT =
  'Save my numbers and email me when LoanKnow launches. I agree that Dett may store my email and these calculator inputs, and contact me about LoanKnow. No spam — unsubscribe anytime.';

export interface LoanKnowCTAProps {
  /** Calculator slug used to pick contextual copy and tag the lead */
  calculatorSlug?: string;
  /** Human-readable calculator name stored with the lead */
  calculatorName?: string;
  /** Current calculator inputs — persisted with the lead so state carries over */
  inputs?: Record<string, unknown>;
  /** Result summary persisted with the lead */
  summary?: string;
  /** Result details persisted with the lead */
  details?: Record<string, number | string>;
}

export function LoanKnowCTA({ calculatorSlug, calculatorName, inputs, summary, details }: LoanKnowCTAProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copy = useMemo(() => getLoanKnowCtaCopy(calculatorSlug, inputs), [calculatorSlug, inputs]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasNumbers = Boolean(inputs && Object.keys(inputs).length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !consent || status === 'sending') return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/loanknow-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consentText: CONSENT_TEXT,
          calculatorSlug: calculatorSlug || 'unknown',
          calculatorName: calculatorName || calculatorSlug || 'Calculator',
          inputs: inputs || {},
          summary: summary || '',
          details: details || {},
          sourcePath: typeof window !== 'undefined' ? window.location.pathname : '',
          ctaLabel: copy.buttonLabel,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      trackEvent('lead_captured', {
        calculator_slug: calculatorSlug,
        cta_label: copy.buttonLabel,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        border: '1px solid',
        borderColor: '#C7D2FE',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.08)',
          pointerEvents: 'none',
        }}
      />

      {status === 'success' ? (
        <Stack spacing={2} alignItems="flex-start">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircle sx={{ color: '#059669', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#312E81' }}>
              You&apos;re on the list!
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#4338CA', maxWidth: 600 }}>
            {hasNumbers
              ? 'We saved your numbers with your email. When LoanKnow launches, your data carries over — no re-entering anything.'
              : 'We saved your email. We\u2019ll let you know the moment LoanKnow launches.'}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
            <Rocket sx={{ color: '#6366F1', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#312E81' }}>
              {copy.headline}
            </Typography>
            <Chip
              label="LoanKnow"
              size="small"
              sx={{
                bgcolor: '#6366F1',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </Stack>

          <Typography variant="body1" sx={{ color: '#4338CA', maxWidth: 640 }}>
            {copy.body}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={1.5} sx={{ maxWidth: 560 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  label="Email address"
                  size="small"
                  fullWidth
                  required
                  disabled={status === 'sending'}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={status === 'sending' || !emailValid || !consent}
                  endIcon={status === 'sending' ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
                  sx={{
                    bgcolor: '#6366F1',
                    '&:hover': { bgcolor: '#4F46E5' },
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    px: 3,
                    flexShrink: 0,
                  }}
                >
                  {status === 'sending' ? 'Saving...' : copy.buttonLabel}
                </Button>
              </Stack>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={status === 'sending'}
                    size="small"
                    sx={{ color: '#6366F1', '&.Mui-checked': { color: '#6366F1' }, pt: 0 }}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ color: '#4338CA', lineHeight: 1.5 }}>
                    {CONSENT_TEXT}
                  </Typography>
                }
                sx={{ alignItems: 'flex-start', m: 0 }}
              />

              {status === 'error' && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Typography variant="caption" sx={{ color: '#6366F1', opacity: 0.8 }}>
                {hasNumbers
                  ? 'Your current calculator inputs are saved with your request so you can pick up where you left off.'
                  : 'Run the calculator first if you\u2019d like your numbers saved with your request.'}{' '}
                See our <a href="/privacy" style={{ color: 'inherit' }}>Privacy Policy</a>.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      )}
    </Paper>
  );
}
