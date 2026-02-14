'use client';

import dynamic from 'next/dynamic';
import { Box, LinearProgress, Typography } from '@mui/material';

// Skeleton placeholder while recharts loads
function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F8FAFC',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
      }}
    >
      <Box sx={{ width: '60%', mb: 1 }}>
        <LinearProgress sx={{ borderRadius: 1 }} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Loading chart...
      </Typography>
    </Box>
  );
}

// Dynamically import each chart component so recharts is code-split
export const LazyDonutChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.DonutChart })),
  { loading: () => <ChartSkeleton height={280} />, ssr: false }
);

export const LazyAmortizationChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.AmortizationChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

export const LazyComparisonBarChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.ComparisonBarChart })),
  { loading: () => <ChartSkeleton height={280} />, ssr: false }
);

export const LazyTimelineChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.TimelineChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

export const LazyStackedBarChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.StackedBarChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

// Re-export non-recharts components directly (no lazy needed — they're lightweight)
export { HorizontalBar, ChartLegend, CHART_COLORS } from './ChartComponents';
