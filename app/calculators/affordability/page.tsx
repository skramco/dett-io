'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
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
  TrendingUp,
  Home,
  Warning,
  CheckCircle,
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
  LazyComparisonBarChart as ComparisonBarChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateAffordability } from '@/lib/calculators';
import type { AffordabilityInputs } from '@/lib/calculators/types';

export default function AffordabilityCalculator() {
  const [inputs, setInputs] = useState<AffordabilityInputs>({
    annualIncome: 120000,
    monthlyDebts: 500,
    downPayment: 80000,
    interestRate: 6.75,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1800,
    hoaFees: 0,
  });
  useUrlInputs(inputs, setInputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.annualIncome <= 0) return null;
    return calculateAffordability(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof AffordabilityInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Derived values
  const monthlyIncome = inputs.annualIncome / 12;

  // Chart data for comparison
  const comparisonData = useMemo(() => {
    if (!result) return [];
    return [
      { 
        name: 'Conservative', 
        current: result.details.conservativePrice as number, 
        new: result.details.conservativePayment as number * 12 
      },
      { 
        name: 'Moderate', 
        current: result.details.moderatePrice as number, 
        new: result.details.moderatePayment as number * 12 
      },
      { 
        name: 'Aggressive', 
        current: result.details.aggressivePrice as number, 
        new: result.details.aggressivePayment as number * 12 
      },
    ];
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="affordability"
      title="How Much House Can I Afford?"
      description="Calculate your maximum home price based on income, debts, and down payment. See conservative, moderate, and aggressive affordability ranges with DTI analysis."
      relatedCalculators={[
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
        { slug: 'down-payment', name: 'Down Payment Strategy' },
        { slug: 'rent-vs-buy', name: 'Rent vs Buy Analysis' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Income & Debts" icon={<AccountBalance />}>
              <CurrencyInput
                label="Annual Gross Income"
                value={inputs.annualIncome}
                onChange={(v) => handleInputChange('annualIncome', v)}
              />
              
              <CurrencyInput
                label="Monthly Debt Payments"
                value={inputs.monthlyDebts}
                onChange={(v) => handleInputChange('monthlyDebts', v)}
                helperText="Car loans, credit cards, student loans, etc."
              />

              <CurrencyInput
                label="Down Payment Available"
                value={inputs.downPayment}
                onChange={(v) => handleInputChange('downPayment', v)}
              />
            </InputSection>

            <InputSection title="Loan Details" icon={<Home />} color="secondary">
              <PercentageInput
                label="Interest Rate"
                value={inputs.interestRate}
                onChange={(v) => handleInputChange('interestRate', v)}
                step={0.125}
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

              <PercentageInput
                label="Property Tax Rate"
                value={inputs.propertyTaxRate}
                onChange={(v) => handleInputChange('propertyTaxRate', v)}
                step={0.1}
                helperText="Annual rate as % of home value"
              />

              <CurrencyInput
                label="Home Insurance (Annual)"
                value={inputs.homeInsuranceAnnual}
                onChange={(v) => handleInputChange('homeInsuranceAnnual', v)}
              />

              <CurrencyInput
                label="HOA Fees (Monthly)"
                value={inputs.hoaFees}
                onChange={(v) => handleInputChange('hoaFees', v)}
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* Hero Metric - Moderate recommendation */}
              <HeroMetric
                label="Recommended Home Price"
                value={`$${(result.details.moderatePrice as number).toLocaleString()}`}
                sublabel={`Based on 36% DTI with $${(result.details.moderatePayment as number).toLocaleString()}/month payment`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Monthly Income"
                    value={`$${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Down Payment"
                    value={`$${inputs.downPayment.toLocaleString()}`}
                    sublabel={`${((inputs.downPayment / (result.details.moderatePrice as number)) * 100).toFixed(0)}% of moderate`}
                    color="secondary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Current Debts"
                    value={`$${inputs.monthlyDebts.toLocaleString()}/mo`}
                    color={inputs.monthlyDebts > monthlyIncome * 0.1 ? 'warning' : 'success'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Back-End DTI"
                    value={`${result.details.backEndDTI}%`}
                    sublabel={Number(result.details.backEndDTI) > 43 ? 'High' : 'Good'}
                    color={Number(result.details.backEndDTI) > 43 ? 'error' : 'success'}
                  />
                </Grid>
              </Grid>

              {/* Affordability Ranges */}
              <ResultsSection 
                title="Affordability Ranges" 
                subtitle="Three options based on different debt-to-income ratios"
              >
                <Stack spacing={2}>
                  {/* Conservative */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: '#22C55E',
                      bgcolor: '#F0FDF4',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#166534' }}>
                            Conservative (28% DTI)
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#166534' }}>
                          Safest option with breathing room for unexpected expenses
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#166534' }}>
                          ${(result.details.conservativePrice as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#166534' }}>
                          ${(result.details.conservativePayment as number).toLocaleString()}/month
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Moderate */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: '#006397',
                      bgcolor: '#EBF5FF',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <TrendingUp sx={{ color: '#006397', fontSize: 20 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#004B73' }}>
                            Moderate (36% DTI) — Recommended
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#004B73' }}>
                          Balanced approach - most common choice for stable income
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#004B73' }}>
                          ${(result.details.moderatePrice as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#004B73' }}>
                          ${(result.details.moderatePayment as number).toLocaleString()}/month
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Aggressive */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: '#F59E0B',
                      bgcolor: '#FFFBEB',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Warning sx={{ color: '#F59E0B', fontSize: 20 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#92400E' }}>
                            Aggressive (43% DTI)
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#92400E' }}>
                          Maximum qualification - leaves little room for error
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#92400E' }}>
                          ${(result.details.aggressivePrice as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#92400E' }}>
                          ${(result.details.aggressivePayment as number).toLocaleString()}/month
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </ResultsSection>

              {/* Visual Comparison */}
              <ResultsSection 
                title="Price vs Annual Payment" 
                subtitle="Compare home prices and what you'll pay each year"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <ComparisonBarChart 
                    data={comparisonData}
                    labels={{ current: 'Home Price', new: 'Annual Payment' }}
                    height={280}
                  />
                </Paper>
              </ResultsSection>

              {/* Monthly Budget Impact */}
              <ResultsSection 
                title="Monthly Budget Impact" 
                subtitle="How each option affects your monthly finances"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Monthly income remaining after housing payment:
                    </Typography>
                  </Box>
                  
                  <HorizontalBar
                    label="Conservative"
                    value={monthlyIncome - (result.details.conservativePayment as number)}
                    maxValue={monthlyIncome}
                    color="#22C55E"
                    formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })} left`}
                  />
                  <HorizontalBar
                    label="Moderate"
                    value={monthlyIncome - (result.details.moderatePayment as number)}
                    maxValue={monthlyIncome}
                    color="#006397"
                    formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })} left`}
                  />
                  <HorizontalBar
                    label="Aggressive"
                    value={monthlyIncome - (result.details.aggressivePayment as number)}
                    maxValue={monthlyIncome}
                    color="#F59E0B"
                    formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })} left`}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Rule of thumb:</strong> Keep housing costs under 30% of gross income. 
                      Your moderate option uses {result.details.moderateDTI}% of income.
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
                        type={insight.includes('⚠️') ? 'warning' : insight.includes('💡') ? 'tip' : 'info'}
                        title={insight.includes('⚠️') ? 'Warning' : insight.includes('💡') ? 'Tip' : 'Insight'}
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
                  background: 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Home sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                      With a <strong>${inputs.annualIncome.toLocaleString()}</strong> annual income and <strong>${inputs.downPayment.toLocaleString()}</strong> down payment, 
                      we recommend looking at homes up to <strong>${(result.details.moderatePrice as number).toLocaleString()}</strong>. 
                      This keeps your monthly payment at <strong>${(result.details.moderatePayment as number).toLocaleString()}</strong>, 
                      leaving you with <strong>${(monthlyIncome - (result.details.moderatePayment as number)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> each month for other expenses.
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
