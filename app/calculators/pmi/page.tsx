'use client';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Shield,
  AccountBalance,
  TrendingDown,
  AttachMoney,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import CalculatorLayout from '@/components/mui/CalculatorLayout';
import {
  InputSection,
  CurrencyInput,
  PercentageInput,
  SelectInput,
  NumberInput,
  SliderInput,
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
} from '@/components/mui/calculator/LazyCharts';
import { calculatePMI } from '@/lib/calculators';
import type { PMIInputs } from '@/lib/calculators/pmi';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function PMICalculator() {
  const [inputs, setInputs] = useState<PMIInputs>({
    homePrice: 450000,
    downPaymentPercent: 10,
    loanAmount: 405000,
    interestRate: 6.75,
    loanTerm: 30,
    creditScore: 740,
    pmiType: 'borrower-paid',
  });
  useUrlInputs(inputs, setInputs);
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferredInputs.homePrice <= 0) return null;
    return calculatePMI(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof PMIInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const noPMI = result ? (result.details.noPMI as number) === 1 : false;

  return (
    <CalculatorLayout
      calculatorSlug="pmi"
      title="PMI Calculator"
      description="Calculate your private mortgage insurance (PMI) cost based on your down payment, credit score, and loan details. See when PMI drops off and how to eliminate it faster."
      relatedCalculators={[
        { slug: 'down-payment', name: 'Down Payment Strategy' },
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Home & Loan" icon={<AccountBalance />}>
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

            <InputSection title="Credit Profile" icon={<Shield />} color="secondary">
              <SliderInput
                label="Credit Score"
                value={inputs.creditScore}
                onChange={(v) => handleInputChange('creditScore', v)}
                min={620}
                max={850}
                step={10}
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* No PMI Banner */}
              {noPMI ? (
                <Alert
                  severity="success"
                  icon={<CheckCircle sx={{ fontSize: 28 }} />}
                  sx={{ borderRadius: 3, py: 3 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    No PMI Required!
                  </Typography>
                  <Typography variant="body1">
                    With {inputs.downPaymentPercent}% down, you exceed the 20% threshold and avoid PMI entirely.
                    This saves you hundreds per month compared to a lower down payment.
                  </Typography>
                </Alert>
              ) : (
                <>
                  {/* Hero Metric */}
                  <HeroMetric
                    label="Monthly PMI Cost"
                    value={`$${fmt(result.details.monthlyPMI as number)}`}
                    sublabel={`${result.details.pmiRate}% annual rate • drops off in ${result.details.yearsUntilRemoval} years`}
                  />
                </>
              )}

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Monthly P&I"
                    value={`$${fmt(result.details.monthlyPI as number)}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Monthly PMI"
                    value={noPMI ? '$0' : `$${fmt(result.details.monthlyPMI as number)}`}
                    sublabel={noPMI ? 'Not required' : `${result.details.pmiRate}%/yr`}
                    color={noPMI ? 'success' : 'warning'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total w/ PMI"
                    value={`$${fmt(result.details.monthlyPaymentWithPMI as number)}`}
                    sublabel="/month"
                    color="error"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total PMI Cost"
                    value={noPMI ? '$0' : `$${fmt(result.details.totalPMICost as number)}`}
                    sublabel={noPMI ? 'Saved!' : `over ${result.details.yearsUntilRemoval} yrs`}
                    color={noPMI ? 'success' : 'warning'}
                  />
                </Grid>
              </Grid>

              {/* PMI Removal Timeline */}
              {!noPMI && (
                <ResultsSection title="PMI Removal Timeline" subtitle="When does PMI drop off?">
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Stack spacing={3}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Current LTV: {result.details.ltv}%
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Target: 78% (auto-removal)
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, ((100 - (result.details.ltv as number)) / 22) * 100)}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': { bgcolor: CHART_COLORS.primary, borderRadius: 6 },
                          }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              REQUEST REMOVAL AT 80% LTV
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              ${fmt(result.details.requestRemovalBalance as number)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Balance must reach this amount
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              AUTO-REMOVAL AT 78% LTV
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              ${fmt(result.details.targetBalance as number)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {result.details.monthsUntilRemoval} months ({result.details.yearsUntilRemoval} years)
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Paper>
                </ResultsSection>
              )}

              {/* Down Payment Comparison */}
              <ResultsSection title="PMI by Down Payment" subtitle="See how more down payment reduces PMI">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    {(result.chartData as Array<{ name: string; monthlyPMI: number; totalPMICost: number; monthlyPayment: number }>).map((scenario, i) => {
                      const isNoPMI = scenario.monthlyPMI === 0;
                      const isCurrent = scenario.name === `${inputs.downPaymentPercent}%`;
                      return (
                        <Box
                          key={i}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: isCurrent ? '#EBF5FF' : isNoPMI ? '#F0FDF4' : '#F9FAFB',
                            border: '1px solid',
                            borderColor: isCurrent ? '#93C5FD' : isNoPMI ? '#BBF7D0' : '#E5E7EB',
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {scenario.name} Down
                                {isCurrent && (
                                  <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontWeight: 600 }}>
                                    Your scenario
                                  </Typography>
                                )}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="body2" color="text.secondary">Monthly PMI</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: isNoPMI ? '#22C55E' : '#EF4444' }}>
                                {isNoPMI ? 'None' : `$${fmt(scenario.monthlyPMI)}/mo`}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="body2" color="text.secondary">Total PMI</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {isNoPMI ? '$0' : `$${fmt(scenario.totalPMICost)}`}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="body2" color="text.secondary">Payment</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                ${fmt(scenario.monthlyPayment)}/mo
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
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
                        type={insight.includes('avoid') || insight.includes('save') || insight.includes('No PMI') ? 'tip' : insight.includes('Improving') ? 'tip' : 'info'}
                        title={insight.includes('avoid') || insight.includes('No PMI') ? 'Great News' : insight.includes('Improving') ? 'Pro Tip' : 'Insight'}
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
                  background: noPMI
                    ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
                    : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1px solid',
                  borderColor: noPMI ? 'success.light' : 'warning.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Shield sx={{ fontSize: 32, color: noPMI ? 'success.main' : 'warning.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: noPMI ? 'success.dark' : 'warning.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: noPMI ? 'success.dark' : 'warning.dark' }}>
                      {noPMI ? (
                        <>
                          With <strong>{inputs.downPaymentPercent}% down</strong> on a <strong>${fmt(inputs.homePrice)}</strong> home,
                          you avoid PMI entirely. Your monthly payment is <strong>${fmt(result.details.monthlyPI as number)}</strong> (principal &amp; interest only).
                        </>
                      ) : (
                        <>
                          With <strong>{inputs.downPaymentPercent}% down</strong> and a <strong>{inputs.creditScore}</strong> credit score,
                          your PMI costs <strong>${fmt(result.details.monthlyPMI as number)}/month</strong> ({result.details.pmiRate}% annual rate).
                          PMI automatically drops off after <strong>{result.details.yearsUntilRemoval} years</strong>,
                          costing you <strong>${fmt(result.details.totalPMICost as number)}</strong> total.
                          Your full monthly payment including PMI is <strong>${fmt(result.details.monthlyPaymentWithPMI as number)}</strong>.
                        </>
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
