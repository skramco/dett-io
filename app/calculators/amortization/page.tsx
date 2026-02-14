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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import {
  TableChart,
  AccountBalance,
  TrendingDown,
  Savings,
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
} from '@/components/mui/calculator/LazyCharts';
import { calculateAmortization } from '@/lib/calculators';
import type { AmortizationInputs } from '@/lib/calculators/amortization';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function AmortizationCalculator() {
  const [inputs, setInputs] = useState<AmortizationInputs>({
    loanAmount: 360000,
    interestRate: 6.75,
    loanTerm: 30,
    extraMonthlyPayment: 0,
  });
  useUrlInputs(inputs, setInputs);

  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');

  const result = useMemo(() => {
    if (inputs.loanAmount <= 0) return null;
    return calculateAmortization(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof AmortizationInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const schedule = result?.amortizationSchedule;

  return (
    <CalculatorLayout
      calculatorSlug="amortization"
      title="Amortization Schedule Calculator"
      description="See a complete month-by-month breakdown of every mortgage payment. Understand exactly how much goes to principal vs interest over the life of your loan."
      relatedCalculators={[
        { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
        { slug: 'extra-payment', name: 'Extra Payment Impact' },
        { slug: 'refinance', name: 'Should I Refinance?' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
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
                  { value: 10, label: '10 years' },
                  { value: 15, label: '15 years' },
                  { value: 20, label: '20 years' },
                  { value: 25, label: '25 years' },
                  { value: 30, label: '30 years' },
                ]}
              />
            </InputSection>

            <InputSection title="Extra Payments" icon={<Savings />} color="secondary">
              <CurrencyInput
                label="Extra Monthly Payment"
                value={inputs.extraMonthlyPayment ?? 0}
                onChange={(v) => handleInputChange('extraMonthlyPayment', v)}
                helperText="Optional: pay extra each month to save on interest"
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
                label="Monthly Payment"
                value={`$${fmt(result.details.monthlyPayment as number)}`}
                sublabel={
                  (result.details.extraMonthlyPayment as number) > 0
                    ? `+ $${fmt(result.details.extraMonthlyPayment as number)} extra = $${fmt((result.details.monthlyPayment as number) + (result.details.extraMonthlyPayment as number))}/mo total`
                    : `${inputs.loanTerm}-year fixed at ${inputs.interestRate}%`
                }
              />

              {/* Key Metrics Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Loan Amount"
                    value={`$${fmt(result.details.loanAmount as number)}`}
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Interest"
                    value={`$${((result.details.totalInterest as number) / 1000).toFixed(0)}k`}
                    sublabel={`${(((result.details.totalInterest as number) / (result.details.loanAmount as number)) * 100).toFixed(0)}% of loan`}
                    color="warning"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Paid"
                    value={`$${((result.details.totalPaid as number) / 1000).toFixed(0)}k`}
                    color="error"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Payoff"
                    value={`${result.details.payoffYears} yrs`}
                    sublabel={
                      (result.details.yearsSaved as number) > 0
                        ? `${result.details.yearsSaved} yrs saved`
                        : `${result.details.numberOfPayments} payments`
                    }
                    color={(result.details.yearsSaved as number) > 0 ? 'success' : 'primary'}
                  />
                </Grid>
              </Grid>

              {/* Interest Saved Banner */}
              {(result.details.interestSaved as number) > 0 && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Extra payments save you ${fmt(result.details.interestSaved as number)} in interest</strong> and
                    pay off your mortgage {result.details.yearsSaved} years early!
                  </Typography>
                </Alert>
              )}

              {/* Principal vs Interest Over Time */}
              <ResultsSection
                title="Principal vs Interest by Year"
                subtitle="Watch the ratio shift as you build equity"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {schedule && schedule.yearlySummary.slice(0, 10).map((year, i) => {
                    const total = year.totalPrincipal + year.totalInterest;
                    const principalPct = (year.totalPrincipal / total) * 100;
                    return (
                      <Box key={i} sx={{ mb: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Year {year.year}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${fmt(year.endingBalance)} remaining
                          </Typography>
                        </Stack>
                        <Box sx={{ display: 'flex', height: 20, borderRadius: 1, overflow: 'hidden' }}>
                          <Box
                            sx={{
                              width: `${principalPct}%`,
                              bgcolor: CHART_COLORS.primary,
                              transition: 'width 0.3s',
                            }}
                          />
                          <Box
                            sx={{
                              width: `${100 - principalPct}%`,
                              bgcolor: CHART_COLORS.quaternary,
                              transition: 'width 0.3s',
                            }}
                          />
                        </Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            Principal: ${fmt(year.totalPrincipal)} ({principalPct.toFixed(0)}%)
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Interest: ${fmt(year.totalInterest)}
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  })}
                  {schedule && schedule.yearlySummary.length > 10 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                      Showing first 10 of {schedule.yearlySummary.length} years. See full schedule below.
                    </Typography>
                  )}
                </Paper>
              </ResultsSection>

              {/* Full Amortization Schedule */}
              <ResultsSection
                title="Full Amortization Schedule"
                subtitle="Complete payment breakdown"
              >
                <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(_, v) => v && setViewMode(v)}
                      size="small"
                    >
                      <ToggleButton value="yearly">Yearly</ToggleButton>
                      <ToggleButton value="monthly">Monthly</ToggleButton>
                    </ToggleButtonGroup>
                    <Chip
                      label={`${viewMode === 'yearly' ? schedule?.yearlySummary.length : schedule?.schedule.length} rows`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <TableContainer sx={{ maxHeight: 500 }}>
                    {viewMode === 'yearly' ? (
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Year</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Total Payment</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Principal</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Interest</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {schedule?.yearlySummary.map((year) => (
                            <TableRow key={year.year} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{year.year}</TableCell>
                              <TableCell align="right">${fmt(year.totalPayment)}</TableCell>
                              <TableCell align="right" sx={{ color: CHART_COLORS.primary }}>${fmt(year.totalPrincipal)}</TableCell>
                              <TableCell align="right" sx={{ color: CHART_COLORS.quaternary }}>${fmt(year.totalInterest)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>${fmt(year.endingBalance)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Payment</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Principal</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Interest</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {schedule?.schedule.map((row) => (
                            <TableRow key={row.month} hover>
                              <TableCell>{row.month}</TableCell>
                              <TableCell>{row.date}</TableCell>
                              <TableCell align="right">
                                ${fmt(row.totalPayment)}
                                {row.extraPayment > 0 && (
                                  <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                                    +${fmt(row.extraPayment)} extra
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right" sx={{ color: CHART_COLORS.primary }}>${fmt(row.principal)}</TableCell>
                              <TableCell align="right" sx={{ color: CHART_COLORS.quaternary }}>${fmt(row.interest)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>${fmt(row.balance)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TableContainer>
                </Paper>
              </ResultsSection>

              {/* Lifetime Cost */}
              <ResultsSection
                title="Lifetime Cost Summary"
                subtitle="The total cost of your mortgage"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <HorizontalBar
                    label="Principal (what you borrowed)"
                    value={result.details.loanAmount as number}
                    maxValue={result.details.totalPaid as number}
                    color={CHART_COLORS.primary}
                  />
                  <HorizontalBar
                    label="Total Interest Paid"
                    value={result.details.totalInterest as number}
                    maxValue={result.details.totalPaid as number}
                    color={CHART_COLORS.quaternary}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ p: 3, bgcolor: '#FEE2E2', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      TOTAL COST OF YOUR MORTGAGE
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#DC2626', my: 1 }}>
                      ${fmt(result.details.totalPaid as number)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${fmt(result.details.loanAmount as number)} principal + ${fmt(result.details.totalInterest as number)} interest
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
                        type={insight.includes('save') || insight.includes('saved') ? 'tip' : insight.includes('interest') ? 'info' : 'info'}
                        title={insight.includes('save') || insight.includes('saved') ? 'Savings' : insight.includes('year one') ? 'Year 1' : 'Insight'}
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
                  <TableChart sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                      Your <strong>${fmt(result.details.loanAmount as number)}</strong> mortgage at <strong>{inputs.interestRate}%</strong> will
                      cost you <strong>${fmt(result.details.monthlyPayment as number)}/month</strong> over <strong>{result.details.payoffYears} years</strong>.
                      You&apos;ll pay a total of <strong>${fmt(result.details.totalInterest as number)}</strong> in interest — that&apos;s{' '}
                      {(((result.details.totalInterest as number) / (result.details.loanAmount as number)) * 100).toFixed(0)}% of what you borrowed.
                      {(result.details.interestSaved as number) > 0 && (
                        <> With your extra payments, you&apos;ll save <strong>${fmt(result.details.interestSaved as number)}</strong> and be mortgage-free <strong>{result.details.yearsSaved} years sooner</strong>.</>
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
