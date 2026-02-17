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
} from '@mui/material';
import {
  Savings,
  TrendingUp,
  AccountBalance,
  Speed,
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
  HorizontalBar,
  LazyAmortizationChart as AmortizationChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateExtraPayment } from '@/lib/calculators';
import type { ExtraPaymentInputs } from '@/lib/calculators/types';

export default function ExtraPaymentCalculator() {
  const [inputs, setInputs] = useState<ExtraPaymentInputs>({
    loanAmount: 360000,
    interestRate: 6.75,
    loanTerm: 30,
    extraMonthlyPayment: 300,
    extraAnnualPayment: 0,
    investmentReturn: 7,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (deferredInputs.loanAmount <= 0) return null;
    return calculateExtraPayment(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof ExtraPaymentInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Amortization data for chart
  const amortizationData = useMemo(() => {
    if (!result?.chartData) return [];
    return (result.chartData as Array<{ year: number; regularLoan: number; withExtraPayments: number }>).map(item => ({
      year: item.year,
      balance: item.withExtraPayments,
    }));
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="extra-payment"
      title="Extra Payment Calculator"
      description="See how extra payments accelerate your mortgage payoff. Compare the impact of monthly vs annual extra payments and whether to prepay or invest."
      relatedCalculators={[
        { slug: 'biweekly', name: 'Biweekly Payments' },
        { slug: 'acceleration', name: 'Acceleration Planner' },
        { slug: 'refinance', name: 'Should I Refinance?' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Current Loan" icon={<AccountBalance />}>
              <CurrencyInput
                label="Loan Amount"
                value={inputs.loanAmount}
                onChange={(v) => handleInputChange('loanAmount', v)}
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
                  { value: 20, label: '20 years' },
                  { value: 30, label: '30 years' },
                ]}
              />
            </InputSection>

            <InputSection title="Extra Payments" icon={<Savings />} color="secondary">
              <CurrencyInput
                label="Extra Monthly Payment"
                value={inputs.extraMonthlyPayment ?? 0}
                onChange={(v) => handleInputChange('extraMonthlyPayment', v)}
                helperText="Added to principal each month"
              />

              <CurrencyInput
                label="Extra Annual Payment"
                value={inputs.extraAnnualPayment ?? 0}
                onChange={(v) => handleInputChange('extraAnnualPayment', v)}
                helperText="One-time extra payment each year"
              />
            </InputSection>

            <InputSection title="Investment Alternative" icon={<TrendingUp />}>
              <PercentageInput
                label="Expected Investment Return"
                value={inputs.investmentReturn ?? 7}
                onChange={(v) => handleInputChange('investmentReturn', v)}
                step={0.5}
                helperText="If you invested extra payments instead"
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
                label="Interest Saved"
                value={`$${(result.details.interestSaved as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                sublabel={`Pay off ${(result.details.yearsSaved as number).toFixed(1)} years early`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Regular Payment"
                    value={`$${(result.details.regularMonthlyPayment as number).toLocaleString()}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="With Extra"
                    value={`$${((result.details.regularMonthlyPayment as number) + (inputs.extraMonthlyPayment ?? 0)).toLocaleString()}`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Months Saved"
                    value={`${result.details.monthsSaved}`}
                    sublabel={`${(result.details.yearsSaved as number).toFixed(1)} years`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Investment Value"
                    value={`$${(result.details.investmentValue as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    sublabel="If invested instead"
                    color="secondary"
                  />
                </Grid>
              </Grid>

              {/* Interest Comparison */}
              <ResultsSection 
                title="Interest Comparison" 
                subtitle="Total interest paid with and without extra payments"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Regular Payments"
                    value={result.details.totalInterestRegular as number}
                    maxValue={result.details.totalInterestRegular as number}
                    color={CHART_COLORS.quaternary}
                  />
                  <HorizontalBar
                    label="With Extra Payments"
                    value={result.details.totalInterestWithExtra as number}
                    maxValue={result.details.totalInterestRegular as number}
                    color={CHART_COLORS.primary}
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46' }}>
                      Save ${(result.details.interestSaved as number).toLocaleString(undefined, { maximumFractionDigits: 0 })} in Interest
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Plus pay off your mortgage {(result.details.yearsSaved as number).toFixed(1)} years early
                    </Typography>
                  </Box>
                </Paper>
              </ResultsSection>

              {/* Loan Balance Over Time */}
              <ResultsSection 
                title="Loan Balance Over Time" 
                subtitle="How quickly you build equity with extra payments"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <AmortizationChart data={amortizationData} height={280} />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Regular Payoff</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {Math.round((result.details.monthsRegular as number) / 12)} years
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">With Extra Payments</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#065F46' }}>
                          {((result.details.monthsWithExtra as number) / 12).toFixed(1)} years
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Prepay vs Invest */}
              <ResultsSection 
                title="Prepay vs Invest" 
                subtitle="Should you pay down the mortgage or invest?"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, height: '100%' }}>
                        <Savings sx={{ fontSize: 32, color: '#22C55E', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#065F46' }}>
                          Prepay Mortgage
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          ${(result.details.interestSaved as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Guaranteed {inputs.interestRate}% return
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, height: '100%' }}>
                        <TrendingUp sx={{ fontSize: 32, color: '#196bc0', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F4F8F' }}>
                          Invest Instead
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4F8F', my: 1 }}>
                          ${(result.details.investmentValue as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Potential at {result.details.investmentReturn}% return
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Alert 
                    severity={(result.details.investmentValue as number) > (result.details.interestSaved as number) ? 'info' : 'success'} 
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2">
                      {(result.details.investmentValue as number) > (result.details.interestSaved as number) 
                        ? `Investing may yield $${((result.details.investmentValue as number) - (result.details.interestSaved as number)).toLocaleString(undefined, { maximumFractionDigits: 0 })} more than prepaying. However, investment returns aren't guaranteed while interest savings are.`
                        : `Prepaying wins by $${((result.details.interestSaved as number) - (result.details.investmentValue as number)).toLocaleString(undefined, { maximumFractionDigits: 0 })}. The guaranteed ${inputs.interestRate}% return from prepaying beats the expected ${result.details.investmentReturn}% investment return.`
                      }
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('lower') ? 'tip' : insight.includes('higher') ? 'info' : 'info'}
                        title="Analysis"
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
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  border: '1px solid',
                  borderColor: 'success.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Speed sx={{ fontSize: 32, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'success.dark' }}>
                      Adding <strong>${(inputs.extraMonthlyPayment ?? 0).toLocaleString()}/month</strong> 
                      {(inputs.extraAnnualPayment ?? 0) > 0 ? ` plus $${(inputs.extraAnnualPayment ?? 0).toLocaleString()}/year` : ''} to your mortgage 
                      saves <strong>${(result.details.interestSaved as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in interest and 
                      pays off your loan <strong>{(result.details.yearsSaved as number).toFixed(1)} years early</strong>. 
                      That's a guaranteed <strong>{inputs.interestRate}%</strong> return on every extra dollar.
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
