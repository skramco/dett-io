'use client';

import { useState, useMemo } from 'react';
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
  AccountBalance,
  TrendingDown,
  TrendingUp,
  Schedule,
  Savings,
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
  TimelineChart,
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateRefinance } from '@/lib/calculators';
import type { RefinanceInputs } from '@/lib/calculators/types';

export default function RefinanceCalculator() {
  const [inputs, setInputs] = useState<RefinanceInputs>({
    currentBalance: 320000,
    currentRate: 7.5,
    currentMonthlyPayment: 2237,
    yearsRemaining: 27,
    newRate: 6.25,
    newTerm: 30,
    closingCosts: 8000,
  });

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.currentBalance <= 0) return null;
    return calculateRefinance(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof RefinanceInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Derived values
  const monthlySavings = result ? (result.details.monthlySavings as number) : 0;
  const isBeneficial = monthlySavings > 0;

  // Timeline data for break-even visualization
  const timelineData = useMemo(() => {
    if (!result) return [];
    const breakEvenMonths = result.details.breakEvenMonths as number;
    const data = [];
    const maxMonths = Math.min(Math.max(breakEvenMonths * 2, 60), 120);
    
    for (let month = 0; month <= maxMonths; month += 6) {
      const savings = monthlySavings * month;
      const netSavings = savings - (result.details.closingCosts as number);
      data.push({
        month,
        optionA: result.details.closingCosts as number,
        optionB: savings,
      });
    }
    return data;
  }, [result, monthlySavings]);

  return (
    <CalculatorLayout
      title="Should I Refinance?"
      description="Compare your current mortgage to a new loan. See monthly savings, break-even timeline, and total cost comparison to make an informed decision."
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Current Loan" icon={<AccountBalance />}>
              <CurrencyInput
                label="Current Loan Balance"
                value={inputs.currentBalance}
                onChange={(v) => handleInputChange('currentBalance', v)}
              />
              
              <PercentageInput
                label="Current Interest Rate"
                value={inputs.currentRate}
                onChange={(v) => handleInputChange('currentRate', v)}
                step={0.125}
              />

              <CurrencyInput
                label="Current Monthly Payment"
                value={inputs.currentMonthlyPayment}
                onChange={(v) => handleInputChange('currentMonthlyPayment', v)}
                helperText="Principal & interest only"
              />

              <NumberInput
                label="Years Remaining"
                value={inputs.yearsRemaining}
                onChange={(v) => handleInputChange('yearsRemaining', v)}
                suffix="years"
              />
            </InputSection>

            <InputSection title="New Loan" icon={<TrendingDown />} color="secondary">
              <PercentageInput
                label="New Interest Rate"
                value={inputs.newRate}
                onChange={(v) => handleInputChange('newRate', v)}
                step={0.125}
              />

              <SelectInput
                label="New Loan Term"
                value={inputs.newTerm}
                onChange={(v) => handleInputChange('newTerm', v as number)}
                options={[
                  { value: 15, label: '15 years' },
                  { value: 20, label: '20 years' },
                  { value: 30, label: '30 years' },
                ]}
              />

              <CurrencyInput
                label="Closing Costs"
                value={inputs.closingCosts}
                onChange={(v) => handleInputChange('closingCosts', v)}
                helperText="Typically 2-5% of loan amount"
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
                label={isBeneficial ? "Monthly Savings" : "Monthly Increase"}
                value={`${isBeneficial ? '-' : '+'}$${Math.abs(monthlySavings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                sublabel={isBeneficial 
                  ? `Break-even in ${result.details.breakEvenMonths} months (${(result.details.breakEvenYears as number).toFixed(1)} years)`
                  : "This refinance may not make financial sense"
                }
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Current Payment"
                    value={`$${(result.details.currentMonthlyPayment as number).toLocaleString()}`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="New Payment"
                    value={`$${(result.details.newMonthlyPayment as number).toLocaleString()}`}
                    color={isBeneficial ? 'success' : 'error'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Closing Costs"
                    value={`$${(result.details.closingCosts as number).toLocaleString()}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Savings"
                    value={`$${Math.abs(result.details.totalSavings as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    sublabel={(result.details.totalSavings as number) > 0 ? 'You save' : 'You pay more'}
                    color={(result.details.totalSavings as number) > 0 ? 'success' : 'error'}
                  />
                </Grid>
              </Grid>

              {/* Payment Comparison */}
              <ResultsSection 
                title="Payment Comparison" 
                subtitle="Current vs new monthly payment breakdown"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#FEF3C7', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          CURRENT LOAN
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#92400E', my: 1 }}>
                          ${(result.details.currentMonthlyPayment as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.currentRate}% for {inputs.yearsRemaining} more years
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: isBeneficial ? '#D1FAE5' : '#FEE2E2', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          NEW LOAN
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: isBeneficial ? '#065F46' : '#991B1B', my: 1 }}>
                          ${(result.details.newMonthlyPayment as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.newRate}% for {inputs.newTerm} years
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    {isBeneficial ? (
                      <TrendingDown sx={{ color: '#22C55E', fontSize: 32 }} />
                    ) : (
                      <TrendingUp sx={{ color: '#EF4444', fontSize: 32 }} />
                    )}
                    <Typography variant="h5" sx={{ fontWeight: 700, color: isBeneficial ? '#22C55E' : '#EF4444' }}>
                      {isBeneficial ? 'Save' : 'Pay'} ${Math.abs(monthlySavings).toLocaleString()}/month
                    </Typography>
                  </Stack>
                </Paper>
              </ResultsSection>

              {/* Break-Even Analysis */}
              {isBeneficial && (
                <ResultsSection 
                  title="Break-Even Analysis" 
                  subtitle="When your savings exceed closing costs"
                >
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <TimelineChart 
                      data={timelineData}
                      breakEvenMonth={result.details.breakEvenMonths as number}
                      labels={{ optionA: 'Closing Costs', optionB: 'Cumulative Savings' }}
                      height={280}
                    />
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Alert 
                      severity={Number(result.details.breakEvenMonths) < 36 ? 'success' : 'warning'} 
                      icon={<Schedule />}
                      sx={{ borderRadius: 2 }}
                    >
                      <Typography variant="body2">
                        <strong>Break-even point: {result.details.breakEvenMonths} months ({(result.details.breakEvenYears as number).toFixed(1)} years)</strong>
                        <br />
                        {Number(result.details.breakEvenMonths) < 36 
                          ? "This is a reasonable break-even period. If you plan to stay in your home longer than this, refinancing makes sense."
                          : "This is a longer break-even period. Make sure you plan to stay in your home at least this long to benefit from refinancing."
                        }
                      </Typography>
                    </Alert>
                  </Paper>
                </ResultsSection>
              )}

              {/* Lifetime Cost Comparison */}
              <ResultsSection 
                title="Lifetime Cost Comparison" 
                subtitle="Total amount paid over the life of each loan"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Current Loan Total"
                    value={result.details.currentTotalPaid as number}
                    maxValue={Math.max(result.details.currentTotalPaid as number, result.details.newTotalPaid as number)}
                    color={CHART_COLORS.quaternary}
                  />
                  <HorizontalBar
                    label="New Loan Total"
                    value={result.details.newTotalPaid as number}
                    maxValue={Math.max(result.details.currentTotalPaid as number, result.details.newTotalPaid as number)}
                    color={CHART_COLORS.primary}
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: (result.details.totalSavings as number) > 0 ? '#D1FAE5' : '#FEE2E2', 
                    borderRadius: 2, 
                    textAlign: 'center' 
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {(result.details.totalSavings as number) > 0 ? 'TOTAL LIFETIME SAVINGS' : 'ADDITIONAL COST'}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: (result.details.totalSavings as number) > 0 ? '#065F46' : '#991B1B', my: 1 }}>
                      ${Math.abs(result.details.totalSavings as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interest savings: ${(result.details.interestSavings as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                  </Box>
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('Warning') ? 'warning' : insight.includes('increase') ? 'warning' : 'info'}
                        title={insight.includes('Warning') ? 'Warning' : insight.includes('save') ? 'Savings' : 'Analysis'}
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
                  background: isBeneficial 
                    ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                    : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                  border: '1px solid',
                  borderColor: isBeneficial ? 'success.light' : 'error.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Savings sx={{ fontSize: 32, color: isBeneficial ? 'success.main' : 'error.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isBeneficial ? 'success.dark' : 'error.dark', mb: 1 }}>
                      {isBeneficial ? 'Refinancing Makes Sense' : 'Consider Carefully'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: isBeneficial ? 'success.dark' : 'error.dark' }}>
                      {isBeneficial 
                        ? `By refinancing from ${inputs.currentRate}% to ${inputs.newRate}%, you'll save $${Math.abs(monthlySavings).toLocaleString()}/month. After ${result.details.breakEvenMonths} months, you'll have recovered the $${(result.details.closingCosts as number).toLocaleString()} closing costs and start saving $${Math.abs(monthlySavings).toLocaleString()} every month thereafter.`
                        : `This refinance would increase your monthly payment by $${Math.abs(monthlySavings).toLocaleString()}. Unless you need to access equity or have other strategic reasons, this refinance may not be in your best interest.`
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
