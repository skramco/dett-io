'use client';

import { Box, Typography, Stack, Paper, Chip, Button } from '@mui/material';
import { Rocket, OpenInNew } from '@mui/icons-material';
import { trackEvent } from '@/lib/analytics';
import {
  LOANKNOW_CTA_ENABLED,
  getLoanKnowCtaCopy,
  getLoanKnowWaitlistUrl,
} from '@/lib/loanknow';

interface LoanKnowCTAProps {
  calculatorSlug?: string;
}

export function LoanKnowCTA({ calculatorSlug }: LoanKnowCTAProps) {
  if (!LOANKNOW_CTA_ENABLED) return null;

  const { headline, body } = getLoanKnowCtaCopy(calculatorSlug);
  const waitlistUrl = getLoanKnowWaitlistUrl(calculatorSlug);

  const handleClick = () => {
    trackEvent('cta_click', {
      cta_label: 'loanknow_waitlist',
      calculator_slug: calculatorSlug,
      link_url: waitlistUrl,
    });
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
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Rocket sx={{ color: '#6366F1', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#312E81' }}>
            {headline}
          </Typography>
          <Chip
            label="Launching Soon"
            size="small"
            sx={{
              bgcolor: '#4F46E5',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Stack>
        <Typography variant="body1" sx={{ color: '#4338CA', maxWidth: 600 }}>
          {body}
        </Typography>
        <Box>
          <Button
            variant="contained"
            component="a"
            href={waitlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: '#6366F1',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#4F46E5' },
            }}
          >
            Join the LoanKnow waitlist
          </Button>
        </Box>
        <Typography variant="caption" sx={{ color: '#6366F1', opacity: 0.8 }}>
          Opens loanknow.com. Free and anonymous — your calculator results stay on this page.
        </Typography>
      </Stack>
    </Paper>
  );
}
