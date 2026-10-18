'use client';

import { formatCurrency, formatSignedCurrency } from '@/lib/format';

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
  Savings,
  TrendingUp,
  AccountBalance,
  Speed,
  CalendarMonth,
  CheckCircle,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  SelectInput,
  NumberInput,
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
import { calculatePayoff } from '@/lib/calculators';
import type { PayoffInputs } from '@/lib/calculators/types';

export default function PayoffCalculator() {
  const [inputs, setInputs] = useState<PayoffInputs>({
    loanAmount: 360000,
    interestRate: DEFAULT_RATES.thirtyYearFixed,
    loanTerm: 30,
    extraMonthlyPayment: 300,
    extraAnnualPayment: 0,
    lumpSumAmount: 0,
    lumpSumYear: 0,
    biweeklyFee: 400,
    investmentReturn: 7,
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  const marketRates = useLiveRateDefaults(inputs, setInputs, { anchorField: 'interestRate' });
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferredInputs.loanAmount <= 0) return null;
    return calculatePayoff(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof PayoffInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const amortizationData = useMemo(() => {
    if (!result?.chartData) return [];
    return (result.chartData as Array<{ year: number; regularLoan: number; withExtraPayments: number }>).map(item => ({
      year: item.year,
      balance: item.withExtraPayments,
    }));
  }, [result]);

  const strategies = result?.strategyComparison ?? [];
  const maxStrategyInterest = Math.max(...strategies.map(s => s.totalInterest), 1);
  const bestStrategy = strategies.reduce(
    (best, s) => (s.totalInterest < best.totalInterest ? s : best),
    strategies[0] ?? { strategy: '', totalInterest: 0, years: 0 }
  );

  return (
    <CalculatorLayout
      calculatorSlug="payoff"
      assumptions={[
        `Fixed-rate loan of ${formatCurrency(inputs.loanAmount)} at ${inputs.interestRate}% interest for ${inputs.loanTerm} years, fully amortizing`,
        `Invest-instead comparison assumes a ${inputs.investmentReturn}% annual return, which is not guaranteed`,
      ]}
      title="Pay Off Your Mortgage Faster"
      description="Compare every payoff strategy in one place: extra monthly or annual payments, lump sums, true biweekly payments, and the free DIY alternative — plus whether you'd be better off investing instead."
      relatedCalculators={[
        { slug: 'recast-vs-refi', name: 'Recast vs Refinance' },
        { slug: 'amortization', name: 'Amortization Schedule' },
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
              <MarketRateNote rates={marketRates} />
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
              <CurrencyInput
                label="Lump Sum Amount"
                value={inputs.lumpSumAmount ?? 0}
                onChange={(v) => handleInputChange('lumpSumAmount', v)}
                helperText="A one-time principal payment (bonus, inheritance, etc.)"
              />
              {(inputs.lumpSumAmount ?? 0) > 0 && (
                <NumberInput
                  label="Lump Sum Year"
                  value={inputs.lumpSumYear ?? 0}
                  onChange={(v) => handleInputChange('lumpSumYear', v)}
                  suffix="years"
                />
              )}
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
              <HeroMetric
                label="Interest Saved"
                value={`${formatCurrency((result.details.interestSaved as number))}`}
                sublabel={`Pay off ${(result.details.yearsSaved as number).toFixed(1)} years early`}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Regular Payment"
                    value={`${formatCurrency((result.details.regularMonthlyPayment as number))}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="With Extra"
                    value={`${formatCurrency(((result.details.regularMonthlyPayment as number) + (inputs.extraMonthlyPayment ?? 0)))}`}
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
                    label="Effective Return"
                    value={`${inputs.interestRate}%`}
                    sublabel="Guaranteed (your loan rate)"
                    color="secondary"
                  />
                </Grid>
              </Grid>

              {/* Strategy Comparison */}
              <ResultsSection
                title="Every Payoff Strategy Compared"
                subtitle="Total interest and payoff time for each approach"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {strategies.map((s) => (
                      <Box
                        key={s.strategy}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          bgcolor: s.strategy === bestStrategy.strategy ? '#D1FAE5' : '#F9FAFB',
                          border: s.strategy === bestStrategy.strategy ? '2px solid #22C55E' : '1px solid #E5E7EB',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {s.strategy === bestStrategy.strategy && <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />}
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{s.strategy}</Typography>
                            </Stack>
                            {s.strategy === bestStrategy.strategy && (
                              <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 600 }}>LEAST INTEREST</Typography>
                            )}
                          </Grid>
                          <Grid size={{ xs: 6, sm: 4 }}>
                            <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(s.totalInterest)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">Payoff In</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{s.years} yrs</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  {strategies.map((s) => (
                    <HorizontalBar
                      key={s.strategy}
                      label={s.strategy}
                      value={s.totalInterest}
                      maxValue={maxStrategyInterest}
                      color={s.strategy === bestStrategy.strategy ? CHART_COLORS.primary : '#9CA3AF'}
                    />
                  ))}
                </Paper>
              </ResultsSection>

              {/* Biweekly truth box */}
              <ResultsSection
                title="The Truth About Biweekly Programs"
                subtitle="You don't need to pay for this"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, height: '100%' }}>
                        <CalendarMonth sx={{ fontSize: 32, color: '#22C55E', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#065F46' }}>
                          True Biweekly (26/year)
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          {formatCurrency((result.details.biweeklyInterestSaved as number))} saved
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency((result.details.biweeklyPayment as number))} every 2 weeks pays off in {result.details.biweeklyYears} years — {result.details.biweeklyYearsSaved} years early.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, height: '100%' }}>
                        <Savings sx={{ fontSize: 32, color: '#196bc0', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F4F8F' }}>
                          Free DIY Alternative
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4F8F', my: 1 }}>
                          {formatSignedCurrency((result.details.diyExtraMonthly as number))}/month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add 1/12 of your payment to principal each month — identical result, no enrollment fees.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Alert severity="warning" sx={{ borderRadius: 2, mt: 3 }}>
                    <Typography variant="body2">
                      &quot;Fake&quot; biweekly services charge ~{formatCurrency((result.details.biweeklyFee as number))}/year but only forward 24 half-payments — exactly the same as paying monthly. All fee, no benefit.
                    </Typography>
                  </Alert>

                  <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Some servicers will not accept true biweekly or partial payments
                    </Typography>
                    <Typography variant="body2">
                      Many mortgage servicers reject half-payments or hold extra funds until a full monthly
                      amount arrives, so a true 26-payment biweekly schedule is not always available.
                      If your servicer will not apply payments every two weeks, use the DIY extra monthly
                      payment instead — extra principal is accepted on almost every loan.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Loan Balance Over Time */}
              <ResultsSection
                title="Loan Balance Over Time"
                subtitle="How quickly you build equity with your payoff plan"
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
                        <Typography variant="caption" color="text.secondary">With Your Plan</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#065F46' }}>
                          {((result.details.monthsWithExtra as number) / 12).toFixed(1)} years
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Prepay vs Invest — ENG-323 fair comparison */}
              <ResultsSection
                title="Prepay vs Invest"
                subtitle={`Net worth at year ${result.details.horizonYears} under each strategy, with identical monthly spending`}
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
                          {formatCurrency((result.details.prepayPortfolio as number))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Portfolio at year {result.details.horizonYears}: loan paid off in {((result.details.monthsWithExtra as number) / 12).toFixed(1)} years, then the full {formatCurrency(((result.details.regularMonthlyPayment as number) + (inputs.extraMonthlyPayment ?? 0)))}/month payment is invested at {result.details.investmentReturn}%
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
                          {formatCurrency((result.details.investmentValue as number))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Portfolio at year {result.details.horizonYears}: extra payments invested at {result.details.investmentReturn}% while the loan runs its full term
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Alert
                    severity={(result.details.netWorthDifference as number) > 0 ? 'info' : 'success'}
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2">
                      {(result.details.netWorthDifference as number) > 0
                        ? `At year ${result.details.horizonYears}, investing ends ${formatCurrency((result.details.netWorthDifference as number))} ahead of prepaying. But that edge assumes you actually earn ${result.details.investmentReturn}% every year - prepaying's ${inputs.interestRate}% return is guaranteed.`
                        : `At year ${result.details.horizonYears}, prepaying ends ${formatCurrency(Math.abs(result.details.netWorthDifference as number))} ahead of investing. The guaranteed ${inputs.interestRate}% return from prepaying beats the expected ${result.details.investmentReturn}% investment return.`
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
                      {result.summary} Every extra dollar toward principal earns a guaranteed <strong>{inputs.interestRate}%</strong> return — and never pay a third party for a biweekly program.
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
