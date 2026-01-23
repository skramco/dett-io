'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Paper, Typography, Stack, Divider, Alert } from '@mui/material';
import { AttachMoney, AccountBalance, TrendingUp, Warning, CompareArrows } from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import { InputSection, CurrencyInput, PercentageInput, SelectInput, NumberInput } from '@/components/mui/calculator/InputPanel';
import { HeroMetric, MetricCard, InsightCallout, ResultsSection, EmptyResultsState } from '@/components/mui/calculator/ResultsPanel';
import { HorizontalBar, CHART_COLORS } from '@/components/mui/calculator/ChartComponents';
import { calculateCashOutRefi } from '@/lib/calculators';
import type { CashOutRefinanceInputs } from '@/lib/calculators/types';

export default function CashOutRefiCalculator() {
  const [inputs, setInputs] = useState<CashOutRefinanceInputs>({
    currentBalance: 280000, currentRate: 4.5, yearsRemaining: 25, homeValue: 500000,
    cashOutAmount: 50000, newRate: 6.75, newTerm: 30, closingCosts: 8000, alternativeRate: 10,
  });

  const result = useMemo(() => inputs.currentBalance <= 0 ? null : calculateCashOutRefi(inputs), [inputs]);
  const handleInputChange = (field: keyof CashOutRefinanceInputs, value: number) => setInputs(prev => ({ ...prev, [field]: value }));

  const scenarios = useMemo(() => (result?.chartData || []) as Array<{ scenario: string; payment: number; totalInterest: number }>, [result]);

  return (
    <CalculatorLayout title="Cash-Out Refinance Calculator" description="Analyze the true cost of accessing your home equity through a cash-out refinance.">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
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
              <HeroMetric label="Effective Cost of Cash" value={`${result.details.effectiveRate}%`} sublabel={`Getting $${inputs.cashOutAmount.toLocaleString()} costs you this rate over ${inputs.newTerm} years`} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Current Payment" value={`$${(result.details.currentPayment as number).toLocaleString()}`} color="primary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="New Payment" value={`$${(result.details.newPayment as number).toLocaleString()}`} color="warning" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="New LTV" value={`${result.details.newLTV}%`} color={(result.details.newLTV as number) > 80 ? 'error' : 'success'} /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Extra Interest" value={`$${(result.details.totalInterestIncrease as number).toLocaleString()}`} color="error" /></Grid>
              </Grid>
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
                      Getting <strong>${inputs.cashOutAmount.toLocaleString()}</strong> via cash-out refi costs you an effective <strong>{result.details.effectiveRate}%</strong> rate 
                      and <strong>${(result.details.totalInterestIncrease as number).toLocaleString()}</strong> in extra interest. Your payment increases by 
                      <strong> ${((result.details.newPayment as number) - (result.details.currentPayment as number)).toLocaleString()}/month</strong>.
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
