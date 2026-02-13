'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Home,
  AccountBalance,
  TrendingUp,
  Savings,
  Warning,
  Info,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  SelectInput,
  SliderInput,
  InputHint,
} from '@/components/mui/calculator/InputPanel';
import {
  HeroMetric,
  MetricCard,
  BreakdownRow,
  InsightCallout,
  ResultsSection,
  EmptyResultsState,
} from '@/components/mui/calculator/ResultsPanel';
import {
  DonutChart,
  ChartLegend,
  AmortizationChart,
  HorizontalBar,
  ComparisonBarChart,
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateMortgageCost } from '@/lib/calculators';
import type { MortgageCostInputs } from '@/lib/calculators/types';

export default function MortgageCostCalculator() {
  const [inputs, setInputs] = useState<MortgageCostInputs>({
    homePrice: 450000,
    downPayment: 90000,
    interestRate: 6.75,
    loanTerm: 30,
    propertyTax: 5400,
    homeInsurance: 1800,
    hoaFees: 0,
    pmi: 0,
  });

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.homePrice <= 0) return null;
    return calculateMortgageCost(inputs);
  }, [inputs]);

  // Derived values
  const loanAmount = inputs.homePrice - inputs.downPayment;
  const downPaymentPercent = inputs.homePrice > 0 ? (inputs.downPayment / inputs.homePrice) * 100 : 0;
  const needsPMI = downPaymentPercent < 20;

  // Auto-calculate PMI if needed
  useEffect(() => {
    if (needsPMI && (inputs.pmi ?? 0) === 0) {
      // Estimate PMI at 0.5% of loan amount annually
      const estimatedPMI = loanAmount * 0.005;
      setInputs(prev => ({ ...prev, pmi: Math.round(estimatedPMI) }));
    } else if (!needsPMI && (inputs.pmi ?? 0) > 0) {
      setInputs(prev => ({ ...prev, pmi: 0 }));
    }
  }, [needsPMI, loanAmount]);

  const handleInputChange = (field: keyof MortgageCostInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Generate amortization data for chart
  const amortizationData = useMemo(() => {
    if (!result) return [];
    const data = [];
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;
    let balance = loanAmount;
    const monthlyPI = result.details.principalAndInterest as number;
    
    for (let year = 0; year <= inputs.loanTerm; year += 5) {
      if (year === 0) {
        data.push({ year, balance: loanAmount, principal: 0, interest: 0 });
      } else {
        const monthsElapsed = year * 12;
        let totalPrincipal = 0;
        let totalInterest = 0;
        let tempBalance = loanAmount;
        
        for (let m = 1; m <= monthsElapsed && m <= numberOfPayments; m++) {
          const interestPayment = tempBalance * monthlyRate;
          const principalPayment = monthlyPI - interestPayment;
          totalInterest += interestPayment;
          totalPrincipal += principalPayment;
          tempBalance -= principalPayment;
        }
        
        data.push({
          year,
          balance: Math.max(0, tempBalance),
          principal: totalPrincipal,
          interest: totalInterest,
        });
      }
    }
    return data;
  }, [result, inputs, loanAmount]);

  // Chart data for donut
  const chartData = useMemo(() => {
    if (!result?.chartData) return [];
    return result.chartData.map((item, index) => ({
      name: item.name as string,
      value: item.value as number,
      color: CHART_COLORS.gradient[index % CHART_COLORS.gradient.length],
    }));
  }, [result]);

  // Legend items
  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalMonthlyPayment as number;
    return result.chartData.map((item, index) => ({
      name: item.name as string,
      value: `$${(item.value as number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      color: CHART_COLORS.gradient[index % CHART_COLORS.gradient.length],
      percentage: ((item.value as number) / total) * 100,
    }));
  }, [result]);

  // Principal vs Interest over loan lifetime
  const principalVsInterestData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Principal', current: loanAmount, new: 0 },
      { name: 'Interest', current: result.details.totalInterest as number, new: 0 },
    ];
  }, [result, loanAmount]);

  // Annual cost breakdown
  const annualCostData = useMemo(() => {
    if (!result) return { principal: 0, interest: 0, taxes: 0, insurance: 0, other: 0, total: 0 };
    const monthlyPI = result.details.principalAndInterest as number;
    const monthlyTax = result.details.monthlyPropertyTax as number;
    const monthlyIns = result.details.monthlyInsurance as number;
    const monthlyHOA = result.details.monthlyHOA as number;
    const monthlyPMI = result.details.monthlyPMI as number;
    
    // Estimate first year principal (rough - interest heavy early)
    const firstYearInterest = loanAmount * (inputs.interestRate / 100);
    const firstYearPrincipal = (monthlyPI * 12) - firstYearInterest;
    
    return {
      principal: Math.max(0, firstYearPrincipal),
      interest: firstYearInterest,
      taxes: monthlyTax * 12,
      insurance: monthlyIns * 12,
      other: (monthlyHOA + monthlyPMI) * 12,
      total: (result.details.totalMonthlyPayment as number) * 12,
    };
  }, [result, loanAmount, inputs.interestRate]);

  return (
    <CalculatorLayout
      calculatorSlug="mortgage-cost"
      title="True Monthly Mortgage Cost"
      description="See your real monthly payment including PITI (Principal, Interest, Taxes, Insurance), HOA fees, and PMI. Most calculators only show principal and interest—we show you the full picture."
      relatedCalculators={[
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'down-payment', name: 'Down Payment Strategy' },
        { slug: 'refinance', name: 'Should I Refinance?' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Home & Loan" icon={<Home />}>
              <CurrencyInput
                label="Home Price"
                value={inputs.homePrice}
                onChange={(v) => handleInputChange('homePrice', v)}
              />
              
              <Box>
                <SliderInput
                  label="Down Payment"
                  value={inputs.downPayment}
                  onChange={(v) => handleInputChange('downPayment', v)}
                  min={0}
                  max={inputs.homePrice * 0.5}
                  step={5000}
                  valueLabelFormat={(v) => `$${(v / 1000).toFixed(0)}k (${((v / inputs.homePrice) * 100).toFixed(0)}%)`}
                />
                {needsPMI && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Less than 20% down requires PMI
                  </Alert>
                )}
              </Box>

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
            </InputSection>

            <InputSection title="Additional Costs" icon={<AccountBalance />} color="secondary">
              <CurrencyInput
                label="Annual Property Tax"
                value={inputs.propertyTax}
                onChange={(v) => handleInputChange('propertyTax', v)}
                helperText="Typically 1-2% of home value per year"
              />

              <CurrencyInput
                label="Annual Home Insurance"
                value={inputs.homeInsurance}
                onChange={(v) => handleInputChange('homeInsurance', v)}
              />

              <CurrencyInput
                label="Monthly HOA Fees"
                value={inputs.hoaFees}
                onChange={(v) => handleInputChange('hoaFees', v)}
              />

              {needsPMI && (
                <CurrencyInput
                  label="Annual PMI"
                  value={inputs.pmi ?? 0}
                  onChange={(v) => handleInputChange('pmi', v)}
                  helperText="Usually 0.5-1% of loan amount per year"
                />
              )}
            </InputSection>

            {/* Calculate Button */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: 'primary.main',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 99, 151, 0.3)',
                },
              }}
              onClick={() => {
                // Scroll to results on mobile
                if (window.innerWidth < 1200) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Calculate Results
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', mt: 0.5 }}>
                Results update automatically as you type
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* Hero Metric */}
              <HeroMetric
                label="Your True Monthly Payment"
                value={`$${(result.details.totalMonthlyPayment as number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                sublabel={`That's $${((result.details.totalMonthlyPayment as number) - (result.details.principalAndInterest as number)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} more than just P&I`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Loan Amount"
                    value={`$${(result.details.loanAmount as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Down Payment"
                    value={`${(result.details.downPaymentPercent as number).toFixed(0)}%`}
                    sublabel={`$${inputs.downPayment.toLocaleString()}`}
                    color={needsPMI ? 'warning' : 'success'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Interest"
                    value={`$${((result.details.totalInterest as number) / 1000).toFixed(0)}k`}
                    sublabel={`Over ${inputs.loanTerm} years`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Cost"
                    value={`$${((result.details.totalPaid as number) / 1000).toFixed(0)}k`}
                    sublabel="All payments combined"
                    color="error"
                  />
                </Grid>
              </Grid>

              {/* Payment Breakdown */}
              <ResultsSection 
                title="Monthly Payment Breakdown" 
                subtitle="Where your money goes each month"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DonutChart
                        data={chartData}
                        centerLabel="per month"
                        centerValue={`$${(result.details.totalMonthlyPayment as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <ChartLegend items={legendItems} />
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            P&I Only (what most show)
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${(result.details.principalAndInterest as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            True Total (what you pay)
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ${(result.details.totalMonthlyPayment as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="error.main">
                            Hidden costs
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                            +${((result.details.totalMonthlyPayment as number) - (result.details.principalAndInterest as number)).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Loan Balance Over Time */}
              <ResultsSection 
                title="Loan Balance Over Time" 
                subtitle="Watch your mortgage shrink as you make payments"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <AmortizationChart data={amortizationData} height={280} />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        After 5 years
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        ${(amortizationData[1]?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        remaining
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        After 10 years
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        ${(amortizationData[2]?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        remaining
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        After 15 years
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        ${(amortizationData[3]?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        remaining
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* First Year Cost Breakdown */}
              <ResultsSection 
                title="First Year Cost Breakdown" 
                subtitle="Where your money goes in year one"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Annual Housing Cost
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${annualCostData.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Typography>
                    </Stack>
                  </Box>
                  
                  <HorizontalBar
                    label="Interest (Year 1)"
                    value={annualCostData.interest}
                    maxValue={annualCostData.total}
                    color={CHART_COLORS.quaternary}
                  />
                  <HorizontalBar
                    label="Principal (Year 1)"
                    value={annualCostData.principal}
                    maxValue={annualCostData.total}
                    color={CHART_COLORS.primary}
                  />
                  <HorizontalBar
                    label="Property Taxes"
                    value={annualCostData.taxes}
                    maxValue={annualCostData.total}
                    color={CHART_COLORS.tertiary}
                  />
                  <HorizontalBar
                    label="Insurance"
                    value={annualCostData.insurance}
                    maxValue={annualCostData.total}
                    color={CHART_COLORS.secondary}
                  />
                  {annualCostData.other > 0 && (
                    <HorizontalBar
                      label="HOA + PMI"
                      value={annualCostData.other}
                      maxValue={annualCostData.total}
                      color="#9CA3AF"
                    />
                  )}
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Why so much interest?</strong> In year one, {((annualCostData.interest / (annualCostData.interest + annualCostData.principal)) * 100).toFixed(0)}% of your P&I payment goes to interest. 
                      This ratio improves over time as you pay down the principal.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Lifetime Cost Analysis */}
              <ResultsSection 
                title="Lifetime Cost Analysis" 
                subtitle="The true cost of your mortgage over {inputs.loanTerm} years"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          TOTAL AMOUNT BORROWED
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: CHART_COLORS.primary, my: 1 }}>
                          ${loanAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your original loan amount
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#FEF3C7', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          TOTAL INTEREST PAID
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: CHART_COLORS.quaternary, my: 1 }}>
                          ${(result.details.totalInterest as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(((result.details.totalInterest as number) / loanAmount) * 100).toFixed(0)}% of loan amount
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, p: 3, bgcolor: '#FEE2E2', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      TOTAL COST OF HOMEOWNERSHIP
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#DC2626', my: 1 }}>
                      ${(result.details.totalPaid as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Principal + Interest + Taxes + Insurance over {inputs.loanTerm} years
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
                        type={insight.includes('PMI') ? 'warning' : insight.includes('interest') ? 'info' : 'tip'}
                        title={insight.includes('PMI') ? 'PMI Alert' : insight.includes('interest') ? 'Interest Impact' : 'Did You Know?'}
                      >
                        {insight}
                      </InsightCallout>
                    ))}
                  </Stack>
                </ResultsSection>
              )}

              {/* Bottom Line Summary */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  border: '1px solid',
                  borderColor: 'success.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Savings sx={{ fontSize: 32, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'success.dark' }}>
                      Your true monthly housing cost is <strong>${(result.details.totalMonthlyPayment as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>, 
                      not the ${(result.details.principalAndInterest as number).toLocaleString(undefined, { maximumFractionDigits: 0 })} that most calculators show. 
                      Over {inputs.loanTerm} years, you'll pay a total of <strong>${(result.details.totalPaid as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> — 
                      that's ${(result.details.totalInterest as number).toLocaleString(undefined, { maximumFractionDigits: 0 })} in interest alone.
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
