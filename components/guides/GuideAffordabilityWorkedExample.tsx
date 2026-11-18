'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';
import { calculateAffordability } from '@/lib/calculators';
import { useDeferredInputs } from '@/lib/hooks/useDeferredInputs';
import {
  CurrencyInput,
  PercentageInput,
  SelectInput,
} from '@/components/mui/calculator/InputPanel';
import {
  AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE,
  AFFORD_HOUSE_100K_RATE_AS_OF,
  AFFORD_HOUSE_100K_RATE_SOURCE,
  AFFORD_HOUSE_100K_SCENARIO,
  buildAffordabilityGuideHref,
  moderatePaymentBreakdown,
} from '@/lib/guides/scenarios/affordHouse100k';
import type { AffordabilityInputs } from '@/lib/calculators/types';

const TIER_META = {
  conservative: {
    label: 'Conservative (28/36)',
    blurb: 'More breathing room',
  },
  moderate: {
    label: 'Mid-range (36% total debt)',
    blurb: 'Housing plus other debts',
  },
  aggressive: {
    label: 'Top of many guidelines (43%)',
    blurb: 'May not fit a comfortable budget',
  },
} as const;

export function GuideAffordabilityWorkedExample() {
  const [inputs, setInputs] = useState<AffordabilityInputs>({
    ...AFFORD_HOUSE_100K_SCENARIO,
  });
  const deferred = useDeferredInputs(inputs);

  const result = useMemo(() => {
    if (deferred.annualIncome <= 0) return null;
    return calculateAffordability(deferred);
  }, [deferred]);

  const handleChange = (field: keyof AffordabilityInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const moderatePrice = result?.details.moderatePrice as number | undefined;
  const moderatePayment = result?.details.moderatePayment as number | undefined;
  const binding = result?.details.moderateBinding as string | undefined;
  const moderatePmi = result?.details.moderatePMI as number | undefined;

  const breakdown =
    moderatePrice && moderatePrice > 0
      ? moderatePaymentBreakdown(deferred, moderatePrice)
      : null;

  const bindLabel =
    binding === 'back-end'
      ? 'Capped by back-end DTI because of other debts.'
      : 'Capped by the housing-only (front-end) guideline.';

  const fullCalcHref = buildAffordabilityGuideHref(inputs);

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={2.5} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Your numbers
            </Typography>
            <Stack spacing={2}>
              <CurrencyInput
                label="Annual gross income"
                value={inputs.annualIncome}
                onChange={(v) => handleChange('annualIncome', v)}
              />
              <CurrencyInput
                label="Other monthly debts"
                value={inputs.monthlyDebts}
                onChange={(v) => handleChange('monthlyDebts', v)}
                helperText="Car loans, student loans, credit-card minimums — not rent or utilities"
              />
              <CurrencyInput
                label="Down payment"
                value={inputs.downPayment}
                onChange={(v) => handleChange('downPayment', v)}
              />
              <PercentageInput
                label="Interest rate"
                value={inputs.interestRate}
                onChange={(v) => handleChange('interestRate', v)}
                step={0.01}
                helperText={`Illustrative ${AFFORD_HOUSE_100K_RATE_SOURCE.shortName} average, ${AFFORD_HOUSE_100K_RATE_AS_OF} — replace with a rate you are actually offered`}
              />
              <SelectInput
                label="Loan term"
                value={inputs.loanTerm}
                onChange={(v) => handleChange('loanTerm', v as number)}
                options={[
                  { value: 30, label: '30 years' },
                  { value: 15, label: '15 years' },
                ]}
              />
              <PercentageInput
                label="Property tax rate (% of price / year)"
                value={inputs.propertyTaxRate}
                onChange={(v) => handleChange('propertyTaxRate', v)}
                step={0.05}
              />
              <CurrencyInput
                label="Homeowners insurance ($ / year)"
                value={inputs.homeInsuranceAnnual}
                onChange={(v) => handleChange('homeInsuranceAnnual', v)}
              />
              <CurrencyInput
                label="HOA dues ($ / month)"
                value={inputs.hoaFees}
                onChange={(v) => handleChange('hoaFees', v)}
              />
              <SelectInput
                label="Credit-score band (for PMI estimate)"
                value={inputs.creditScore ?? 740}
                onChange={(v) => handleChange('creditScore', v as number)}
                options={[
                  { value: 760, label: '760+' },
                  { value: 740, label: '740–759' },
                  { value: 720, label: '720–739' },
                  { value: 700, label: '700–719' },
                  { value: 680, label: '680–699' },
                  { value: 660, label: 'Below 680' },
                ]}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Estimated home prices
            </Typography>

            {result && moderatePrice ? (
              <Stack spacing={2}>
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    p: 2.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
                    Mid-range (36% total-debt guideline)
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}
                  >
                    {formatCurrency(moderatePrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    About {formatCurrency(moderatePayment ?? 0)} per month including taxes, insurance
                    {(moderatePmi ?? 0) > 0 ? ', and PMI' : ''}. {bindLabel}
                  </Typography>
                </Box>

                <Stack spacing={1.25}>
                  {(['conservative', 'moderate', 'aggressive'] as const).map((key) => {
                    const price = result.details[`${key}Price`] as number;
                    const payment = result.details[`${key}Payment`] as number;
                    const meta = TIER_META[key];
                    const active = key === 'moderate';
                    return (
                      <Box
                        key={key}
                        sx={{
                          border: '1px solid',
                          borderColor: active ? 'primary.main' : 'divider',
                          bgcolor: active ? '#EBF5FF' : 'background.paper',
                          borderRadius: 2,
                          px: 2,
                          py: 1.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {meta.label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
                          {price > 0 ? formatCurrency(price) : '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {price > 0
                            ? `${formatCurrency(payment)}/mo · ${meta.blurb}`
                            : 'No room under this cap'}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>

                {breakdown && (
                  <List disablePadding sx={{ mt: 1 }}>
                    {(
                      [
                        ['Principal & interest', breakdown.monthlyPI],
                        ['Property tax', breakdown.monthlyTax],
                        ['Homeowners insurance', breakdown.monthlyIns],
                        ...(breakdown.monthlyPMI > 0
                          ? ([['Estimated PMI', breakdown.monthlyPMI]] as [string, number][])
                          : []),
                        ...(inputs.hoaFees > 0
                          ? ([['HOA dues', inputs.hoaFees]] as [string, number][])
                          : []),
                        ['Full monthly housing cost', breakdown.total],
                      ] as [string, number][]
                    ).map(([label, amount], index, rows) => (
                      <ListItem
                        key={label}
                        disableGutters
                        sx={{
                          py: 1,
                          borderBottom:
                            index < rows.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={index === rows.length - 1 ? 'text.primary' : 'text.secondary'}
                          sx={{ fontWeight: index === rows.length - 1 ? 600 : 400 }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={index === rows.length - 1 ? 'text.primary' : 'text.secondary'}
                          sx={{ fontWeight: index === rows.length - 1 ? 600 : 400 }}
                        >
                          {formatCurrency(amount)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Figures use Dett&apos;s affordability formulas, including a binary search for the
                  highest price whose full payment fits each cap. Prices are rounded to the nearest
                  dollar. Results are estimates for education only.
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Enter income above zero to see estimated price ranges.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Want the full calculator with charts and export?{' '}
        <Link href={fullCalcHref} style={{ fontWeight: 600 }}>
          Open How Much House Can I Afford?
        </Link>{' '}
        with these inputs prefilled (example rate {AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE}%).
      </Typography>
    </Box>
  );
}