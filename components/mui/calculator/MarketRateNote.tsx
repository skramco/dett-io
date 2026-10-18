'use client';

import { Box, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import type { MarketRates } from '@/lib/rates/types';

function formatAsOf(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Small attribution line shown under a rate input whose default comes from
 * live market data. Renders nothing while rates are loading or when the feed
 * is unavailable (static defaults apply, so there is no as-of date to show).
 */
export function MarketRateNote({ rates }: { rates: MarketRates | null }) {
  if (!rates) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: -1.5 }}>
      <TrendingUp sx={{ fontSize: 14, color: '#6B7280' }} />
      <Typography variant="caption" sx={{ color: '#6B7280' }}>
        Rate default: {rates.rate30}% U.S. weekly average as of {formatAsOf(rates.asOf)} ·{' '}
        {rates.sourceLabel}
      </Typography>
    </Box>
  );
}
