'use client';

import { formatCurrency } from '@/lib/format';

import { createContext, useContext } from 'react';
import dynamic from 'next/dynamic';
import { Box, LinearProgress, Typography } from '@mui/material';
import type {
  DonutChartProps,
  AmortizationChartProps,
  ComparisonBarChartProps,
  TimelineChartProps,
  RangeTimelineChartProps,
  StackedBarChartProps,
  CategoryStackedBarChartProps,
} from './ChartComponents';

// next/dynamic with `ssr: false` renders the `loading` component into the
// server HTML. Instead of only showing "Loading chart...", each lazy chart
// wrapper below derives a textual summary from the same data the chart will
// render and passes it down via context, so the key numbers are present in
// the initial HTML for crawlers and users without (or still waiting on) JS.

interface ChartFallback {
  summary: string | null;
  height?: number;
}

const ChartFallbackContext = createContext<ChartFallback>({ summary: null });

function ChartSkeleton({ height: defaultHeight = 280 }: { height?: number }) {
  const { summary, height } = useContext(ChartFallbackContext);
  return (
    <Box
      sx={{
        height: height ?? defaultHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        bgcolor: '#F8FAFC',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
      }}
    >
      {summary ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 560 }}
        >
          {summary}
        </Typography>
      ) : (
        <>
          <Box sx={{ width: '60%', mb: 1 }}>
            <LinearProgress sx={{ borderRadius: 1 }} />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Loading chart...
          </Typography>
        </>
      )}
    </Box>
  );
}

const fmtUSD = formatCurrency;

function summarizeDonut({ data, centerLabel, centerValue }: DonutChartProps): string | null {
  if (!data || data.length === 0) return null;
  const parts = data.filter((d) => d.value > 0).map((d) => `${d.name} ${fmtUSD(d.value)}`);
  const total = data.reduce((sum, d) => sum + Math.max(d.value, 0), 0);
  const lead = centerValue
    ? `${centerValue}${centerLabel ? ` ${centerLabel}` : ''}`
    : `${fmtUSD(total)} total`;
  return parts.length > 0 ? `${lead}: ${parts.join(', ')}.` : `${lead}.`;
}

function summarizeAmortization({ data }: AmortizationChartProps): string | null {
  if (!data || data.length === 0) return null;
  const first = data[0];
  const last = data[data.length - 1];
  if (data.length === 1) {
    return `Loan balance: ${fmtUSD(first.balance)} in year ${first.year}.`;
  }
  const ending =
    last.balance <= 1
      ? `is fully paid off by year ${last.year}`
      : `falls to ${fmtUSD(last.balance)} by year ${last.year}`;
  return `Loan balance starts at ${fmtUSD(first.balance)} and ${ending}.`;
}

function summarizeComparison({ data, labels }: ComparisonBarChartProps): string | null {
  if (!data || data.length === 0) return null;
  const currentLabel = labels?.current ?? 'Current';
  const newLabel = labels?.new ?? 'New';
  const rows = data
    .slice(0, 4)
    .map((d) => `${d.name}: ${currentLabel} ${fmtUSD(d.current)}, ${newLabel} ${fmtUSD(d.new)}`);
  return `${rows.join('; ')}.`;
}

function summarizeTimeline({ data, breakEvenMonth, labels }: TimelineChartProps): string | null {
  if (!data || data.length === 0) return null;
  const labelA = labels?.optionA ?? 'Option A';
  const labelB = labels?.optionB ?? 'Option B';
  const last = data[data.length - 1];
  const breakEven = breakEvenMonth ? `; break-even at month ${Math.round(breakEvenMonth)}` : '';
  return `After ${last.month} months, ${labelA} totals ${fmtUSD(last.optionA)} and ${labelB} totals ${fmtUSD(last.optionB)}${breakEven}.`;
}

function summarizeStacked({ data }: StackedBarChartProps): string | null {
  if (!data || data.length === 0) return null;
  const describe = (d: StackedBarChartProps['data'][number]) => {
    const parts = [`principal ${fmtUSD(d.principal)}`, `interest ${fmtUSD(d.interest)}`];
    if (d.taxes !== undefined) parts.push(`taxes ${fmtUSD(d.taxes)}`);
    if (d.insurance !== undefined) parts.push(`insurance ${fmtUSD(d.insurance)}`);
    return parts.join(', ');
  };
  const first = data[0];
  if (data.length === 1) return `Year ${first.year}: ${describe(first)}.`;
  const last = data[data.length - 1];
  return `Year ${first.year}: ${describe(first)}; year ${last.year}: ${describe(last)}.`;
}

function summarizeRangeTimeline({
  data,
  xKey = 'year',
  bandLow,
  bandHigh,
  bandLabel = 'P10–P90 range',
  lines = [],
}: RangeTimelineChartProps): string | null {
  if (!data || data.length === 0) return null;
  const last = data[data.length - 1];
  const x = last[xKey];
  const low = Number(last[bandLow] ?? 0);
  const high = Number(last[bandHigh] ?? 0);
  const lineBits = lines
    .slice(0, 3)
    .map((line) => `${line.name} ${fmtUSD(Number(last[line.dataKey] ?? 0))}`);
  const range = `${bandLabel} ${fmtUSD(low)} to ${fmtUSD(high)}`;
  const rest = lineBits.length > 0 ? `; ${lineBits.join(', ')}` : '';
  return `At ${xKey} ${x}: ${range}${rest}.`;
}

function summarizeCategoryStacked({ data, series, nameKey = 'name' }: CategoryStackedBarChartProps): string | null {
  if (!data || data.length === 0 || !series || series.length === 0) return null;
  const rows = data.slice(0, 4).map((row) => {
    const label = String(row[nameKey] ?? '');
    const parts = series
      .map((s) => {
        const value = Number(row[s.dataKey] ?? 0);
        return value > 0 ? `${s.name} ${fmtUSD(value)}` : null;
      })
      .filter((part): part is string => Boolean(part));
    return parts.length > 0 ? `${label}: ${parts.join(', ')}` : label;
  });
  return `${rows.join('; ')}.`;
}

// Dynamically import each chart component so recharts stays code-split.
const DynamicDonutChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.DonutChart })),
  { loading: () => <ChartSkeleton height={280} />, ssr: false }
);

const DynamicAmortizationChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.AmortizationChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

const DynamicComparisonBarChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.ComparisonBarChart })),
  { loading: () => <ChartSkeleton height={280} />, ssr: false }
);

const DynamicTimelineChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.TimelineChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

const DynamicRangeTimelineChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.RangeTimelineChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

const DynamicStackedBarChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.StackedBarChart })),
  { loading: () => <ChartSkeleton height={300} />, ssr: false }
);

const DynamicCategoryStackedBarChart = dynamic(
  () => import('./ChartComponents').then((mod) => ({ default: mod.CategoryStackedBarChart })),
  { loading: () => <ChartSkeleton height={220} />, ssr: false }
);

export function LazyDonutChart(props: DonutChartProps) {
  return (
    <ChartFallbackContext.Provider value={{ summary: summarizeDonut(props), height: props.height }}>
      <DynamicDonutChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

export function LazyAmortizationChart(props: AmortizationChartProps) {
  return (
    <ChartFallbackContext.Provider
      value={{ summary: summarizeAmortization(props), height: props.height }}
    >
      <DynamicAmortizationChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

export function LazyComparisonBarChart(props: ComparisonBarChartProps) {
  return (
    <ChartFallbackContext.Provider
      value={{ summary: summarizeComparison(props), height: props.height }}
    >
      <DynamicComparisonBarChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

export function LazyTimelineChart(props: TimelineChartProps) {
  return (
    <ChartFallbackContext.Provider
      value={{ summary: summarizeTimeline(props), height: props.height }}
    >
      <DynamicTimelineChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

export function LazyRangeTimelineChart(props: RangeTimelineChartProps) {
  return (
    <ChartFallbackContext.Provider
      value={{ summary: summarizeRangeTimeline(props), height: props.height }}
    >
      <DynamicRangeTimelineChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

export function LazyStackedBarChart(props: StackedBarChartProps) {
  return (
    <ChartFallbackContext.Provider
      value={{ summary: summarizeStacked(props), height: props.height }}
    >
      <DynamicStackedBarChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

export function LazyCategoryStackedBarChart(props: CategoryStackedBarChartProps) {
  return (
    <ChartFallbackContext.Provider
      value={{ summary: summarizeCategoryStacked(props), height: props.height }}
    >
      <DynamicCategoryStackedBarChart {...props} />
    </ChartFallbackContext.Provider>
  );
}

// Re-export non-recharts components directly (no lazy needed — they're lightweight).
// IMPORTANT: these come from ChartPrimitives, NOT ChartComponents — a static
// re-export from ChartComponents would pull recharts into the page bundle and
// defeat the code-splitting above.
export { HorizontalBar, ChartLegend, CHART_COLORS } from './ChartPrimitives';
