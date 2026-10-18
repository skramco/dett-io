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
  AccountBalance,
  TrendingDown,
  CheckCircle,
  Speed,
  Bolt,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  NumberInput,
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
import { ARM_RATE_PATH_ASSUMPTIONS, calculateLoanTimeline } from '@/lib/calculators';
import type { LoanTimelineInputs } from '@/lib/calculators/types';

export default function LoanTimelineCalculator() {
  const [inputs, setInputs] = useState<LoanTimelineInputs>({
    loanAmount: 360000,
    loanTerm: 30,
    expectedYearsInHome: 7,
    parRate: DEFAULT_RATES.thirtyYearFixed,
    pointsRate: DEFAULT_RATES.thirtyYearFixed - 0.5,
    pointsCost: 7200,
    lenderCredit: 3600,
    lenderCreditRate: DEFAULT_RATES.thirtyYearFixed + 0.25,
    buydownType: 'none',
    armInitialRate: DEFAULT_RATES.fiveOneArm,
    armFixedPeriod: 5,
    armAdjustmentFrequency: 6,
    armInitialCap: 2,
    armMargin: 2.75,
    armAdjustmentCap: 1,
    armLifetimeCap: 5,
    expectedIndexRate: 4,
    fifteenYearRate: DEFAULT_RATES.fifteenYearFixed,
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  const marketRates = useLiveRateDefaults(inputs, setInputs, {
    anchorField: 'parRate',
    offsetFields: ['pointsRate', 'lenderCreditRate', 'armInitialRate', 'fifteenYearRate'],
  });
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferredInputs.loanAmount <= 0 || (deferredInputs.expectedYearsInHome ?? 0) <= 0) return null;
    return calculateLoanTimeline(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof LoanTimelineInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const stayYears = inputs.expectedYearsInHome ?? 7;
  const scenarios = result?.scenarios ?? [];
  const bestOption = result?.details.bestOption as string | undefined;
  const maxNetCost = Math.max(...scenarios.map(s => s.netCost), 1);

  const rangeChartData = useMemo(() => {
    if (!result?.armSchedule) return [];
    return result.armSchedule;
  }, [result]);

  const armAdjusts = stayYears > inputs.armFixedPeriod;
  const productName = (result?.details.productName as string) || `${inputs.armFixedPeriod}/6 ARM`;
  const capStructure = (result?.details.capStructure as string) || `${inputs.armInitialCap}/${inputs.armAdjustmentCap}/${inputs.armLifetimeCap}`;

  return (
    <CalculatorLayout
      calculatorSlug="loan-timeline"
      assumptions={[
        `${inputs.loanTerm}-year loan of ${formatCurrency(inputs.loanAmount)}; 30-year par ${inputs.parRate}%, points ${inputs.pointsRate}%, ARM ${inputs.armInitialRate}% for the first ${inputs.armFixedPeriod} years`,
        `ARM adjustments are estimates from a ${inputs.expectedIndexRate}% index plus a ${inputs.armMargin}% margin, limited by your entered caps — actual adjustments will differ`,
        `Assumes you move in year ${stayYears} — actual plans and future rates will differ`,
      ]}
      title="Best Loan for My Timeline"
      description="Compare fixed-rate, discount points, ARM, and 15-year options based on how long you plan to stay. Models ARM adjustments across named rate paths and a Monte Carlo range — not just the teaser vs worst case."
      relatedCalculators={[
        { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
        { slug: 'refinance', name: 'Should I Refinance?' },
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Loan & Timeline" icon={<AccountBalance />}>
              <CurrencyInput
                label="Loan Amount"
                value={inputs.loanAmount}
                onChange={(v) => handleInputChange('loanAmount', v)}
              />
              <NumberInput
                label="Expected Years in Home"
                value={inputs.expectedYearsInHome ?? 7}
                onChange={(v) => handleInputChange('expectedYearsInHome', v)}
                suffix="years"
              />
              <PercentageInput
                label="30-Year Fixed Rate (Par)"
                value={inputs.parRate ?? 0}
                onChange={(v) => handleInputChange('parRate', v)}
                step={0.125}
              />
              <MarketRateNote rates={marketRates} />
              <PercentageInput
                label="15-Year Fixed Rate"
                value={inputs.fifteenYearRate ?? 0}
                onChange={(v) => handleInputChange('fifteenYearRate', v)}
                step={0.125}
              />
            </InputSection>

            <InputSection title="Discount Points Option" icon={<Bolt />} color="secondary">
              <PercentageInput
                label="Rate with Points"
                value={inputs.pointsRate}
                onChange={(v) => handleInputChange('pointsRate', v)}
                step={0.125}
              />
              <CurrencyInput
                label="Points Cost"
                value={inputs.pointsCost}
                onChange={(v) => handleInputChange('pointsCost', v)}
                helperText="Typically 1% of the loan per point"
              />
              <CurrencyInput
                label="Lender Credit"
                value={inputs.lenderCredit ?? 0}
                onChange={(v) => handleInputChange('lenderCredit', v)}
                helperText="Upfront credit in exchange for a higher rate"
              />
              <PercentageInput
                label="Rate with Lender Credit"
                value={inputs.lenderCreditRate ?? 0}
                onChange={(v) => handleInputChange('lenderCreditRate', v)}
                step={0.125}
              />
              <SelectInput
                label="Temporary Buydown"
                value={inputs.buydownType ?? 'none'}
                onChange={(v) => handleInputChange('buydownType', v as string)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: '1-0', label: '1-0 buydown' },
                  { value: '2-1', label: '2-1 buydown' },
                  { value: '3-2-1', label: '3-2-1 buydown' },
                ]}
              />
            </InputSection>

            <InputSection title="ARM Option" icon={<TrendingDown />}>
              <PercentageInput
                label="ARM Initial Rate"
                value={inputs.armInitialRate}
                onChange={(v) => handleInputChange('armInitialRate', v)}
                step={0.125}
              />
              <NumberInput
                label="Fixed Period"
                value={inputs.armFixedPeriod}
                onChange={(v) => handleInputChange('armFixedPeriod', v)}
                suffix="years"
              />
              <SelectInput
                label="Adjustment Frequency"
                value={inputs.armAdjustmentFrequency ?? 6}
                onChange={(v) => handleInputChange('armAdjustmentFrequency', v as number)}
                options={[
                  { value: 6, label: 'Every 6 months (5/6 SOFR)' },
                  { value: 12, label: 'Every 12 months (5/1)' },
                ]}
              />
              <PercentageInput
                label="Margin"
                value={inputs.armMargin}
                onChange={(v) => handleInputChange('armMargin', v)}
                step={0.25}
                helperText="Added to the index at each adjustment"
              />
              <PercentageInput
                label="Initial Adjustment Cap"
                value={inputs.armInitialCap ?? 2}
                onChange={(v) => handleInputChange('armInitialCap', v)}
                step={0.5}
                helperText="Max rate change at the first reset"
              />
              <PercentageInput
                label="Periodic Adjustment Cap"
                value={inputs.armAdjustmentCap}
                onChange={(v) => handleInputChange('armAdjustmentCap', v)}
                step={0.5}
              />
              <PercentageInput
                label="Lifetime Cap"
                value={inputs.armLifetimeCap}
                onChange={(v) => handleInputChange('armLifetimeCap', v)}
                step={0.5}
                helperText="Max increase over the initial rate"
              />
              <PercentageInput
                label="Expected Index Rate"
                value={inputs.expectedIndexRate}
                onChange={(v) => handleInputChange('expectedIndexRate', v)}
                step={0.25}
                helperText="e.g. SOFR — your rate adjusts toward index + margin"
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              <HeroMetric
                label={`Best for a ${stayYears}-Year Stay`}
                value={result.details.bestOption as string}
                sublabel={`Net cost: ${formatCurrency((result.details.bestNetCost as number))} (payments + upfront − equity built)`}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="30-Yr Fixed"
                    value={`${formatCurrency((result.details.fixedPayment as number))}`}
                    sublabel="per month"
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="With Points"
                    value={`${formatCurrency((result.details.pointsPayment as number))}`}
                    sublabel={`+${formatCurrency((result.details.pointsCost as number))} upfront`}
                    color="secondary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="ARM Start"
                    value={`${formatCurrency((result.details.armInitialPayment as number))}`}
                    sublabel={`to ${formatCurrency((result.details.armMaxPaymentDuringHold as number))} expected`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="15-Yr Fixed"
                    value={`${formatCurrency((result.details.fifteenYearPayment as number))}`}
                    sublabel="per month"
                    color="warning"
                  />
                </Grid>
              </Grid>

              {/* All Options Compared */}
              <ResultsSection
                title="All Options Compared"
                subtitle={`Net cost over ${stayYears} years = payments + upfront costs − principal paid down`}
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {scenarios.map((opt) => (
                      <Box
                        key={opt.option}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: opt.option === bestOption ? '#D1FAE5' : '#F9FAFB',
                          border: opt.option === bestOption ? '2px solid #22C55E' : '1px solid #E5E7EB',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 3.5 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {opt.option === bestOption && <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />}
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{opt.option}</Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">{opt.rate}% rate</Typography>
                            {opt.option === bestOption && (
                              <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 600, display: 'block' }}>LOWEST NET COST</Typography>
                            )}
                          </Grid>
                          <Grid size={{ xs: 4, sm: 2.5 }}>
                            <Typography variant="body2" color="text.secondary">Payment</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(opt.initialPayment)}</Typography>
                            {opt.maxPaymentDuringHold > opt.initialPayment && (
                              <Typography variant="caption" color="text.secondary">up to {formatCurrency(opt.maxPaymentDuringHold)}</Typography>
                            )}
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">Equity Built</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(opt.principalPaid)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">Net Cost</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: opt.option === bestOption ? '#065F46' : 'inherit' }}>
                              {formatCurrency(opt.netCost)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  {scenarios.map((opt) => (
                    <HorizontalBar
                      key={opt.option}
                      label={opt.option}
                      value={opt.netCost}
                      maxValue={maxNetCost}
                      color={opt.option === bestOption ? CHART_COLORS.primary : '#9CA3AF'}
                    />
                  ))}
                </Paper>
              </ResultsSection>

              {/* ARM rate-path scenarios */}
              <ResultsSection
                title="ARM Rate-Path Scenarios"
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
                        label="ARM cheaper share"
                        value={`${result.details.pctArmCheaper}%`}
                        sublabel={`of ${ARM_RATE_PATH_ASSUMPTIONS.samples} paths`}
                      />
                    </Grid>
                  </Grid>

                  <Stack spacing={1.25} sx={{ mb: 2 }}>
                    {[
                      {
                        name: `Falling index (${(result.details.fallingIndex as number).toFixed(2)}%)`,
                        total: result.details.fallingTotalPaid as number,
                        note: `${ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift} pts vs expected`,
                      },
                      {
                        name: `Expected index (${inputs.expectedIndexRate.toFixed(2)}%)`,
                        total: result.details.armTotalPaid as number,
                        note: 'Index stays at your input',
                      },
                      {
                        name: `Rising index (${(result.details.risingIndex as number).toFixed(2)}%)`,
                        total: result.details.risingTotalPaid as number,
                        note: `+${ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift} pts vs expected`,
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
                          Total {formatCurrency(row.total)} over stay
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: armAdjusts ? '#FEF3C7' : '#D1FAE5', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Adjustment Risk</Typography>
                        <Typography variant="body2">
                          {armAdjusts
                            ? `⚠️ The ${productName} adjusts starting year ${inputs.armFixedPeriod + 1} — before your planned move in year ${stayYears}. At the expected ${inputs.expectedIndexRate}% index your payment reaches ${formatCurrency((result.details.armMaxPaymentDuringHold as number))}/month.`
                            : `✓ You plan to move before the ${productName}'s first adjustment in year ${inputs.armFixedPeriod + 1}. You'd keep the ${inputs.armInitialRate}% rate the whole time.`}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#FEE2E2', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Worst Case</Typography>
                        <Typography variant="body2">
                          If rates spike, your {capStructure} caps (initial/periodic/lifetime) still let the payment reach {formatCurrency((result.details.armWorstCasePayment as number))}/month. That bound is cap-driven, not a random draw.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Methodology:</strong> After year {inputs.armFixedPeriod}, the {productName} adjusts every {inputs.armAdjustmentFrequency} months
                      toward index + margin, limited by your {capStructure} caps.
                      Named paths hold the index at expected {ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift} / 0 / +{ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift} points.
                      The shaded band is {ARM_RATE_PATH_ASSUMPTIONS.samples} seeded Monte Carlo index paths
                      (mean-reverting to {inputs.expectedIndexRate}%, {ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent}% annual volatility, κ = {ARM_RATE_PATH_ASSUMPTIONS.meanReversion}).
                      Totals are over your {stayYears}-year stay.{' '}
                      <Link href="/methodology" style={{ color: 'inherit', fontWeight: 700 }}>Full methodology</Link>
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Points break-even */}
              <ResultsSection title="Do Points Pay Off?" subtitle="Break-even vs your timeline">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {(result.details.pointsBreakEvenMonths as number) > 0 ? (
                    <Alert
                      severity={(result.details.pointsBreakEvenMonths as number) < stayYears * 12 ? 'success' : 'warning'}
                      sx={{ borderRadius: 2 }}
                    >
                      <Typography variant="body2">
                        Paying {formatCurrency((result.details.pointsCost as number))} for a {inputs.pointsRate}% rate saves
                        {formatCurrency(((result.details.fixedPayment as number) - (result.details.pointsPayment as number)))}/month and breaks even in{' '}
                        <strong>{((result.details.pointsBreakEvenMonths as number) / 12).toFixed(1)} years</strong>
                        {(result.details.pointsBreakEvenMonths as number) < stayYears * 12
                          ? ` — within your ${stayYears}-year timeline, so points can pay off.`
                          : ` — longer than your ${stayYears}-year timeline, so skip the points.`}
                      </Typography>
                    </Alert>
                  ) : (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2">Points at this rate produce no monthly savings — skip them.</Typography>
                    </Alert>
                  )}
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout key={index} type={insight.includes('⚠️') ? 'warning' : 'info'} title="Analysis">
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
                  background: 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Speed sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                      {result.summary} Net cost counts what you actually spend (interest and fees) rather than just the payment size, so higher-payment options like the 15-year get credit for the equity they build.
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
