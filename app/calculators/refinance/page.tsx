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
  LazyTimelineChart as TimelineChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateRefinance } from '@/lib/calculators';
import type { RefinanceInputs } from '@/lib/calculators/types';

export default function RefinanceCalculator() {
  const [inputs, setInputs] = useState<RefinanceInputs>({
    currentBalance: 320000,
    currentRate: 7.5,
    // Amortized P&I for $320k at 7.5% with 27 years remaining (~$2,306)
    currentMonthlyPayment: 2306,
    yearsRemaining: 27,
    newRate: 6.25,
    newTerm: 30,
    closingCosts: 8000,
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (deferredInputs.currentBalance <= 0) return null;
    return calculateRefinance(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof RefinanceInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Derived values
  const monthlySavings = result ? (result.details.monthlySavings as number) : 0;
  const totalSavings = result ? (result.details.totalSavings as number) : 0;
  const isBeneficial = monthlySavings > 0;
  const savesTotal = totalSavings > 0;
  // Refinancing only "makes sense" when it wins on both monthly payment AND lifetime cost
  const verdict: 'save' | 'mixed' | 'costs-more' =
    isBeneficial && savesTotal ? 'save' : !isBeneficial && !savesTotal ? 'costs-more' : 'mixed';
  const paymentMismatch = result ? result.details.paymentMismatch === 1 : false;

  // Timeline data for break-even visualization
  const timelineData = useMemo(() => {
    if (!result) return [];
    const breakEvenMonths = result.details.breakEvenMonths as number;
    const data = [];
    const maxMonths = Math.min(Math.max(breakEvenMonths * 2, 60), 120);
    
    for (let month = 0; month <= maxMonths; month += 6) {
      const savings = monthlySavings * month;
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
      calculatorSlug="refinance"
      title="Should I Refinance?"
      description="Compare your current mortgage to a new loan. See monthly savings, break-even timeline, and total cost comparison to make an informed decision."
      relatedCalculators={[
        { slug: 'cash-out-refi', name: 'Cash-Out Refinance' },
        { slug: 'recast-vs-refi', name: 'Recast vs Refinance' },
        { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
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
                helperText={
                  result && paymentMismatch
                    ? `Doesn't match the scheduled P&I of $${(result.details.scheduledCurrentPayment as number).toLocaleString()} for this balance/rate/term — the computed value is used`
                    : 'Principal & interest only'
                }
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
                helperText="Typically 2-5% of loan amount. Financed into the new loan balance."
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* Payment validation warning */}
              {paymentMismatch && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    Your entered payment (${(result.details.enteredMonthlyPayment as number).toLocaleString()}) doesn&apos;t
                    match the scheduled P&amp;I of ${(result.details.scheduledCurrentPayment as number).toLocaleString()} implied
                    by a ${inputs.currentBalance.toLocaleString()} balance at {inputs.currentRate}% with {inputs.yearsRemaining} years
                    left. The analysis below uses the computed payment — make sure your entry is principal &amp; interest only
                    (no taxes, insurance, or extra principal).
                  </Typography>
                </Alert>
              )}

              {/* Hero Metric */}
              <HeroMetric
                label={isBeneficial ? "Monthly Savings" : "Monthly Increase"}
                value={`${isBeneficial ? '' : '+'}$${Math.abs(monthlySavings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                sublabel={
                  verdict === 'save'
                    ? `Break-even in ${result.details.breakEvenMonths} months (${(result.details.breakEvenYears as number).toFixed(1)} years)`
                    : verdict === 'mixed'
                      ? isBeneficial
                        ? `Lower payment, but $${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} more in lifetime cost`
                        : `Higher payment, but $${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} less in lifetime cost`
                      : 'This refinance does not save you money'
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
                    label={savesTotal ? 'Total Savings' : 'Added Lifetime Cost'}
                    value={`$${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    sublabel={savesTotal ? 'You save over the life' : 'You pay more over the life'}
                    color={savesTotal ? 'success' : 'error'}
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
                          ? "This is a reasonable break-even period. If you plan to stay in your home longer than this, the monthly savings work in your favor."
                          : "This is a longer break-even period. Make sure you plan to stay in your home at least this long to benefit from refinancing."
                        }
                      </Typography>
                    </Alert>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      How we calculate break-even: closing costs (${(result.details.closingCosts as number).toLocaleString()}) ÷ monthly
                      payment savings (${Math.abs(monthlySavings).toLocaleString()}). Because closing costs are financed into the new
                      loan (new balance ${(result.details.newLoanAmount as number).toLocaleString()}), this measures when cumulative
                      payment savings offset the amount added to your balance. It compares payments only — it doesn&apos;t credit the
                      slower equity build from resetting your term, so check the Lifetime Cost Comparison below for the full picture.
                    </Typography>
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
                    bgcolor: savesTotal ? '#D1FAE5' : '#FEE2E2', 
                    borderRadius: 2, 
                    textAlign: 'center' 
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {savesTotal ? 'TOTAL LIFETIME SAVINGS' : 'ADDITIONAL LIFETIME COST'}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: savesTotal ? '#065F46' : '#991B1B', my: 1 }}>
                      ${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(result.details.interestSavings as number) >= 0 ? 'Interest savings' : 'Extra interest paid'}: ${Math.abs(result.details.interestSavings as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      {' · '}Totals include the ${(result.details.closingCosts as number).toLocaleString()} closing costs financed into the new loan
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
                  background: verdict === 'save'
                    ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                    : verdict === 'mixed'
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                      : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                  border: '1px solid',
                  borderColor: verdict === 'save' ? 'success.light' : verdict === 'mixed' ? 'warning.light' : 'error.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Savings sx={{ fontSize: 32, color: verdict === 'save' ? 'success.main' : verdict === 'mixed' ? 'warning.main' : 'error.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: verdict === 'save' ? 'success.dark' : verdict === 'mixed' ? 'warning.dark' : 'error.dark', mb: 1 }}>
                      {verdict === 'save' ? 'Refinancing Makes Sense' : verdict === 'mixed' ? 'It\u2019s a Trade-Off' : 'Refinancing Doesn\u2019t Save You Money'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: verdict === 'save' ? 'success.dark' : verdict === 'mixed' ? 'warning.dark' : 'error.dark' }}>
                      {verdict === 'save'
                        ? `By refinancing from ${inputs.currentRate}% to ${inputs.newRate}%, you'll save $${Math.abs(monthlySavings).toLocaleString()}/month and $${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} over the life of the loan. After ${result.details.breakEvenMonths} months, your payment savings will have offset the $${(result.details.closingCosts as number).toLocaleString()} in closing costs financed into the new loan.`
                        : verdict === 'mixed'
                          ? isBeneficial
                            ? `This refinance lowers your payment by $${Math.abs(monthlySavings).toLocaleString()}/month, but because the term resets to ${inputs.newTerm} years you'd pay $${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} more in total. It can still make sense if monthly cash flow matters most — just know the trade-off.`
                            : `This refinance raises your payment by $${Math.abs(monthlySavings).toLocaleString()}/month, but the shorter payoff saves $${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} in total. It can make sense if you can afford the higher payment.`
                          : `This refinance would increase your monthly payment by $${Math.abs(monthlySavings).toLocaleString()} and cost $${Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} more over the life of the loan. Unless you need to access equity or have other strategic reasons, it is not in your financial interest.`
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
