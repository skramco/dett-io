'use client';

import { Box, Divider, Link as MuiLink, Stack, Typography } from '@mui/material';
import { DEFAULT_RATES, RATES_SOURCE, formatRatesAsOf } from '@/lib/rates';
import { CONTENT_LAST_REVIEWED } from '@/lib/seo/contentDates';

/**
 * Per-page methodology, default-rate sourcing, and last-updated disclosure.
 * Shown on every calculator page for transparency / E-E-A-T.
 */
export function MethodologyNote() {
  const lastUpdatedLabel = new Date(`${CONTENT_LAST_REVIEWED}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <Box
      component="section"
      aria-label="Rates, methodology, and updates"
      sx={{ px: 2.5, py: 2.5, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          About the default rates &amp; methodology
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
          <strong>Default interest rates:</strong> pre-filled rates are based on the{' '}
          <MuiLink href={RATES_SOURCE.url} target="_blank" rel="noopener noreferrer" color="inherit" underline="always">
            {RATES_SOURCE.name}
          </MuiLink>{' '}
          national averages as of <strong>{formatRatesAsOf()}</strong> — {DEFAULT_RATES.thirtyYearFixed}% for a
          30-year fixed and {DEFAULT_RATES.fifteenYearFixed}% for a 15-year fixed. FHA, VA, and ARM defaults are
          estimates derived from typical spreads to the 30-year average. Defaults are starting points, not rate
          quotes — always replace them with the rate you&apos;re actually quoted.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
          <strong>Methodology:</strong> results use standard fully amortizing fixed-payment formulas
          (M&nbsp;=&nbsp;P&nbsp;×&nbsp;[r(1+r)<sup>n</sup>]&nbsp;/&nbsp;[(1+r)<sup>n</sup>&nbsp;−&nbsp;1]) applied
          month by month, with taxes, insurance, PMI/MIP, and fees added where applicable. Expand &ldquo;Show me the
          math&rdquo; above for the exact formulas and intermediate values behind this calculator&apos;s results.
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography variant="caption" color="text.disabled">
          Calculator content last updated {lastUpdatedLabel} · Maintained and reviewed by the Dett.io team
        </Typography>
      </Stack>
    </Box>
  );
}
