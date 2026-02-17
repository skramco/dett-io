'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import { Box, Grid, Paper, Typography, Stack, Divider, Alert } from '@mui/material';
import { Refresh, AccountBalance, Speed, CheckCircle, CompareArrows } from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import { InputSection, CurrencyInput, PercentageInput, SelectInput, NumberInput } from '@/components/mui/calculator/InputPanel';
import { HeroMetric, MetricCard, InsightCallout, ResultsSection, EmptyResultsState } from '@/components/mui/calculator/ResultsPanel';
import { HorizontalBar, CHART_COLORS } from '@/components/mui/calculator/LazyCharts';
import { calculateRecastVsRefi } from '@/lib/calculators';
import type { RecastVsRefinanceInputs } from '@/lib/calculators/types';

export default function RecastVsRefiCalculator() {
  const [inputs, setInputs] = useState<RecastVsRefinanceInputs>({
    currentBalance: 320000, currentRate: 6.5, yearsRemaining: 27, lumpSumAmount: 50000,
    recastFee: 250, newRate: 6.0, newTerm: 30, closingCosts: 6000,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => deferredInputs.currentBalance <= 0 ? null : calculateRecastVsRefi(deferredInputs), [deferredInputs]);
  const handleInputChange = (field: keyof RecastVsRefinanceInputs, value: number) => setInputs(prev => ({ ...prev, [field]: value }));

  const options = useMemo(() => (result?.chartData || []) as Array<{ option: string; payment: number; totalInterest: number }>, [result]);
  const bestOption = options.slice(1).reduce((best, current) => current.totalInterest < best.totalInterest ? current : best, options[1] || { option: '', payment: 0, totalInterest: 0 });

  return (
    <CalculatorLayout calculatorSlug="recast-vs-refi" title="Recast vs Refinance Calculator" description="Compare recasting your mortgage vs refinancing when you have a lump sum to apply." relatedCalculators={[{ slug: 'refinance', name: 'Should I Refinance?' }, { slug: 'extra-payment', name: 'Extra Payment Impact' }, { slug: 'cash-out-refi', name: 'Cash-Out Refinance' }]} actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Current Mortgage" icon={<AccountBalance />}>
              <CurrencyInput label="Current Balance" value={inputs.currentBalance} onChange={(v) => handleInputChange('currentBalance', v)} />
              <PercentageInput label="Current Rate" value={inputs.currentRate} onChange={(v) => handleInputChange('currentRate', v)} step={0.125} />
              <NumberInput label="Years Remaining" value={inputs.yearsRemaining} onChange={(v) => handleInputChange('yearsRemaining', v)} suffix="years" />
            </InputSection>
            <InputSection title="Lump Sum" icon={<Speed />} color="secondary">
              <CurrencyInput label="Lump Sum Amount" value={inputs.lumpSumAmount} onChange={(v) => handleInputChange('lumpSumAmount', v)} helperText="Amount to apply to principal" />
              <CurrencyInput label="Recast Fee" value={inputs.recastFee} onChange={(v) => handleInputChange('recastFee', v)} />
            </InputSection>
            <InputSection title="Refinance Option" icon={<Refresh />}>
              <PercentageInput label="New Rate" value={inputs.newRate} onChange={(v) => handleInputChange('newRate', v)} step={0.125} />
              <SelectInput label="New Term" value={inputs.newTerm} onChange={(v) => handleInputChange('newTerm', v as number)} options={[{ value: 15, label: '15 years' }, { value: 20, label: '20 years' }, { value: 30, label: '30 years' }]} />
              <CurrencyInput label="Closing Costs" value={inputs.closingCosts} onChange={(v) => handleInputChange('closingCosts', v)} />
            </InputSection>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              <HeroMetric label="Best Option for Interest Savings" value={bestOption.option} sublabel={`Total interest: $${bestOption.totalInterest.toLocaleString()}`} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Current Payment" value={`$${(result.details.currentPayment as number).toLocaleString()}`} color="primary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Recast Payment" value={`$${(result.details.recastPayment as number).toLocaleString()}`} sublabel={`Fee: $${result.details.recastFee}`} color="success" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Refi Payment" value={`$${(result.details.refiPayment as number).toLocaleString()}`} sublabel={`Costs: $${result.details.refiCosts}`} color="secondary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Prepay Saves" value={`${Math.round((result.details.prepayMonthsSaved as number) / 12)} years`} color="warning" /></Grid>
              </Grid>
              <ResultsSection title="Options Compared" subtitle="Three ways to use your lump sum">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {options.slice(1).map((opt, i) => (
                      <Box key={i} sx={{ p: 3, borderRadius: 2, bgcolor: opt.option === bestOption.option ? '#D1FAE5' : '#F9FAFB', border: opt.option === bestOption.option ? '2px solid #22C55E' : '1px solid #E5E7EB' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {opt.option === bestOption.option && <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />}
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{opt.option}</Typography>
                            </Stack>
                            {opt.option === bestOption.option && <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 600 }}>BEST FOR INTEREST</Typography>}
                          </Grid>
                          <Grid size={{ xs: 6, sm: 4 }}>
                            <Typography variant="body2" color="text.secondary">Monthly Payment</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>${opt.payment.toLocaleString()}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 4 }}>
                            <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: opt.option === bestOption.option ? '#065F46' : 'inherit' }}>${opt.totalInterest.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </ResultsSection>
              <ResultsSection title="Total Interest Comparison" subtitle="Which option saves the most?">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {options.map((opt, i) => <HorizontalBar key={i} label={opt.option} value={opt.totalInterest} maxValue={Math.max(...options.map(o => o.totalInterest))} color={opt.option === bestOption.option ? CHART_COLORS.primary : i === 0 ? '#9CA3AF' : CHART_COLORS.secondary} />)}
                </Paper>
              </ResultsSection>
              <ResultsSection title="Quick Comparison" subtitle="Key differences at a glance">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065F46', mb: 1 }}>Recast</Typography>
                        <Typography variant="body2" sx={{ color: '#065F46' }}>✓ Low fee (${result.details.recastFee})<br />✓ Keep current rate<br />✓ Lower payment<br />✓ Quick process</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F4F8F', mb: 1 }}>Refinance</Typography>
                        <Typography variant="body2" sx={{ color: '#0F4F8F' }}>✓ New rate ({inputs.newRate}%)<br />✓ Reset term<br />✓ Higher costs (${inputs.closingCosts})<br />✓ More paperwork</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 3, bgcolor: '#FEF3C7', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400E', mb: 1 }}>Prepay Only</Typography>
                        <Typography variant="body2" sx={{ color: '#92400E' }}>✓ No fees<br />✓ Same payment<br />✓ Pay off {Math.round((result.details.prepayMonthsSaved as number) / 12)} years early<br />✓ Most interest saved</Typography>
                      </Box>
                    </Grid>
                  </Grid>
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
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CompareArrows sx={{ fontSize: 32, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>The Bottom Line</Typography>
                    <Typography variant="body1" sx={{ color: 'success.dark' }}>
                      With ${inputs.lumpSumAmount.toLocaleString()} to apply, <strong>{bestOption.option}</strong> saves the most interest 
                      (${bestOption.totalInterest.toLocaleString()} total). Recast lowers your payment to ${(result.details.recastPayment as number).toLocaleString()}/mo 
                      for just ${result.details.recastFee} fee.
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
