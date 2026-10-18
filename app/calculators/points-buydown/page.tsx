'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import { Box, Grid, Paper, Typography, Stack, Divider, Alert } from '@mui/material';
import { Percent, AttachMoney, Timeline, CheckCircle, AccountBalance } from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import { InputSection, CurrencyInput, PercentageInput, SelectInput, NumberInput } from '@/components/mui/calculator/InputPanel';
import { HeroMetric, MetricCard, InsightCallout, ResultsSection, EmptyResultsState } from '@/components/mui/calculator/ResultsPanel';
import { HorizontalBar, CHART_COLORS } from '@/components/mui/calculator/LazyCharts';
import { calculatePointsBuydown, calculateBuydownSubsidy } from '@/lib/calculators';
import type { PointsBuydownInputs } from '@/lib/calculators/types';

const fmtUpfront = (v: number) => `${v < 0 ? '−' : ''}$${Math.abs(v).toLocaleString()}`;

export default function PointsBuydownCalculator() {
  const [inputs, setInputs] = useState<PointsBuydownInputs>({
    loanAmount: 360000, parRate: 6.75, loanTerm: 30, pointsCost: 7200, pointsRate: 6.25,
    lenderCredit: 3600, lenderCreditRate: 7.0, buydownType: 'none', buydownCost: 0, yearsToHold: 7,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => deferredInputs.loanAmount <= 0 ? null : calculatePointsBuydown(deferredInputs), [deferredInputs]);
  const handleInputChange = (field: keyof PointsBuydownInputs, value: number | string) => setInputs(prev => ({ ...prev, [field]: value }));
  const handleBuydownTypeChange = (type: PointsBuydownInputs['buydownType']) => setInputs(prev => ({
    ...prev,
    buydownType: type,
    buydownCost: type === 'none' ? 0 : Math.round(calculateBuydownSubsidy(prev.loanAmount, prev.parRate, prev.loanTerm, type)),
  }));

  const options = useMemo(() => (result?.chartData || []) as Array<{ option: string; monthlyPayment: number; upfrontCost: number; remainingBalance: number; totalCost: number }>, [result]);
  const bestOption = options.reduce((best, current) => current.totalCost < best.totalCost ? current : best, options[0] || { option: '', monthlyPayment: 0, upfrontCost: 0, totalCost: 0 });

  return (
    <CalculatorLayout calculatorSlug="points-buydown" title="Points & Buydown Calculator" description="Compare buying points, taking lender credits, or temporary buydowns." relatedCalculators={[{ slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' }, { slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate' }, { slug: 'interest-sensitivity', name: 'Rate Sensitivity' }]} actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Loan Details" icon={<AccountBalance />}>
              <CurrencyInput label="Loan Amount" value={inputs.loanAmount} onChange={(v) => handleInputChange('loanAmount', v)} />
              <PercentageInput label="Par Rate" value={inputs.parRate} onChange={(v) => handleInputChange('parRate', v)} step={0.125} />
              <SelectInput label="Loan Term" value={inputs.loanTerm} onChange={(v) => handleInputChange('loanTerm', v as number)} options={[{ value: 15, label: '15 years' }, { value: 30, label: '30 years' }]} />
            </InputSection>
            <InputSection title="Points Option" icon={<Percent />} color="secondary">
              <CurrencyInput label="Points Cost" value={inputs.pointsCost} onChange={(v) => handleInputChange('pointsCost', v)} />
              <PercentageInput label="Rate with Points" value={inputs.pointsRate} onChange={(v) => handleInputChange('pointsRate', v)} step={0.125} />
            </InputSection>
            <InputSection title="Lender Credit" icon={<AttachMoney />}>
              <CurrencyInput label="Credit Amount" value={inputs.lenderCredit} onChange={(v) => handleInputChange('lenderCredit', v)} />
              <PercentageInput label="Rate with Credit" value={inputs.lenderCreditRate} onChange={(v) => handleInputChange('lenderCreditRate', v)} step={0.125} />
            </InputSection>
            <InputSection title="Temporary Buydown" icon={<Timeline />} color="secondary">
              <SelectInput label="Buydown Type" value={inputs.buydownType} onChange={(v) => handleBuydownTypeChange(v as PointsBuydownInputs['buydownType'])} options={[{ value: 'none', label: 'None' }, { value: '1-0', label: '1-0 (1% off year 1)' }, { value: '2-1', label: '2-1 (2% off yr 1, 1% off yr 2)' }, { value: '3-2-1', label: '3-2-1 (3%, 2%, 1% off yrs 1-3)' }]} helperText="Lowers your payment for the first years; the loan itself stays at the par rate" />
              {inputs.buydownType !== 'none' && (
                <CurrencyInput label="Buydown Cost" value={inputs.buydownCost} onChange={(v) => handleInputChange('buydownCost', v)} helperText={`Typical escrow cost: $${Math.round(calculateBuydownSubsidy(inputs.loanAmount, inputs.parRate, inputs.loanTerm, inputs.buydownType)).toLocaleString()} (set to $0 if seller-paid)`} />
              )}
            </InputSection>
            <InputSection title="Timeline" icon={<Timeline />}>
              <NumberInput label="Years to Hold" value={inputs.yearsToHold} onChange={(v) => handleInputChange('yearsToHold', v)} suffix="years" />
            </InputSection>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              <HeroMetric label={`Best for ${inputs.yearsToHold} Years`} value={result.details.bestOption as string} sublabel={`Net cost: $${(result.details.bestTotalCost as number).toLocaleString()}`} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Par Payment" value={`$${(result.details.parPayment as number).toLocaleString()}`} color="primary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Best Payment" value={`$${(result.details.bestPayment as number).toLocaleString()}`} color="success" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Hold Period" value={`${inputs.yearsToHold} yrs`} color="secondary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Best Cost" value={`$${(result.details.bestTotalCost as number).toLocaleString()}`} color="success" /></Grid>
              </Grid>
              <ResultsSection title="Options Compared" subtitle={`Net cost over ${inputs.yearsToHold} years — payments + upfront cost, minus principal paid down`}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    <Grid container spacing={2} sx={{ px: 2 }}>
                      <Grid size={{ xs: 4 }}><Typography variant="caption" color="text.secondary">Option</Typography></Grid>
                      <Grid size={{ xs: 3 }}><Typography variant="caption" color="text.secondary">Payment</Typography></Grid>
                      <Grid size={{ xs: 2 }}><Typography variant="caption" color="text.secondary">Upfront</Typography></Grid>
                      <Grid size={{ xs: 3 }}><Typography variant="caption" color="text.secondary">Net cost</Typography></Grid>
                    </Grid>
                    {options.map((opt, i) => (
                      <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: opt.option === bestOption.option ? '#D1FAE5' : '#F9FAFB', border: opt.option === bestOption.option ? '2px solid #22C55E' : '1px solid #E5E7EB' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 4 }}><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{opt.option === bestOption.option && <CheckCircle sx={{ fontSize: 16, color: '#22C55E', mr: 0.5 }} />}{opt.option}</Typography></Grid>
                          <Grid size={{ xs: 3 }}><Typography variant="body2">${opt.monthlyPayment.toLocaleString()}/mo{opt.option.includes('Buydown') ? ' (yr 1)' : ''}</Typography></Grid>
                          <Grid size={{ xs: 2 }}><Typography variant="body2">{fmtUpfront(opt.upfrontCost)}</Typography></Grid>
                          <Grid size={{ xs: 3 }}><Typography variant="body2" sx={{ fontWeight: 700 }}>${opt.totalCost.toLocaleString()}</Typography></Grid>
                        </Grid>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Balance after {inputs.yearsToHold} yrs: ${opt.remainingBalance.toLocaleString()}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </ResultsSection>
              <ResultsSection title="Net Cost" subtitle="Visual comparison — lower is better">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {options.map((opt, i) => <HorizontalBar key={i} label={opt.option} value={opt.totalCost} maxValue={Math.max(...options.map(o => o.totalCost))} color={opt.option === bestOption.option ? CHART_COLORS.primary : '#9CA3AF'} />)}
                </Paper>
              </ResultsSection>
              {result.insights?.length > 0 && (
                <ResultsSection title="Insights">
                  <Stack spacing={2}>
                    {result.insights.map((insight, i) => <InsightCallout key={i} type={insight.includes('💡') ? 'tip' : 'info'} title="Analysis">{insight.replace('💡 ', '')}</InsightCallout>)}
                  </Stack>
                </ResultsSection>
              )}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>The Bottom Line</Typography>
                <Typography variant="body1" sx={{ color: 'success.dark' }}>For a {inputs.yearsToHold}-year hold, <strong>{result.details.bestOption}</strong> is your best option at ${(result.details.bestTotalCost as number).toLocaleString()} net cost — payments plus upfront cost, minus the principal you&apos;ve paid down.</Typography>
              </Paper>
            </Stack>
          ) : <EmptyResultsState />}
        </Grid>
      </Grid>
    </CalculatorLayout>
  );
}
