'use client';

import { Box, Typography, Stack, LinearProgress } from '@mui/material';
import { formatCurrency } from '@/lib/format';
import { RESULT_TOKENS } from '@/lib/theme/resultTokens';

// Brand accent plus restrained supporting hues — color is for series identity, not decoration.
// Lives here (not in ChartComponents) so pages can import colors/legend/bars
// without pulling the recharts bundle into their initial JS payload.
export const CHART_COLORS = {
  primary: RESULT_TOKENS.accent,
  secondary: '#047857',
  tertiary: '#4B5563',
  quaternary: '#0F4F8F',
  quinary: '#6B7280',
  gradient: [RESULT_TOKENS.accent, '#0F4F8F', '#047857', '#4B5563', '#6B7280'],
};

// ============================================
// CHART LEGEND - Custom legend component
// ============================================
interface ChartLegendProps {
  items: Array<{ name: string; value: string; color: string; percentage?: number }>;
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <Box key={index}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: 0.5,
                bgcolor: item.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: RESULT_TOKENS.chartLabel }}>
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: RESULT_TOKENS.chartLabel }}>
              {item.value}
            </Typography>
          </Stack>
          {item.percentage !== undefined && (
            <Box sx={{ ml: 4 }}>
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: item.color,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
}

// ============================================
// HORIZONTAL BAR - Simple visual comparison
// ============================================
interface HorizontalBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
  formatValue?: (value: number) => string;
}

export function HorizontalBar({
  label,
  value,
  maxValue,
  color = CHART_COLORS.primary,
  formatValue = (v) => formatCurrency(v),
}: HorizontalBarProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: RESULT_TOKENS.chartTick }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: RESULT_TOKENS.chartLabel }}>
          {formatValue(value)}
        </Typography>
      </Stack>
      <Box sx={{ position: 'relative', height: 12, bgcolor: '#E5E7EB', borderRadius: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${Math.min(percentage, 100)}%`,
            bgcolor: color,
            borderRadius: 1,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    </Box>
  );
}
