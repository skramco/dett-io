'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';
import { calculateAffordability } from '@/lib/calculators';
import type { AffordabilityInputs } from '@/lib/calculators/types';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  CurrencyInput,
  PercentageInput,
  SelectInput,
} from '@/components/mui/calculator/InputPanel';

export const AFFORD_100K_GUIDE_DEFAULTS: AffordabilityInputs = {
  annualIncome: 100_000,
  monthlyDebts: 400,
  downPayment: 40_000,
  interestRate: 7.11,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  hoaFees: 0,
  creditScore: 740,
};

const TIER_META = [
  {
    key: 'conservative' as const,
    label: 'Conservative (28/36)',
    blurb: 'More breathing room',
    highlight: false,
  },
  {
    key: 'moderate' as const,
    label: 'Mid-range (36% total debt)',
    blurb: 'Housing plus other debts',
    highlight: true,
  },
  {
    key: 'aggressive' as const,
    label: 'Top of many guidelines (43%)',
    blurb: 'May not fit a comfortable budget',
    highlight: false,
  },
];

const CREDIT_BAND_OPTIONS = [
  { value: 760, label: '760+' },
  { value: 740, label: '740–759' },
  { value: 720, label: '720–739' },
  { value: 700, label: '700–719' },
  { value: 680, label: '680–699' },
  { value: 660, label: 'Below 680' },
];

interface GuideAffordabilityCalculatorProps {
  onSummaryChange?: (summary: {
    conservativePrice: number;
    moderatePrice: number;
    moderatePayment: number;
    inputs: AffordabilityInputs;
    monthlyIncome: number;
    moderateLoan: number;
    moderateBinding: string;
    moderatePmi: number;
  }) => void;
}

export function GuideAffordabilityCalculator({ onSummaryChange }: GuideAffordabilityCalculatorProps) {
  const [inputs, setInputs] = useState<AffordabilityInputs>(AFFORD_100K_GUIDE_DEFAULTS);
  const deferred = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferred.annualIncome <= 0) return null;
    return calculateAffordability(deferred);
  }, [deferred]);

  const monthlyIncome = inputs.annualIncome / 12;

  const breakdown = useMemo(() => {
    if (!result) return null;
    const price = result.details.moderatePrice as number;
    if (price <= 0) return null;
    const monthlyTax = (price * inputs.propertyTaxRate) / 100 / 12;
    const monthlyIns = inputs.homeInsuranceAnnual / 12;
    const monthlyPmi = (result.details.moderatePMI as number) || 0;
    const total = result.details.moderatePayment as number;
    const monthlyPi = total - monthlyPmi - monthlyTax - monthlyIns - inputs.hoaFees;
    return { monthlyPi, monthlyTax, monthlyIns, monthlyPmi, total };
  }, [result, inputs]);

  useEffect(() => {
    if (!result || !onSummaryChange) return;
    onSummaryChange({
      conservativePrice: result.details.conservativePrice as number,
      moderatePrice: result.details.moderatePrice as number,
      moderatePayment: result.details.moderatePayment as number,
      inputs: deferred,
      monthlyIncome,
      moderateLoan: result.details.moderateLoanAmount as number,
      moderateBinding: result.details.moderateBinding as string,
      moderatePmi: (result.details.moderatePMI as number) || 0,
    });
  }, [result, deferred, monthlyIncome, onSummaryChange]);

  const bindingLabel =
    result?.details.moderateBinding === 'back-end'
      ? 'Capped by back-end DTI because of other debts.'
      : 'Capped by the housing-only (front-end) guideline.';

  const tierPrice = (key: 'conservative' | 'moderate' | 'aggressive') =>
    result ? (result.details[`${key}Price`] as number) : 0;
  const tierPayment = (key: 'conservative' | 'moderate' | 'aggressive') =>
    result ? (result.details[`${key}Payment`] as number) : 0;

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 2.5 }}>
              Your numbers
            </Typography>
            <Stack spacing={2}>
              <CurrencyInput
                label="Annual gross income"
                value={inputs.annualIncome}
                onChange={(v) => setInputs((p) => ({ ...p, annualIncome: v }))}
              />
              <CurrencyInput
                label="Other monthly debts"
                value={inputs.monthlyDebts}
                onChange={(v) => setInputs((p) => ({ ...p, monthlyDebts: v }))}
                helperText="Car loans, student loans, credit-card minimums — not rent or utilities"
              />
              <CurrencyInput
                label="Down payment"
                value={inputs.downPayment}
                onChange={(v) => setInputs((p) => ({ ...p, downPayment: v }))}
              />
              <PercentageInput
                label="Interest rate"
                value={inputs.interestRate}
                onChange={(v) => setInputs((p) => ({ ...p, interestRate: v }))}
                step={0.01}
                helperText="Illustrative PMMS average, week of Nov 12, 2026 — replace with a rate you are actually offered"
              />
              <SelectInput
                label="Loan term"
                value={inputs.loanTerm}
                onChange={(v) => setInputs((p) => ({ ...p, loanTerm: v as number }))}
                options={[
                  { value: 30, label: '30 years' },
                  { value: 15, label: '15 years' },
                ]}
              />
              <PercentageInput
                label="Property tax rate (% of price / year)"
                value={inputs.propertyTaxRate}
                onChange={(v) => setInputs((p) => ({ ...p, propertyTaxRate: v }))}
                step={0.05}
              />
              <CurrencyInput
                label="Homeowners insurance ($ / year)"
                value={inputs.homeInsuranceAnnual}
                onChange={(v) => setInputs((p) => ({ ...p, homeInsuranceAnnual: v }))}
              />
              <CurrencyInput
                label="HOA dues ($ / month)"
                value={inputs.hoaFees}
                onChange={(v) => setInputs((p) => ({ ...p, hoaFees: v }))}
              />
              <SelectInput
                label="Credit-score band (for PMI estimate)"
                value={inputs.creditScore ?? 740}
                onChange={(v) => setInputs((p) => ({ ...p, creditScore: v as number }))}
                options={CREDIT_BAND_OPTIONS}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Estimated home prices
            </Typography>

            {result && tierPrice('moderate') > 0 ? (
              <>
                <Box
                  sx={{
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                    p: 2.5,
                    mb: 2.5,
                    border: '1px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Mid-range (36% total-debt guideline)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5 }}>
                    {formatCurrency(tierPrice('moderate'))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    About {formatCurrency(tierPayment('moderate'))} per month including taxes, insurance
                    {breakdown && breakdown.monthlyPmi > 0 ? ', and PMI' : ''}. {bindingLabel}
                  </Typography>
                </Box>

                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  {TIER_META.map(({ key, label, blurb, highlight }) => {
                    const price = tierPrice(key);
                    const payment = tierPayment(key);
                    return (
                      <Box
                        key={key}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: highlight ? 'primary.main' : 'divider',
                          bgcolor: highlight ? 'primary.light' : 'background.paper',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {price > 0 ? formatCurrency(price) : '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {price > 0
                            ? `${formatCurrency(payment)}/mo · ${blurb}`
                            : 'No room under this cap'}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>

                {breakdown && (
                  <Stack spacing={0}>
                    {(
                      [
                        { label: 'Principal & interest', value: breakdown.monthlyPi },
                        { label: 'Property tax', value: breakdown.monthlyTax },
                        { label: 'Homeowners insurance', value: breakdown.monthlyIns },
                        ...(inputs.hoaFees > 0 ? [{ label: 'HOA dues', value: inputs.hoaFees }] : []),
                        ...(breakdown.monthlyPmi > 0
                          ? [{ label: 'Estimated PMI', value: breakdown.monthlyPmi }]
                          : []),
                        { label: 'Full monthly housing cost', value: breakdown.total },
                      ] as { label: string; value: number }[]
                    ).map(({ label, value }, i, arr) => (
                      <Stack
                        key={label}
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          py: 1.25,
                          borderBottom: i === arr.length - 1 ? 0 : '1px solid',
                          borderColor: 'divider',
                          fontWeight: i === arr.length - 1 ? 600 : 400,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: i === arr.length - 1 ? 700 : 500 }}>
                          {formatCurrency(value)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                There is no remaining room for a housing payment under this mid-range guideline. Paying down
                other debts would free budget.
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Figures use Dett&apos;s affordability formulas, including a binary search for the highest price whose
              full payment fits each cap. Prices are rounded to the nearest dollar. Results are estimates for
              education only.{' '}
              <Link href="/methodology">Methodology</Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}