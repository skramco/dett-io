'use client';

import { Box } from '@mui/material';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { CLOZABLE_CTA_ENABLED } from '@/lib/clozable';

interface ClozableCTAProps {
  calculatorSlug?: string;
}

/**
 * Post-results Clozable mention. Intentionally a single quiet sentence — no
 * promo card, no forms, no contact capture — so it stays consistent with
 * dett.io's "free, no signup, no sales" positioning. Hidden globally via
 * CLOZABLE_CTA_ENABLED in lib/clozable.ts.
 */
export function ClozableCTA({ calculatorSlug }: ClozableCTAProps) {
  if (!CLOZABLE_CTA_ENABLED) return null;

  return (
    <Box sx={{ mt: 3, mb: 1, textAlign: 'center' }}>
      <ClozableBlurb placement="calculator" calculatorSlug={calculatorSlug} />
    </Box>
  );
}
