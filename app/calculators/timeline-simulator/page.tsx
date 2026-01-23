'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Paper, Typography, Stack, Divider, Alert } from '@mui/material';
import { Timeline, AccountBalance, TrendingUp, CheckCircle, Speed } from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import { InputSection, CurrencyInput, PercentageInput, NumberInput, SliderInput } from '@/components/mui/calculator/InputPanel';
import { HeroMetric, MetricCard, InsightCallout, ResultsSection, EmptyResultsState } from '@/components/mui/calculator/ResultsPanel';
import { HorizontalBar, CHART_COLORS } from '@/components/mui/calculator/ChartComponents';
import { calculateTimelineSimulator } from '@/lib/calculators';
import type { TimelineSimulatorInputs } from '@/lib/calculators/types';

export default function TimelineSimulatorCalculator() {
  const [inputs, setInputs] = useState<TimelineSimulatorInputs>({
    loanAmount: 360000, interestRate: 6.75, expectedMoveYear: 7, refiLikelihood: 30,
    armInitialRate: 5.75, armFixedPeriod: 5, pointsCost: 7200, pointsRate: 6.25,
  });

  const result = useMemo(() => inputs.loanAmount <= 0 ? null : calculateTimelineSimulator(inputs), [inputs]);
  const handleInputChange = (field: keyof TimelineSimulatorInputs, value: number) => setInputs(prev => ({ ...prev, [field]: value }));

  const options = useMemo(() => (result?.chartData || []) as Array<{ option: string; monthlyPayment: number; totalPaid: number; remainingBalance: number }>, [result]);
  const bestOption = options.reduce((best, current) => current.totalPaid < best.totalPaid ? current : best, options[0] || { option: '', monthlyPayment: 0, totalPaid: 0, remainingBalance: 0 });

  return (
    <CalculatorLayout title="Timeline Simulator" description="Find the best mortgage option based on how long you plan to stay. Compare fixed, ARM, and points strategies.">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <InputSection title="Loan Details" icon={<AccountBalance />}>
              <CurrencyInput label="Loan Amount" value={inputs.loanAmount} onChange={(v) => handleInputChange('loanAmount', v)} />
              <PercentageInput label="30-Year Fixed Rate" value={inputs.interestRate} onChange={(v) => handleInputChange('interestRate', v)} step={0.125} />
            </InputSection>
            <InputSection title="Your Timeline" icon={<Timeline />} color="secondary">
              <NumberInput label="Expected Years in Home" value={inputs.expectedMoveYear} onChange={(v) => handleInputChange('expectedMoveYear', v)} suffix="years" />
              <SliderInput label="Refinance Likelihood (%)" value={inputs.refiLikelihood} onChange={(v) => handleInputChange('refiLikelihood', v)} min={0} max={100} step={10} />
            </InputSection>
            <InputSection title="ARM Option" icon={<TrendingUp />}>
              <PercentageInput label="ARM Initial Rate" value={inputs.armInitialRate} onChange={(v) => handleInputChange('armInitialRate', v)} step={0.125} />
              <NumberInput label="ARM Fixed Period" value={inputs.armFixedPeriod} onChange={(v) => handleInputChange('armFixedPeriod', v)} suffix="years" />
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
              <HeroMetric label={`Best for ${inputs.expectedMoveYear}-Year Hold`} value={result.details.bestOption as string} sublabel={`Total cost: $${(result.details.bestTotalCost as number).toLocaleString()}`} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Best Payment" value={`$${(result.details.bestPayment as number).toLocaleString()}`} color="success" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Fixed Payment" value={`$${(result.details.fixedPayment as number).toLocaleString()}`} color="primary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="ARM Payment" value={`$${(result.details.armPayment as number).toLocaleString()}`} color="secondary" /></Grid>
                <Grid size={{ xs: 6, sm: 3 }}><MetricCard label="Balance at Move" value={`$${(result.details.bestBalance as number).toLocaleString()}`} color="warning" /></Grid>
              </Grid>
              <ResultsSection title="All Options Compared" subtitle={`Total cost over ${inputs.expectedMoveYear} years (payments only)`}>
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
                          <Grid size={{ xs: 4, sm: 2 }}>
                            <Typography variant="body2" color="text.secondary">Payment</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>${opt.monthlyPayment.toLocaleString()}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: opt.option === bestOption.option ? '#065F46' : 'inherit' }}>${opt.totalPaid.toLocaleString()}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary">Balance Left</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>${opt.remainingBalance.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </ResultsSection>
              <ResultsSection title="Total Cost Visualization" subtitle="Lower is better">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {options.map((opt, i) => <HorizontalBar key={i} label={opt.option} value={opt.totalPaid} maxValue={Math.max(...options.map(o => o.totalPaid))} color={opt.option === bestOption.option ? CHART_COLORS.primary : '#9CA3AF'} />)}
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
                            ? `✓ You'll move before the ARM adjusts (year ${inputs.armFixedPeriod}). ARM is low-risk for you.`
                            : `⚠️ ARM adjusts in year ${inputs.armFixedPeriod}, but you plan to stay ${inputs.expectedMoveYear} years. Rate risk exists.`}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: inputs.refiLikelihood > 50 ? '#EBF5FF' : '#F9FAFB', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Refi Likelihood: {inputs.refiLikelihood}%</Typography>
                        <Typography variant="body2">
                          {inputs.refiLikelihood > 50 
                            ? `High refi likelihood means points may not pay off. Consider par rate or ARM.`
                            : `Lower refi likelihood means you'll likely keep this loan. Points could pay off.`}
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
                      For a <strong>{inputs.expectedMoveYear}-year</strong> hold, <strong>{result.details.bestOption}</strong> costs the least 
                      at <strong>${(result.details.bestTotalCost as number).toLocaleString()}</strong> total. 
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
