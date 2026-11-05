'use client';

import { Box, Typography } from '@mui/material';
import { trackEvent } from '@/lib/analytics';
import { CLOZABLE_CTA_ENABLED, getClozableWaitlistUrl } from '@/lib/clozable';

interface ClozableCTAProps {
  calculatorSlug?: string;
}

/**
 * Single-line Clozable mention (ENG-359). Intentionally subtle — no promo
 * card, no forms, no contact capture — to stay consistent with dett.io's
 * "free, no signup, no sales" positioning. Hidden globally via the
 * CLOZABLE_CTA_ENABLED flag in lib/clozable.ts (ENG-337).
 */
export function ClozableCTA({ calculatorSlug }: ClozableCTAProps) {
  if (!CLOZABLE_CTA_ENABLED) return null;

  const waitlistUrl = getClozableWaitlistUrl(calculatorSlug);

  const handleClick = () => {
    trackEvent('cta_click', {
      cta_label: 'clozable_waitlist',
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
        Clozable is coming soon →
      </Typography>
    </Box>
  );
}
