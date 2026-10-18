'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import { Box, Grid, Paper, Typography, Stack, Divider, Alert } from '@mui/material';
import { Timeline, AccountBalance, TrendingUp, CheckCircle, Speed } from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import { InputSection, CurrencyInput, PercentageInput, NumberInput } from '@/components/mui/calculator/InputPanel';
import { HeroMetric, MetricCard, InsightCallout, ResultsSection, EmptyResultsState } from '@/components/mui/calculator/ResultsPanel';
import { HorizontalBar, CHART_COLORS } from '@/components/mui/calculator/LazyCharts';
import { calculateTimelineSimulator } from '@/lib/calculators';
import type { TimelineSimulatorInputs } from '@/lib/calculators/types';

export default function TimelineSimulatorCalculator() {
  const [inputs, setInputs] = useState<TimelineSimulatorInputs>({
    loanAmount: 360000, interestRate: 6.75, expectedMoveYear: 7,
    armInitialRate: 5.75, armFixedPeriod: 5, armIndexRate: 5, armMargin: 2.75, armAdjustmentCap: 2, armLifetimeCap: 5,
    pointsCost: 7200, pointsRate: 6.25,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => deferredInputs.loanAmount <= 0 ? null : calculateTimelineSimulator(deferredInputs), [deferredInputs]);
  const handleInputChange = (field: keyof TimelineSimulatorInputs, value: number) => setInputs(prev => ({ ...prev, [field]: value }));

  const options = useMemo(() => (result?.chartData || []) as Array<{ option: string; monthlyPayment: number; totalPaid: number; remainingBalance: number; netCost: number }>, [result]);
  const bestOption = options.reduce((best, current) => current.netCost < best.netCost ? current : best, options[0] || { option: '', monthlyPayment: 0, totalPaid: 0, remainingBalance: 0, netCost: 0 });

  return (
    <CalculatorLayout calculatorSlug="timeline-simulator" title="Timeline Simulator" description="Find the best mortgage option based on how long you plan to stay. Compare fixed, ARM, and points strategies." relatedCalculators={[{ slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate' }, { slug: 'refinance', name: 'Should I Refinance?' }, { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' }]} actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Loan Details" icon={<AccountBalance />}>
              <CurrencyInput label="Loan Amount" value={inputs.loanAmount} onChange={(v) => handleInputChange('loanAmount', v)} />
              <PercentageInput label="30-Year Fixed Rate" value={inputs.interestRate} onChange={(v) => handleInputChange('interestRate', v)} step={0.125} />
            </InputSection>
            <InputSection title="Your Timeline" icon={<Timeline />} color="secondary">
              <NumberInput label="Expected Years in Home" value={inputs.expectedMoveYear} onChange={(v) => handleInputChange('expectedMoveYear', v)} suffix="years" />
            </InputSection>
            <InputSection title="ARM Option" icon={<TrendingUp />}>
              <PercentageInput label="ARM Initial Rate" value={inputs.armInitialRate} onChange={(v) => handleInputChange('armInitialRate', v)} step={0.125} />
              <NumberInput label="ARM Fixed Period" value={inputs.armFixedPeriod} onChange={(v) => handleInputChange('armFixedPeriod', v)} suffix="years" />
              <PercentageInput label="Expected Index Rate" value={inputs.armIndexRate} onChange={(v) => handleInputChange('armIndexRate', v)} step={0.25} helperText="Future rate prediction (SOFR/Treasury)" />
              <PercentageInput label="ARM Margin" value={inputs.armMargin} onChange={(v) => handleInputChange('armMargin', v)} step={0.25} helperText="Added to index rate after fixed period" />
            </InputSection>
            <InputSection title="Points Option" icon={<Speed />}>
              <CurrencyInput label="Points Cost" value={inputs.pointsCost} onChange={(v) => handleInputChange('pointsCost', v)} />
              <PercentageInput label="Rate with Points" value={inputs.pointsRate} onChange={(v) => handleInputChange('pointsRate', v)} step={0.125} />
            </InputSection>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              <HeroMetric label={`Best for ${inputs.expectedMoveYear}-Year Hold`} value={result.details.bestOption as string} sublabel={`Net cost: $${(result.details.bestNetCost as number).toLocaleString()}`} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Best Payment" value={`$${(result.details.bestPayment as number).toLocaleString()}`} color="success" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Fixed Payment" value={`$${(result.details.fixedPayment as number).toLocaleString()}`} color="primary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="ARM Payment" value={`$${(result.details.armPayment as number).toLocaleString()}`} sublabel={inputs.expectedMoveYear > inputs.armFixedPeriod ? `adjusts to $${(result.details.armAdjustedPayment as number).toLocaleString()} at ${result.details.armAdjustedRate}%` : `fixed through year ${inputs.armFixedPeriod}`} color="secondary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Balance at Move" value={`$${(result.details.bestBalance as number).toLocaleString()}`} color="warning" /></Grid>
              </Grid>
              <ResultsSection title="All Options Compared" subtitle={`Net cost over ${inputs.expectedMoveYear} years: payments + upfront costs − equity built`}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {options.map((opt, i) => (
                      <Box key={i} sx={{ p: 3, borderRadius: 2, bgcolor: opt.option === bestOption.option ? '#D1FAE5' : '#F9FAFB', border: opt.option === bestOption.option ? '2px solid #22C55E' : '1px solid #E5E7EB' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {opt.option === bestOption.option && <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />}
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{opt.option}</Typography>
                            </Stack>
                            {opt.option === bestOption.option && <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 600 }}>LOWEST COST</Typography>}
                          </Grid>
                          <Grid size={{ xs: 6, sm: 2 }}>
                            <Typography variant="body2" color="text.secondary">Payment</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>${opt.monthlyPayment.toLocaleString()}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 2 }}>
                            <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>${opt.totalPaid.toLocaleString()}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 2 }}>
                            <Typography variant="body2" color="text.secondary">Net Cost</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: opt.option === bestOption.option ? '#065F46' : 'inherit' }}>${opt.netCost.toLocaleString()}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 2 }}>
                            <Typography variant="body2" color="text.secondary">Balance Left</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>${opt.remainingBalance.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </ResultsSection>
              <ResultsSection title="Net Cost Visualization" subtitle="Lower is better">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {options.map((opt, i) => <HorizontalBar key={i} label={opt.option} value={opt.netCost} maxValue={Math.max(...options.map(o => o.netCost))} color={opt.option === bestOption.option ? CHART_COLORS.primary : '#9CA3AF'} />)}
                </Paper>
              </ResultsSection>
              <ResultsSection title="Timeline Considerations" subtitle="Key factors for your decision">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: inputs.expectedMoveYear <= inputs.armFixedPeriod ? '#D1FAE5' : '#FEF3C7', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>ARM Consideration</Typography>
                        <Typography variant="body2">
                          {inputs.expectedMoveYear <= inputs.armFixedPeriod 
                            ? `✓ You'll move before the ARM adjusts (after year ${inputs.armFixedPeriod}). ARM is low-risk for you.`
                            : `⚠️ ARM adjusts after year ${inputs.armFixedPeriod}, but you plan to stay ${inputs.expectedMoveYear} years. The comparison includes the higher adjusted payments.`}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: inputs.expectedMoveYear > inputs.armFixedPeriod ? '#EBF5FF' : '#F9FAFB', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>After the ARM Adjusts</Typography>
                        <Typography variant="body2">
                          {inputs.expectedMoveYear > inputs.armFixedPeriod 
                            ? `At index ${inputs.armIndexRate}% + margin ${inputs.armMargin}% (capped), the rate becomes ${result.details.armAdjustedRate}% and the payment is about $${(result.details.armAdjustedPayment as number).toLocaleString()}/month.`
                            : `If you stayed past year ${inputs.armFixedPeriod}, the rate would move toward index ${inputs.armIndexRate}% + margin ${inputs.armMargin}% = ${(inputs.armIndexRate + inputs.armMargin).toFixed(2)}%, subject to caps.`}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>
              {result.insights?.length > 0 && (
                <ResultsSection title="Insights">
                  <Stack spacing={2}>
                    {result.insights.map((insight, i) => <InsightCallout key={i} type={insight.includes('⚠️') ? 'warning' : insight.includes('💡') ? 'tip' : 'info'} title="Analysis">{insight.replace('⚠️ ', '').replace('💡 ', '')}</InsightCallout>)}
                  </Stack>
                </ResultsSection>
              )}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Timeline sx={{ fontSize: 32, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>The Bottom Line</Typography>
                    <Typography variant="body1" sx={{ color: 'success.dark' }}>
                      For a <strong>{inputs.expectedMoveYear}-year</strong> hold, <strong>{result.details.bestOption}</strong> has the lowest net cost 
                      at <strong>${(result.details.bestNetCost as number).toLocaleString()}</strong> (payments + upfront costs − equity built). 
                      You'll have <strong>${(result.details.bestBalance as number).toLocaleString()}</strong> remaining when you sell.
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
