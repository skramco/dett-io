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
  Home,
  Savings,
  TrendingUp,
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
  ComparisonBarChart,
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateDownPayment } from '@/lib/calculators';
import type { DownPaymentInputs } from '@/lib/calculators/types';

export default function DownPaymentCalculator() {
  const [inputs, setInputs] = useState<DownPaymentInputs>({
    homePrice: 450000,
    downPaymentPercent: 10,
    interestRate: 6.75,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1800,
    pmiRate: 0.5,
  });

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.homePrice <= 0) return null;
    return calculateDownPayment(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof DownPaymentInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Parse chart data for comparison
  const comparisonData = useMemo(() => {
    if (!result?.chartData) return [];
    return (result.chartData as Array<{ downPayment: string; cashToClose: number; monthlyPayment: number; pmiCost: number }>).map(item => ({
      name: item.downPayment,
      current: item.cashToClose,
      new: item.monthlyPayment * 12,
    }));
  }, [result]);

  // Get specific options for display
  const getOption = (percent: number) => {
    if (!result?.chartData) return null;
    return (result.chartData as Array<{ downPayment: string; cashToClose: number; monthlyPayment: number; pmiCost: number }>)
      .find(item => item.downPayment === `${percent}%`);
  };

  return (
    <CalculatorLayout
      title="Down Payment Comparison"
      description="Compare different down payment amounts to see how they affect your monthly payment, PMI costs, and total cash needed at closing."
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Home Details" icon={<Home />}>
              <CurrencyInput
                label="Home Price"
                value={inputs.homePrice}
                onChange={(v) => handleInputChange('homePrice', v)}
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

            <InputSection title="Additional Costs" icon={<Savings />} color="secondary">
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

              <PercentageInput
                label="PMI Rate"
                value={inputs.pmiRate}
                onChange={(v) => handleInputChange('pmiRate', v)}
                step={0.1}
                helperText="Annual PMI as % of loan (typically 0.3-1.5%)"
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
                label="PMI Savings with 20% Down"
                value={`$${(result.details.pmiSavings as number).toLocaleString()}`}
                sublabel="Total PMI cost avoided by putting 20% down instead of 3%"
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="3% Down"
                    value={`$${(result.details.option3Down as number).toLocaleString()}`}
                    sublabel={`$${(result.details.option3Payment as number).toLocaleString()}/mo`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="20% Down"
                    value={`$${(result.details.option20Down as number).toLocaleString()}`}
                    sublabel={`$${(result.details.option20Payment as number).toLocaleString()}/mo`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Monthly Diff"
                    value={`$${((result.details.option3Payment as number) - (result.details.option20Payment as number)).toLocaleString()}`}
                    sublabel="3% vs 20%"
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="PMI Cost (3%)"
                    value={`$${(result.details.option3PMI as number).toLocaleString()}`}
                    sublabel="Total PMI paid"
                    color="error"
                  />
                </Grid>
              </Grid>

              {/* Down Payment Options */}
              <ResultsSection 
                title="Down Payment Options" 
                subtitle="Compare 5 common down payment scenarios"
              >
                <Stack spacing={2}>
                  {[3, 5, 10, 15, 20].map((percent) => {
                    const option = getOption(percent);
                    if (!option) return null;
                    const needsPMI = percent < 20;
                    
                    return (
                      <Paper 
                        key={percent}
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 3, 
                          border: '2px solid',
                          borderColor: percent === 20 ? '#22C55E' : percent < 10 ? '#F59E0B' : '#E5E7EB',
                          bgcolor: percent === 20 ? '#F0FDF4' : percent < 10 ? '#FFFBEB' : '#FFFFFF',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              {percent === 20 ? (
                                <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />
                              ) : needsPMI ? (
                                <Warning sx={{ color: '#F59E0B', fontSize: 20 }} />
                              ) : null}
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {percent}% Down
                              </Typography>
                            </Stack>
                            {needsPMI && (
                              <Chip 
                                label="Requires PMI" 
                                size="small" 
                                sx={{ mt: 0.5, bgcolor: '#FEF3C7', color: '#92400E', fontSize: '0.7rem' }} 
                              />
                            )}
                            {percent === 20 && (
                              <Chip 
                                label="No PMI" 
                                size="small" 
                                sx={{ mt: 0.5, bgcolor: '#D1FAE5', color: '#065F46', fontSize: '0.7rem' }} 
                              />
                            )}
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">Cash to Close</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              ${option.cashToClose.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">Monthly Payment</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              ${option.monthlyPayment.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 4, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">Total PMI Cost</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: option.pmiCost > 0 ? '#DC2626' : '#22C55E' }}>
                              {option.pmiCost > 0 ? `$${option.pmiCost.toLocaleString()}` : '$0'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Stack>
              </ResultsSection>

              {/* Visual Comparison */}
              <ResultsSection 
                title="Cash vs Annual Cost" 
                subtitle="Upfront cash required vs first year housing costs"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <ComparisonBarChart 
                    data={comparisonData}
                    labels={{ current: 'Cash to Close', new: 'Annual Payment' }}
                    height={280}
                  />
                </Paper>
              </ResultsSection>

              {/* PMI Analysis */}
              <ResultsSection 
                title="PMI Impact Analysis" 
                subtitle="How PMI affects your total cost at each down payment level"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {[3, 5, 10, 15].map((percent) => {
                    const option = getOption(percent);
                    if (!option) return null;
                    const maxPMI = getOption(3)?.pmiCost || 1;
                    
                    return (
                      <HorizontalBar
                        key={percent}
                        label={`${percent}% Down`}
                        value={option.pmiCost}
                        maxValue={maxPMI}
                        color={percent === 3 ? '#EF4444' : percent === 5 ? '#F59E0B' : percent === 10 ? '#3B82F6' : '#22C55E'}
                      />
                    );
                  })}
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#D1FAE5', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle sx={{ color: '#22C55E' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#065F46' }}>
                        20% Down = $0 PMI
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>PMI automatically drops</strong> when your loan balance reaches 78% of the original home value. 
                      With 3% down, this typically takes 8-10 years.
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
                        type={insight.includes('💡') ? 'tip' : 'info'}
                        title={insight.includes('3%') ? '3% Down' : insight.includes('20%') ? '20% Down' : 'Insight'}
                      >
                        {insight.replace('💡 ', '')}
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
                  <TrendingUp sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                      On a <strong>${inputs.homePrice.toLocaleString()}</strong> home, putting 20% down 
                      (<strong>${(result.details.option20Down as number).toLocaleString()}</strong>) saves you 
                      <strong> ${(result.details.pmiSavings as number).toLocaleString()}</strong> in PMI and 
                      <strong> ${((result.details.option3Payment as number) - (result.details.option20Payment as number)).toLocaleString()}/month</strong> on your payment. 
                      However, if you need to preserve cash for emergencies or other investments, 
                      a lower down payment may make sense despite the PMI cost.
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
