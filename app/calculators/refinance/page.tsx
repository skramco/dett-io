'use client';

import { formatCurrency } from '@/lib/format';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useScenarioPrefill } from '@/lib/hooks/useScenarioPrefill';
import { useLiveRateDefaults } from '@/lib/hooks/useLiveRateDefaults';
import { MarketRateNote } from '@/components/mui/calculator/MarketRateNote';
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
  LazyCategoryStackedBarChart as CategoryStackedBarChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { RESULT_TOKENS } from '@/lib/theme/resultTokens';
import { calculateRefinance } from '@/lib/calculators';
import type { RefinanceInputs } from '@/lib/calculators/types';

export default function RefinanceCalculator() {
  const [inputs, setInputs] = useState<RefinanceInputs>({
    currentBalance: 320000,
    currentRate: 7.5,
    // Amortized P&I for $320k at 7.5% with 27 years remaining — kept in sync
    // with the balance/rate/term defaults so the math is self-consistent.
    currentMonthlyPayment: 2306,
    yearsRemaining: 27,
    newRate: 6.25,
    newTerm: 30,
    closingCosts: 8000,
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  const marketRates = useLiveRateDefaults(inputs, setInputs, { anchorField: 'newRate' });
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
  // Lower monthly payment — drives payment-level displays only
  const isBeneficial = monthlySavings > 0;
  // Overall verdict from the calculator:
  // 'refinance' | 'mixed' | 'higher-payment-lower-cost' | 'keep'
  const verdict = result ? (result.details.verdict as string) : 'keep';
  const paymentMismatch = result ? result.details.paymentMismatch === 1 : false;
  // Trade-off verdicts (win on one axis, lose on the other) share amber styling
  const isTradeOff = verdict === 'mixed' || verdict === 'higher-payment-lower-cost';
  const impliedCurrentPayment = result ? (result.details.impliedCurrentPayment as number) : 0;

  // Closing-cost recovery at key milestones (replaces the flat "Closing Costs" line)
  const closingCostRecovery = useMemo(() => {
    if (!result || monthlySavings <= 0) return { data: [], series: [], rows: [] };
    const costs = result.details.closingCosts as number;
    const breakEven = Math.max(1, Math.round(result.details.breakEvenMonths as number));
    const milestones = [0, 12, 24, 36, breakEven]
      .filter((month, index, all) => all.indexOf(month) === index)
      .sort((a, b) => a - b);

    const data = milestones.map((month) => {
      const recovered = Math.min(costs, monthlySavings * month);
      return {
        name: month === 0 ? 'At close' : month === breakEven ? `Break-even (${month} mo)` : `${month} mo`,
        recovered: Math.round(recovered),
        remaining: Math.round(Math.max(0, costs - recovered)),
      };
    });

    const rows = [
      { label: 'Closing costs (financed)', value: `${formatCurrency(costs)}` },
      { label: 'Monthly savings', value: `${formatCurrency(monthlySavings)}` },
      { label: 'Recovered after 12 months', value: `${formatCurrency(Math.min(costs, monthlySavings * 12))}` },
      { label: 'Remaining after 12 months', value: `${formatCurrency(Math.max(0, costs - monthlySavings * 12))}` },
      { label: 'Break-even', value: `${breakEven} months` },
    ];

    return {
      data,
      series: [
        { dataKey: 'recovered', name: 'Savings recovered', color: RESULT_TOKENS.savings },
        { dataKey: 'remaining', name: 'Closing costs remaining', color: RESULT_TOKENS.accent },
      ],
      rows,
    };
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
                helperText="Principal & interest only"
              />

              {result && paymentMismatch && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    Your entered payment doesn&apos;t match these loan terms. At {formatCurrency(inputs.currentBalance)} / {inputs.currentRate}% / {inputs.yearsRemaining} years
                    remaining, the P&amp;I payment is about <strong>{formatCurrency(impliedCurrentPayment)}/month</strong>.
                    The analysis below uses the computed payment — make sure your entry is principal &amp; interest only
                    (no taxes, insurance, or escrow).
                  </Typography>
                </Alert>
              )}

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
              <MarketRateNote rates={marketRates} />

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
                value={`${isBeneficial ? '' : '+'}${formatCurrency(Math.abs(monthlySavings))}`}
                sublabel={!isBeneficial
                  ? verdict === 'higher-payment-lower-cost'
                    ? `Higher payment, but ${formatCurrency(Math.abs(totalSavings))} less in lifetime cost`
                    : "This refinance does not save you money"
                  : verdict === 'mixed'
                    ? `Break-even in ${result.details.breakEvenMonths} months — but you pay more over the full term`
                    : `Break-even in ${result.details.breakEvenMonths} months (${(result.details.breakEvenYears as number).toFixed(1)} years)`
                }
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Current Payment"
                    value={`${formatCurrency((result.details.currentMonthlyPayment as number))}`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="New Payment"
                    value={`${formatCurrency((result.details.newMonthlyPayment as number))}`}
                    color={isBeneficial ? 'success' : 'error'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Closing Costs"
                    value={`${formatCurrency((result.details.closingCosts as number))}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label={totalSavings > 0 ? 'Total Savings' : 'Extra Lifetime Cost'}
                    value={`${formatCurrency(Math.abs(totalSavings))}`}
                    sublabel={totalSavings > 0 ? 'You save over the life' : 'You pay more over the life'}
                    color={totalSavings > 0 ? 'success' : 'error'}
                  />
                </Grid>
              </Grid>

              {/* Financed closing costs disclosure */}
              <Alert severity="info" icon={<AccountBalance />} sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Closing costs are financed into the new loan.</strong> Your new balance starts at {formatCurrency((result.details.newLoanAmount as number))} ({formatCurrency(inputs.currentBalance)} balance + {formatCurrency((result.details.closingCosts as number))} costs), so
                  you pay interest on the closing costs instead of paying them upfront.
                </Typography>
              </Alert>

              {/* Payment Comparison */}
              <ResultsSection 
                title="Payment Comparison" 
                subtitle="Current vs new monthly payment breakdown"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: 'result.surface', border: '1px solid', borderColor: 'result.border', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          CURRENT LOAN
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'result.costText', my: 1 }}>
                          {formatCurrency((result.details.currentMonthlyPayment as number))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inputs.currentRate}% for {inputs.yearsRemaining} more years
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: 'result.surface', border: '1px solid', borderColor: 'result.border', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          NEW LOAN
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: isBeneficial ? 'result.savingsText' : 'result.costText', my: 1 }}>
                          {formatCurrency((result.details.newMonthlyPayment as number))}
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
                      <TrendingDown sx={{ color: '#15803D', fontSize: 32 }} />
                    ) : (
                      <TrendingUp sx={{ color: '#B91C1C', fontSize: 32 }} />
                    )}
                    <Typography variant="h5" sx={{ fontWeight: 700, color: isBeneficial ? '#15803D' : '#B91C1C' }}>
                      {isBeneficial ? 'Save' : 'Pay'} {formatCurrency(Math.abs(monthlySavings))}/month
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
                    <CategoryStackedBarChart
                      data={closingCostRecovery.data}
                      series={closingCostRecovery.series}
                      height={280}
                      layout="horizontal"
                    />

                    <Box sx={{ mt: 3, border: '1px solid', borderColor: 'result.border', borderRadius: 2, overflow: 'hidden' }}>
                      {closingCostRecovery.rows.map((row, index) => (
                        <Stack
                          key={row.label}
                          direction="row"
                          justifyContent="space-between"
                          sx={{
                            px: 2,
                            py: 1.25,
                            bgcolor: index % 2 === 0 ? 'result.surface' : 'background.paper',
                            borderTop: index === 0 ? 'none' : '1px solid',
                            borderColor: 'result.border',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'result.chartLabel', fontWeight: 500 }}>
                            {row.label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'result.chartLabel', fontWeight: 700 }}>
                            {row.value}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                    
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

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      How break-even is calculated: closing costs ÷ monthly payment savings. This payment-only method
                      doesn&apos;t account for resetting your loan term or the slower equity build that comes with it — if
                      the new term is longer than your remaining term, check the lifetime cost comparison below before
                      deciding.
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
                    bgcolor: (result.details.totalSavings as number) > 0 ? '#D1FAE5' : '#FEE2E2', 
                    borderRadius: 2, 
                    textAlign: 'center' 
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {(result.details.totalSavings as number) > 0 ? 'TOTAL LIFETIME SAVINGS' : 'ADDITIONAL COST'}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: (result.details.totalSavings as number) > 0 ? '#065F46' : '#991B1B', my: 1 }}>
                      {formatCurrency(Math.abs(result.details.totalSavings as number))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(result.details.interestSavings as number) >= 0 ? 'Interest savings' : 'Extra interest paid'}: {formatCurrency(Math.abs(result.details.interestSavings as number))}
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
                  background: verdict === 'refinance'
                    ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                    : isTradeOff
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                      : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                  border: '1px solid',
                  borderColor: verdict === 'refinance' ? 'success.light' : isTradeOff ? 'warning.light' : 'error.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Savings sx={{ fontSize: 32, color: verdict === 'refinance' ? 'success.main' : isTradeOff ? 'warning.main' : 'error.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: verdict === 'refinance' ? 'success.dark' : isTradeOff ? 'warning.dark' : 'error.dark', mb: 1 }}>
                      {verdict === 'refinance'
                        ? 'Refinancing Makes Sense'
                        : verdict === 'mixed'
                          ? 'Lower Payment, But Higher Total Cost'
                          : verdict === 'higher-payment-lower-cost'
                            ? 'Higher Payment, But Lower Total Cost'
                            : 'Refinancing Doesn\u2019t Save You Money'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: verdict === 'refinance' ? 'success.dark' : isTradeOff ? 'warning.dark' : 'error.dark' }}>
                      {verdict === 'refinance'
                        ? `By refinancing from ${inputs.currentRate}% to ${inputs.newRate}%, you'll save ${formatCurrency(Math.abs(monthlySavings))}/month and ${formatCurrency(Math.abs(totalSavings))} over the life of the loan. After ${result.details.breakEvenMonths} months of payment savings, you'll have recovered the ${formatCurrency((result.details.closingCosts as number))} closing costs financed into your new loan.`
                        : verdict === 'mixed'
                          ? `Refinancing lowers your payment by ${formatCurrency(Math.abs(monthlySavings))}/month and breaks even in ${result.details.breakEvenMonths} months — but because the term resets to ${inputs.newTerm} years, you'd pay ${formatCurrency(Math.abs(totalSavings))} more over the life of the loan. It can still make sense if you need the monthly cash flow or won't keep the loan to term.`
                          : verdict === 'higher-payment-lower-cost'
                            ? `This refinance raises your payment by ${formatCurrency(Math.abs(monthlySavings))}/month, but the shorter payoff saves ${formatCurrency(Math.abs(totalSavings))} in total. It can make sense if you can afford the higher payment.`
                            : `This refinance would increase your monthly payment by ${formatCurrency(Math.abs(monthlySavings))} and cost ${formatCurrency(Math.abs(totalSavings))} more over the life of the loan. Unless you need to access equity or have other strategic reasons, it is not in your financial interest.`
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
