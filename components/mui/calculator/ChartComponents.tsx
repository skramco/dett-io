'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { formatAxisCurrency } from '@/lib/format/currency';
import { RESULT_TOKENS } from '@/lib/theme/resultTokens';
import { CHART_COLORS } from './ChartPrimitives';

export { CHART_COLORS, ChartLegend, HorizontalBar } from './ChartPrimitives';

const AXIS_TICK = { fontSize: 12, fill: RESULT_TOKENS.chartTick };
const AXIS_LINE = { stroke: RESULT_TOKENS.border };

function ChartLegendText(value: ReactNode) {
  return (
    <span style={{ color: RESULT_TOKENS.chartLabel, fontSize: 13, fontWeight: 500 }}>
      {value}
    </span>
  );
}

// Loading placeholder
function ChartLoading({ height }: { height: number }) {
  return (
    <Box 
      sx={{ 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#F3F4F6', 
        borderRadius: 2,
        border: '1px solid #E5E7EB',
      }}
    >
      <Box sx={{ width: '60%', mb: 1 }}>
        <LinearProgress sx={{ borderRadius: 1 }} />
      </Box>
      <Typography variant="caption" color="text.secondary">Loading visualization...</Typography>
    </Box>
  );
}

// ============================================
// DONUT CHART - Payment breakdown
// ============================================
export interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

export function DonutChart({ data, centerLabel, centerValue, height = 280 }: DonutChartProps) {
  const [mounted, setMounted] = useState(false);
  const colors = CHART_COLORS.gradient;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChartLoading height={height} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ position: 'relative', height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center label */}
      {(centerLabel || centerValue) && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {centerValue && (
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
              {centerValue}
            </Typography>
          )}
          {centerLabel && (
            <Typography variant="caption" sx={{ color: RESULT_TOKENS.chartTick }}>
              {centerLabel}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

// ============================================
// AMORTIZATION CHART - Loan balance over time
// ============================================
export interface AmortizationChartProps {
  data: Array<{ year: number; balance: number; principal?: number; interest?: number }>;
  height?: number;
}

export function AmortizationChart({ data, height = 300 }: AmortizationChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChartLoading height={height} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="year" 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
            label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: RESULT_TOKENS.chartTick, fontSize: 12 }}
          />
          <YAxis 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
            tickFormatter={formatAxisCurrency}
            width={68}
          />
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Remaining Balance"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            fill="url(#balanceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

// ============================================
// COMPARISON BAR CHART - Side by side comparison
// ============================================
export interface ComparisonBarChartProps {
  data: Array<{ name: string; current: number; new: number }>;
  height?: number;
  labels?: { current: string; new: string };
}

export function ComparisonBarChart({ 
  data, 
  height = 280,
  labels = { current: 'Current', new: 'New' }
}: ComparisonBarChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChartLoading height={height} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
          />
          <YAxis 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
            tickFormatter={formatAxisCurrency}
            width={68}
          />
          <Tooltip
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend formatter={ChartLegendText} />
          <Bar dataKey="current" name={labels.current} fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="new" name={labels.new} fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

// ============================================
// TIMELINE CHART - Break-even / crossover analysis
// ============================================
export interface TimelineChartProps {
  data: Array<{ month: number; optionA: number; optionB: number }>;
  breakEvenMonth?: number;
  height?: number;
  labels?: { optionA: string; optionB: string };
}

export function TimelineChart({ 
  data, 
  breakEvenMonth,
  height = 300,
  labels = { optionA: 'Option A', optionB: 'Option B' }
}: TimelineChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChartLoading height={height} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
            label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: RESULT_TOKENS.chartTick, fontSize: 12 }}
          />
          <YAxis 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
            tickFormatter={formatAxisCurrency}
            width={68}
          />
          <Tooltip
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
            labelFormatter={(label) => `Month ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend formatter={ChartLegendText} />
          {breakEvenMonth && (
            <ReferenceLine 
              x={breakEvenMonth} 
              stroke={CHART_COLORS.secondary} 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: 'Break-even', fill: CHART_COLORS.secondary, fontSize: 12, position: 'top' }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="optionA" 
            name={labels.optionA}
            stroke={CHART_COLORS.primary} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: CHART_COLORS.primary }}
          />
          <Line 
            type="monotone" 
            dataKey="optionB" 
            name={labels.optionB}
            stroke={CHART_COLORS.tertiary} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: CHART_COLORS.tertiary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

// ============================================
// STACKED BAR CHART - Payment composition over time
// ============================================
export interface StackedBarChartProps {
  data: Array<{ year: number; principal: number; interest: number; taxes?: number; insurance?: number }>;
  height?: number;
}

export function StackedBarChart({ data, height = 300 }: StackedBarChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChartLoading height={height} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="year" 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
          />
          <YAxis 
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={AXIS_LINE}
            tickFormatter={formatAxisCurrency}
            width={68}
          />
          <Tooltip
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend formatter={ChartLegendText} />
          <Bar dataKey="principal" name="Principal" stackId="a" fill={CHART_COLORS.primary} />
          <Bar dataKey="interest" name="Interest" stackId="a" fill={CHART_COLORS.quaternary} />
          {data[0]?.taxes !== undefined && (
            <Bar dataKey="taxes" name="Taxes" stackId="a" fill={CHART_COLORS.tertiary} />
          )}
          {data[0]?.insurance !== undefined && (
            <Bar dataKey="insurance" name="Insurance" stackId="a" fill={CHART_COLORS.secondary} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

// ============================================
// CATEGORY STACKED BAR - Closing-cost / composition breakdown
// ============================================
export interface CategoryStackedBarChartProps {
  data: Array<Record<string, string | number>>;
  series: Array<{ dataKey: string; name: string; color: string }>;
  nameKey?: string;
  height?: number;
  layout?: 'horizontal' | 'vertical';
  showLegend?: boolean;
}

export function CategoryStackedBarChart({
  data,
  series,
  nameKey = 'name',
  height = 220,
  layout = 'vertical',
  showLegend = true,
}: CategoryStackedBarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChartLoading height={height} />;
  }

  if (!data || data.length === 0 || series.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  const isVertical = layout === 'vertical';

  return (
    <Box sx={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isVertical ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 24, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={RESULT_TOKENS.border} />
          {isVertical ? (
            <>
              <XAxis
                type="number"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={AXIS_LINE}
                tickFormatter={formatAxisCurrency}
              />
              <YAxis
                type="category"
                dataKey={nameKey}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={AXIS_LINE}
                width={110}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={nameKey}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={AXIS_LINE}
              />
              <YAxis
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={AXIS_LINE}
                tickFormatter={formatAxisCurrency}
                width={68}
              />
            </>
          )}
          <Tooltip
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          {showLegend && <Legend formatter={ChartLegendText} />}
          {series.map((s) => (
            <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name} stackId="a" fill={s.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

