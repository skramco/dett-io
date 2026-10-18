'use client';

import { DEFAULT_RATES } from '@/lib/rates/defaultRates';

import { useState, useMemo } from 'react';
import { useUrlInputs } from '@/lib/hooks/useUrlInputs';
import { useScenarioPrefill } from '@/lib/hooks/useScenarioPrefill';
import { useLiveRateDefaults } from '@/lib/hooks/useLiveRateDefaults';
import { MarketRateNote } from '@/components/mui/calculator/MarketRateNote';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  MilitaryTech,
  Home,
  CheckCircle,
  AccountBalance,
  FamilyRestroom,
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
  LazyDonutChart as DonutChart,
  ChartLegend,
  CHART_COLORS,
} from '@/components/mui/calculator/LazyCharts';
import { calculateVA } from '@/lib/calculators';
import { getResidualIncomeTable, VA_REGION_LABELS } from '@/lib/calculators/va';
import type { VAInputs, VARegion } from '@/lib/calculators/va';

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function VACalculator() {
  const [inputs, setInputs] = useState<VAInputs>({
    homePrice: 400000,
    downPaymentPercent: 0,
    interestRate: DEFAULT_RATES.va30,
    loanTerm: 30,
    loanPurpose: 'purchase',
    serviceType: 'regular',
    firstTimeUse: true,
    disabilityExempt: false,
    region: 'south',
    familySize: 3,
    propertyTax: 4800,
    homeInsurance: 1500,
    monthlyGrossIncome: 7000,
    monthlyDebts: 400,
  });
  useScenarioPrefill(inputs, setInputs);
  useUrlInputs(inputs, setInputs);
  const marketRates = useLiveRateDefaults(inputs, setInputs, { anchorField: 'interestRate' });
  const deferredInputs = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferredInputs.homePrice <= 0) return null;
    return calculateVA(deferredInputs);
  }, [deferredInputs]);

  const handleInputChange = (field: keyof VAInputs, value: number | string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const isPurchase = inputs.loanPurpose === 'purchase';

  const chartData = useMemo(() => {
    if (!result?.chartData) return [];
    const colors = [CHART_COLORS.primary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: item.value as number,
      color: colors[i % colors.length],
    }));
  }, [result]);

  const legendItems = useMemo(() => {
    if (!result?.chartData) return [];
    const total = result.details.totalMonthlyPayment as number;
    const colors = [CHART_COLORS.primary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];
    return result.chartData.map((item, i) => ({
      name: item.name as string,
      value: `$${fmt(item.value as number)}`,
      color: colors[i % colors.length],
      percentage: total > 0 ? ((item.value as number) / total) * 100 : 0,
    }));
  }, [result]);

  const comparison = useMemo(() => {
    if (!result) return null;
    const va = result.details.totalMonthlyPayment as number;
    const fha = result.details.fhaTotalMonthly as number;
    const conv = result.details.convTotalMonthly as number;
    const cheapest: 'va' | 'fha' | 'conv' = va <= fha && va <= conv ? 'va' : fha <= conv ? 'fha' : 'conv';
    return { cheapest, vsFha: fha - va, vsConv: conv - va };
  }, [result]);

  const bestValueBadge = (
    <Box sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#22C55E', color: 'white', px: 2, py: 0.25, borderRadius: 2, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      BEST VALUE
    </Box>
  );

  return (
    <CalculatorLayout
      calculatorSlug="va"
      title="VA Loan Calculator"
      description="Calculate your VA mortgage payment with $0 down and no PMI. See your VA funding fee, compare VA vs FHA vs conventional, and understand the financial benefits of your VA loan benefit."
      relatedCalculators={[
        { slug: 'fha', name: 'FHA Loan Calculator' },
        { slug: 'affordability', name: 'How Much House Can I Afford?' },
        { slug: 'dti', name: 'DTI Calculator' },
      ]}
      actionBarData={result ? { summary: result.summary, details: result.details, insights: result.insights, inputs: inputs as unknown as Record<string, unknown> } : undefined}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE - INPUTS */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="calculator-inputs">
            <InputSection title="Home & Loan" icon={<Home />}>
              <SelectInput
                label="Loan Purpose"
                value={inputs.loanPurpose}
                onChange={(v) => handleInputChange('loanPurpose', v as string)}
                options={[
                  { value: 'purchase', label: 'Purchase' },
                  { value: 'cash-out', label: 'Cash-Out Refinance' },
                  { value: 'irrrl', label: 'IRRRL (Streamline Refinance)' },
                ]}
                helperText={inputs.loanPurpose === 'irrrl' ? 'IRRRL has a flat 0.5% funding fee' : inputs.loanPurpose === 'cash-out' ? 'Cash-out fee: 2.15% first use / 3.3% after' : undefined}
              />
              <CurrencyInput
                label={isPurchase ? 'Home Price' : 'Home Value'}
                value={inputs.homePrice}
                onChange={(v) => handleInputChange('homePrice', v)}
              />
              <PercentageInput
                label={isPurchase ? 'Down Payment' : 'Equity Kept (not borrowed)'}
                value={inputs.downPaymentPercent}
                onChange={(v) => handleInputChange('downPaymentPercent', v)}
                step={1}
                helperText={isPurchase
                  ? 'VA loans allow $0 down — but more down reduces the funding fee'
                  : 'Share of home value not borrowed — refi fee tiers don\'t change with equity'}
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
                  { value: 30, label: '30 years' },
                ]}
              />
            </InputSection>

            <InputSection title="Service Details" icon={<MilitaryTech />} color="secondary">
              <SelectInput
                label="Service Type"
                value={inputs.serviceType}
                onChange={(v) => handleInputChange('serviceType', v as string)}
                options={[
                  { value: 'regular', label: 'Active Duty / Veteran' },
                  { value: 'reserves-guard', label: 'Reserves / National Guard' },
                  { value: 'surviving-spouse', label: 'Surviving Spouse' },
                ]}
                helperText={inputs.serviceType === 'reserves-guard'
                  ? 'Since 2020, Reserve/Guard pay the same funding fee as active duty'
                  : inputs.serviceType === 'surviving-spouse'
                    ? 'Eligible surviving spouses are exempt from the funding fee'
                    : undefined}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={inputs.firstTimeUse}
                    onChange={(e) => handleInputChange('firstTimeUse', e.target.checked)}
                  />
                }
                label="First-time VA loan use"
                sx={{ ml: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={inputs.disabilityExempt}
                    onChange={(e) => handleInputChange('disabilityExempt', e.target.checked)}
                  />
                }
                label="Disability exemption (10%+ VA disability)"
                sx={{ ml: 0 }}
              />
            </InputSection>

            <InputSection title="Income & Debts" icon={<AccountBalance />}>
              <CurrencyInput
                label="Monthly Gross Income"
                value={inputs.monthlyGrossIncome}
                onChange={(v) => handleInputChange('monthlyGrossIncome', v)}
              />
              <CurrencyInput
                label="Other Monthly Debts"
                value={inputs.monthlyDebts}
                onChange={(v) => handleInputChange('monthlyDebts', v)}
                helperText="Car payments, student loans, credit cards, etc."
              />
              <CurrencyInput
                label="Annual Property Tax"
                value={inputs.propertyTax}
                onChange={(v) => handleInputChange('propertyTax', v)}
              />
              <CurrencyInput
                label="Annual Home Insurance"
                value={inputs.homeInsurance}
                onChange={(v) => handleInputChange('homeInsurance', v)}
              />
            </InputSection>

            <InputSection title="Household (Residual Income)" icon={<FamilyRestroom />} color="secondary">
              <SelectInput
                label="Region"
                value={inputs.region}
                onChange={(v) => handleInputChange('region', v as string)}
                options={[
                  { value: 'northeast', label: 'Northeast' },
                  { value: 'midwest', label: 'Midwest' },
                  { value: 'south', label: 'South' },
                  { value: 'west', label: 'West' },
                ]}
                helperText="VA residual income guidelines vary by region"
              />
              <SelectInput
                label="Family Size"
                value={inputs.familySize}
                onChange={(v) => handleInputChange('familySize', v as number)}
                options={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                  { value: 6, label: '6' },
                  { value: 7, label: '7+' },
                ]}
                helperText="Everyone in the household, including the borrower"
              />
            </InputSection>
          </Box>
        </Grid>

        {/* RIGHT SIDE - RESULTS */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {result ? (
            <Stack spacing={4}>
              {/* No PMI Banner */}
              <Alert
                severity="success"
                icon={<MilitaryTech sx={{ fontSize: 28 }} />}
                sx={{ borderRadius: 3, py: 2 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  VA Benefit: No PMI Required
                </Typography>
                <Typography variant="body2">
                  VA loans never require private mortgage insurance — saving you ${fmt(result.details.pmiSavingsVsConv as number)}/month vs a conventional loan.
                </Typography>
              </Alert>

              {/* Hero Metric */}
              <HeroMetric
                label="Total Monthly VA Payment"
                value={`$${fmt(result.details.totalMonthlyPayment as number)}`}
                sublabel={`P&I: $${fmt(result.details.monthlyPI as number)} + Tax: $${fmt(result.details.monthlyPropertyTax as number)} + Ins: $${fmt(result.details.monthlyInsurance as number)} • No PMI`}
              />

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label={isPurchase ? 'Down Payment' : 'Equity Kept'}
                    value={inputs.downPaymentPercent === 0 ? '$0' : `$${fmt(result.details.downPayment as number)}`}
                    sublabel={inputs.downPaymentPercent === 0 ? (isPurchase ? 'Zero down!' : 'Full value borrowed') : `${inputs.downPaymentPercent}%${isPurchase ? ' down' : ' not borrowed'}`}
                    color="success"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Funding Fee"
                    value={(result.details.feeExempt as number) === 1 ? 'Exempt' : `$${fmt(result.details.fundingFee as number)}`}
                    sublabel={(result.details.feeExempt as number) === 1 ? (inputs.serviceType === 'surviving-spouse' && !inputs.disabilityExempt ? 'Surviving spouse' : 'Disability waiver') : `${result.details.fundingFeeRate}% (financed)`}
                    color={(result.details.feeExempt as number) === 1 ? 'success' : 'warning'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="Total Loan"
                    value={`$${fmt(result.details.totalLoanAmount as number)}`}
                    sublabel="incl. funding fee"
                    color="primary"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <MetricCard
                    label="DTI Ratio"
                    value={`${result.details.totalDTI}%`}
                    sublabel="41% is a guideline, not a cap"
                    color="primary"
                  />
                </Grid>
              </Grid>

              {/* Payment Breakdown */}
              <ResultsSection title="Payment Breakdown" subtitle="Where your monthly payment goes — notice: no mortgage insurance">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DonutChart
                        data={chartData}
                        centerLabel="monthly"
                        centerValue={`$${fmt(result.details.totalMonthlyPayment as number)}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <ChartLegend items={legendItems} />
                      <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534' }}>
                            Mortgage Insurance: $0/month
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </ResultsSection>

              {/* Residual Income Guidance */}
              <ResultsSection
                title="Residual Income Guidance"
                subtitle="VA's primary affordability measure — money left over each month after major obligations"
              >
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Your Estimated Residual</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ${fmt(result.details.monthlyResidualIncome as number)}/mo
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          VA Guideline ({VA_REGION_LABELS[inputs.region]}, family of {inputs.familySize})
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ${fmt(result.details.effectiveRequiredResidual as number)}/mo
                        </Typography>
                        {(result.details.dtiAboveGuideline as number) === 1 && (
                          <Typography variant="caption" color="text.secondary">
                            Includes +20% because DTI is above 41%
                          </Typography>
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Cushion vs Guideline</Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: (result.details.residualIncomeSurplus as number) >= 0 ? '#166534' : '#B45309' }}
                        >
                          {(result.details.residualIncomeSurplus as number) >= 0 ? '+' : '−'}${fmt(Math.abs(result.details.residualIncomeSurplus as number))}/mo
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        VA Residual Income Table — Loans {(result.details.totalLoanAmount as number) >= 80000 ? '$80,000 and Above' : 'Below $80,000'}
                      </Typography>
                      <Box sx={{ overflowX: 'auto' }}>
                        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& th, & td': { p: 1, fontSize: '0.85rem', textAlign: 'center', border: '1px solid', borderColor: 'divider' }, '& th': { fontWeight: 700, bgcolor: 'grey.50' } }}>
                          <Box component="thead">
                            <Box component="tr">
                              <Box component="th" sx={{ textAlign: 'left !important' }}>Region</Box>
                              {[1, 2, 3, 4, 5].map((size) => (
                                <Box
                                  component="th"
                                  key={size}
                                  sx={Math.min(inputs.familySize, 5) === size ? { bgcolor: '#EBF5FF !important' } : undefined}
                                >
                                  Family of {size}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                          <Box component="tbody">
                            {(Object.keys(VA_REGION_LABELS) as VARegion[]).map((region) => (
                              <Box component="tr" key={region} sx={region === inputs.region ? { bgcolor: '#EBF5FF' } : undefined}>
                                <Box component="td" sx={{ textAlign: 'left !important', fontWeight: region === inputs.region ? 700 : 400 }}>
                                  {VA_REGION_LABELS[region]}
                                </Box>
                                {getResidualIncomeTable(result.details.totalLoanAmount as number)[region].map((amount, i) => (
                                  <Box
                                    component="td"
                                    key={i}
                                    sx={region === inputs.region && Math.min(inputs.familySize, 5) === i + 1 ? { fontWeight: 700, bgcolor: '#DBEAFE' } : undefined}
                                  >
                                    ${fmt(amount)}
                                  </Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        For families over 5, add $80 per additional member (up to 7). Source: VA Lenders Handbook (Pamphlet 26-7, Ch. 4).
                      </Typography>
                    </Box>

                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2">
                        <strong>Educational estimate only.</strong> VA has no hard DTI cap — the 41% figure is a guideline.
                        When DTI exceeds 41%, VA guidance calls for residual income at least 20% above the table amount, or other
                        compensating factors. Actual underwriting computes residual income from your tax returns, child care,
                        utilities, and maintenance costs — our estimate simply assumes ~75% of gross income after taxes, minus
                        your housing payment and debts.
                      </Typography>
                    </Alert>
                  </Stack>
                </Paper>
              </ResultsSection>

              {/* VA vs FHA vs Conventional */}
              {isPurchase && (
              <ResultsSection title="VA vs FHA vs Conventional" subtitle="See how VA stacks up">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    {/* VA */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#F0FDF4', border: comparison?.cheapest === 'va' ? '2px solid #22C55E' : '1px solid #BBF7D0', textAlign: 'center', position: 'relative' }}>
                        {comparison?.cheapest === 'va' && bestValueBadge}
                        <MilitaryTech sx={{ fontSize: 32, color: '#22C55E', mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
                          VA Loan
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.totalMonthlyPayment as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Down: ${fmt(result.details.downPayment as number)} ({inputs.downPaymentPercent}%)</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#22C55E' }}>PMI: $0</Typography>
                          <Typography variant="caption">Fee: ${fmt(result.details.fundingFee as number)}</Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* FHA */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#FEF3C7', border: comparison?.cheapest === 'fha' ? '2px solid #22C55E' : '1px solid #FDE68A', textAlign: 'center', position: 'relative' }}>
                        {comparison?.cheapest === 'fha' && bestValueBadge}
                        <AccountBalance sx={{ fontSize: 32, color: '#D97706', mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#92400E' }}>
                          FHA Loan (3.5% Down)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.fhaTotalMonthly as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Down: ${fmt(result.details.fhaDownPayment as number)} (3.5%)</Typography>
                          <Typography variant="caption" sx={{ color: '#DC2626' }}>MIP: ${fmt(result.details.fhaMonthlyMIP as number)}/mo</Typography>
                          <Typography variant="caption">+1.75% upfront MIP</Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Conventional */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#EBF5FF', border: comparison?.cheapest === 'conv' ? '2px solid #22C55E' : '1px solid #93C5FD', textAlign: 'center', position: 'relative' }}>
                        {comparison?.cheapest === 'conv' && bestValueBadge}
                        <Home sx={{ fontSize: 32, color: '#2563EB', mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#1E40AF' }}>
                          Conventional (5% Down)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                          ${fmt(result.details.convTotalMonthly as number)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/month</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={0.5}>
                          <Typography variant="caption">Down: ${fmt(result.details.convDownPayment as number)} (5%)</Typography>
                          <Typography variant="caption" sx={{ color: '#DC2626' }}>PMI: ${fmt(result.details.convMonthlyPMI as number)}/mo</Typography>
                          <Typography variant="caption">Until 80% LTV</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Savings summary */}
                  {comparison && (
                    <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: comparison.cheapest === 'va' ? '#F0FDF4' : '#EBF5FF', border: comparison.cheapest === 'va' ? '1px solid #BBF7D0' : '1px solid #93C5FD' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: comparison.cheapest === 'va' ? '#166534' : '#1E40AF', textAlign: 'center' }}>
                        {comparison.vsFha >= 0 ? (
                          <>VA saves you <strong>${fmt(comparison.vsFha)}/month vs FHA</strong></>
                        ) : (
                          <>VA costs <strong>${fmt(-comparison.vsFha)}/month more vs FHA</strong></>
                        )}
                        {' • '}
                        {comparison.vsConv >= 0 ? (
                          <>VA saves you <strong>${fmt(comparison.vsConv)}/month vs Conventional</strong></>
                        ) : (
                          <>VA costs <strong>${fmt(-comparison.vsConv)}/month more vs Conventional</strong></>
                        )}
                      </Typography>
                    </Paper>
                  )}
                </Paper>
              </ResultsSection>
              )}

              {/* VA Funding Fee Details */}
              <ResultsSection title="VA Funding Fee" subtitle="The one-time cost of your VA benefit">
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  {(result.details.feeExempt as number) === 1 ? (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {inputs.disabilityExempt
                          ? <>You&apos;re exempt from the VA funding fee due to a 10%+ VA disability rating.</>
                          : <>Eligible surviving spouses receiving Dependency and Indemnity Compensation are exempt from the VA funding fee.</>}
                        {' '}This saves you ${fmt(Math.round((result.details.baseLoanAmount as number) * 0.0215))} compared to a first-time VA borrower.
                      </Typography>
                    </Alert>
                  ) : (
                    <Stack spacing={2}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="caption" color="text.secondary">Fee Rate</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{result.details.fundingFeeRate}%</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="caption" color="text.secondary">Fee Amount</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>${fmt(result.details.fundingFee as number)}</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="caption" color="text.secondary">Financed Into Loan</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>Yes</Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      <Typography variant="body2" color="text.secondary">
                        The funding fee is a one-time charge that funds the VA loan program. It can be financed into the loan
                        (adding ${fmt(result.details.fundingFee as number)} to your balance) or paid upfront at closing.
                        {isPurchase && ' Putting more down reduces the fee rate.'}
                        {' '}Since 2020, Reserve and National Guard members pay the same rates as active duty.
                      </Typography>

                      {/* Fee tier table — varies by loan purpose */}
                      {inputs.loanPurpose === 'irrrl' ? (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>IRRRL (Streamline Refinance) Fee</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1, bgcolor: '#EBF5FF' }}>
                            <Typography variant="body2">All IRRRLs (first or subsequent use)</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>0.50%</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            The IRRRL fee is a flat 0.5% regardless of prior VA loan use or equity.
                          </Typography>
                        </Box>
                      ) : inputs.loanPurpose === 'cash-out' ? (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cash-Out Refinance Fee by Use</Typography>
                          <Stack spacing={1}>
                            {[
                              { label: 'First use', rate: '2.15%', active: inputs.firstTimeUse },
                              { label: 'Subsequent use', rate: '3.30%', active: !inputs.firstTimeUse },
                            ].map((row, i) => (
                              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1, bgcolor: row.active ? '#EBF5FF' : 'grey.50' }}>
                                <Typography variant="body2">{row.label}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.rate}</Typography>
                              </Box>
                            ))}
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Cash-out refinance fees do not decrease with equity or down payment.
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            Purchase Funding Fee by Down Payment ({inputs.firstTimeUse ? 'First' : 'Subsequent'} Use)
                          </Typography>
                          <Stack spacing={1}>
                            {[
                              { dp: '0-4.99%', rate: inputs.firstTimeUse ? '2.15%' : '3.30%' },
                              { dp: '5-9.99%', rate: '1.50%' },
                              { dp: '10%+', rate: '1.25%' },
                            ].map((row, i) => (
                              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1, bgcolor: i === 0 && inputs.downPaymentPercent < 5 ? '#EBF5FF' : i === 1 && inputs.downPaymentPercent >= 5 && inputs.downPaymentPercent < 10 ? '#EBF5FF' : i === 2 && inputs.downPaymentPercent >= 10 ? '#EBF5FF' : 'grey.50' }}>
                                <Typography variant="body2">{row.dp} down</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.rate}</Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  )}
                </Paper>
              </ResultsSection>

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <ResultsSection title="Key Insights" subtitle="What these numbers mean for you">
                  <Stack spacing={2}>
                    {result.insights.map((insight, index) => (
                      <InsightCallout
                        key={index}
                        type={insight.includes('saving') || insight.includes('saves') || insight.includes('exempt') ? 'tip' : insight.includes('high') || insight.includes('exceeds') ? 'warning' : 'info'}
                        title={insight.includes('saving') || insight.includes('saves') ? 'VA Advantage' : insight.includes('exempt') ? 'Disability Benefit' : insight.includes('high') || insight.includes('exceeds') ? 'Heads Up' : 'Insight'}
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
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  border: '1px solid',
                  borderColor: 'success.light',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <MilitaryTech sx={{ fontSize: 32, color: 'success.dark' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#14532D', mb: 1 }}>
                      The Bottom Line
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#14532D' }}>
                      Your {inputs.loanPurpose === 'irrrl' ? 'VA IRRRL' : inputs.loanPurpose === 'cash-out' ? 'VA cash-out refinance' : 'VA loan'} on a <strong>${fmt(inputs.homePrice)}</strong> home costs{' '}
                      <strong>${fmt(result.details.totalMonthlyPayment as number)}/month</strong>
                      {isPurchase && (
                        <>{' '}with {inputs.downPaymentPercent === 0 ? <strong>zero down payment</strong> : <><strong>${fmt(result.details.downPayment as number)}</strong> down</>}</>
                      )}
                      {' '}and <strong>no monthly mortgage insurance</strong>.
                      {(result.details.feeExempt as number) === 0 && (
                        <> The {result.details.fundingFeeRate}% funding fee (${fmt(result.details.fundingFee as number)}) is financed into the loan.</>
                      )}
                      {isPurchase && comparison && (comparison.vsFha >= 0 ? (
                        <> Compared to FHA, you save <strong>${fmt(comparison.vsFha)}/month</strong>.</>
                      ) : (
                        <> Compared to FHA, you pay <strong>${fmt(-comparison.vsFha)}/month more</strong>.</>
                      ))}
                      {isPurchase && comparison && (comparison.vsConv >= 0 ? (
                        <> Compared to conventional with 5% down, you save <strong>${fmt(comparison.vsConv)}/month</strong>.</>
                      ) : (
                        <> Compared to conventional with 5% down, you pay <strong>${fmt(-comparison.vsConv)}/month more</strong>.</>
                      ))}
                      {' '}Your estimated residual income is <strong>${fmt(result.details.monthlyResidualIncome as number)}/month</strong> vs
                      a VA guideline of <strong>${fmt(result.details.effectiveRequiredResidual as number)}/month</strong> for your region and family size.
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
