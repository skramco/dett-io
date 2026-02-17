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
  ShowChart,
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
  HorizontalBar,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateInterestSensitivity } from '@/lib/calculators';
import type { InterestSensitivityInputs } from '@/lib/calculators/types';

export default function InterestSensitivityCalculator() {
  const [inputs, setInputs] = useState<InterestSensitivityInputs>({
    loanAmount: 360000,
    baseRate: 6.75,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1800,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (deferredInputs.loanAmount <= 0) return null;
    return calculateInterestSensitivity(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof InterestSensitivityInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Rate scenarios from chart data
  const rateScenarios = useMemo(() => {
    if (!result?.chartData) return [];
    return result.chartData as Array<{ rate: string; monthlyPayment: number; totalInterest: number }>;
  }, [result]);

  // Find base scenario
  const baseScenario = rateScenarios.find(s => s.rate === `${inputs.baseRate.toFixed(2)}%`);

  return (
    <CalculatorLayout
      calculatorSlug="interest-sensitivity"
      title="Interest Rate Sensitivity Calculator"
      description="See how interest rate changes affect your monthly payment and total cost. Understand the impact of rate timing, points, and market movements."
      relatedCalculators={[
        { slug: 'refinance', name: 'Should I Refinance?' },
        { slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate' },
        { slug: 'points-buydown', name: 'Points & Buydown' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Loan Details" icon={<AccountBalance />}>
              <CurrencyInput
                label="Loan Amount"
                value={inputs.loanAmount}
                onChange={(v) => handleInputChange('loanAmount', v)}
              />
              
              <PercentageInput
                label="Base Interest Rate"
                value={inputs.baseRate}
                onChange={(v) => handleInputChange('baseRate', v)}
                step={0.125}
                helperText="Your current or expected rate"
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

            <InputSection title="Property Costs" icon={<ShowChart />} color="secondary">
              <PercentageInput
                label="Property Tax Rate"
                value={inputs.propertyTaxRate}
                onChange={(v) => handleInputChange('propertyTaxRate', v)}
                step={0.1}
              />

              <CurrencyInput
                label="Annual Home Insurance"
                value={inputs.homeInsuranceAnnual}
                onChange={(v) => handleInputChange('homeInsuranceAnnual', v)}
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
                label="Payment at Base Rate"
                value={`$${(result.details.basePayment as number).toLocaleString()}/mo`}
                sublabel={`${inputs.baseRate}% on $${inputs.loanAmount.toLocaleString()} loan`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="±0.25% Impact"
                    value={`$${result.details.quarterPctImpact}/mo`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="±0.5% Impact"
                    value={`$${result.details.halfPctImpact}/mo`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="±1.0% Impact"
                    value={`$${result.details.fullPctImpact}/mo`}
                    color="error"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Interest"
                    value={`$${(result.details.baseInterest as number).toLocaleString()}`}
                    sublabel={`Over ${inputs.loanTerm} years`}
                    color="secondary"
                  />
                </Grid>
              </Grid>

              {/* Rate Scenarios */}
              <ResultsSection 
                title="Rate Scenarios" 
                subtitle="How different rates affect your payment"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {rateScenarios.map((scenario, index) => {
                      const isBase = scenario.rate === `${inputs.baseRate.toFixed(2)}%`;
                      const isLower = parseFloat(scenario.rate) < inputs.baseRate;
                      const diff = baseScenario ? scenario.monthlyPayment - baseScenario.monthlyPayment : 0;
                      
                      return (
                        <Box 
                          key={index}
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            bgcolor: isBase ? '#EBF5FF' : isLower ? '#D1FAE5' : '#FEF3C7',
                            border: isBase ? '2px solid' : '1px solid',
                            borderColor: isBase ? '#196bc0' : 'transparent',
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 3 }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                {isLower ? (
                                  <TrendingDown sx={{ color: '#22C55E', fontSize: 20 }} />
                                ) : !isBase ? (
                                  <TrendingUp sx={{ color: '#F59E0B', fontSize: 20 }} />
                                ) : null}
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                  {scenario.rate}
                                </Typography>
                              </Stack>
                              {isBase && (
                                <Typography variant="caption" sx={{ color: '#196bc0', fontWeight: 600 }}>
                                  BASE RATE
                                </Typography>
                              )}
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                              <Typography variant="body2" color="text.secondary">Monthly P&I</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                ${scenario.monthlyPayment.toLocaleString()}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                ${scenario.totalInterest.toLocaleString()}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              {!isBase && (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    color: diff > 0 ? '#DC2626' : '#22C55E',
                                    textAlign: 'right',
                                  }}
                                >
                                  {diff > 0 ? '+' : ''}{diff.toLocaleString()}/mo
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </ResultsSection>

              {/* Visual Impact */}
              <ResultsSection 
                title="Payment Impact Visualization" 
                subtitle="See how rate changes affect monthly payment"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {rateScenarios.map((scenario, index) => {
                    const isBase = scenario.rate === `${inputs.baseRate.toFixed(2)}%`;
                    const isLower = parseFloat(scenario.rate) < inputs.baseRate;
                    const maxPayment = Math.max(...rateScenarios.map(s => s.monthlyPayment));
                    
                    return (
                      <HorizontalBar
                        key={index}
                        label={`${scenario.rate}${isBase ? ' (base)' : ''}`}
                        value={scenario.monthlyPayment}
                        maxValue={maxPayment}
                        color={isBase ? CHART_COLORS.primary : isLower ? CHART_COLORS.secondary : CHART_COLORS.quaternary}
                      />
                    );
                  })}
                </Paper>
              </ResultsSection>

              {/* Key Takeaways */}
              <ResultsSection 
                title="What This Means" 
                subtitle="Practical implications for your mortgage"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          IF RATES DROP 0.5%
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          Save ${result.details.halfPctImpact}/mo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${((result.details.halfPctImpact as number) * 12).toLocaleString()}/year
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          CURRENT RATE
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4F8F', my: 1 }}>
                          ${(result.details.basePayment as number).toLocaleString()}/mo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          At {inputs.baseRate}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 3, bgcolor: '#FEF3C7', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          IF RATES RISE 0.5%
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#92400E', my: 1 }}>
                          +${result.details.halfPctImpact}/mo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${((result.details.halfPctImpact as number) * 12).toLocaleString()}/year more
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Buying points:</strong> If paying 1 point (1% of loan = ${(inputs.loanAmount * 0.01).toLocaleString()}) 
                      reduces your rate by 0.25%, you'd save ${result.details.quarterPctImpact}/month. 
                      Break-even: {Math.round((inputs.loanAmount * 0.01) / (result.details.quarterPctImpact as number))} months.
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
                        type={insight.includes('💡') ? 'tip' : insight.includes('⚠️') ? 'warning' : 'info'}
                        title={insight.includes('Base') ? 'Base Rate' : insight.includes('±') ? 'Rate Impact' : 'Insight'}
                      >
                        {insight.replace('💡 ', '').replace('⚠️ ', '')}
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
                  background: 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <ShowChart sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                      On a <strong>${inputs.loanAmount.toLocaleString()}</strong> loan, every <strong>0.25%</strong> rate change 
                      affects your payment by <strong>${result.details.quarterPctImpact}/month</strong> 
                      (${((result.details.quarterPctImpact as number) * 12).toLocaleString()}/year). 
                      A <strong>1%</strong> difference means <strong>${result.details.fullPctImpact}/month</strong> more or less—that's 
                      <strong> ${((result.details.fullPctImpact as number) * 12).toLocaleString()}/year</strong> and significant interest over {inputs.loanTerm} years.
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
