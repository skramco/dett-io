'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import { Box, Grid, Paper, Typography, Stack, Divider, Alert } from '@mui/material';
import { AttachMoney, AccountBalance, TrendingUp, Warning, CompareArrows } from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import { InputSection, CurrencyInput, PercentageInput, SelectInput, NumberInput } from '@/components/mui/calculator/InputPanel';
import { HeroMetric, MetricCard, InsightCallout, ResultsSection, EmptyResultsState } from '@/components/mui/calculator/ResultsPanel';
import { HorizontalBar, CHART_COLORS } from '@/components/mui/calculator/LazyCharts';
import { calculateCashOutRefi } from '@/lib/calculators';
import type { CashOutRefinanceInputs } from '@/lib/calculators/types';

export default function CashOutRefiCalculator() {
  const [inputs, setInputs] = useState<CashOutRefinanceInputs>({
    currentBalance: 280000, currentRate: 4.5, yearsRemaining: 25, homeValue: 500000,
    cashOutAmount: 50000, newRate: 6.75, newTerm: 30, closingCosts: 8000, alternativeRate: 10,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => deferredInputs.currentBalance <= 0 ? null : calculateCashOutRefi(deferredInputs), [deferredInputs]);
  const handleInputChange = (field: keyof CashOutRefinanceInputs, value: number) => setInputs(prev => ({ ...prev, [field]: value }));

  const scenarios = useMemo(() => (result?.chartData || []) as Array<{ scenario: string; payment: number; totalInterest: number }>, [result]);

  return (
    <CalculatorLayout calculatorSlug="cash-out-refi" title="Cash-Out Refinance Calculator" description="Analyze the true cost of accessing your home equity through a cash-out refinance." relatedCalculators={[{ slug: 'refinance', name: 'Should I Refinance?' }, { slug: 'recast-vs-refi', name: 'Recast vs Refinance' }, { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' }]} actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Current Mortgage" icon={<AccountBalance />}>
              <CurrencyInput label="Current Balance" value={inputs.currentBalance} onChange={(v) => handleInputChange('currentBalance', v)} />
              <PercentageInput label="Current Rate" value={inputs.currentRate} onChange={(v) => handleInputChange('currentRate', v)} step={0.125} />
              <NumberInput label="Years Remaining" value={inputs.yearsRemaining} onChange={(v) => handleInputChange('yearsRemaining', v)} suffix="years" />
              <CurrencyInput label="Home Value" value={inputs.homeValue} onChange={(v) => handleInputChange('homeValue', v)} />
            </InputSection>
            <InputSection title="Cash-Out Details" icon={<AttachMoney />} color="secondary">
              <CurrencyInput label="Cash Out Amount" value={inputs.cashOutAmount} onChange={(v) => handleInputChange('cashOutAmount', v)} />
              <PercentageInput label="New Rate" value={inputs.newRate} onChange={(v) => handleInputChange('newRate', v)} step={0.125} />
              <SelectInput label="New Term" value={inputs.newTerm} onChange={(v) => handleInputChange('newTerm', v as number)} options={[{ value: 15, label: '15 years' }, { value: 30, label: '30 years' }]} />
              <CurrencyInput label="Closing Costs" value={inputs.closingCosts} onChange={(v) => handleInputChange('closingCosts', v)} />
            </InputSection>
            <InputSection title="Alternative" icon={<TrendingUp />}>
              <PercentageInput label="Alternative Loan Rate" value={inputs.alternativeRate} onChange={(v) => handleInputChange('alternativeRate', v)} step={0.5} helperText="HELOC or personal loan rate" />
            </InputSection>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              <HeroMetric label="Extra Interest to Access Cash" value={`$${(result.details.totalInterestIncrease as number).toLocaleString()}`} sublabel={`Total additional interest you'd pay to get $${inputs.cashOutAmount.toLocaleString()} this way — a dollar cost, not a rate or APR`} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Current Payment" value={`$${(result.details.currentPayment as number).toLocaleString()}`} color="primary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="New Payment" value={`$${(result.details.newPayment as number).toLocaleString()}`} color="warning" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="New LTV" value={`${result.details.newLTV}%`} color={(result.details.newLTV as number) > 80 ? 'error' : 'success'} /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Payment Increase" value={`+$${((result.details.newPayment as number) - (result.details.currentPayment as number)).toLocaleString()}/mo`} color="error" /></Grid>
              </Grid>
              <ResultsSection title="Cost of Cash Comparison" subtitle="Educational estimates — not APRs, quotes, or loan offers">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Cash-out refi note rate</Typography>
                        <Typography variant="caption" color="text.secondary">The rate you entered on the full ${(result.details.newLoanAmount as number).toLocaleString()} balance</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{inputs.newRate}%</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Keep mortgage + borrow separately (blended)</Typography>
                        <Typography variant="caption" color="text.secondary">Balance-weighted average of your {inputs.currentRate}% mortgage and a {inputs.alternativeRate}% loan for the cash</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{result.details.blendedAltRate}%</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Marginal cost of cash (IRR)</Typography>
                        <Typography variant="caption" color="text.secondary">What borrowing the ${inputs.cashOutAmount.toLocaleString()} effectively costs, based on the IRR of your incremental payments</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{typeof result.details.marginalCashCostIrr === 'number' ? `${result.details.marginalCashCostIrr}%` : 'None'}</Typography>
                    </Stack>
                    {typeof result.details.marginalCashCostIrr !== 'number' && (
                      <Typography variant="caption" color="text.secondary">At these inputs the refi doesn&apos;t cost more than the cash you receive, so there is no positive marginal cost.</Typography>
                    )}
                  </Stack>
                  <Alert severity="info" sx={{ borderRadius: 2, mt: 3 }}>
                    <Typography variant="body2">
                      These figures are educational estimates based on your inputs. They are <strong>not APRs</strong> — APR is a standardized disclosure that lenders must provide under the Truth in Lending Act, based on a loan&apos;s actual fees and terms. Always compare official Loan Estimates from lenders.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>
              <ResultsSection title="Payment Comparison" subtitle="Current vs cash-out refi">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">CURRENT MORTGAGE</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>${(result.details.currentPayment as number).toLocaleString()}/mo</Typography>
                        <Typography variant="body2" color="text.secondary">{inputs.currentRate}% • {inputs.yearsRemaining} years left</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#FEF3C7', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">CASH-OUT REFI</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#92400E', my: 1 }}>${(result.details.newPayment as number).toLocaleString()}/mo</Typography>
                        <Typography variant="body2" color="text.secondary">{inputs.newRate}% • {inputs.newTerm} years</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                  <Alert severity={inputs.newRate > inputs.currentRate ? 'warning' : 'info'} sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      {inputs.newRate > inputs.currentRate 
                        ? `You're trading a ${inputs.currentRate}% rate for ${inputs.newRate}%. This is an expensive way to access cash.`
                        : `Your new rate (${inputs.newRate}%) is lower than current (${inputs.currentRate}%). This could make sense.`}
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>
              <ResultsSection title="Total Interest Comparison" subtitle="How much more will you pay?">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {scenarios.map((s, i) => <HorizontalBar key={i} label={s.scenario} value={s.totalInterest} maxValue={Math.max(...scenarios.map(x => x.totalInterest))} color={i === 0 ? CHART_COLORS.primary : i === 1 ? CHART_COLORS.quaternary : CHART_COLORS.secondary} />)}
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ p: 3, bgcolor: '#FEE2E2', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#DC2626' }}>Extra Interest Cost: ${(result.details.totalInterestIncrease as number).toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">This is the true cost of your ${inputs.cashOutAmount.toLocaleString()} cash</Typography>
                  </Box>
                </Paper>
              </ResultsSection>
              {(result.details.newLTV as number) > 80 && (
                <Alert severity="warning" icon={<Warning />} sx={{ borderRadius: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>High LTV Warning</Typography>
                  <Typography variant="body2">Your new LTV is {result.details.newLTV}%. Above 80% may require PMI or result in higher rates.</Typography>
                </Alert>
              )}
              {result.insights?.length > 0 && (
                <ResultsSection title="Insights">
                  <Stack spacing={2}>
                    {result.insights.map((insight, i) => <InsightCallout key={i} type={insight.includes('⚠️') ? 'warning' : insight.includes('💡') ? 'tip' : 'info'} title="Analysis">{insight.replace('⚠️ ', '').replace('💡 ', '')}</InsightCallout>)}
                  </Stack>
                </ResultsSection>
              )}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CompareArrows sx={{ fontSize: 32, color: '#92400E' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#92400E', mb: 1 }}>The Bottom Line</Typography>
                    <Typography variant="body1" sx={{ color: '#92400E' }}>
                      Getting <strong>${inputs.cashOutAmount.toLocaleString()}</strong> via cash-out refi adds 
                      <strong> ${(result.details.totalInterestIncrease as number).toLocaleString()}</strong> in extra interest and raises your payment by 
                      <strong> ${((result.details.newPayment as number) - (result.details.currentPayment as number)).toLocaleString()}/month</strong>. 
                      Compare that with keeping your {inputs.currentRate}% mortgage and borrowing the cash separately at {inputs.alternativeRate}% — a blended <strong>{result.details.blendedAltRate}%</strong> across both balances.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          ) : <EmptyResultsState />}
        </Grid>
      </Grid>
    </CalculatorLayout>
  );
}
