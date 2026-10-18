'use client';

import { lazy, Suspense, useSyncExternalStore, type ComponentType } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import type {
  DonutChartProps,
  AmortizationChartProps,
  ComparisonBarChartProps,
  TimelineChartProps,
  StackedBarChartProps,
} from './ChartComponents';

/**
 * Each chart is loaded with React.lazy so recharts stays code-split out of the
 * initial bundle. Until the chart renders (during SSR, hydration, and while the
 * recharts chunk downloads), we show a static textual summary of the chart's
 * data derived from its props — so crawlers and no-JS/slow clients get the key
 * numbers directly in the initial HTML instead of just "Loading chart...".
 */

const fmtUsd = (value: number) => `$${Math.round(value).toLocaleString()}`;

function ChartFallback({ height = 280, summary }: { height?: number; summary?: string }) {
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
        px: 3,
        textAlign: 'center',
      }}
    >
      {summary && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 520 }}>
          {summary}
        </Typography>
      )}
      <Box sx={{ width: '60%', mb: 1 }}>
        <LinearProgress sx={{ borderRadius: 1 }} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Loading interactive chart...
      </Typography>
    </Box>
  );
}

// false during SSR and the hydration render, true once running on the client
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Builds a lazy chart wrapper: renders the summary fallback during SSR and
 * while the chart chunk loads, then swaps in the real chart client-side.
 */
function createLazyChart<P extends { height?: number }>(
  Chart: ComponentType<P>,
  defaultHeight: number,
  summarize: (props: P) => string | undefined
) {
  return function LazyChart(props: P & { summary?: string }) {
    const { summary, ...chartProps } = props;
    const mounted = useMounted();
    const fallback = (
      <ChartFallback
        height={chartProps.height ?? defaultHeight}
        summary={summary ?? summarize(chartProps as unknown as P)}
      />
    );

    // Not rendering the lazy component before mount keeps recharts out of SSR
    // and guarantees the summary text appears in the server-rendered HTML.
    if (!mounted) return fallback;

    return (
      <Suspense fallback={fallback}>
        <Chart {...(chartProps as unknown as P)} />
      </Suspense>
    );
  };
}

// ---------- Summary generators (key numbers as a sentence) ----------

function summarizeDonut({ data, centerValue, centerLabel }: DonutChartProps): string | undefined {
  if (!data || data.length === 0) return undefined;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const parts = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
      return `${d.name} ${fmtUsd(d.value)} (${pct}%)`;
    });
  const headline = centerValue
    ? `${centerValue}${centerLabel ? ` ${centerLabel}` : ''}`
    : fmtUsd(total);
  return `Total ${headline}: ${parts.join(', ')}.`;
}

function summarizeAmortization({ data }: AmortizationChartProps): string | undefined {
  if (!data || data.length === 0) return undefined;
  const first = data[0];
  const last = data[data.length - 1];
  return `Remaining loan balance declines from ${fmtUsd(first.balance)} in year ${first.year} to ${fmtUsd(last.balance)} by year ${last.year}.`;
}

function summarizeComparison({ data, labels }: ComparisonBarChartProps): string | undefined {
  if (!data || data.length === 0) return undefined;
  const { current = 'Current', new: next = 'New' } = labels ?? {};
  const parts = data.map(
    (d) => `${d.name}: ${current} ${fmtUsd(d.current)} vs ${next} ${fmtUsd(d.new)}`
  );
  return `${parts.join('; ')}.`;
}

function summarizeTimeline({ data, labels, breakEvenMonth }: TimelineChartProps): string | undefined {
  if (!data || data.length === 0) return undefined;
  const { optionA = 'Option A', optionB = 'Option B' } = labels ?? {};
  const last = data[data.length - 1];
  const breakEven = breakEvenMonth
    ? ` Break-even occurs around month ${breakEvenMonth}.`
    : '';
  return `After ${last.month} months, ${optionA} totals ${fmtUsd(last.optionA)} vs ${optionB} at ${fmtUsd(last.optionB)}.${breakEven}`;
}

function summarizeStacked({ data }: StackedBarChartProps): string | undefined {
  if (!data || data.length === 0) return undefined;
  const first = data[0];
  const last = data[data.length - 1];
  const describe = (d: typeof first) => {
    const extras = [
      d.taxes !== undefined ? `taxes ${fmtUsd(d.taxes)}` : null,
      d.insurance !== undefined ? `insurance ${fmtUsd(d.insurance)}` : null,
    ].filter(Boolean);
    return `principal ${fmtUsd(d.principal)}, interest ${fmtUsd(d.interest)}${extras.length ? `, ${extras.join(', ')}` : ''}`;
  };
  if (data.length === 1) {
    return `Year ${first.year}: ${describe(first)}.`;
  }
  return `Year ${first.year}: ${describe(first)}. By year ${last.year}: ${describe(last)}.`;
}

// ---------- Lazily loaded chart components (recharts is code-split) ----------

const DonutChartImpl = lazy(() =>
  import('./ChartComponents').then((mod) => ({ default: mod.DonutChart }))
);
const AmortizationChartImpl = lazy(() =>
  import('./ChartComponents').then((mod) => ({ default: mod.AmortizationChart }))
);
const ComparisonBarChartImpl = lazy(() =>
  import('./ChartComponents').then((mod) => ({ default: mod.ComparisonBarChart }))
);
const TimelineChartImpl = lazy(() =>
  import('./ChartComponents').then((mod) => ({ default: mod.TimelineChart }))
);
const StackedBarChartImpl = lazy(() =>
  import('./ChartComponents').then((mod) => ({ default: mod.StackedBarChart }))
);

export const LazyDonutChart = createLazyChart<DonutChartProps>(
  DonutChartImpl,
  280,
  summarizeDonut
);
export const LazyAmortizationChart = createLazyChart<AmortizationChartProps>(
  AmortizationChartImpl,
  300,
  summarizeAmortization
);
export const LazyComparisonBarChart = createLazyChart<ComparisonBarChartProps>(
  ComparisonBarChartImpl,
  280,
  summarizeComparison
);
export const LazyTimelineChart = createLazyChart<TimelineChartProps>(
  TimelineChartImpl,
  300,
  summarizeTimeline
);
export const LazyStackedBarChart = createLazyChart<StackedBarChartProps>(
  StackedBarChartImpl,
  300,
  summarizeStacked
);

// Re-export non-recharts components directly (lightweight, SSR-safe)
export { HorizontalBar, ChartLegend, CHART_COLORS } from './ChartPrimitives';
