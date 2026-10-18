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
  Alert,
} from '@mui/material';
import {
  Home,
  Apartment,
  TrendingUp,
  Timeline,
  CompareArrows,
  Place,
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
import Link from 'next/link';
import {
  LazyTimelineChart as TimelineChart,
  LazyRangeTimelineChart as RangeTimelineChart,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateRentVsBuy } from '@/lib/calculators';
import { applyLocationToRentVsBuy, rescaleRentVsBuyOnPrice } from '@/lib/locations';
import { RENT_VS_BUY_SCENARIO_ASSUMPTIONS } from '@/lib/calculators/rentVsBuy';
import type { RentVsBuyInputs } from '@/lib/calculators/types';

export default function RentVsBuyCalculator() {
  const [inputs, setInputs] = useState<RentVsBuyInputs>({
    homePrice: 450000,
    downPayment: 90000,
    interestRate: DEFAULT_RATES.thirtyYearFixed,
    loanTerm: 30,
    monthlyRent: 2200,
    rentInflation: 3,
    homeAppreciation: 3,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1800,
    maintenanceRate: 1,
    pmiRate: 0.5,
    closingCosts: 13500,
    sellingCosts: 6,
    investmentReturn: 7,
    yearsToAnalyze: 10,
    state: '',
    zip: '',
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  useLocationHousingSync(inputs, setInputs, applyLocationToRentVsBuy);
  const marketRates = useLiveRateDefaults(inputs, setInputs, { anchorField: 'interestRate' });
  const deferredInputs = useDeferredInputs(inputs);

  // Calculate results in real-time
  const result = useMemo(() => {
    if (deferredInputs.homePrice <= 0) return null;
    return calculateRentVsBuy(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof RentVsBuyInputs, value: number) => {
    if (field === 'homePrice') {
      setInputs((prev) => rescaleRentVsBuyOnPrice(prev, value));
      return;
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Derived values
  const buyingWins = result ? (result.details.baseDifference as number) > 0 : false;

  // Timeline data for chart
  const timelineData = useMemo(() => {
    if (!result?.chartData) return [];
    return (result.chartData as Array<{ year: number; rentNetWorth: number; buyNetWorth: number }>).map(item => ({
      month: item.year * 12,
      optionA: item.rentNetWorth,
      optionB: item.buyNetWorth,
    }));
  }, [result]);

  const crossoverYear = result?.details.baseCrossover;

  const rangeChartData = useMemo(() => {
    if (!result?.chartData) return [];
    return result.chartData as Array<{
      year: number;
      diffP10: number;
      diffP50: number;
      diffP90: number;
      buyNetWorth: number;
      rentNetWorth: number;
    }>;
  }, [result]);

  const formatCrossover = (value: number | string | undefined) => {
    if (value === undefined || value === 'Never' || value === 0 || value === '0') return 'Never';
    return `Year ${value}`;
  };

  return (
    <CalculatorLayout
      calculatorSlug="rent-vs-buy"
      assumptions={[
        `${inputs.loanTerm}-year fixed-rate loan at ${inputs.interestRate}% interest`,
        `${inputs.homeAppreciation}%/yr home appreciation, ${inputs.rentInflation}%/yr rent growth, and ${inputs.investmentReturn}%/yr investment return — projections, not guarantees`,
      ]}
      title="Rent vs Buy Calculator"
      description="Compare the long-term financial impact of renting vs buying. See net worth projections, a Monte Carlo scenario range (not a single path), and disclosed assumptions."
      relatedCalculators={[
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
        { slug: 'down-payment', name: 'Down Payment Strategy' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Location" icon={<Place />}>
              <LocationInput
                value={{ state: inputs.state ?? '', zip: inputs.zip ?? '' }}
                onChange={({ state, zip }) => setInputs((prev) => ({ ...prev, state, zip }))}
                homePrice={inputs.homePrice}
              />
            </InputSection>

            <InputSection title="Buying Scenario" icon={<Home />}>
              <CurrencyInput
                label="Home Price"
                value={inputs.homePrice}
                onChange={(v) => handleInputChange('homePrice', v)}
              />
              
              <CurrencyInput
                label="Down Payment"
                value={inputs.downPayment}
                onChange={(v) => handleInputChange('downPayment', v)}
              />

              <PercentageInput
                label="Interest Rate"
                value={inputs.interestRate}
                onChange={(v) => handleInputChange('interestRate', v)}
                step={0.125}
              />
              <MarketRateNote rates={marketRates} />

              <PercentageInput
                label="Home Appreciation"
                value={inputs.homeAppreciation}
                onChange={(v) => handleInputChange('homeAppreciation', v)}
                step={0.5}
                helperText="Expected annual home value increase"
              />
            </InputSection>

            <InputSection title="Ownership Costs" icon={<TrendingUp />}>
              <PercentageInput
                label="Property Tax Rate"
                value={inputs.propertyTaxRate}
                onChange={(v) => handleInputChange('propertyTaxRate', v)}
                step={0.1}
                helperText={inputs.state ? 'Estimated from your location — override if you know the local rate' : 'Annual, as % of home value'}
              />

              <CurrencyInput
                label="Home Insurance (Annual)"
                value={inputs.homeInsuranceAnnual}
                onChange={(v) => handleInputChange('homeInsuranceAnnual', v)}
                helperText={inputs.state ? 'Estimated from your location — override with your quote' : undefined}
              />

              <PercentageInput
                label="Maintenance Rate"
                value={inputs.maintenanceRate}
                onChange={(v) => handleInputChange('maintenanceRate', v)}
                step={0.25}
                helperText="Annual upkeep, typically ~1% of home value"
              />

              <PercentageInput
                label="PMI Rate"
                value={inputs.pmiRate}
                onChange={(v) => handleInputChange('pmiRate', v)}
                step={0.1}
                helperText="Applies when down payment is under 20%; drops at 78% LTV"
              />

              <CurrencyInput
                label="Closing Costs (Buy)"
                value={inputs.closingCosts}
                onChange={(v) => handleInputChange('closingCosts', v)}
                helperText={inputs.state ? 'Estimated from state closing customs — override with your Loan Estimate' : 'Upfront cash at purchase — counted as opportunity cost'}
              />

              <PercentageInput
                label="Selling Costs"
                value={inputs.sellingCosts}
                onChange={(v) => handleInputChange('sellingCosts', v)}
                step={0.5}
                helperText="Agent commissions + fees when you sell, typically 6–8%"
              />
            </InputSection>

            <InputSection title="Renting Scenario" icon={<Apartment />} color="secondary">
              <CurrencyInput
                label="Monthly Rent"
                value={inputs.monthlyRent}
                onChange={(v) => handleInputChange('monthlyRent', v)}
              />

              <PercentageInput
                label="Rent Inflation"
                value={inputs.rentInflation}
                onChange={(v) => handleInputChange('rentInflation', v)}
                step={0.5}
                helperText="Expected annual rent increase"
              />

              <PercentageInput
                label="Investment Return"
                value={inputs.investmentReturn}
                onChange={(v) => handleInputChange('investmentReturn', v)}
                step={0.5}
                helperText="Return on invested savings"
              />
            </InputSection>

            <InputSection title="Analysis Period" icon={<Timeline />}>
              <SelectInput
                label="Years to Analyze"
                value={inputs.yearsToAnalyze}
                onChange={(v) => handleInputChange('yearsToAnalyze', v as number)}
                options={[
                  { value: 5, label: '5 years' },
                  { value: 7, label: '7 years' },
                  { value: 10, label: '10 years' },
                  { value: 15, label: '15 years' },
                  { value: 20, label: '20 years' },
                ]}
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
                label={`After ${inputs.yearsToAnalyze} Years (base path)`}
                value={buyingWins ? 'Buying Wins' : 'Renting Wins'}
                sublabel={`By ${formatCurrency(Math.abs(result.details.baseDifference as number))} in net worth · buying ahead in ${result.details.pctBuyWins}% of scenarios`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Rent Net Worth"
                    value={`${formatCurrency((result.details.baseRentNetWorth as number))}`}
                    color={!buyingWins ? 'success' : 'primary'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Buy Net Worth"
                    value={`${formatCurrency((result.details.baseBuyNetWorth as number))}`}
                    color={buyingWins ? 'success' : 'primary'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Break-Even"
                    value={crossoverYear === 'Never' ? 'Never' : `Year ${crossoverYear}`}
                    sublabel={crossoverYear === 'Never' ? 'Renting wins' : 'Buying wins after'}
                    color={crossoverYear === 'Never' ? 'warning' : 'success'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Difference"
                    value={`${formatCurrency(Math.abs(result.details.baseDifference as number))}`}
                    sublabel={buyingWins ? 'Buy ahead' : 'Rent ahead'}
                    color={buyingWins ? 'success' : 'warning'}
                  />
                </Grid>
              </Grid>

              {/* Net Worth Over Time */}
              <ResultsSection 
                title="Net Worth Over Time" 
                subtitle="Comparing wealth accumulation: renting + investing vs buying"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <TimelineChart 
                    data={timelineData}
                    breakEvenMonth={crossoverYear !== 'Never' ? (crossoverYear as number) * 12 : undefined}
                    labels={{ optionA: 'Rent + Invest', optionB: 'Buy Home' }}
                    height={320}
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>What&apos;s included:</strong> Buy net worth is sale proceeds — home value minus loan balance minus {inputs.sellingCosts}% selling costs.
                      The rent scenario invests your {formatCurrency((result.details.cashToClose as number))} cash to close (down payment + closing costs) at {inputs.investmentReturn}%,
                      and whichever side pays less each month invests the difference. If you don&apos;t invest the savings, the cheaper option loses its edge.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              <ResultsSection
                title="Scenario range"
                subtitle="Buy − rent net worth across sampled paths (positive means buying is ahead)"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <RangeTimelineChart
                    data={rangeChartData}
                    xKey="year"
                    xLabel="Years"
                    bandLow="diffP10"
                    bandHigh="diffP90"
                    bandLabel="P10–P90 (buy − rent)"
                    bandColor={CHART_COLORS.primary}
                    referenceY={0}
                    referenceLabel="Tie"
                    includeZero={false}
                    height={300}
                    lines={[
                      { dataKey: 'diffP50', name: 'Median (P50)', color: CHART_COLORS.primary, strokeWidth: 2.5 },
                    ]}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="Buying wins in"
                        value={`${result.details.pctBuyWins}%`}
                        sublabel={`of ${result.details.mcSamples} scenarios`}
                        color={(result.details.pctBuyWins as number) >= 50 ? 'success' : 'warning'}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P10 difference"
                        value={`${formatCurrency(result.details.p10Difference as number)}`}
                        sublabel="Buy − rent, 10th pct"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P50 difference"
                        value={`${formatCurrency(result.details.p50Difference as number)}`}
                        sublabel="Median scenario"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <MetricCard
                        label="P90 difference"
                        value={`${formatCurrency(result.details.p90Difference as number)}`}
                        sublabel="Buy − rent, 90th pct"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Side by Side Comparison */}
              <ResultsSection 
                title="Monthly Cost Comparison" 
                subtitle="What you pay each month in year 1"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Apartment sx={{ fontSize: 40, color: '#196bc0', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          RENTING
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F4F8F', my: 1 }}>
                          {formatCurrency(inputs.monthlyRent)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per month (year 1)
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          In year {inputs.yearsToAnalyze}: ~{formatCurrency(inputs.monthlyRent * Math.pow(1 + inputs.rentInflation / 100, inputs.yearsToAnalyze - 1))}/mo
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#F0FDF4', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Home sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          BUYING
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#166534', my: 1 }}>
                          {formatCurrency((result.details.monthlyBuyTotal as number))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          all-in per month (year 1)
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={0.5} sx={{ textAlign: 'left' }}>
                          {([
                            ['Principal & Interest', result.details.monthlyPI as number],
                            ['Property Tax', result.details.monthlyTax as number],
                            ['Insurance', result.details.monthlyInsurance as number],
                            ['PMI', result.details.monthlyPMI as number],
                            ['Maintenance', result.details.monthlyMaintenance as number],
                          ] as const)
                            .filter(([label, amount]) => label !== 'PMI' || amount > 0)
                            .map(([label, amount]) => (
                              <Stack key={label} direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">{label}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(amount)}</Typography>
                              </Stack>
                            ))}
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          P&I fixed for {inputs.loanTerm} years; tax & maintenance grow with home value
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Named joint paths */}
              <ResultsSection 
                title="Named paths" 
                subtitle="Appreciation, rent inflation, and investment return move together — not appreciation alone"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {([
                      {
                        key: 'optimistic',
                        title: 'Optimistic (buying-friendly)',
                        bg: '#D1FAE5',
                        color: '#065F46',
                        appr: result.details.optimisticAppreciation,
                        rent: result.details.optimisticRentInflation,
                        invest: result.details.optimisticInvestmentReturn,
                        crossover: result.details.optimisticCrossover,
                        difference: result.details.optimisticDifference as number,
                      },
                      {
                        key: 'base',
                        title: 'Base (your inputs)',
                        bg: '#EBF5FF',
                        color: '#0F4F8F',
                        appr: inputs.homeAppreciation,
                        rent: inputs.rentInflation,
                        invest: inputs.investmentReturn,
                        crossover: result.details.baseCrossover,
                        difference: result.details.baseDifference as number,
                      },
                      {
                        key: 'pessimistic',
                        title: 'Pessimistic (renting-friendly)',
                        bg: '#FEF3C7',
                        color: '#92400E',
                        appr: result.details.pessimisticAppreciation,
                        rent: result.details.pessimisticRentInflation,
                        invest: result.details.pessimisticInvestmentReturn,
                        crossover: result.details.pessimisticCrossover,
                        difference: result.details.pessimisticDifference as number,
                      },
                    ] as const).map((row) => (
                      <Box key={row.key} sx={{ p: 3, bgcolor: row.bg, borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: row.color }}>
                              {row.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {row.appr}% appreciation · {row.rent}% rent inflation · {row.invest}% return
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Break-even: {formatCrossover(row.crossover)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: row.color }}>
                              {row.difference > 0 ? 'Buying ahead' : row.difference < 0 ? 'Renting ahead' : 'Tie'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: row.color }}>
                              {formatCurrency(Math.abs(row.difference))}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>

                  <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Methodology:</strong> Monte Carlo draws {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.samples} seeded scenarios
                      from truncated normals around your inputs
                      (appreciation σ = {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.appreciation} pts,
                      rent inflation σ = {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.rentInflation} pts,
                      investment return σ = {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.investmentReturn} pts).
                      Named paths jointly shift all three variables; the old best/base/worst cards only moved appreciation.
                      Break-even across draws: {formatCrossover(result.details.p10Crossover as number)}–{formatCrossover(result.details.p90Crossover as number)}
                      (median {formatCrossover(result.details.p50Crossover as number)}).{' '}
                      <Link href="/methodology" style={{ color: 'inherit', fontWeight: 700 }}>Full methodology</Link>
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
                        type={insight.includes('⚠️') ? 'warning' : insight.includes('no equity') ? 'warning' : 'info'}
                        title={insight.includes('Base path') || insight.includes('Base case') ? 'Base Path' : insight.includes('Crossover') ? 'Break-Even' : 'Insight'}
                      >
                        {insight.replace('⚠️ ', '')}
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
                  background: buyingWins 
                    ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                    : 'linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)',
                  border: '1px solid',
                  borderColor: buyingWins ? 'success.light' : 'primary.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CompareArrows sx={{ fontSize: 32, color: buyingWins ? 'success.main' : 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: buyingWins ? 'success.dark' : 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: buyingWins ? 'success.dark' : 'primary.dark' }}>
                      {buyingWins 
                        ? `On the base path, over ${inputs.yearsToAnalyze} years buying a ${formatCurrency(inputs.homePrice)} home builds ${formatCurrency(Math.abs(result.details.baseDifference as number))} more wealth than renting at ${formatCurrency(inputs.monthlyRent)}/month and investing the difference (break-even ${formatCrossover(crossoverYear)}).`
                        : `On the base path, over ${inputs.yearsToAnalyze} years renting at ${formatCurrency(inputs.monthlyRent)}/month and investing the difference builds ${formatCurrency(Math.abs(result.details.baseDifference as number))} more wealth than buying.`
                      }
                      {' '}Buying ends ahead in <strong>{result.details.pctBuyWins}%</strong> of {result.details.mcSamples} sampled scenarios
                      (P10–P90 difference {formatCurrency(result.details.p10Difference as number)} to {formatCurrency(result.details.p90Difference as number)}).
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
