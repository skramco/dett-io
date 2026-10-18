'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Rocket, ArrowForward, CheckCircle, NotificationsActive } from '@mui/icons-material';
import { trackEvent } from '@/lib/analytics';
import { getLoanKnowCta } from '@/lib/loanknow/ctaContent';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONSENT_TEXT =
  'Email me when LoanKnow launches and save my calculator numbers with my request. One launch email, no marketing lists — withdraw anytime.';

// When the live LoanKnow flow is ready, set NEXT_PUBLIC_LOANKNOW_URL and the
// CTA links straight to it (carrying calculator state) instead of capturing emails.
const LOANKNOW_LIVE_URL = process.env.NEXT_PUBLIC_LOANKNOW_URL;

export interface LoanKnowCTAProps {
  calculatorSlug?: string;
  calculatorName: string;
  inputs?: Record<string, unknown>;
  summary?: string;
  details?: Record<string, number | string>;
  insights?: string[];
}

export function LoanKnowCTA({
  calculatorSlug,
  calculatorName,
  inputs,
  summary,
  details,
  insights,
}: LoanKnowCTAProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cta = useMemo(() => getLoanKnowCta(calculatorSlug, inputs), [calculatorSlug, inputs]);
  const hasNumbers = !!inputs && Object.keys(inputs).length > 0;

  const liveUrl = useMemo(() => {
    if (!LOANKNOW_LIVE_URL) return null;
    try {
      const url = new URL(LOANKNOW_LIVE_URL);
      url.searchParams.set('utm_source', 'dett');
      url.searchParams.set('utm_medium', 'calculator_cta');
      if (calculatorSlug) {
        url.searchParams.set('utm_campaign', calculatorSlug);
        url.searchParams.set('calc', calculatorSlug);
      }
      if (inputs) {
        Object.entries(inputs).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
          }
        });
      }
      return url.toString();
    } catch {
      return LOANKNOW_LIVE_URL;
    }
  }, [calculatorSlug, inputs]);

  const handleSubmit = async () => {
    setError(null);
    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please check the consent box so we can save your email.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/loanknow-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consentText: CONSENT_TEXT,
          calculatorSlug: calculatorSlug || 'unknown',
          calculatorName,
          ctaLabel: cta.headline,
          inputs: inputs || {},
          summary,
          details,
          insights,
          calculatorPath: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });

      if (response.ok) {
        trackEvent('loanknow_lead_submitted', {
          calculator_slug: calculatorSlug,
          cta_label: cta.headline,
        });
        setSubmitted(true);
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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

      {submitted ? (
        <Stack spacing={2} alignItems="flex-start">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircle sx={{ color: '#16A34A', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#312E81' }}>
              You&apos;re on the list
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#4338CA', maxWidth: 600 }}>
            {hasNumbers
              ? 'Your numbers are saved with your request. We just sent you a link to this exact calculation, and we\u2019ll email you once when LoanKnow launches so lenders can compete for your business.'
              : 'We\u2019ll email you once when LoanKnow launches so lenders can compete for your business — anonymously and for free.'}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Rocket sx={{ color: '#6366F1', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#312E81' }}>
              {cta.headline}
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ color: '#4338CA', maxWidth: 600 }}>
            {cta.body}
          </Typography>

          {liveUrl ? (
            <Box>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                href={liveUrl}
                target="_blank"
                rel="noopener"
                onClick={() =>
                  trackEvent('cta_click', {
                    calculator_slug: calculatorSlug,
                    cta_label: cta.headline,
                    link_url: liveUrl,
                  })
                }
                sx={{
                  bgcolor: '#6366F1',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  '&:hover': { bgcolor: '#4F46E5' },
                }}
              >
                {hasNumbers ? 'Continue on LoanKnow with my numbers' : 'Continue on LoanKnow'}
              </Button>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#6366F1' }}>
                Free and anonymous — your calculator inputs carry over automatically.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ maxWidth: 560 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !email || !consent}
                  startIcon={
                    submitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <NotificationsActive />
                    )
                  }
                  sx={{
                    bgcolor: '#6366F1',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    '&:hover': { bgcolor: '#4F46E5' },
                    '&.Mui-disabled': { bgcolor: 'rgba(99, 102, 241, 0.35)', color: 'white' },
                  }}
                >
                  {submitting ? 'Saving…' : hasNumbers ? cta.buttonLabel : 'Notify me at launch'}
                </Button>
              </Stack>

              <FormControlLabel
                sx={{ mt: 1.5, alignItems: 'flex-start', ml: 0 }}
                control={
                  <Checkbox
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={submitting}
                    size="small"
                    sx={{ pt: 0, color: '#6366F1', '&.Mui-checked': { color: '#6366F1' } }}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ color: '#4338CA', lineHeight: 1.5 }}>
                    {CONSENT_TEXT}
                  </Typography>
                }
              />

              {error && (
                <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2, maxWidth: 560 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
        </Stack>
      )}
    </Paper>
  );
}
