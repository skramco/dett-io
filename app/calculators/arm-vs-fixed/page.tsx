'use client';

import { formatCurrency } from '@/lib/format';

import { DEFAULT_RATES } from '@/lib/rates/defaultRates';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useScenarioPrefill } from '@/lib/hooks/useScenarioPrefill';
import { useLiveRateDefaults } from '@/lib/hooks/useLiveRateDefaults';
import { MarketRateNote } from '@/components/mui/calculator/MarketRateNote';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Lock,
  Warning,
  CompareArrows,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  SelectInput,
} from '@/components/mui/calculator/InputPanel';
import {
  HeroMetric,
  MetricCard,
  InsightCallout,
  ResultsSection,
  EmptyResultsState,
} from '@/components/mui/calculator/ResultsPanel';
import Link from 'next/link';
import {
  HorizontalBar,
  LazyRangeTimelineChart as RangeTimelineChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateArmVsFixed } from '@/lib/calculators';
import {
  ARM_RATE_PATH_ASSUMPTIONS,
  getArmCapStructure,
  getArmProductName,
  getWorstCaseRatePath,
} from '@/lib/calculators/armVsFixed';
import type { ArmVsFixedInputs } from '@/lib/calculators/types';

export default function ArmVsFixedCalculator() {
  const [inputs, setInputs] = useState<ArmVsFixedInputs>({
    loanAmount: 360000,
    fixedRate: DEFAULT_RATES.thirtyYearFixed,
    armInitialRate: DEFAULT_RATES.fiveOneArm,
    armFixedPeriod: 5,
    armAdjustmentFrequency: 6,
    armInitialCap: 2,
    armAdjustmentCap: 1,
    armLifetimeCap: 5,
    armMargin: 2.75,
    loanTerm: 30,
    expectedIndexRate: 5,
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  const marketRates = useLiveRateDefaults(inputs, setInputs, { anchorField: 'fixedRate', offsetFields: ['armInitialRate'] });
  const deferredInputs = useDeferredInputs(inputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (deferredInputs.loanAmount <= 0) return null;
    return calculateArmVsFixed(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof ArmVsFixedInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const rangeChartData = useMemo(() => {
    if (!result?.chartData) return [];
    return result.chartData as Array<{
      year: number;
      armPayment: number;
      fixedPayment: number;
      fallingPayment: number;
      risingPayment: number;
      worstPayment: number;
      p10Payment: number;
      p50Payment: number;
      p90Payment: number;
    }>;
  }, [result]);

  // Derived values
  const armWins = result ? (result.details.armTotalPaid as number) < (result.details.fixedTotalPaid as number) : false;
  const initialSavings = result ? (result.details.fixedPayment as number) - (result.details.armInitialPayment as number) : 0;
  const productName = getArmProductName(inputs.armFixedPeriod, inputs.armAdjustmentFrequency);
  const capStructure = getArmCapStructure(inputs.armInitialCap, inputs.armAdjustmentCap, inputs.armLifetimeCap);
  const lifetimeMaxRate = inputs.armInitialRate + inputs.armLifetimeCap;
  const worstCaseSteps = useMemo(() => getWorstCaseRatePath(deferredInputs), [deferredInputs]);

  return (
    <CalculatorLayout
      calculatorSlug="arm-vs-fixed"
      title="ARM vs Fixed Rate Calculator"
      description="Compare adjustable-rate mortgages (like the 5/6 SOFR ARM) to fixed-rate loans. Model multiple index rate paths and a Monte Carlo range — not a single expected vs worst-case pair — plus caps-derived bounds."
      relatedCalculators={[
        { slug: 'points-buydown', name: 'Points & Buydown' },
        { slug: 'timeline-simulator', name: 'Decision Timeline' },
        { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Loan Details" icon={<CompareArrows />}>
              <CurrencyInput
                label="Loan Amount"
                value={inputs.loanAmount}
                onChange={(v) => handleInputChange('loanAmount', v)}
              />
              
              <SelectInput
                label="Loan Term"
                value={inputs.loanTerm}
                onChange={(v) => handleInputChange('loanTerm', v as number)}
                options={[
                  { value: 15, label: '15 years' },
                  { value: 30, label: '30 years' },
                ]}
              />
            </InputSection>

            <InputSection title="Fixed Rate Option" icon={<Lock />} color="secondary">
              <PercentageInput
                label="Fixed Interest Rate"
                value={inputs.fixedRate}
                onChange={(v) => handleInputChange('fixedRate', v)}
                step={0.125}
              />
              <MarketRateNote rates={marketRates} />
            </InputSection>

            <InputSection title={`ARM Option (${productName})`} icon={<TrendingUp />}>
              <PercentageInput
                label="Initial ARM Rate"
                value={inputs.armInitialRate}
                onChange={(v) => handleInputChange('armInitialRate', v)}
                step={0.125}
              />

              <SelectInput
                label="Fixed Period"
                value={inputs.armFixedPeriod}
                onChange={(v) => handleInputChange('armFixedPeriod', v as number)}
                options={[
                  { value: 3, label: '3 years' },
                  { value: 5, label: '5 years' },
                  { value: 7, label: '7 years' },
                  { value: 10, label: '10 years' },
                ]}
                helperText="How long the initial rate is locked"
              />

              <SelectInput
                label="Adjustment Frequency"
                value={inputs.armAdjustmentFrequency}
                onChange={(v) => handleInputChange('armAdjustmentFrequency', v as number)}
                options={[
                  { value: 6, label: 'Every 6 months — e.g. 5/6 SOFR ARM (most common today)' },
                  { value: 12, label: 'Every 12 months — e.g. 5/1 ARM (older style)' },
                ]}
                helperText="Most ARMs written today are SOFR-indexed and adjust every 6 months"
              />

              <PercentageInput
                label="Expected Index Rate"
                value={inputs.expectedIndexRate}
                onChange={(v) => handleInputChange('expectedIndexRate', v)}
                step={0.25}
                helperText="Future rate prediction (SOFR/Treasury)"
              />

              <PercentageInput
                label="ARM Margin"
                value={inputs.armMargin}
                onChange={(v) => handleInputChange('armMargin', v)}
                step={0.25}
                helperText="Added to index rate after fixed period"
              />
            </InputSection>

            <InputSection title={`Rate Caps (${capStructure})`} icon={<Warning />} color="secondary">
              <PercentageInput
                label="Initial Adjustment Cap"
                value={inputs.armInitialCap}
                onChange={(v) => handleInputChange('armInitialCap', v)}
                step={0.5}
                max={10}
                helperText="Max rate change at the first adjustment"
              />

              <PercentageInput
                label="Periodic Adjustment Cap"
                value={inputs.armAdjustmentCap}
                onChange={(v) => handleInputChange('armAdjustmentCap', v)}
                step={0.5}
                max={10}
                helperText="Max rate change at each later adjustment"
              />

              <PercentageInput
                label="Lifetime Cap"
                value={inputs.armLifetimeCap}
                onChange={(v) => handleInputChange('armLifetimeCap', v)}
                step={0.5}
                max={15}
                helperText={`Max total increase above the initial rate. Most SOFR ARMs today use 2/1/5 caps — rate can never exceed ${lifetimeMaxRate.toFixed(2)}%`}
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* Hero Metric */}
              <HeroMetric
                label="Initial Monthly Savings with ARM"
                value={`${formatCurrency(initialSavings)}/mo`}
                sublabel={`Save ${formatCurrency((result.details.savingsInFixedPeriod as number))} in first ${inputs.armFixedPeriod} years`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Fixed Payment"
                    value={`${formatCurrency((result.details.fixedPayment as number))}`}
                    sublabel={`${inputs.fixedRate}% for ${inputs.loanTerm} years`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="ARM Initial"
                    value={`${formatCurrency((result.details.armInitialPayment as number))}`}
                    sublabel={`${inputs.armInitialRate}% for ${inputs.armFixedPeriod} years`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="ARM Worst Case"
                    value={`${formatCurrency((result.details.worstCasePayment as number))}`}
                    sublabel={`At ${result.details.worstCaseRate}% (from ${capStructure} caps)`}
                    color="error"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="ARM cheaper in"
                    value={`${result.details.pctArmCheaper}%`}
                    sublabel={`of ${result.details.mcSamples} rate paths`}
                    color={(result.details.pctArmCheaper as number) >= 50 ? 'success' : 'primary'}
                  />
                </Grid>
              </Grid>

              {/* Side by Side Comparison */}
              <ResultsSection 
                title="Payment Comparison" 
                subtitle="Fixed vs ARM initial payments"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Lock sx={{ fontSize: 40, color: '#196bc0', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          FIXED RATE
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F4F8F', my: 1 }}>
                          {formatCurrency((result.details.fixedPayment as number))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.fixedRate}% for entire {inputs.loanTerm} years
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ color: '#0F4F8F' }}>
                          ✓ Predictable payments<br />
                          ✓ No rate risk<br />
                          ✓ Peace of mind
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <TrendingDown sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {productName} (INITIAL)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          {formatCurrency((result.details.armInitialPayment as number))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.armInitialRate}% for first {inputs.armFixedPeriod} years
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ color: '#065F46' }}>
                          ✓ Lower initial payment<br />
                          ✓ Good if moving/refi soon<br />
                          ⚠️ Adjusts every {inputs.armAdjustmentFrequency} months after year {inputs.armFixedPeriod}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ p: 3, bgcolor: '#F0FDF4', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46' }}>
                      ARM saves {formatCurrency(initialSavings)}/month initially
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      That&apos;s {formatCurrency((result.details.savingsInFixedPeriod as number))} over the {inputs.armFixedPeriod}-year fixed period
                    </Typography>
                  </Box>
                </Paper>
              </ResultsSection>

              {/* Rate-path scenarios */}
              <ResultsSection 
                title="Rate-path scenarios" 
                subtitle="Named index paths plus a Monte Carlo P10–P90 payment band — not a single expected line"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <RangeTimelineChart
                    data={rangeChartData}
                    xKey="year"
                    xLabel="Years"
                    bandLow="p10Payment"
                    bandHigh="p90Payment"
                    bandLabel="Monte Carlo P10–P90"
                    bandColor={CHART_COLORS.secondary}
                    height={300}
                    lines={[
                      { dataKey: 'fixedPayment', name: 'Fixed', color: CHART_COLORS.primary, strokeWidth: 2.5 },
                      { dataKey: 'armPayment', name: 'Expected ARM', color: CHART_COLORS.secondary, strokeWidth: 2.5 },
                      { dataKey: 'fallingPayment', name: 'Falling index', color: '#047857', strokeWidth: 1.75, strokeDasharray: '5 4' },
                      { dataKey: 'risingPayment', name: 'Rising index', color: '#92400E', strokeWidth: 1.75, strokeDasharray: '5 4' },
                      { dataKey: 'worstPayment', name: 'Cap-driven worst', color: '#B91C1C', strokeWidth: 2, strokeDasharray: '2 3' },
                    ]}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P10 max payment"
                        value={`${formatCurrency(result.details.p10MaxPayment as number)}`}
                        sublabel="10th percentile"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P50 max payment"
                        value={`${formatCurrency(result.details.p50MaxPayment as number)}`}
                        sublabel="Median path"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P90 max payment"
                        value={`${formatCurrency(result.details.p90MaxPayment as number)}`}
                        sublabel="90th percentile"
                        color="warning"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P10–P90 total paid"
                        value={`${formatCurrency(result.details.p10TotalPaid as number)}`}
                        sublabel={`to ${formatCurrency(result.details.p90TotalPaid as number)}`}
                      />
                    </Grid>
                  </Grid>

                  <Stack spacing={1.25} sx={{ mb: 2 }}>
                    {[
                      {
                        name: `Falling index (${(result.details.fallingIndex as number).toFixed(2)}%)`,
                        total: result.details.fallingTotalPaid as number,
                        maxPay: result.details.fallingMaxPayment as number,
                        note: `${ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift} pts vs expected`,
                      },
                      {
                        name: `Expected index (${inputs.expectedIndexRate.toFixed(2)}%)`,
                        total: result.details.armTotalPaid as number,
                        maxPay: result.details.armInitialPayment as number,
                        note: 'Index stays at your input',
                      },
                      {
                        name: `Rising index (${(result.details.risingIndex as number).toFixed(2)}%)`,
                        total: result.details.risingTotalPaid as number,
                        maxPay: result.details.risingMaxPayment as number,
                        note: `+${ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift} pts vs expected`,
                      },
                      {
                        name: `Cap-driven worst (${result.details.worstCaseRate}%)`,
                        total: result.details.worstCasePayment as number,
                        maxPay: result.details.worstCasePayment as number,
                        note: `${capStructure} caps, every adjustment hits`,
                      },
                    ].map((row) => (
                      <Stack
                        key={row.name}
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider', gap: 0.5 }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.note}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {row.name.startsWith('Cap-driven')
                            ? `Peak ${formatCurrency(row.maxPay)}/mo`
                            : `Total ${formatCurrency(row.total)}`}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Methodology:</strong> After year {inputs.armFixedPeriod}, the {productName} adjusts every {inputs.armAdjustmentFrequency} months
                      toward index + margin, limited by your {capStructure} caps.
                      Named paths hold the index at expected {ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift} / 0 / +{ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift} points.
                      The shaded band is {ARM_RATE_PATH_ASSUMPTIONS.samples} seeded Monte Carlo index paths
                      (mean-reverting to {inputs.expectedIndexRate}%, {ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent}% annual volatility, κ = {ARM_RATE_PATH_ASSUMPTIONS.meanReversion}).
                      The worst case is not a random draw — it is the cap-driven upper bound.{' '}
                      <Link href="/methodology" style={{ color: 'inherit', fontWeight: 700 }}>Full methodology</Link>
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Risk Analysis */}
              <ResultsSection 
                title="Risk Analysis" 
                subtitle="What happens if rates rise?"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Fixed Payment (guaranteed)"
                    value={result.details.fixedPayment as number}
                    maxValue={result.details.worstCasePayment as number}
                    color={CHART_COLORS.primary}
                  />
                  <HorizontalBar
                    label="ARM Initial Payment"
                    value={result.details.armInitialPayment as number}
                    maxValue={result.details.worstCasePayment as number}
                    color={CHART_COLORS.secondary}
                  />
                  <HorizontalBar
                    label="ARM Worst Case"
                    value={result.details.worstCasePayment as number}
                    maxValue={result.details.worstCasePayment as number}
                    color="#EF4444"
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Alert severity="warning" icon={<Warning />} sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Worst case scenario:</strong> If rates spike, your {productName} payment could reach 
                      <strong> {formatCurrency((result.details.worstCasePayment as number))}/month</strong> at a 
                      <strong> {result.details.worstCaseRate}%</strong> rate (reached by year {result.details.worstCaseYear as number}). That&apos;s 
                      <strong> {formatCurrency(((result.details.worstCasePayment as number) - (result.details.fixedPayment as number)))}/month more</strong> than the fixed option. 
                      This rate is derived from your {capStructure} caps, not an arbitrary assumption.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Worst-Case Path Documentation */}
              <ResultsSection 
                title="How the Worst Case Is Derived" 
                subtitle={`Cap-driven rate path for the ${productName} with ${capStructure} caps`}
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    The worst case assumes the index rises so far that <strong>every adjustment hits its cap</strong>: 
                    the first adjustment adds the initial cap ({inputs.armInitialCap}%), each later adjustment (every {inputs.armAdjustmentFrequency} months) 
                    adds the periodic cap ({inputs.armAdjustmentCap}%), and the rate can never exceed the initial rate plus the 
                    lifetime cap ({inputs.armInitialRate}% + {inputs.armLifetimeCap}% = {lifetimeMaxRate.toFixed(2)}%).
                  </Typography>

                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2">
                        Years 1–{inputs.armFixedPeriod} (fixed period)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {inputs.armInitialRate.toFixed(2)}%
                      </Typography>
                    </Stack>
                    {worstCaseSteps.map((step, i) => (
                      <Stack key={i} direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: i < worstCaseSteps.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                        <Typography variant="body2">
                          Month {step.month} ({step.cap}){step.rate >= lifetimeMaxRate ? ' — lifetime cap reached' : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: step.rate >= lifetimeMaxRate ? '#EF4444' : 'text.primary' }}>
                          {step.rate.toFixed(2)}%
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    At the peak rate, the payment is re-amortized on the balance remaining at that point — 
                    {formatCurrency((result.details.worstCasePayment as number))}/month. Assumes a {capStructure} cap structure 
                    (initial / periodic / lifetime) and that the rate never falls below the margin ({inputs.armMargin}%).
                  </Typography>
                </Paper>
              </ResultsSection>

              {/* When ARM Makes Sense */}
              <ResultsSection 
                title="When Does ARM Make Sense?" 
                subtitle="Key factors to consider"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#D1FAE5', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065F46', mb: 1 }}>
                          ✓ ARM may be better if:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#065F46' }}>
                          • You plan to move within {inputs.armFixedPeriod} years<br />
                          • You expect to refinance before adjustments<br />
                          • You expect rates to stay flat or drop<br />
                          • You can handle payment increases
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#EBF5FF', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F4F8F', mb: 1 }}>
                          ✓ Fixed may be better if:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#0F4F8F' }}>
                          • You plan to stay long-term<br />
                          • You value payment predictability<br />
                          • Rates are historically low<br />
                          • Your budget is tight
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('⚠️') ? 'warning' : insight.includes('💡') ? 'tip' : 'info'}
                        title={insight.includes('Fixed') ? 'Fixed Rate' : insight.includes('ARM') ? 'ARM' : 'Analysis'}
                      >
                        {insight.replace('⚠️ ', '').replace('💡 ', '')}
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
                  background: armWins 
                    ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                    : 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: armWins ? 'success.light' : 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CompareArrows sx={{ fontSize: 32, color: armWins ? 'success.main' : 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: armWins ? 'success.dark' : 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: armWins ? 'success.dark' : 'primary.dark' }}>
                      The {productName} saves <strong>{formatCurrency(initialSavings)}/month</strong> initially 
                      (<strong>{formatCurrency((result.details.savingsInFixedPeriod as number))}</strong> over {inputs.armFixedPeriod} years). 
                      {armWins 
                        ? ` On the expected path, the ARM saves ${formatCurrency(Math.abs((result.details.fixedTotalPaid as number) - (result.details.armTotalPaid as number)))} total.`
                        : ` On the expected path, the fixed rate saves ${formatCurrency(Math.abs((result.details.fixedTotalPaid as number) - (result.details.armTotalPaid as number)))} over the life of the loan.`
                      }
                      {' '}Across {result.details.mcSamples} sampled index paths, the ARM costs less than fixed in <strong>{result.details.pctArmCheaper}%</strong> of cases. Good choice if you&apos;ll move or refinance within {inputs.armFixedPeriod} years.
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
