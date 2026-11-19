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
import {
  HUB_GUIDE_SLUG,
  HUB_PMMS_THIRTY_YEAR,
  HUB_SHARED_ASSUMPTIONS,
  SALARY_BAND_ROWS,
  buildAffordabilityCalculatorHref,
  buildDtiCalculatorHref,
  buildMortgageCostCalculatorHref,
  computeSalaryBandRow,
} from '@/lib/guides/salaryAffordabilityHub';

const SLUG = HUB_GUIDE_SLUG;

const WORKED_100K_ROW = computeSalaryBandRow(100_000);
const WORKED_100K_DEFAULT_RESULT = calculateAffordability(AFFORD_100K_GUIDE_DEFAULTS);

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
  const result = WORKED_100K_DEFAULT_RESULT;
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

function formatSalaryLabel(income: number): string {
  if (income >= 1_000_000) return `$${(income / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(income / 1000)}K`;
}

export function AffordHouseBySalary() {
  const faqs = guideFaqs[SLUG] ?? [];
  const firstRow = SALARY_BAND_ROWS[0];
  const lastRow = SALARY_BAND_ROWS[SALARY_BAND_ROWS.length - 1];

  const [summary, setSummary] = useState<CalcSummary>(defaultSummary);
  const handleSummaryChange = useCallback((next: CalcSummary) => setSummary(next), []);

  const aggressiveFromSummary = useMemo(() => {
    const result = calculateAffordability(summary.inputs);
    return {
      aggressivePrice: result.details.aggressivePrice as number,
      aggressivePayment: result.details.aggressivePayment as number,
    };
  }, [summary.inputs]);

  const calcLinksForSummary = useMemo(() => {
    const { inputs, moderatePrice, moderateLoan } = summary;
    const priceForLinks = moderatePrice > 0 ? moderatePrice : WORKED_100K_ROW.moderatePrice;
    const loanForLinks =
      moderateLoan > 0
        ? moderateLoan
        : (WORKED_100K_DEFAULT_RESULT.details.moderateLoanAmount as number);
    return {
      affordability: buildAffordabilityCalculatorHref(inputs),
      mortgageCost: buildMortgageCostCalculatorHref(inputs, priceForLinks),
      dti: buildDtiCalculatorHref(inputs, priceForLinks, loanForLinks),
    };
  }, [summary]);

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

  const shortAnswer =
    firstRow.moderatePrice > 0 && lastRow.moderatePrice > 0
      ? `From about ${formatCurrency(firstRow.conservativePrice)}–${formatCurrency(firstRow.moderatePrice)} on ${formatSalaryLabel(firstRow.annualIncome)} to about ${formatCurrency(lastRow.conservativePrice)}–${formatCurrency(lastRow.moderatePrice)} on ${formatSalaryLabel(lastRow.annualIncome)}, using shared assumptions and Dett's affordability math — estimates only, not a loan offer.`
      : 'Use the table below and the affordability calculator for estimates at your income.';

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
        <Typography variant="overline" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
          The short answer
        </Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 700, my: 1 }}>
          It depends on debts, down payment, taxes, insurance, and the rate you are offered
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
          {shortAnswer}
        </Typography>
      </Paper>

      <p>
        A common shortcut is &quot;two to four times your salary.&quot; That range is a conversation starter, not a
        budget. Two households with the same income can support very different payments once car loans, student loans,
        credit-card minimums, local taxes, insurance, and the down payment are included.
      </p>
      <p>
        The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
          Consumer Financial Protection Bureau
        </a>{' '}
        defines debt-to-income ratio (DTI) as monthly debt payments divided by gross monthly income — one way lenders
        measure the ability to repay. This table uses the same three tiers as Dett&apos;s{' '}
        <Link href="/calculators/affordability">How Much House Can I Afford?</Link> calculator: conservative 28/36,
        mid-range 36% total debt, and top-of-guideline 43% at the high end.
      </p>

      <h2>Salary band estimates</h2>
      <p>
        Each row is computed with Dett&apos;s shared affordability formulas (including PMI when the down payment is
        under 20%), not hand-typed ranges. The mid-range column is the 36% total-debt guideline — a common planning
        anchor, not a promise of what a lender will offer.
      </p>

      <Alert severity="info" sx={{ my: 2, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Example rate:</strong> {HUB_SHARED_ASSUMPTIONS.rateLabel}. Dett&apos;s calculators still default to
          6.75% when you open them without a prefill — only this guide&apos;s table and prefill links use the
          illustrative PMMS average for consistency across salary bands.
        </Typography>
      </Alert>

      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Gross salary</th>
              <th>Conservative (28/36)</th>
              <th>Mid-range (36%)</th>
              <th>Full monthly housing cost</th>
              <th>Run your numbers</th>
            </tr>
          </thead>
          <tbody>
            {SALARY_BAND_ROWS.map((row) => (
              <tr key={row.annualIncome}>
                <td>{formatCurrency(row.annualIncome)}</td>
                <td>{row.conservativePrice > 0 ? formatCurrency(row.conservativePrice) : '—'}</td>
                <td>{row.moderatePrice > 0 ? formatCurrency(row.moderatePrice) : '—'}</td>
                <td>{row.moderatePayment > 0 ? `${formatCurrency(row.moderatePayment)}/mo` : '—'}</td>
                <td>
                  {row.annualIncome === 100_000 ? (
                    <>
                      <Link href="#100k">Worked $100K example</Link>
                      {' · '}
                      <Link href={row.calculatorHref}>Calculator</Link>
                    </>
                  ) : (
                    <Link href={row.calculatorHref}>Affordability calculator</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>

      <h3>Assumptions behind every row</h3>
      <ul>
        <li>
          <strong>Other monthly debts:</strong> {HUB_SHARED_ASSUMPTIONS.monthlyDebtsNote}
        </li>
        <li>
          <strong>Down payment:</strong> {HUB_SHARED_ASSUMPTIONS.downPaymentNote}
        </li>
        <li>
          <strong>Taxes &amp; insurance:</strong> {HUB_SHARED_ASSUMPTIONS.taxesInsurance}
        </li>
        <li>
          <strong>Loan term:</strong> {HUB_SHARED_ASSUMPTIONS.term}
        </li>
        <li>
          <strong>Illustrative rate:</strong> {HUB_PMMS_THIRTY_YEAR}% 30-year fixed (
          <a href="https://www.freddiemac.com/pmms">Freddie Mac PMMS</a>, week of November 12, 2026) — estimation only,
          not an APR or offer
        </li>
        <li>
          <strong>DTI guidelines:</strong> {HUB_SHARED_ASSUMPTIONS.dtiTiers}
        </li>
        <li>
          <strong>Credit-score band:</strong> {HUB_SHARED_ASSUMPTIONS.creditScore} (for PMI estimates on conventional
          loans)
        </li>
      </ul>

      <Box id="100k" component="section" sx={{ scrollMarginTop: 96 }}>
        <h2>$100,000 salary</h2>
        <p>
          A common shortcut is &quot;three to four times your salary,&quot; which would put a $100,000 income
          somewhere between $300,000 and $400,000. That range is a starting point, not a budget. Two households with
          the same salary can support very different payments once car loans, student loans, credit-card minimums, local
          property taxes, and the down payment are included.
        </p>
        <p>
          On a $100,000 salary with $400 a month in other debts, a $40,000 down payment, and an illustrative{' '}
          {HUB_PMMS_THIRTY_YEAR}% 30-year rate (Freddie Mac PMMS, week of November 12, 2026), Dett&apos;s affordability
          calculator estimates a conservative home price of about{' '}
          <strong>{formatCurrency(summary.conservativePrice)}</strong> and a mid-range price of about{' '}
          <strong>{formatCurrency(summary.moderatePrice)}</strong>. The mid-range payment is about{' '}
          <strong>{formatCurrency(summary.moderatePayment)} a month</strong> including taxes, insurance, and PMI.
          These are estimates, not a loan offer, a rate quote, or a decision on a loan.
        </p>

        <h3>A worked example you can change</h3>
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
            <strong>{HUB_PMMS_THIRTY_YEAR}%</strong> interest rate, the Freddie Mac{' '}
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

        <h4>Show me the mid-range math</h4>
        <p>{mathParagraph}</p>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ my: 2 }} flexWrap="wrap" useFlexGap>
          <Link href={calcLinksForSummary.affordability}>Pre-filled affordability calculator</Link>
          <span aria-hidden>·</span>
          <Link href={calcLinksForSummary.mortgageCost}>Pre-filled true monthly cost</Link>
          <span aria-hidden>·</span>
          <Link href={calcLinksForSummary.dti}>Pre-filled DTI calculator</Link>
        </Stack>

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

        <h3>What changes the answer</h3>
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
                <td>Starting example ($400 debts, $40k down, {HUB_PMMS_THIRTY_YEAR}%)</td>
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
                <td>Use 6.75% instead of {HUB_PMMS_THIRTY_YEAR}%</td>
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

        <h3>Why the highest number may not fit your budget</h3>
        <p>
          The top-of-guideline estimate in this example is about{' '}
          <strong>{formatCurrency(aggressiveFromSummary.aggressivePrice)}</strong>, with a full housing payment of about{' '}
          <strong>{formatCurrency(aggressiveFromSummary.aggressivePayment)}</strong>. That is 38% of gross income for
          housing alone, and 43% once the $400 in other debts is included. Some lenders will consider loans in that range;
          that does not make it a comfortable payment.
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
      </Box>

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
          <strong>Gross income is not take-home pay.</strong> Compare any payment to your actual monthly budget, not
          only to a DTI percentage. A payment that fits a guideline may still be tight after taxes, utilities,
          maintenance, and savings.
        </Typography>
      </Alert>

      <h2>Why the highest number may not fit your budget</h2>
      <p>
        The top-of-guideline tier in the calculator (43% total debt) can produce a higher price than the mid-range column
        in the table. That does not make it a comfortable payment.{' '}
        <a href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
          HUD has long treated housing costs above 30% of income as a cost burden
        </a>
        . If a payment would crowd out savings or repairs, it does not fit your budget even when it fits a guideline.
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
          (30-year fixed average {HUB_PMMS_THIRTY_YEAR}%)
        </li>
        <li>
          <a href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026">
            FHFA, 2026 conforming loan limits
          </a>{' '}
          (baseline $832,750 for a one-unit home in most counties)
        </li>
        <li>
          <a href="https://selling-guide.fanniemae.com/">Fannie Mae Selling Guide</a> (agency underwriting standards,
          including DTI considerations)
        </li>
        <li>
          <a href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
            HUD USER, &quot;Defining Housing Affordability&quot;
          </a>
        </li>
        <li>
          <Link href="/calculators/affordability">Dett affordability calculator</Link> and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 19, 2026. This page provides estimates for educational purposes only. Dett.io is not a
        lender, broker, or financial advisor. Actual rates, terms, payments, and eligibility are determined by lenders
        based on your complete financial profile, credit history, property, and market conditions.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}