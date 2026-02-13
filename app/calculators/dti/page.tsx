'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance,
  DirectionsCar,
  School,
  CreditCard,
  ChildCare,
  Home,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
} from '@/components/mui/calculator/InputPanel';
import {
  HeroMetric,
  MetricCard,
  InsightCallout,
  ResultsSection,
  EmptyResultsState,
} from '@/components/mui/calculator/ResultsPanel';
import {
  DonutChart,
  ChartLegend,
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateDTI } from '@/lib/calculators';
import type { DTIInputs } from '@/lib/calculators/dti';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const DTI_COLORS = {
  excellent: '#22C55E',
  good: '#3B82F6',
  acceptable: '#F59E0B',
  high: '#EF4444',
  veryHigh: '#991B1B',
};

function getDTIColor(dti: number): string {
  if (dti <= 28) return DTI_COLORS.excellent;
  if (dti <= 36) return DTI_COLORS.good;
  if (dti <= 43) return DTI_COLORS.acceptable;
  if (dti <= 50) return DTI_COLORS.high;
  return DTI_COLORS.veryHigh;
}

function getDTIIcon(rating: string) {
  if (rating === 'Excellent' || rating === 'Good') return <CheckCircle sx={{ color: DTI_COLORS.excellent }} />;
  if (rating === 'Acceptable') return <Warning sx={{ color: DTI_COLORS.acceptable }} />;
  return <ErrorIcon sx={{ color: DTI_COLORS.high }} />;
}

export default function DTICalculator() {
  const [inputs, setInputs] = useState<DTIInputs>({
    monthlyGrossIncome: 10000,
    mortgagePayment: 2200,
    propertyTax: 5400,
    homeInsurance: 1800,
    hoaFees: 0,
    carPayments: 450,
    studentLoans: 300,
    creditCardMinimums: 150,
    personalLoans: 0,
    childSupport: 0,
    otherDebts: 0,
  });

  const result = useMemo(() => {
    if (inputs.monthlyGrossIncome <= 0) return null;
    return calculateDTI(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof DTIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Chart data for donut
  const chartData = useMemo(() => {
    if (!result?.chartData) return [];
    const colors = [
      CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary,
      CHART_COLORS.quaternary, '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
    ];
    return result.chartData.map((item, index) => ({
      name: item.name as string,
      value: item.value as number,
      color: colors[index % colors.length],
    }));
  }, [result]);

  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalMonthlyDebts as number;
    const colors = [
      CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary,
      CHART_COLORS.quaternary, '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
    ];
    return result.chartData.map((item, index) => ({
      name: item.name as string,
      value: `$${fmt(item.value as number)}`,
      color: colors[index % colors.length],
      percentage: total > 0 ? ((item.value as number) / total) * 100 : 0,
    }));
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="dti"
      title="Debt-to-Income (DTI) Calculator"
      description="Calculate your front-end and back-end DTI ratios — the key numbers lenders use to determine how much mortgage you can qualify for. See exactly what lenders see."
      relatedCalculators={[
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
        { slug: 'refinance', name: 'Should I Refinance?' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Monthly Income" icon={<AccountBalance />}>
              <CurrencyInput
                label="Monthly Gross Income"
                value={inputs.monthlyGrossIncome}
                onChange={(v) => handleInputChange('monthlyGrossIncome', v)}
                helperText="Before taxes — all sources combined"
              />
            </InputSection>

            <InputSection title="Housing Costs" icon={<Home />} color="secondary">
              <CurrencyInput
                label="Mortgage Payment (P&I)"
                value={inputs.mortgagePayment}
                onChange={(v) => handleInputChange('mortgagePayment', v)}
                helperText="Principal and interest only"
              />
              <CurrencyInput
                label="Annual Property Tax"
                value={inputs.propertyTax}
                onChange={(v) => handleInputChange('propertyTax', v)}
              />
              <CurrencyInput
                label="Annual Home Insurance"
                value={inputs.homeInsurance}
                onChange={(v) => handleInputChange('homeInsurance', v)}
              />
              <CurrencyInput
                label="Monthly HOA Fees"
                value={inputs.hoaFees}
                onChange={(v) => handleInputChange('hoaFees', v)}
              />
            </InputSection>

            <InputSection title="Other Monthly Debts" icon={<CreditCard />}>
              <CurrencyInput
                label="Car Payments"
                value={inputs.carPayments}
                onChange={(v) => handleInputChange('carPayments', v)}
              />
              <CurrencyInput
                label="Student Loans"
                value={inputs.studentLoans}
                onChange={(v) => handleInputChange('studentLoans', v)}
              />
              <CurrencyInput
                label="Credit Card Minimums"
                value={inputs.creditCardMinimums}
                onChange={(v) => handleInputChange('creditCardMinimums', v)}
                helperText="Minimum monthly payments only"
              />
              <CurrencyInput
                label="Personal Loans"
                value={inputs.personalLoans}
                onChange={(v) => handleInputChange('personalLoans', v)}
              />
              <CurrencyInput
                label="Child Support / Alimony"
                value={inputs.childSupport}
                onChange={(v) => handleInputChange('childSupport', v)}
              />
              <CurrencyInput
                label="Other Monthly Debts"
                value={inputs.otherDebts}
                onChange={(v) => handleInputChange('otherDebts', v)}
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* DTI Gauges */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid', borderColor: getDTIColor(result.details.frontEndDTI as number), textAlign: 'center' }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                      {getDTIIcon(result.details.frontEndRating as string)}
                      <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary' }}>
                        Front-End DTI
                      </Typography>
                    </Stack>
                    <Typography variant="h2" sx={{ fontWeight: 700, color: getDTIColor(result.details.frontEndDTI as number) }}>
                      {result.details.frontEndDTI}%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: getDTIColor(result.details.frontEndDTI as number) }}>
                      {result.details.frontEndRating as string}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Housing costs only
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (result.details.frontEndDTI as number) / 50 * 100)}
                      sx={{
                        mt: 2, height: 8, borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': { bgcolor: getDTIColor(result.details.frontEndDTI as number), borderRadius: 4 },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">0%</Typography>
                      <Typography variant="caption" color="text.secondary">28%</Typography>
                      <Typography variant="caption" color="text.secondary">50%</Typography>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid', borderColor: getDTIColor(result.details.backEndDTI as number), textAlign: 'center' }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                      {getDTIIcon(result.details.backEndRating as string)}
                      <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary' }}>
                        Back-End DTI
                      </Typography>
                    </Stack>
                    <Typography variant="h2" sx={{ fontWeight: 700, color: getDTIColor(result.details.backEndDTI as number) }}>
                      {result.details.backEndDTI}%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: getDTIColor(result.details.backEndDTI as number) }}>
                      {result.details.backEndRating as string}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      All debts included
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (result.details.backEndDTI as number) / 50 * 100)}
                      sx={{
                        mt: 2, height: 8, borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': { bgcolor: getDTIColor(result.details.backEndDTI as number), borderRadius: 4 },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">0%</Typography>
                      <Typography variant="caption" color="text.secondary">43%</Typography>
                      <Typography variant="caption" color="text.secondary">50%</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard label="Housing Costs" value={`$${fmt(result.details.housingCosts as number)}`} sublabel="/month" color="primary" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard label="Other Debts" value={`$${fmt(result.details.nonHousingDebts as number)}`} sublabel="/month" color="warning" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard label="Total Debts" value={`$${fmt(result.details.totalMonthlyDebts as number)}`} sublabel="/month" color="error" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Remaining"
                    value={`$${fmt(result.details.remainingIncome as number)}`}
                    sublabel={`${result.details.remainingPercent}% of income`}
                    color={(result.details.remainingPercent as number) > 30 ? 'success' : 'warning'}
                  />
                </Grid>
              </Grid>

              {/* Debt Breakdown */}
              <ResultsSection title="Debt Breakdown" subtitle="Where your monthly obligations go">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DonutChart
                        data={chartData}
                        centerLabel="total debts"
                        centerValue={`$${fmt(result.details.totalMonthlyDebts as number)}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <ChartLegend items={legendItems} />
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Lender Thresholds */}
              <ResultsSection title="What Lenders See" subtitle="DTI thresholds for different loan programs">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {[
                      { label: 'Conventional (Ideal)', threshold: 28, color: DTI_COLORS.excellent, desc: 'Front-end ≤ 28%, Back-end ≤ 36%' },
                      { label: 'Conventional (Max)', threshold: 36, color: DTI_COLORS.good, desc: 'Back-end ≤ 43% with strong credit' },
                      { label: 'FHA', threshold: 43, color: DTI_COLORS.acceptable, desc: 'Back-end ≤ 43%, up to 50% with compensating factors' },
                      { label: 'VA', threshold: 41, color: DTI_COLORS.acceptable, desc: 'Back-end ≤ 41%, no hard cap with residual income' },
                    ].map((item) => {
                      const backEnd = result.details.backEndDTI as number;
                      const qualifies = backEnd <= item.threshold;
                      return (
                        <Box key={item.label} sx={{ p: 2, borderRadius: 2, bgcolor: qualifies ? '#F0FDF4' : '#FEF2F2', border: '1px solid', borderColor: qualifies ? '#BBF7D0' : '#FECACA' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Stack direction="row" spacing={1} alignItems="center">
                                {qualifies ? <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} /> : <ErrorIcon sx={{ fontSize: 18, color: '#EF4444' }} />}
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                              </Stack>
                              <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: qualifies ? '#22C55E' : '#EF4444' }}>
                              {qualifies ? 'Likely Qualifies' : 'May Not Qualify'}
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('excellent') || insight.includes('strong') ? 'tip' : insight.includes('high') || insight.includes('exceeds') ? 'warning' : 'info'}
                        title={insight.includes('excellent') || insight.includes('strong') ? 'Good News' : insight.includes('high') || insight.includes('exceeds') ? 'Warning' : 'Insight'}
                      >
                        {insight}
                      </InsightCallout>
                    ))}
                  </Stack>
                </ResultsSection>
              )}

              {/* Bottom Line */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: (result.details.backEndDTI as number) <= 43
                    ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
                    : 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
                  border: '1px solid',
                  borderColor: (result.details.backEndDTI as number) <= 43 ? 'success.light' : 'error.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <AccountBalance sx={{ fontSize: 32, color: (result.details.backEndDTI as number) <= 43 ? 'success.main' : 'error.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: (result.details.backEndDTI as number) <= 43 ? 'success.dark' : 'error.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: (result.details.backEndDTI as number) <= 43 ? 'success.dark' : 'error.dark' }}>
                      Your front-end DTI is <strong>{result.details.frontEndDTI}%</strong> and back-end DTI is <strong>{result.details.backEndDTI}%</strong>.
                      {' '}After all debts, you have <strong>${fmt(result.details.remainingIncome as number)}</strong> remaining each month
                      ({result.details.remainingPercent}% of gross income).
                      {(result.details.backEndDTI as number) <= 43
                        ? ' Your DTI is within conventional loan limits.'
                        : ' You may need to reduce debts or increase income to qualify for most mortgage programs.'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          ) : (
            <EmptyResultsState />
          )}
        </Grid>
      </Grid>
    </CalculatorLayout>
  );
}
