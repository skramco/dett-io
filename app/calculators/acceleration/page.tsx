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
  Speed,
  Savings,
  TrendingUp,
  AccountBalance,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  NumberInput,
  SelectInput,
  CheckboxInput,
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
import { calculateAcceleration } from '@/lib/calculators';
import type { AccelerationInputs } from '@/lib/calculators/types';

export default function AccelerationCalculator() {
  const [inputs, setInputs] = useState<AccelerationInputs>({
    loanAmount: 360000,
    interestRate: 6.75,
    loanTerm: 30,
    extraMonthly: 200,
    extraAnnual: 0,
    lumpSumAmount: 0,
    lumpSumYear: 5,
    investmentReturn: 7,
    recastOption: false,
    recastFee: 250,
  });

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.loanAmount <= 0) return null;
    return calculateAcceleration(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof AccelerationInputs, value: number | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Comparison data for chart
  const comparisonData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Regular', current: result.details.regularInterest as number, new: (result.details.regularYears as number) * 12 },
      { name: 'Prepay', current: result.details.prepayInterest as number, new: (result.details.prepayYears as number) * 12 },
    ];
  }, [result]);

  return (
    <CalculatorLayout
      title="Mortgage Acceleration Calculator"
      description="See how extra payments can pay off your mortgage faster and save thousands in interest. Compare prepaying vs investing the difference."
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <InputSection title="Current Loan" icon={<AccountBalance />}>
              <CurrencyInput
                label="Loan Amount"
                value={inputs.loanAmount}
                onChange={(v) => handleInputChange('loanAmount', v)}
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

            <InputSection title="Extra Payments" icon={<Speed />} color="secondary">
              <CurrencyInput
                label="Extra Monthly Payment"
                value={inputs.extraMonthly}
                onChange={(v) => handleInputChange('extraMonthly', v)}
                helperText="Added to principal each month"
              />

              <CurrencyInput
                label="Extra Annual Payment"
                value={inputs.extraAnnual}
                onChange={(v) => handleInputChange('extraAnnual', v)}
                helperText="One-time extra payment each year"
              />

              <CurrencyInput
                label="Lump Sum Payment"
                value={inputs.lumpSumAmount}
                onChange={(v) => handleInputChange('lumpSumAmount', v)}
              />

              {inputs.lumpSumAmount > 0 && (
                <NumberInput
                  label="Lump Sum Year"
                  value={inputs.lumpSumYear}
                  onChange={(v) => handleInputChange('lumpSumYear', v)}
                  suffix="years from now"
                />
              )}
            </InputSection>

            <InputSection title="Compare to Investing" icon={<TrendingUp />}>
              <PercentageInput
                label="Expected Investment Return"
                value={inputs.investmentReturn}
                onChange={(v) => handleInputChange('investmentReturn', v)}
                step={0.5}
                helperText="If you invested extra payments instead"
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
                label="Interest Saved"
                value={`$${(result.details.interestSaved as number).toLocaleString()}`}
                sublabel={`Pay off ${result.details.yearsSaved} years early`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Base Payment"
                    value={`$${(result.details.basePayment as number).toLocaleString()}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Regular Interest"
                    value={`$${(result.details.regularInterest as number).toLocaleString()}`}
                    sublabel={`${result.details.regularYears} years`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Prepay Interest"
                    value={`$${(result.details.prepayInterest as number).toLocaleString()}`}
                    sublabel={`${result.details.prepayYears} years`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Invest Portfolio"
                    value={`$${(result.details.investPortfolio as number).toLocaleString()}`}
                    sublabel="If invested instead"
                    color="secondary"
                  />
                </Grid>
              </Grid>

              {/* Strategy Comparison */}
              <ResultsSection 
                title="Strategy Comparison" 
                subtitle="Regular payments vs accelerated payoff"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#FEF3C7', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          REGULAR PAYMENTS
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#92400E', my: 1 }}>
                          ${(result.details.regularInterest as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total interest over {result.details.regularYears} years
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          WITH EXTRA PAYMENTS
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          ${(result.details.prepayInterest as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total interest over {result.details.prepayYears} years
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#006397' }}>
                      You Save ${(result.details.interestSaved as number).toLocaleString()} + {result.details.yearsSaved} Years
                    </Typography>
                  </Box>
                </Paper>
              </ResultsSection>

              {/* Interest Comparison */}
              <ResultsSection 
                title="Total Interest Paid" 
                subtitle="Visual comparison of interest costs"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Regular Payments"
                    value={result.details.regularInterest as number}
                    maxValue={result.details.regularInterest as number}
                    color={CHART_COLORS.quaternary}
                  />
                  <HorizontalBar
                    label="With Extra Payments"
                    value={result.details.prepayInterest as number}
                    maxValue={result.details.regularInterest as number}
                    color={CHART_COLORS.primary}
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Extra ${inputs.extraMonthly}/month</strong> saves you <strong>${(result.details.interestSaved as number).toLocaleString()}</strong> in interest 
                      and pays off your mortgage <strong>{result.details.yearsSaved} years early</strong>.
                    </Typography>
                  </Alert>
                </Paper>
              </ResultsSection>

              {/* Prepay vs Invest */}
              <ResultsSection 
                title="Prepay vs Invest" 
                subtitle="Should you pay down the mortgage or invest?"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, height: '100%' }}>
                        <Savings sx={{ fontSize: 32, color: '#22C55E', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#065F46' }}>
                          Prepay Mortgage
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46', my: 1 }}>
                          ${(result.details.interestSaved as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Guaranteed {inputs.interestRate}% return (interest saved)
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ color: '#065F46' }}>
                          ✓ Risk-free, guaranteed return<br />
                          ✓ Peace of mind, debt freedom<br />
                          ✓ Builds home equity faster
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 3, bgcolor: '#EBF5FF', borderRadius: 2, height: '100%' }}>
                        <TrendingUp sx={{ fontSize: 32, color: '#006397', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#004B73' }}>
                          Invest Instead
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#004B73', my: 1 }}>
                          ${(result.details.investPortfolio as number).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Potential portfolio at {inputs.investmentReturn}% return
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ color: '#004B73' }}>
                          ✓ Potentially higher returns<br />
                          ✓ Maintains liquidity<br />
                          ✓ Tax advantages (401k, IRA)
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Alert 
                    severity={(result.details.investPortfolio as number) > (result.details.interestSaved as number) ? 'info' : 'success'} 
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2">
                      {(result.details.investPortfolio as number) > (result.details.interestSaved as number) 
                        ? `At ${inputs.investmentReturn}% returns, investing may yield $${((result.details.investPortfolio as number) - (result.details.interestSaved as number)).toLocaleString()} more than prepaying. But remember: investment returns aren't guaranteed, while interest savings are.`
                        : `At ${inputs.investmentReturn}% returns, prepaying wins by $${((result.details.interestSaved as number) - (result.details.investPortfolio as number)).toLocaleString()}. The guaranteed ${inputs.interestRate}% return from prepaying beats the expected investment return.`
                      }
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
                        type={insight.includes('💡') ? 'tip' : insight.includes('Prepaying wins') ? 'info' : 'info'}
                        title={insight.includes('Regular') ? 'Regular Payments' : insight.includes('Prepay') ? 'Prepay Strategy' : 'Analysis'}
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
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  border: '1px solid',
                  borderColor: 'success.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Speed sx={{ fontSize: 32, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'success.dark' }}>
                      Adding <strong>${inputs.extraMonthly}/month</strong> to your mortgage payment saves 
                      <strong> ${(result.details.interestSaved as number).toLocaleString()}</strong> in interest and 
                      pays off your loan <strong>{result.details.yearsSaved} years early</strong>. 
                      That's a guaranteed <strong>{inputs.interestRate}%</strong> return on every extra dollar you pay.
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
