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
  Home,
  Apartment,
  TrendingUp,
  Timeline,
  CompareArrows,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  NumberInput,
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
  TimelineChart,
  HorizontalBar,
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateRentVsBuy } from '@/lib/calculators';
import type { RentVsBuyInputs } from '@/lib/calculators/types';

export default function RentVsBuyCalculator() {
  const [inputs, setInputs] = useState<RentVsBuyInputs>({
    homePrice: 450000,
    downPayment: 90000,
    interestRate: 6.75,
    loanTerm: 30,
    monthlyRent: 2200,
    rentInflation: 3,
    homeAppreciation: 3,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1800,
    maintenanceRate: 1,
    closingCosts: 13500,
    sellingCosts: 6,
    investmentReturn: 7,
    yearsToAnalyze: 10,
  });

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.homePrice <= 0) return null;
    return calculateRentVsBuy(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof RentVsBuyInputs, value: number) => {
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

  // Find crossover point
  const crossoverYear = result?.details.baseCrossover;

  return (
    <CalculatorLayout
      title="Rent vs Buy Calculator"
      description="Compare the long-term financial impact of renting vs buying. See net worth projections, break-even timelines, and scenario analysis."
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
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

              <PercentageInput
                label="Home Appreciation"
                value={inputs.homeAppreciation}
                onChange={(v) => handleInputChange('homeAppreciation', v)}
                step={0.5}
                helperText="Expected annual home value increase"
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
                label={`After ${inputs.yearsToAnalyze} Years`}
                value={buyingWins ? 'Buying Wins' : 'Renting Wins'}
                sublabel={`By $${Math.abs(result.details.baseDifference as number).toLocaleString()} in net worth`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Rent Net Worth"
                    value={`$${(result.details.baseRentNetWorth as number).toLocaleString()}`}
                    color={!buyingWins ? 'success' : 'primary'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Buy Net Worth"
                    value={`$${(result.details.baseBuyNetWorth as number).toLocaleString()}`}
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
                    value={`$${Math.abs(result.details.baseDifference as number).toLocaleString()}`}
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
                      <strong>Key assumption:</strong> When renting, you invest the difference between buying costs and rent. 
                      If you don't invest the difference, buying almost always wins.
                    </Typography>
                  </Alert>
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
                        <Apartment sx={{ fontSize: 40, color: '#006397', mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          RENTING
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#004B73', my: 1 }}>
                          ${inputs.monthlyRent.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per month (year 1)
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          In year {inputs.yearsToAnalyze}: ~${Math.round(inputs.monthlyRent * Math.pow(1 + inputs.rentInflation / 100, inputs.yearsToAnalyze - 1)).toLocaleString()}/mo
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
                          ${(result.details.monthlyPI as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          P&I only (+ taxes, insurance, maintenance)
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          Payment stays fixed for {inputs.loanTerm} years
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Scenario Analysis */}
              <ResultsSection 
                title="Scenario Analysis" 
                subtitle="How different appreciation rates affect the outcome"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#065F46' }}>
                            Best Case ({inputs.homeAppreciation + 2}% appreciation)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Break-even: Year {result.details.bestCrossover}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#065F46' }}>
                          Buying Wins
                        </Typography>
                      </Stack>
                    </Box>
                    
                    <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#004B73' }}>
                            Base Case ({inputs.homeAppreciation}% appreciation)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Break-even: Year {result.details.baseCrossover}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#004B73' }}>
                          {buyingWins ? 'Buying Wins' : 'Renting Wins'}
                        </Typography>
                      </Stack>
                    </Box>
                    
                    <Box sx={{ p: 3, bgcolor: '#FEF3C7', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#92400E' }}>
                            Worst Case ({Math.max(0, inputs.homeAppreciation - 3)}% appreciation)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Break-even: Year {result.details.worstCrossover}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#92400E' }}>
                          {result.details.worstCrossover === 'Never' ? 'Renting Wins' : 'Buying Wins'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
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
                        title={insight.includes('Base case') ? 'Base Case' : insight.includes('Crossover') ? 'Break-Even' : 'Insight'}
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
                        ? `Over ${inputs.yearsToAnalyze} years, buying a $${inputs.homePrice.toLocaleString()} home builds $${Math.abs(result.details.baseDifference as number).toLocaleString()} more wealth than renting at $${inputs.monthlyRent.toLocaleString()}/month and investing the difference. You break even in year ${crossoverYear}.`
                        : `Over ${inputs.yearsToAnalyze} years, renting at $${inputs.monthlyRent.toLocaleString()}/month and investing the difference builds $${Math.abs(result.details.baseDifference as number).toLocaleString()} more wealth than buying. Consider staying longer or finding a cheaper home.`
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
