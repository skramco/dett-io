'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
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
  Home,
  Shield,
  CheckCircle,
  Cancel,
  CreditCard,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  SelectInput,
  SliderInput,
} from '@/components/mui/calculator/InputPanel';
import {
  HeroMetric,
  MetricCard,
  InsightCallout,
  ResultsSection,
  EmptyResultsState,
} from '@/components/mui/calculator/ResultsPanel';
import {
  LazyDonutChart as DonutChart,
  ChartLegend,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateFHA } from '@/lib/calculators';
import type { FHAInputs } from '@/lib/calculators/fha';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function FHACalculator() {
  const [inputs, setInputs] = useState<FHAInputs>({
    homePrice: 350000,
    downPaymentPercent: 3.5,
    interestRate: 6.5,
    loanTerm: 30,
    creditScore: 680,
    propertyTax: 4200,
    homeInsurance: 1500,
    monthlyGrossIncome: 7500,
    monthlyDebts: 500,
  });
  useUrlInputs(inputs, setInputs);

  const result = useMemo(() => {
    if (inputs.homePrice <= 0) return null;
    return calculateFHA(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof FHAInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const chartData = useMemo(() => {
    if (!result?.chartData) return [];
    const colors = [CHART_COLORS.primary, '#F59E0B', CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: item.value as number,
      color: colors[i % colors.length],
    }));
  }, [result]);

  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalMonthlyPayment as number;
    const colors = [CHART_COLORS.primary, '#F59E0B', CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: `$${fmt(item.value as number)}`,
      color: colors[i % colors.length],
      percentage: total > 0 ? ((item.value as number) / total) * 100 : 0,
    }));
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="fha"
      title="FHA Loan Calculator"
      description="Calculate your FHA mortgage payment including upfront and monthly MIP. See if you qualify, compare FHA vs conventional, and understand the true cost of FHA mortgage insurance."
      relatedCalculators={[
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'dti', name: 'DTI Calculator' },
        { slug: 'closing-costs', name: 'Closing Cost Estimator' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Home & Loan" icon={<Home />}>
              <CurrencyInput
                label="Home Price"
                value={inputs.homePrice}
                onChange={(v) => handleInputChange('homePrice', v)}
              />
              <PercentageInput
                label="Down Payment"
                value={inputs.downPaymentPercent}
                onChange={(v) => handleInputChange('downPaymentPercent', v)}
                step={0.5}
                helperText="FHA minimum: 3.5% (580+ credit) or 10% (500-579)"
              />
              <PercentageInput
                label="Interest Rate"
                value={inputs.interestRate}
                onChange={(v) => handleInputChange('interestRate', v)}
                step={0.125}
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

            <InputSection title="Credit & Income" icon={<Shield />} color="secondary">
              <SliderInput
                label="Credit Score"
                value={inputs.creditScore}
                onChange={(v) => handleInputChange('creditScore', v)}
                min={500}
                max={850}
                step={10}
              />
              <CurrencyInput
                label="Monthly Gross Income"
                value={inputs.monthlyGrossIncome}
                onChange={(v) => handleInputChange('monthlyGrossIncome', v)}
              />
              <CurrencyInput
                label="Other Monthly Debts"
                value={inputs.monthlyDebts}
                onChange={(v) => handleInputChange('monthlyDebts', v)}
                helperText="Car payments, student loans, credit cards, etc."
              />
            </InputSection>

            <InputSection title="Property Costs" icon={<AccountBalance />}>
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
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* Hero Metric */}
              <HeroMetric
                label="Total Monthly FHA Payment"
                value={`$${fmt(result.details.totalMonthlyPayment as number)}`}
                sublabel={`P&I: $${fmt(result.details.monthlyPI as number)} + MIP: $${fmt(result.details.monthlyMIP as number)} + Tax/Ins: $${fmt((result.details.monthlyPropertyTax as number) + (result.details.monthlyInsurance as number))}`}
              />

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Down Payment"
                    value={`$${fmt(result.details.downPayment as number)}`}
                    sublabel={`${inputs.downPaymentPercent}% down`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Upfront MIP"
                    value={`$${fmt(result.details.upfrontMIP as number)}`}
                    sublabel="1.75% (financed)"
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Monthly MIP"
                    value={`$${fmt(result.details.monthlyMIP as number)}`}
                    sublabel={`${result.details.annualMIPRate}%/yr for ${result.details.mipDurationYears} yrs`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total MIP Cost"
                    value={`$${fmt(result.details.totalMIPCost as number)}`}
                    sublabel="upfront + monthly"
                    color="error"
                  />
                </Grid>
              </Grid>

              {/* FHA Eligibility Check */}
              <ResultsSection title="FHA Eligibility" subtitle="Do you qualify?">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {[
                      {
                        label: 'Credit Score',
                        detail: `${inputs.creditScore} (minimum: 500)`,
                        passes: (result.details.meetsCreditScore as number) === 1,
                      },
                      {
                        label: 'Down Payment',
                        detail: `${inputs.downPaymentPercent}% (minimum: ${result.details.minDownPayment}%)`,
                        passes: (result.details.meetsDownPayment as number) === 1,
                      },
                      {
                        label: 'DTI Ratio (Standard)',
                        detail: `${result.details.totalDTI}% (guideline: ≤43%)`,
                        passes: (result.details.meetsStandardDTI as number) === 1,
                      },
                      {
                        label: 'DTI Ratio (Extended)',
                        detail: `${result.details.totalDTI}% (FHA max: ≤57%)`,
                        passes: (result.details.meetsDTI as number) === 1,
                      },
                    ].map((check, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, bgcolor: check.passes ? '#F0FDF4' : '#FEF2F2' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {check.passes ? <CheckCircle sx={{ fontSize: 20, color: '#22C55E' }} /> : <Cancel sx={{ fontSize: 20, color: '#EF4444' }} />}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{check.label}</Typography>
                            <Typography variant="caption" color="text.secondary">{check.detail}</Typography>
                          </Box>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: check.passes ? '#22C55E' : '#EF4444' }}>
                          {check.passes ? 'Pass' : 'Fail'}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </ResultsSection>

              {/* Payment Breakdown */}
              <ResultsSection title="Payment Breakdown" subtitle="Where your monthly payment goes">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DonutChart
                        data={chartData}
                        centerLabel="monthly"
                        centerValue={`$${fmt(result.details.totalMonthlyPayment as number)}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <ChartLegend items={legendItems} />
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* FHA vs Conventional */}
              <ResultsSection title="FHA vs Conventional" subtitle="Which loan type costs less?">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#FEF3C7', border: '1px solid #FDE68A', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#92400E' }}>
                          FHA Loan
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.totalMonthlyPayment as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">P&I: ${fmt(result.details.monthlyPI as number)}</Typography>
                          <Typography variant="caption">MIP: ${fmt(result.details.monthlyMIP as number)}</Typography>
                          <Typography variant="caption">Down: ${fmt(result.details.downPayment as number)} ({inputs.downPaymentPercent}%)</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#EBF5FF', border: '1px solid #93C5FD', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#1E40AF' }}>
                          Conventional (5% Down)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.convTotalMonthly as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">P&I: ${fmt(result.details.convMonthlyPI as number)}</Typography>
                          <Typography variant="caption">PMI: ${fmt(result.details.convMonthlyPMI as number)}</Typography>
                          <Typography variant="caption">Down: ${fmt(Math.round(inputs.homePrice * 0.05))} (5%)</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                  {(result.details.convTotalMonthly as number) < (result.details.totalMonthlyPayment as number) ? (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                      <Typography variant="body2">
                        Conventional saves <strong>${fmt((result.details.totalMonthlyPayment as number) - (result.details.convTotalMonthly as number))}/month</strong>,
                        but requires a higher credit score (typically 680+) and PMI drops off at 80% LTV.
                      </Typography>
                    </Alert>
                  ) : (
                    <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                      <Typography variant="body2">
                        FHA is <strong>${fmt((result.details.convTotalMonthly as number) - (result.details.totalMonthlyPayment as number))}/month cheaper</strong> in this scenario,
                        likely due to your credit score or down payment amount.
                      </Typography>
                    </Alert>
                  )}
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('qualify') || insight.includes('meets') ? 'tip' : insight.includes('below') || insight.includes('exceeds') ? 'warning' : 'info'}
                        title={insight.includes('qualify') || insight.includes('meets') ? 'Eligibility' : insight.includes('below') || insight.includes('exceeds') ? 'Warning' : 'Insight'}
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
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1px solid',
                  borderColor: 'warning.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <AccountBalance sx={{ fontSize: 32, color: 'warning.dark' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#78350F', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#78350F' }}>
                      Your FHA loan on a <strong>${fmt(inputs.homePrice)}</strong> home with <strong>{inputs.downPaymentPercent}% down</strong> costs{' '}
                      <strong>${fmt(result.details.totalMonthlyPayment as number)}/month</strong>.
                      The upfront MIP of <strong>${fmt(result.details.upfrontMIP as number)}</strong> is financed into the loan,
                      and monthly MIP of <strong>${fmt(result.details.monthlyMIP as number)}</strong> lasts{' '}
                      <strong>{result.details.mipDurationYears} years</strong>.
                      Total MIP cost over the life of the loan: <strong>${fmt(result.details.totalMIPCost as number)}</strong>.
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
