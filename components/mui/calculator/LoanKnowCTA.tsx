'use client';

import { Box, Typography } from '@mui/material';
import { trackEvent } from '@/lib/analytics';
import { LOANKNOW_CTA_ENABLED, getLoanKnowWaitlistUrl } from '@/lib/loanknow';

interface LoanKnowCTAProps {
  calculatorSlug?: string;
}

/**
 * Single-line LoanKnow mention (ENG-359). Intentionally subtle — no promo
 * card, no forms, no contact capture — to stay consistent with dett.io's
 * "free, no signup, no sales" positioning. Hidden globally via the
 * LOANKNOW_CTA_ENABLED flag in lib/loanknow.ts (ENG-337).
 */
export function LoanKnowCTA({ calculatorSlug }: LoanKnowCTAProps) {
  if (!LOANKNOW_CTA_ENABLED) return null;

  const waitlistUrl = getLoanKnowWaitlistUrl(calculatorSlug);

  const handleClick = () => {
    trackEvent('cta_click', {
      cta_label: 'loanknow_waitlist',
      calculator_slug: calculatorSlug,
      link_url: waitlistUrl,
    });
  };

  return (
    <Box sx={{ mt: 6, textAlign: 'center' }}>
      <Typography
        component="a"
        href={waitlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        variant="body2"
        sx={{
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': {
            color: '#196bc0',
            textDecoration: 'underline',
          },
        }}
      >
        LoanKnow is coming soon →
      </Typography>
    </Box>
  );
}
