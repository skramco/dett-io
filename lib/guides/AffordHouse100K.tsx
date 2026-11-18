'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { formatCurrency } from '@/lib/format';
import { calculateAffordability } from '@/lib/calculators';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import {
  AFFORD_100K_GUIDE_DEFAULTS,
  GuideAffordabilityCalculator,
} from '@/components/mui/guides/GuideAffordabilityCalculator';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import type { AffordabilityInputs } from '@/lib/calculators/types';

const SLUG = 'afford-house-100k-salary';

type CalcSummary = {
  conservativePrice: number;
  moderatePrice: number;
  moderatePayment: number;
  inputs: AffordabilityInputs;
  monthlyIncome: number;
  moderateLoan: number;
  moderateBinding: string;
  moderatePmi: number;
};

function defaultSummary(): CalcSummary {
  const result = calculateAffordability(AFFORD_100K_GUIDE_DEFAULTS);
  return {
    conservativePrice: result.details.conservativePrice as number,
    moderatePrice: result.details.moderatePrice as number,
    moderatePayment: result.details.moderatePayment as number,
    inputs: AFFORD_100K_GUIDE_DEFAULTS,
    monthlyIncome: AFFORD_100K_GUIDE_DEFAULTS.annualIncome / 12,
    moderateLoan: result.details.moderateLoanAmount as number,
    moderateBinding: result.details.moderateBinding as string,
    moderatePmi: (result.details.moderatePMI as number) || 0,
  };
}

export function AffordHouse100K() {
  const [summary, setSummary] = useState<CalcSummary>(defaultSummary);
  const handleSummaryChange = useCallback((next: CalcSummary) => setSummary(next), []);

  const mathParagraph = useMemo(() => {
    const { inputs, monthlyIncome, moderatePrice, moderatePayment, moderateLoan, moderatePmi } = summary;
    const back36 = monthlyIncome * 0.36;
    const front28 = monthlyIncome * 0.28;
    const housingBudget = Math.max(0, back36 - inputs.monthlyDebts);
    const conPrice = summary.conservativePrice;

    const midPart =
      moderatePrice > 0
        ? `In this example the mid-range price is ${formatCurrency(moderatePrice)}: a ${formatCurrency(
            moderateLoan
          )} loan at ${inputs.interestRate}% for ${inputs.loanTerm} years, plus estimated taxes, insurance, and ${
            moderatePmi > 0 ? 'PMI' : 'no PMI'
          }, lands on a ${formatCurrency(moderatePayment)} total payment. `
        : 'In this example, other debts leave no room under the mid-range cap. ';

    const conPart =
      conPrice > 0
        ? `The conservative cap is tighter because it limits housing alone to 28% of gross income, or ${formatCurrency(
            front28
          )}, which supports about ${formatCurrency(conPrice)}.`
        : '';

    return (
      <>
        With {formatCurrency(inputs.annualIncome)} of gross income, monthly income is{' '}
        {formatCurrency(monthlyIncome)}. A 36% total-debt cap is {formatCurrency(back36)}. Subtract{' '}
        {formatCurrency(inputs.monthlyDebts)} of other debts and the housing budget left is{' '}
        {formatCurrency(housingBudget)}. That amount has to cover principal and interest, property tax, insurance,
        and PMI — not just the loan payment. {midPart}
        {conPart}
      </>
    );
  }, [summary]);

  const shortRange =
    summary.conservativePrice > 0 && summary.moderatePrice > 0
      ? `About ${formatCurrency(summary.conservativePrice)}–${formatCurrency(summary.moderatePrice)} in this example`
      : 'Adjust the numbers to see a range';

  const faqs = guideFaqs[SLUG] ?? [];

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 4,
          borderRadius: 3,
          bgcolor: '#EBF5FF',
          border: '1px solid #dbeafe',
        }}
      >
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}
        >
          The short answer
        </Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 700, my: 1 }}>
          {shortRange}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
          On a $100,000 salary with $400 a month in other debts, a $40,000 down payment, and an illustrative 7.11%
          30-year rate, Dett&apos;s affordability calculator estimates a conservative home price of about{' '}
          <strong>{formatCurrency(summary.conservativePrice)}</strong> and a mid-range price of about{' '}
          <strong>{formatCurrency(summary.moderatePrice)}</strong>. The mid-range payment is about{' '}
          <strong>{formatCurrency(summary.moderatePayment)} a month</strong> including taxes, insurance, and PMI.
          These are estimates, not a loan offer, a rate quote, or a decision on a loan.
        </Typography>
      </Paper>

      <p>
        A common shortcut is &quot;three to four times your salary,&quot; which would put a $100,000 income
        somewhere between $300,000 and $400,000. That range is a starting point, not a budget. Two households with
        the same salary can support very different payments once car loans, student loans, credit-card minimums, local
        property taxes, and the down payment are included.
      </p>
      <p>
        The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
          Consumer Financial Protection Bureau
        </a>{' '}
        explains debt-to-income ratio (DTI) as all monthly debt payments divided by gross monthly income — one way
        lenders measure the ability to repay. Different loan products and lenders use different DTI limits. This page
        uses the same three guideline tiers as Dett&apos;s{' '}
        <Link href="/calculators/affordability">How Much House Can I Afford?</Link> calculator: a conservative 28/36
        split, a mid-range 36% total-debt cap, and a 43% total-debt cap at the top of many guideline ranges.
      </p>

      <h2>A worked example you can change</h2>
      <p>
        The calculator below is pre-filled with a realistic first-time-buyer scenario, then uses Dett&apos;s published
        formulas — including PMI when the down payment is under 20%. Change any field and the prices update.
      </p>
      <ul>
        <li>
          <strong>$100,000</strong> gross annual income ($8,333 a month before taxes)
        </li>
        <li>
          <strong>$400 a month</strong> in other debts, such as a car payment or student loan
        </li>
        <li>
          <strong>$40,000</strong> down payment
        </li>
        <li>
          <strong>7.11%</strong> interest rate, the Freddie Mac{' '}
          <a href="https://www.freddiemac.com/pmms">Primary Mortgage Market Survey</a> average for 30-year fixed loans
          as of November 12, 2026. That is a national average used here for estimation only — not an APR, a quote, or
          an offer.
        </li>
        <li>
          <strong>30-year</strong> fixed, fully amortizing loan
        </li>
        <li>
          <strong>1.2%</strong> annual property tax and <strong>$1,800</strong> annual homeowners insurance (the
          affordability calculator&apos;s defaults; your local costs will differ)
        </li>
        <li>
          <strong>740</strong> credit-score band, the calculator&apos;s default for estimating conventional PMI
        </li>
      </ul>

      <GuideAffordabilityCalculator onSummaryChange={handleSummaryChange} />

      <h3>Show me the mid-range math</h3>
      <p>{mathParagraph}</p>

      <Alert
        severity="warning"
        sx={{
          my: 3,
          borderRadius: 2,
          borderLeft: '4px solid',
          borderColor: '#C2410C',
          bgcolor: '#FFF7ED',
          '& .MuiAlert-icon': { color: '#C2410C' },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <strong>Gross income is not take-home pay.</strong> The leftover amounts shown after housing are calculated
          from pre-tax income. Federal and state taxes, retirement contributions, utilities, food, transportation, and
          savings all still have to come out of what&apos;s left. Compare any payment to your actual monthly budget,
          not only to a DTI percentage.
        </Typography>
      </Alert>

      <h2>What changes the answer</h2>
      <p>In this same $100,000 income example, small changes move the mid-range price by tens of thousands of dollars:</p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>If you change this</th>
              <th>Mid-range price</th>
              <th>Full monthly housing cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Starting example ($400 debts, $40k down, 7.11%)</td>
              <td>$340,500</td>
              <td>$2,600</td>
            </tr>
            <tr>
              <td>Pay off the $400 in other debts</td>
              <td>$390,396</td>
              <td>$3,000</td>
            </tr>
            <tr>
              <td>Put $80,000 down (PMI drops off at the mid-range)</td>
              <td>$386,658</td>
              <td>$2,600</td>
            </tr>
            <tr>
              <td>Use 6.75% instead of 7.11%</td>
              <td>$349,808</td>
              <td>$2,600</td>
            </tr>
          </tbody>
        </Box>
      </Box>
      <p>
        Other debts are often the binding constraint. In the starting example, the 36% total-debt rule caps housing at
        $2,600 a month instead of $3,000. Paying down those debts raises the housing budget dollar for dollar. A larger
        down payment can also remove{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
          private mortgage insurance
        </a>
        , which the CFPB notes is typically required on a conventional loan with less than 20% down.
      </p>
      <p>
        Local taxes and insurance matter as much as the rate. A buyer in a high-tax county will support a lower price at
        the same payment than a buyer in a low-tax county. Enter your own estimates above, or use Dett&apos;s{' '}
        <Link href="/calculators/mortgage-cost">true monthly cost calculator</Link> once you have a specific property in
        mind.
      </p>

      <h2>Why the highest number may not fit your budget</h2>
      <p>
        The top-of-guideline estimate in this example is about <strong>$405,655</strong>, with a full housing payment
        of about <strong>$3,183</strong>. That is 38% of gross income for housing alone, and 43% once the $400 in other
        debts is included. Some lenders will consider loans in that range; that does not make it a comfortable payment.
      </p>
      <p>
        <a href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
          HUD has long treated housing costs above 30% of income as a cost burden
        </a>
        , and costs above 50% as a severe cost burden. The mid-range payment in this example is about 31% of gross
        income — already near that line — and it still does not include utilities or maintenance. If the higher payment
        would crowd out savings or leave no room for repairs, it does not fit this budget, even if it fits a guideline.
      </p>
      <p>
        For 2026, the{' '}
        <a href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026">
          FHFA conforming loan limit
        </a>{' '}
        for a one-unit home is $832,750 in most counties, and up to $1,249,125 in high-cost areas. All three prices in
        this $100,000 example stay well below that baseline, so jumbo-loan limits are not the constraint here. Income,
        debts, and the payment are.
      </p>

      <h2>Frequently asked questions</h2>
      <Stack spacing={1} sx={{ mb: 4 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={faq.question}
            defaultExpanded={index === 0}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
            CFPB, &quot;What is a debt-to-income ratio?&quot;
          </a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
            CFPB, &quot;What is private mortgage insurance?&quot;
          </a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/owning-a-home/">CFPB, Owning a Home tools</a>
        </li>
        <li>
          <a href="https://www.freddiemac.com/pmms">
            Freddie Mac Primary Mortgage Market Survey, week of November 12, 2026
          </a>{' '}
          (30-year fixed average 7.11%)
        </li>
        <li>
          <a href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026">
            FHFA, 2026 conforming loan limits
          </a>{' '}
          (baseline $832,750 for a one-unit home in most counties)
        </li>
        <li>
          <a href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
            HUD USER, &quot;Defining Housing Affordability&quot;
          </a>{' '}
          (cost-burden threshold of 30% of income)
        </li>
        <li>
          <Link href="/calculators/affordability">Dett affordability calculator</Link> and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 17, 2026. This page provides estimates for educational purposes only. Dett.io is not a
        lender, broker, or financial advisor. Actual rates, terms, payments, and eligibility are determined by lenders
        based on your complete financial profile, credit history, property, and market conditions.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}