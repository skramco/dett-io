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
  TrendingUp,
  TrendingDown,
  Lock,
  Warning,
  CompareArrows,
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
  LazyTimelineChart as TimelineChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateArmVsFixed } from '@/lib/calculators';
import type { ArmVsFixedInputs } from '@/lib/calculators/types';

export default function ArmVsFixedCalculator() {
  const [inputs, setInputs] = useState<ArmVsFixedInputs>({
    loanAmount: 360000,
    fixedRate: 6.75,
    armInitialRate: 5.75,
    armFixedPeriod: 5,
    armAdjustmentCap: 2,
    armLifetimeCap: 5,
    armMargin: 2.75,
    loanTerm: 30,
    expectedIndexRate: 5,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (deferredInputs.loanAmount <= 0) return null;
    return calculateArmVsFixed(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof ArmVsFixedInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Timeline data for payment comparison
  const timelineData = useMemo(() => {
    if (!result?.chartData) return [];
    return (result.chartData as Array<{ year: number; armPayment: number; fixedPayment: number }>).map(item => ({
      month: item.year * 12,
      optionA: item.fixedPayment,
      optionB: item.armPayment,
    }));
  }, [result]);

  // Derived values
  const armWins = result ? (result.details.armTotalPaid as number) < (result.details.fixedTotalPaid as number) : false;
  const initialSavings = result ? (result.details.fixedPayment as number) - (result.details.armInitialPayment as number) : 0;

  return (
    <CalculatorLayout
      calculatorSlug="arm-vs-fixed"
      title="ARM vs Fixed Rate Calculator"
      description="Compare adjustable-rate mortgages (ARM) to fixed-rate loans. See initial savings, rate adjustment scenarios, and worst-case payment projections."
      relatedCalculators={[
        { slug: 'points-buydown', name: 'Points & Buydown' },
        { slug: 'timeline-simulator', name: 'Decision Timeline' },
        { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Loan Details" icon={<CompareArrows />}>
              <CurrencyInput
                label="Loan Amount"
                value={inputs.loanAmount}
                onChange={(v) => handleInputChange('loanAmount', v)}
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

            <InputSection title="Fixed Rate Option" icon={<Lock />} color="secondary">
              <PercentageInput
                label="Fixed Interest Rate"
                value={inputs.fixedRate}
                onChange={(v) => handleInputChange('fixedRate', v)}
                step={0.125}
              />
            </InputSection>

            <InputSection title="ARM Option" icon={<TrendingUp />}>
              <PercentageInput
                label="Initial ARM Rate"
                value={inputs.armInitialRate}
                onChange={(v) => handleInputChange('armInitialRate', v)}
                step={0.125}
              />

              <SelectInput
                label="Fixed Period"
                value={inputs.armFixedPeriod}
                onChange={(v) => handleInputChange('armFixedPeriod', v as number)}
                options={[
                  { value: 3, label: '3 years (3/1 ARM)' },
                  { value: 5, label: '5 years (5/1 ARM)' },
                  { value: 7, label: '7 years (7/1 ARM)' },
                  { value: 10, label: '10 years (10/1 ARM)' },
                ]}
              />

              <PercentageInput
                label="Expected Index Rate"
                value={inputs.expectedIndexRate}
                onChange={(v) => handleInputChange('expectedIndexRate', v)}
                step={0.25}
                helperText="Future rate prediction (SOFR/Treasury)"
              />

              <PercentageInput
                label="ARM Margin"
                value={inputs.armMargin}
                onChange={(v) => handleInputChange('armMargin', v)}
                step={0.25}
                helperText="Added to index rate after fixed period"
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
                label="Initial Monthly Savings with ARM"
                value={`$${initialSavings.toLocaleString()}/mo`}
                sublabel={`Save $${(result.details.savingsInFixedPeriod as number).toLocaleString()} in first ${inputs.armFixedPeriod} years`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Fixed Payment"
                    value={`$${(result.details.fixedPayment as number).toLocaleString()}`}
                    sublabel={`${inputs.fixedRate}% for ${inputs.loanTerm} years`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="ARM Initial"
                    value={`$${(result.details.armInitialPayment as number).toLocaleString()}`}
                    sublabel={`${inputs.armInitialRate}% for ${inputs.armFixedPeriod} years`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="ARM Worst Case"
                    value={`$${(result.details.worstCasePayment as number).toLocaleString()}`}
                    sublabel={`At ${result.details.worstCaseRate}% rate`}
                    color="error"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Expected Winner"
                    value={armWins ? 'ARM' : 'Fixed'}
                    sublabel={`Saves $${Math.abs((result.details.fixedTotalPaid as number) - (result.details.armTotalPaid as number)).toLocaleString()}`}
                    color={armWins ? 'success' : 'primary'}
                  />
                </Grid>
              </Grid>

              {/* Side by Side Comparison */}
              <ResultsSection 
                title="Payment Comparison" 
                subtitle="Fixed vs ARM initial payments"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Lock sx={{ fontSize: 40, color: '#006397', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          FIXED RATE
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#004B73', my: 1 }}>
                          ${(result.details.fixedPayment as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.fixedRate}% for entire {inputs.loanTerm} years
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ color: '#004B73' }}>
                          ✓ Predictable payments<br />
                          ✓ No rate risk<br />
                          ✓ Peace of mind
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <TrendingDown sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          ARM (INITIAL)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          ${(result.details.armInitialPayment as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.armInitialRate}% for first {inputs.armFixedPeriod} years
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ color: '#065F46' }}>
                          ✓ Lower initial payment<br />
                          ✓ Good if moving/refi soon<br />
                          ⚠️ Rate adjusts after {inputs.armFixedPeriod} years
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ p: 3, bgcolor: '#F0FDF4', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46' }}>
                      ARM saves ${initialSavings.toLocaleString()}/month initially
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      That's ${(result.details.savingsInFixedPeriod as number).toLocaleString()} over the {inputs.armFixedPeriod}-year fixed period
                    </Typography>
                  </Box>
                </Paper>
              </ResultsSection>

              {/* Payment Over Time */}
              <ResultsSection 
                title="Payment Projection" 
                subtitle="How payments may change over time (expected scenario)"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <TimelineChart 
                    data={timelineData}
                    labels={{ optionA: 'Fixed Rate', optionB: 'ARM' }}
                    height={280}
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>After year {inputs.armFixedPeriod}:</strong> ARM rate adjusts annually based on market conditions. 
                      This projection assumes the index rate stays around {inputs.expectedIndexRate}%.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Risk Analysis */}
              <ResultsSection 
                title="Risk Analysis" 
                subtitle="What happens if rates rise?"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Fixed Payment (guaranteed)"
                    value={result.details.fixedPayment as number}
                    maxValue={result.details.worstCasePayment as number}
                    color={CHART_COLORS.primary}
                  />
                  <HorizontalBar
                    label="ARM Initial Payment"
                    value={result.details.armInitialPayment as number}
                    maxValue={result.details.worstCasePayment as number}
                    color={CHART_COLORS.secondary}
                  />
                  <HorizontalBar
                    label="ARM Worst Case"
                    value={result.details.worstCasePayment as number}
                    maxValue={result.details.worstCasePayment as number}
                    color="#EF4444"
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Alert severity="warning" icon={<Warning />} sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Worst case scenario:</strong> If rates spike, your ARM payment could reach 
                      <strong> ${(result.details.worstCasePayment as number).toLocaleString()}/month</strong> at a 
                      <strong> {result.details.worstCaseRate}%</strong> rate. That's 
                      <strong> ${((result.details.worstCasePayment as number) - (result.details.fixedPayment as number)).toLocaleString()}/month more</strong> than the fixed option.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* When ARM Makes Sense */}
              <ResultsSection 
                title="When Does ARM Make Sense?" 
                subtitle="Key factors to consider"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#D1FAE5', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065F46', mb: 1 }}>
                          ✓ ARM may be better if:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#065F46' }}>
                          • You plan to move within {inputs.armFixedPeriod} years<br />
                          • You expect to refinance before adjustments<br />
                          • You expect rates to stay flat or drop<br />
                          • You can handle payment increases
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#EBF5FF', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#004B73', mb: 1 }}>
                          ✓ Fixed may be better if:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#004B73' }}>
                          • You plan to stay long-term<br />
                          • You value payment predictability<br />
                          • Rates are historically low<br />
                          • Your budget is tight
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('⚠️') ? 'warning' : insight.includes('💡') ? 'tip' : 'info'}
                        title={insight.includes('Fixed') ? 'Fixed Rate' : insight.includes('ARM') ? 'ARM' : 'Analysis'}
                      >
                        {insight.replace('⚠️ ', '').replace('💡 ', '')}
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
                  background: armWins 
                    ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                    : 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: armWins ? 'success.light' : 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CompareArrows sx={{ fontSize: 32, color: armWins ? 'success.main' : 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: armWins ? 'success.dark' : 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: armWins ? 'success.dark' : 'primary.dark' }}>
                      The {inputs.armFixedPeriod}/1 ARM saves <strong>${initialSavings.toLocaleString()}/month</strong> initially 
                      (<strong>${(result.details.savingsInFixedPeriod as number).toLocaleString()}</strong> over {inputs.armFixedPeriod} years). 
                      {armWins 
                        ? ` Based on expected rates, the ARM saves $${Math.abs((result.details.fixedTotalPaid as number) - (result.details.armTotalPaid as number)).toLocaleString()} total. Good choice if you'll move or refinance within ${inputs.armFixedPeriod} years.`
                        : ` However, if rates rise as expected, the fixed rate saves $${Math.abs((result.details.fixedTotalPaid as number) - (result.details.armTotalPaid as number)).toLocaleString()} over the life of the loan.`
                      }
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
