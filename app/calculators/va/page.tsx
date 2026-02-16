'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  MilitaryTech,
  Home,
  Shield,
  CheckCircle,
  Cancel,
  AccountBalance,
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
import {
  LazyDonutChart as DonutChart,
  ChartLegend,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateVA } from '@/lib/calculators';
import type { VAInputs } from '@/lib/calculators/va';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function VACalculator() {
  const [inputs, setInputs] = useState<VAInputs>({
    homePrice: 400000,
    downPaymentPercent: 0,
    interestRate: 6.25,
    loanTerm: 30,
    serviceType: 'regular',
    firstTimeUse: true,
    disabilityExempt: false,
    propertyTax: 4800,
    homeInsurance: 1500,
    monthlyGrossIncome: 7000,
    monthlyDebts: 400,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferredInputs.homePrice <= 0) return null;
    return calculateVA(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof VAInputs, value: number | string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const chartData = useMemo(() => {
    if (!result?.chartData) return [];
    const colors = [CHART_COLORS.primary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: item.value as number,
      color: colors[i % colors.length],
    }));
  }, [result]);

  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalMonthlyPayment as number;
    const colors = [CHART_COLORS.primary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: `$${fmt(item.value as number)}`,
      color: colors[i % colors.length],
      percentage: total > 0 ? ((item.value as number) / total) * 100 : 0,
    }));
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="va"
      title="VA Loan Calculator"
      description="Calculate your VA mortgage payment with $0 down and no PMI. See your VA funding fee, compare VA vs FHA vs conventional, and understand the financial benefits of your VA loan benefit."
      relatedCalculators={[
        { slug: 'fha', name: 'FHA Loan Calculator' },
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'dti', name: 'DTI Calculator' },
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
                step={1}
                helperText="VA loans allow $0 down — but more down reduces the funding fee"
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

            <InputSection title="Service Details" icon={<MilitaryTech />} color="secondary">
              <SelectInput
                label="Service Type"
                value={inputs.serviceType}
                onChange={(v) => handleInputChange('serviceType', v as string)}
                options={[
                  { value: 'regular', label: 'Active Duty / Veteran' },
                  { value: 'reserves-guard', label: 'Reserves / National Guard' },
                  { value: 'surviving-spouse', label: 'Surviving Spouse' },
                ]}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={inputs.firstTimeUse}
                    onChange={(e) => handleInputChange('firstTimeUse', e.target.checked)}
                  />
                }
                label="First-time VA loan use"
                sx={{ ml: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={inputs.disabilityExempt}
                    onChange={(e) => handleInputChange('disabilityExempt', e.target.checked)}
                  />
                }
                label="Disability exemption (10%+ VA disability)"
                sx={{ ml: 0 }}
              />
            </InputSection>

            <InputSection title="Income & Debts" icon={<AccountBalance />}>
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
              {/* No PMI Banner */}
              <Alert
                severity="success"
                icon={<MilitaryTech sx={{ fontSize: 28 }} />}
                sx={{ borderRadius: 3, py: 2 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  VA Benefit: No PMI Required
                </Typography>
                <Typography variant="body2">
                  VA loans never require private mortgage insurance — saving you ${fmt(result.details.pmiSavingsVsConv as number)}/month vs a conventional loan.
                </Typography>
              </Alert>

              {/* Hero Metric */}
              <HeroMetric
                label="Total Monthly VA Payment"
                value={`$${fmt(result.details.totalMonthlyPayment as number)}`}
                sublabel={`P&I: $${fmt(result.details.monthlyPI as number)} + Tax: $${fmt(result.details.monthlyPropertyTax as number)} + Ins: $${fmt(result.details.monthlyInsurance as number)} • No PMI`}
              />

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Down Payment"
                    value={inputs.downPaymentPercent === 0 ? '$0' : `$${fmt(result.details.downPayment as number)}`}
                    sublabel={inputs.downPaymentPercent === 0 ? 'Zero down!' : `${inputs.downPaymentPercent}% down`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Funding Fee"
                    value={(result.details.disabilityExempt as number) === 1 ? 'Exempt' : `$${fmt(result.details.fundingFee as number)}`}
                    sublabel={(result.details.disabilityExempt as number) === 1 ? 'Disability waiver' : `${result.details.fundingFeeRate}% (financed)`}
                    color={(result.details.disabilityExempt as number) === 1 ? 'success' : 'warning'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Loan"
                    value={`$${fmt(result.details.totalLoanAmount as number)}`}
                    sublabel="incl. funding fee"
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="DTI Ratio"
                    value={`${result.details.totalDTI}%`}
                    sublabel={(result.details.meetsDTI as number) === 1 ? 'Within guideline' : 'Above 41%'}
                    color={(result.details.meetsDTI as number) === 1 ? 'success' : 'warning'}
                  />
                </Grid>
              </Grid>

              {/* Payment Breakdown */}
              <ResultsSection title="Payment Breakdown" subtitle="Where your monthly payment goes — notice: no mortgage insurance">
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
                      <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534' }}>
                            Mortgage Insurance: $0/month
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* VA vs FHA vs Conventional */}
              <ResultsSection title="VA vs FHA vs Conventional" subtitle="See how VA stacks up">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    {/* VA */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#F0FDF4', border: '2px solid #22C55E', textAlign: 'center', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#22C55E', color: 'white', px: 2, py: 0.25, borderRadius: 2, fontSize: '0.7rem', fontWeight: 700 }}>
                          BEST VALUE
                        </Box>
                        <MilitaryTech sx={{ fontSize: 32, color: '#22C55E', mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
                          VA Loan
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.totalMonthlyPayment as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Down: ${fmt(result.details.downPayment as number)} ({inputs.downPaymentPercent}%)</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#22C55E' }}>PMI: $0</Typography>
                          <Typography variant="caption">Fee: ${fmt(result.details.fundingFee as number)}</Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* FHA */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#FEF3C7', border: '1px solid #FDE68A', textAlign: 'center' }}>
                        <AccountBalance sx={{ fontSize: 32, color: '#D97706', mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#92400E' }}>
                          FHA Loan (3.5% Down)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.fhaTotalMonthly as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Down: ${fmt(result.details.fhaDownPayment as number)} (3.5%)</Typography>
                          <Typography variant="caption" sx={{ color: '#DC2626' }}>MIP: ${fmt(result.details.fhaMonthlyMIP as number)}/mo</Typography>
                          <Typography variant="caption">+1.75% upfront MIP</Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Conventional */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#EBF5FF', border: '1px solid #93C5FD', textAlign: 'center' }}>
                        <Home sx={{ fontSize: 32, color: '#2563EB', mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#1E40AF' }}>
                          Conventional (5% Down)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.convTotalMonthly as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Down: ${fmt(result.details.convDownPayment as number)} (5%)</Typography>
                          <Typography variant="caption" sx={{ color: '#DC2626' }}>PMI: ${fmt(result.details.convMonthlyPMI as number)}/mo</Typography>
                          <Typography variant="caption">Until 80% LTV</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Savings summary */}
                  <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534', textAlign: 'center' }}>
                      VA saves you <strong>${fmt((result.details.fhaTotalMonthly as number) - (result.details.totalMonthlyPayment as number))}/month vs FHA</strong> and{' '}
                      <strong>${fmt((result.details.convTotalMonthly as number) - (result.details.totalMonthlyPayment as number))}/month vs Conventional</strong>
                    </Typography>
                  </Paper>
                </Paper>
              </ResultsSection>

              {/* VA Funding Fee Details */}
              <ResultsSection title="VA Funding Fee" subtitle="The one-time cost of your VA benefit">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {(result.details.disabilityExempt as number) === 1 ? (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        You&apos;re exempt from the VA funding fee due to a 10%+ VA disability rating.
                        This saves you ${fmt(Math.round((result.details.baseLoanAmount as number) * 0.0215))} compared to a first-time VA borrower.
                      </Typography>
                    </Alert>
                  ) : (
                    <Stack spacing={2}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="caption" color="text.secondary">Fee Rate</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{result.details.fundingFeeRate}%</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="caption" color="text.secondary">Fee Amount</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>${fmt(result.details.fundingFee as number)}</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="caption" color="text.secondary">Financed Into Loan</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>Yes</Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      <Typography variant="body2" color="text.secondary">
                        The funding fee is a one-time charge that funds the VA loan program. It can be financed into the loan
                        (adding ${fmt(result.details.fundingFee as number)} to your balance) or paid upfront at closing.
                        Putting more down reduces the fee rate.
                      </Typography>

                      {/* Fee reduction table */}
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Funding Fee by Down Payment</Typography>
                        <Stack spacing={1}>
                          {[
                            { dp: '0-4.99%', rate: inputs.firstTimeUse ? (inputs.serviceType === 'reserves-guard' ? '2.50%' : '2.15%') : (inputs.serviceType === 'reserves-guard' ? '2.50%' : '3.30%') },
                            { dp: '5-9.99%', rate: '1.50%' },
                            { dp: '10%+', rate: '1.25%' },
                          ].map((row, i) => (
                            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1, bgcolor: i === 0 && inputs.downPaymentPercent < 5 ? '#EBF5FF' : i === 1 && inputs.downPaymentPercent >= 5 && inputs.downPaymentPercent < 10 ? '#EBF5FF' : i === 2 && inputs.downPaymentPercent >= 10 ? '#EBF5FF' : 'grey.50' }}>
                              <Typography variant="body2">{row.dp} down</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.rate}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
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
                        type={insight.includes('saving') || insight.includes('saves') || insight.includes('exempt') ? 'tip' : insight.includes('high') || insight.includes('exceeds') ? 'warning' : 'info'}
                        title={insight.includes('saving') || insight.includes('saves') ? 'VA Advantage' : insight.includes('exempt') ? 'Disability Benefit' : insight.includes('high') || insight.includes('exceeds') ? 'Heads Up' : 'Insight'}
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
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  border: '1px solid',
                  borderColor: 'success.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <MilitaryTech sx={{ fontSize: 32, color: 'success.dark' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#14532D', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#14532D' }}>
                      Your VA loan on a <strong>${fmt(inputs.homePrice)}</strong> home costs{' '}
                      <strong>${fmt(result.details.totalMonthlyPayment as number)}/month</strong> with{' '}
                      {inputs.downPaymentPercent === 0 ? <strong>zero down payment</strong> : <><strong>${fmt(result.details.downPayment as number)}</strong> down</>}
                      {' '}and <strong>no monthly mortgage insurance</strong>.
                      {(result.details.disabilityExempt as number) === 0 && (
                        <> The {result.details.fundingFeeRate}% funding fee (${fmt(result.details.fundingFee as number)}) is financed into the loan.</>
                      )}
                      {' '}Compared to FHA, you save <strong>${fmt((result.details.fhaTotalMonthly as number) - (result.details.totalMonthlyPayment as number))}/month</strong>.
                      Compared to conventional with 5% down, you save <strong>${fmt((result.details.convTotalMonthly as number) - (result.details.totalMonthlyPayment as number))}/month</strong>.
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
