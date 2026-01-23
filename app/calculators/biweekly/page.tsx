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
  CalendarMonth,
  Savings,
  Warning,
  CheckCircle,
  AccountBalance,
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
  CHART_COLORS,
} from '@/components/mui/calculator/ChartComponents';
import { calculateBiweekly } from '@/lib/calculators';
import type { BiweeklyInputs } from '@/lib/calculators/types';

export default function BiweeklyCalculator() {
  const [inputs, setInputs] = useState<BiweeklyInputs>({
    loanAmount: 360000,
    interestRate: 6.75,
    loanTerm: 30,
    biweeklyFee: 300,
  });

  // Calculate results in real-time
  const result = useMemo(() => {
    if (inputs.loanAmount <= 0) return null;
    return calculateBiweekly(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof BiweeklyInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <CalculatorLayout
      title="Biweekly Payment Calculator"
      description="See how biweekly payments can pay off your mortgage faster. Learn the difference between true biweekly and fake biweekly programs, plus a free DIY alternative."
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <InputSection title="Loan Details" icon={<AccountBalance />}>
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

            <InputSection title="Biweekly Service Fee" icon={<CalendarMonth />} color="secondary">
              <CurrencyInput
                label="Annual Service Fee"
                value={inputs.biweeklyFee}
                onChange={(v) => handleInputChange('biweeklyFee', v)}
                helperText="Fee charged by biweekly payment services"
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
                label="Interest Saved with True Biweekly"
                value={`$${(result.details.interestSaved as number).toLocaleString()}`}
                sublabel={`Pay off ${result.details.yearsSaved} years early`}
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Monthly Payment"
                    value={`$${(result.details.monthlyPayment as number).toLocaleString()}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Biweekly Payment"
                    value={`$${(result.details.biweeklyPayment as number).toLocaleString()}`}
                    sublabel="Every 2 weeks"
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Years Saved"
                    value={`${result.details.yearsSaved}`}
                    sublabel={`${result.details.biweeklyYears} vs ${result.details.monthlyYears} years`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="DIY Extra"
                    value={`$${(result.details.extraMonthlyEquivalent as number).toLocaleString()}/mo`}
                    sublabel="Same result, no fees"
                    color="secondary"
                  />
                </Grid>
              </Grid>

              {/* Payment Strategies */}
              <ResultsSection 
                title="Payment Strategies Compared" 
                subtitle="Understanding your options"
              >
                <Stack spacing={2}>
                  {/* Monthly */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: '#E5E7EB',
                      bgcolor: '#FFFFFF',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Monthly Payments
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Standard 12 payments/year
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2 }}>
                        <Typography variant="caption" color="text.secondary">Payment</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          ${(result.details.monthlyPayment as number).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Total Interest</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          ${(result.details.monthlyInterest as number).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Payoff</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {result.details.monthlyYears} years
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* True Biweekly */}
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
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#166534' }}>
                            True Biweekly
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#166534' }}>
                          26 payments/year (13 monthly equivalents)
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2 }}>
                        <Typography variant="caption" color="text.secondary">Payment</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#166534' }}>
                          ${(result.details.biweeklyPayment as number).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Total Interest</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#166534' }}>
                          ${(result.details.biweeklyInterest as number).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Payoff</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#166534' }}>
                          {result.details.biweeklyYears} years
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Fake Biweekly */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: '2px solid',
                      borderColor: '#EF4444',
                      bgcolor: '#FEF2F2',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Warning sx={{ color: '#EF4444', fontSize: 20 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#991B1B' }}>
                            "Fake" Biweekly
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#991B1B' }}>
                          24 payments/year (same as monthly!)
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2 }}>
                        <Typography variant="caption" color="text.secondary">Payment</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#991B1B' }}>
                          ${(result.details.biweeklyPayment as number).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Total Interest</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#991B1B' }}>
                          ${(result.details.monthlyInterest as number).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">+ Fees</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#991B1B' }}>
                          ${(inputs.biweeklyFee * inputs.loanTerm).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              </ResultsSection>

              {/* Interest Comparison */}
              <ResultsSection 
                title="Total Interest Comparison" 
                subtitle="See the savings visually"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Monthly Payments"
                    value={result.details.monthlyInterest as number}
                    maxValue={result.details.monthlyInterest as number}
                    color="#9CA3AF"
                  />
                  <HorizontalBar
                    label="True Biweekly"
                    value={result.details.biweeklyInterest as number}
                    maxValue={result.details.monthlyInterest as number}
                    color={CHART_COLORS.primary}
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ p: 3, bgcolor: '#D1FAE5', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#065F46' }}>
                      Save ${(result.details.interestSaved as number).toLocaleString()} in Interest
                    </Typography>
                  </Box>
                </Paper>
              </ResultsSection>

              {/* DIY Alternative */}
              <ResultsSection 
                title="Free DIY Alternative" 
                subtitle="Get the same benefit without paying service fees"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid', borderColor: '#006397', bgcolor: '#EBF5FF' }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Savings sx={{ fontSize: 40, color: '#006397' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#004B73', mb: 1 }}>
                        Just Add ${(result.details.extraMonthlyEquivalent as number).toLocaleString()} to Your Monthly Payment
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#004B73', mb: 2 }}>
                        The "magic" of biweekly payments is simple: you make 26 half-payments per year, 
                        which equals 13 full payments instead of 12. That's one extra payment per year.
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#004B73' }}>
                        <strong>DIY Method:</strong> Add ${(result.details.extraMonthlyEquivalent as number).toLocaleString()} 
                        (1/12 of your payment) to each monthly payment. Same result, zero fees!
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Your Current Payment</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ${(result.details.monthlyPayment as number).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">New Payment (DIY)</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#006397' }}>
                          ${((result.details.monthlyPayment as number) + (result.details.extraMonthlyEquivalent as number)).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Warning about fake biweekly */}
              <Alert 
                severity="warning" 
                icon={<Warning />}
                sx={{ borderRadius: 3 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Beware of "Fake" Biweekly Services
                </Typography>
                <Typography variant="body2">
                  Some companies charge ${inputs.biweeklyFee}/year to collect biweekly payments, but only forward 
                  them to your lender monthly (24 payments/year). This provides <strong>zero benefit</strong> and 
                  costs you <strong>${(inputs.biweeklyFee * inputs.loanTerm).toLocaleString()}</strong> over the life of your loan. 
                  Always verify that payments are applied biweekly, not held and paid monthly.
                </Typography>
              </Alert>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('⚠️') ? 'warning' : insight.includes('💡') ? 'tip' : 'info'}
                        title={insight.includes('Monthly') ? 'Monthly' : insight.includes('True biweekly') ? 'True Biweekly' : insight.includes('Fake') ? 'Warning' : 'Tip'}
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
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  border: '1px solid',
                  borderColor: 'success.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CalendarMonth sx={{ fontSize: 32, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'success.dark' }}>
                      True biweekly payments save <strong>${(result.details.interestSaved as number).toLocaleString()}</strong> and 
                      pay off your mortgage <strong>{result.details.yearsSaved} years early</strong>. 
                      Skip the paid services—just add <strong>${(result.details.extraMonthlyEquivalent as number).toLocaleString()}</strong> to 
                      your monthly payment for the same result with zero fees.
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
