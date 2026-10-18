'use client';

import { formatCurrency } from '@/lib/format';

import { DEFAULT_RATES } from '@/lib/rates/defaultRates';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useScenarioPrefill } from '@/lib/hooks/useScenarioPrefill';
import { useLiveRateDefaults } from '@/lib/hooks/useLiveRateDefaults';
import { useLocationHousingSync } from '@/lib/hooks/useLocationHousingSync';
import { MarketRateNote } from '@/components/mui/calculator/MarketRateNote';
import { LocationInput } from '@/components/mui/calculator/LocationInput';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  AttachMoney,
  Home,
  AccountBalance,
  Receipt,
  CheckCircle,
  Place,
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
  LazyCategoryStackedBarChart as CategoryStackedBarChart,
  ChartLegend,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateClosingCosts } from '@/lib/calculators';
import { applyLocationToClosingCosts, rescaleClosingCostsOnPrice } from '@/lib/locations';
import type { ClosingCostInputs } from '@/lib/calculators/closingCosts';

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
    interestRate: DEFAULT_RATES.thirtyYearFixed,
    loanTerm: 30,
    state: 'CA',
    zip: '',
    isNewConstruction: false,
    sellerCreditPercent: 0,
    originationFeePercent: 1,
    propertyTaxRate: 1.1,
    taxEscrowMonths: 3,
    prepaidInterestDays: 15,
    prepaidInsurance: 1800,
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  useLocationHousingSync(inputs, setInputs, applyLocationToClosingCosts);
  const marketRates = useLiveRateDefaults(inputs, setInputs, { anchorField: 'interestRate' });
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferredInputs.homePrice <= 0) return null;
    return calculateClosingCosts(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof ClosingCostInputs, value: number | string | boolean) => {
    if (field === 'homePrice' && typeof value === 'number') {
      setInputs((prev) => rescaleClosingCostsOnPrice(prev, value));
      return;
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const stackedBreakdown = useMemo(() => {
    if (!result?.chartData) return { data: [], series: [] };
    const colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    const row: Record<string, string | number> = { name: 'Closing Costs' };
    const series = result.chartData.map((item, i) => {
      const key = `cat_${i}`;
      row[key] = item.value as number;
      return {
        dataKey: key,
        name: item.name as string,
        color: colors[i % colors.length],
      };
    });
    return { data: [row], series };
  }, [result]);

  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalClosingCosts as number;
    const colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: `${formatCurrency(item.value as number)}`,
      color: colors[i % colors.length],
      percentage: total > 0 ? ((item.value as number) / total) * 100 : 0,
    }));
  }, [result]);

  return (
    <CalculatorLayout
      calculatorSlug="closing-costs"
      assumptions={[
        `${inputs.loanTerm}-year fixed-rate loan at ${inputs.interestRate}% interest`,
        `Fees are typical estimates for ${inputs.state} and vary by lender, provider, and transaction`,
      ]}
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
            <InputSection title="Location" icon={<Place />}>
              <LocationInput
                value={{ state: inputs.state, zip: inputs.zip ?? '' }}
                onChange={({ state, zip }) => setInputs((prev) => ({ ...prev, state, zip }))}
                homePrice={inputs.homePrice}
              />
            </InputSection>

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
              <MarketRateNote rates={marketRates} />
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
                label="Origination Fee"
                value={inputs.originationFeePercent ?? 1}
                onChange={(v) => handleInputChange('originationFeePercent', v)}
                step={0.125}
                helperText="Assumption — varies by lender (0–1% is common) and is often negotiable"
              />
            </InputSection>

            <InputSection title="Prepaids & Escrow" icon={<Receipt />} color="secondary">
              <CurrencyInput
                label="Annual Homeowners Insurance"
                value={inputs.prepaidInsurance ?? 1800}
                onChange={(v) => handleInputChange('prepaidInsurance', v)}
                helperText={inputs.state ? 'Estimated from your location — override with your quote' : undefined}
              />
              <PercentageInput
                label="Property Tax Rate (annual)"
                value={inputs.propertyTaxRate ?? 1.1}
                onChange={(v) => handleInputChange('propertyTaxRate', v)}
                step={0.1}
                helperText={inputs.state ? 'Estimated from your location — override if you know the local rate' : "As a % of home price — check your county's rate"}
              />
              <NumberInput
                label="Tax Escrow Prefund"
                value={inputs.taxEscrowMonths ?? 3}
                onChange={(v) => handleInputChange('taxEscrowMonths', v)}
                suffix="months"
                helperText="Months of property tax collected once at closing to open escrow"
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
                value={`${formatCurrency(result.details.totalCashNeeded as number)}`}
                sublabel={`${formatCurrency(result.details.downPayment as number)} down + ${formatCurrency(result.details.netClosingCosts as number)} closing costs`}
              />

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Closing Costs"
                    value={`${formatCurrency(result.details.totalClosingCosts as number)}`}
                    sublabel={`${result.details.closingCostPercent}% of price`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Down Payment"
                    value={`${formatCurrency(result.details.downPayment as number)}`}
                    sublabel={`${inputs.downPaymentPercent}% down`}
                    color="secondary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Seller Credit"
                    value={`${formatCurrency(result.details.sellerCredit as number)}`}
                    sublabel={(result.details.sellerCredit as number) > 0 ? 'Applied' : 'None'}
                    color={(result.details.sellerCredit as number) > 0 ? 'success' : 'primary'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Loan Amount"
                    value={`${formatCurrency(result.details.loanAmount as number)}`}
                    color="warning"
                  />
                </Grid>
              </Grid>

              {/* Cost Breakdown Chart */}
              <ResultsSection title="Cost Breakdown" subtitle="Where your closing costs go">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CategoryStackedBarChart
                    data={stackedBreakdown.data}
                    series={stackedBreakdown.series}
                    height={160}
                    layout="vertical"
                    showLegend={false}
                  />
                  <Box sx={{ mt: 3 }}>
                    <ChartLegend items={legendItems} />
                  </Box>
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
                            {formatCurrency(categoryTotal)}
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
                                  {formatCurrency(item.amount)}
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
                          {formatCurrency(result.details.totalClosingCosts as number)}
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
                              -{formatCurrency(result.details.sellerCredit as number)}
                            </Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Net Closing Costs</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {formatCurrency(result.details.netClosingCosts as number)}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Paper>

                  {/* Paid outside closing */}
                  {(result.details.outsideClosingTotal as number) > 0 && (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'grey.400', overflow: 'hidden' }}>
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Paid Outside Closing
                          </Typography>
                          <Chip label="Not in cash to close" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'grey.200' }} />
                        </Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(result.details.outsideClosingTotal as number)}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Stack spacing={1}>
                          {result.lineItems.filter(i => i.category === 'outside-closing').map((item, i) => (
                            <Box key={i} sx={{ py: 0.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">{item.name}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatCurrency(item.amount)}
                                </Typography>
                              </Box>
                              {item.note && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.note}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Paper>
                  )}
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
                      To buy a <strong>{formatCurrency(inputs.homePrice)}</strong> home with <strong>{inputs.downPaymentPercent}% down</strong>,
                      you&apos;ll need approximately <strong>{formatCurrency(result.details.totalCashNeeded as number)}</strong> in cash at closing.
                      That&apos;s <strong>{formatCurrency(result.details.downPayment as number)}</strong> for the down payment
                      plus <strong>{formatCurrency(result.details.netClosingCosts as number)}</strong> in closing costs
                      ({result.details.closingCostPercent}% of the home price).
                      {(result.details.sellerCredit as number) > 0 && (
                        <> The seller credit saves you <strong>{formatCurrency(result.details.sellerCredit as number)}</strong>.</>
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
