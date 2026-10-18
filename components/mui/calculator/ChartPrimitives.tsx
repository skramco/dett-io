'use client';

import { Box, Typography, Stack, LinearProgress } from '@mui/material';

// Premium color palette (shared by the recharts components and the
// lightweight primitives below — kept here so importing it doesn't pull
// recharts into the bundle)
export const CHART_COLORS = {
  primary: '#196bc0',
  secondary: '#10B981',
  tertiary: '#8B5CF6',
  quaternary: '#F59E0B',
  quinary: '#EF4444',
  gradient: ['#196bc0', '#0891B2', '#10B981', '#84CC16', '#F59E0B'],
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
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
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
  formatValue = (v) => `$${v.toLocaleString()}`
}: HorizontalBarProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
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
