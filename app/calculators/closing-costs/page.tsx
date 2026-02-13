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
  Chip,
} from '@mui/material';
import {
  AttachMoney,
  Home,
  AccountBalance,
  Gavel,
  Receipt,
  CheckCircle,
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
  DonutChart,
  ChartLegend,
  HorizontalBar,
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateClosingCosts } from '@/lib/calculators';
import type { ClosingCostInputs } from '@/lib/calculators/closingCosts';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CATEGORY_COLORS: Record<string, string> = {
  lender: CHART_COLORS.primary,
  'third-party': CHART_COLORS.secondary,
  government: CHART_COLORS.tertiary,
  prepaid: CHART_COLORS.quaternary,
};

const CATEGORY_LABELS: Record<string, string> = {
  lender: 'Lender Fees',
  'third-party': 'Third-Party Fees',
  government: 'Government Fees',
  prepaid: 'Prepaid Items',
};

export default function ClosingCostCalculator() {
  const [inputs, setInputs] = useState<ClosingCostInputs>({
    homePrice: 450000,
    downPaymentPercent: 20,
    interestRate: 6.75,
    loanTerm: 30,
    state: 'CA',
    isNewConstruction: false,
    sellerCreditPercent: 0,
    prepaidTaxMonths: 6,
    prepaidInterestDays: 15,
    prepaidInsurance: 1800,
  });

  const result = useMemo(() => {
    if (inputs.homePrice <= 0) return null;
    return calculateClosingCosts(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof ClosingCostInputs, value: number | string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const chartData = useMemo(() => {
    if (!result?.chartData) return [];
    const colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: item.value as number,
      color: colors[i % colors.length],
    }));
  }, [result]);

  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalClosingCosts as number;
    const colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: `$${fmt(item.value as number)}`,
      color: colors[i % colors.length],
      percentage: total > 0 ? ((item.value as number) / total) * 100 : 0,
    }));
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="closing-costs"
      title="Closing Cost Estimator"
      description="Get a detailed estimate of your mortgage closing costs. See lender fees, third-party fees, government charges, and prepaid items — so you know exactly how much cash you need at the closing table."
      relatedCalculators={[
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'down-payment', name: 'Down Payment Strategy' },
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
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
              <PercentageInput
                label="Down Payment"
                value={inputs.downPaymentPercent}
                onChange={(v) => handleInputChange('downPaymentPercent', v)}
                step={1}
              />
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

            <InputSection title="Prepaid Items" icon={<Receipt />} color="secondary">
              <CurrencyInput
                label="Annual Homeowners Insurance"
                value={inputs.prepaidInsurance ?? 1800}
                onChange={(v) => handleInputChange('prepaidInsurance', v)}
              />
              <NumberInput
                label="Prepaid Tax Months"
                value={inputs.prepaidTaxMonths ?? 6}
                onChange={(v) => handleInputChange('prepaidTaxMonths', v)}
                suffix="months"
              />
              <NumberInput
                label="Prepaid Interest Days"
                value={inputs.prepaidInterestDays ?? 15}
                onChange={(v) => handleInputChange('prepaidInterestDays', v)}
                suffix="days"
              />
            </InputSection>

            <InputSection title="Credits" icon={<AttachMoney />}>
              <PercentageInput
                label="Seller Credit"
                value={inputs.sellerCreditPercent ?? 0}
                onChange={(v) => handleInputChange('sellerCreditPercent', v)}
                step={0.5}
                helperText="Percentage of home price the seller covers"
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
                label="Total Cash Needed at Closing"
                value={`$${fmt(result.details.totalCashNeeded as number)}`}
                sublabel={`$${fmt(result.details.downPayment as number)} down + $${fmt(result.details.netClosingCosts as number)} closing costs`}
              />

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Closing Costs"
                    value={`$${fmt(result.details.totalClosingCosts as number)}`}
                    sublabel={`${result.details.closingCostPercent}% of price`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Down Payment"
                    value={`$${fmt(result.details.downPayment as number)}`}
                    sublabel={`${inputs.downPaymentPercent}% down`}
                    color="secondary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Seller Credit"
                    value={`$${fmt(result.details.sellerCredit as number)}`}
                    sublabel={(result.details.sellerCredit as number) > 0 ? 'Applied' : 'None'}
                    color={(result.details.sellerCredit as number) > 0 ? 'success' : 'primary'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Loan Amount"
                    value={`$${fmt(result.details.loanAmount as number)}`}
                    color="warning"
                  />
                </Grid>
              </Grid>

              {/* Cost Breakdown Chart */}
              <ResultsSection title="Cost Breakdown" subtitle="Where your closing costs go">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DonutChart
                        data={chartData}
                        centerLabel="closing costs"
                        centerValue={`$${fmt(result.details.totalClosingCosts as number)}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <ChartLegend items={legendItems} />
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Itemized Costs */}
              <ResultsSection title="Itemized Closing Costs" subtitle="Every fee explained">
                <Stack spacing={3}>
                  {(['lender', 'third-party', 'government', 'prepaid'] as const).map((category) => {
                    const items = result.lineItems.filter(i => i.category === category);
                    if (items.length === 0) return null;
                    const categoryTotal = items.reduce((sum, i) => sum + i.amount, 0);

                    return (
                      <Paper key={category} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: CATEGORY_COLORS[category] }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {CATEGORY_LABELS[category]}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            ${fmt(categoryTotal)}
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                          <Stack spacing={1}>
                            {items.map((item, i) => (
                              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2">{item.name}</Typography>
                                  {item.isEstimate && (
                                    <Chip label="Est." size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'grey.200' }} />
                                  )}
                                </Stack>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  ${fmt(item.amount)}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </Paper>
                    );
                  })}

                  {/* Total */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#EBF5FF', border: '1px solid', borderColor: 'primary.light' }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Closing Costs</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ${fmt(result.details.totalClosingCosts as number)}
                        </Typography>
                      </Box>
                      {(result.details.sellerCredit as number) > 0 && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                              <CheckCircle sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                              Seller Credit
                            </Typography>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                              -${fmt(result.details.sellerCredit as number)}
                            </Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Net Closing Costs</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              ${fmt(result.details.netClosingCosts as number)}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('negotiable') ? 'tip' : insight.includes('need') ? 'warning' : 'info'}
                        title={insight.includes('negotiable') ? 'Pro Tip' : insight.includes('need') ? 'Cash Needed' : 'Insight'}
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
                  background: 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <AccountBalance sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                      To buy a <strong>${fmt(inputs.homePrice)}</strong> home with <strong>{inputs.downPaymentPercent}% down</strong>,
                      you&apos;ll need approximately <strong>${fmt(result.details.totalCashNeeded as number)}</strong> in cash at closing.
                      That&apos;s <strong>${fmt(result.details.downPayment as number)}</strong> for the down payment
                      plus <strong>${fmt(result.details.netClosingCosts as number)}</strong> in closing costs
                      ({result.details.closingCostPercent}% of the home price).
                      {(result.details.sellerCredit as number) > 0 && (
                        <> The seller credit saves you <strong>${fmt(result.details.sellerCredit as number)}</strong>.</>
                      )}
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
