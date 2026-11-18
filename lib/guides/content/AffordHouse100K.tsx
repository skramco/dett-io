'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatCurrency } from '@/lib/format';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { GuideAffordabilityWorkedExample } from '@/components/guides/GuideAffordabilityWorkedExample';
import {
  AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE,
  AFFORD_HOUSE_100K_RATE_AS_OF,
  AFFORD_HOUSE_100K_RATE_SOURCE,
  AFFORD_HOUSE_100K_SCENARIO,
  AFFORD_HOUSE_100K_VARIANTS,
  affordHouse100kBaseResult,
  buildAffordabilityGuideHref,
} from '@/lib/guides/scenarios/affordHouse100k';

const base = affordHouse100kBaseResult.details;
const moderatePrice = base.moderatePrice as number;
const conservativePrice = base.conservativePrice as number;
const aggressivePrice = base.aggressivePrice as number;
const moderatePayment = base.moderatePayment as number;
const conservativePayment = base.conservativePayment as number;
const aggressivePayment = base.aggressivePayment as number;
const monthlyIncome = base.monthlyIncome as number;
const moderateLoan = base.moderateLoanAmount as number;
const faqItems = [
  {
    question: 'How much house can I afford on a $100,000 salary?',
    answer: (
      <>
        It depends on your other monthly debts, down payment, local taxes and insurance, and the
        interest rate a lender actually offers you. In this worked example — $100,000 income, $400 a
        month in other debts, a $40,000 down payment, and an illustrative {AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE}%
        30-year rate — the mid-range estimate is about {formatCurrency(moderatePrice)} with a full
        monthly housing cost of about {formatCurrency(moderatePayment)}. A more conservative estimate is
        about {formatCurrency(conservativePrice)} with a {formatCurrency(conservativePayment)} payment.
        These are estimates, not a loan offer or a decision on a loan.
      </>
    ),
  },
  {
    question: 'Do car payments or student loans change how much house I can afford?',
    answer: null,
  },
  {
    question: 'Is the 28/36 rule a legal limit?',
    answer: (
      <>
        No. It is a long-used underwriting guideline, not a law. The{' '}
        <Link href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
          CFPB notes
        </Link>{' '}
        that different loan products and lenders will have different DTI limits. A payment that fits a
        guideline can still be tight once income taxes, utilities, maintenance, and savings are included.
      </>
    ),
  },
  {
    question: 'Should I buy at the top of the range a lender might consider?',
    answer: (
      <>
        Not automatically. In this example, the top-of-guideline price is about{' '}
        {formatCurrency(aggressivePrice)} with a full housing payment of about{' '}
        {formatCurrency(aggressivePayment)} — {base.aggressiveDTI}% of gross income for housing alone. If
        that payment would not leave room in your take-home pay for savings and repairs, it does not fit
        this budget. The conservative or mid-range estimate is the more cautious place to start.
      </>
    ),
  },
  {
    question: 'Does this estimate include property taxes, insurance, and PMI?',
    answer: (
      <>
        Yes. The full monthly housing cost includes principal and interest, property taxes, homeowners
        insurance, HOA dues if you enter them, and PMI when the down payment is under 20%. It does not
        include utilities, maintenance, furnishings, or income taxes. Actual taxes and insurance vary by
        property and location. For more on PMI, see the{' '}
        <Link href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
          CFPB&apos;s explanation
        </Link>
        .
      </>
    ),
  },
] as const;

/** Debt-free mid-range price for FAQ comparison copy. */
const debtFreeMid = AFFORD_HOUSE_100K_VARIANTS[1].result.details.moderatePrice as number;

export function AffordHouse100K() {
  const back36 = monthlyIncome * 0.36;
  const housingBudget = Math.max(0, back36 - AFFORD_HOUSE_100K_SCENARIO.monthlyDebts);
  const front28 = monthlyIncome * 0.28;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#EBF5FF',
          border: '1px solid #dbeafe',
          borderRadius: 2,
          p: { xs: 2.5, sm: 3 },
          mb: 3,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.04em' }}
        >
          The short answer
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{ fontWeight: 600, letterSpacing: '-0.02em', mt: 1, mb: 1 }}
        >
          About {formatCurrency(conservativePrice)}–{formatCurrency(moderatePrice)} in this example
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7, mb: 0 }}>
          On a $100,000 salary with $400 a month in other debts, a $40,000 down payment, and an
          illustrative {AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE}% 30-year rate, Dett&apos;s affordability
          calculator estimates a conservative home price of about{' '}
          <strong>{formatCurrency(conservativePrice)}</strong> and a mid-range price of about{' '}
          <strong>{formatCurrency(moderatePrice)}</strong>. The mid-range payment is about{' '}
          <strong>{formatCurrency(moderatePayment)} a month</strong> including taxes, insurance, and PMI.
          These are estimates, not a loan offer, a rate quote, or a decision on a loan.
        </Typography>
      </Paper>

      <p>
        A common shortcut is &ldquo;three to four times your salary,&rdquo; which would put a $100,000
        income somewhere between $300,000 and $400,000. That range is a starting point, not a budget. Two
        households with the same salary can support very different payments once car loans, student loans,
        credit-card minimums, local property taxes, and the down payment are included.
      </p>
      <p>
        The{' '}
        <Link href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
          Consumer Financial Protection Bureau
        </Link>{' '}
        explains debt-to-income ratio (DTI) as all monthly debt payments divided by gross monthly income —
        one way lenders measure the ability to repay. Different loan products and lenders use different DTI
        limits. This page uses the same three guideline tiers as Dett&apos;s{' '}
        <Link href={buildAffordabilityGuideHref()}>How Much House Can I Afford?</Link> calculator: a
        conservative 28/36 split, a mid-range 36% total-debt cap, and a 43% total-debt cap at the top of
        many guideline ranges.
      </p>

      <h2>A worked example you can change</h2>
      <p>
        The calculator below is pre-filled with a realistic first-time-buyer scenario, then uses Dett&apos;s
        published formulas — including PMI when the down payment is under 20%. Change any field and the
        prices update.
      </p>
      <ul>
        <li>
          <strong>$100,000</strong> gross annual income ({formatCurrency(monthlyIncome)} a month before
          taxes)
        </li>
        <li>
          <strong>$400 a month</strong> in other debts, such as a car payment or student loan
        </li>
        <li>
          <strong>$40,000</strong> down payment
        </li>
        <li>
          <strong>{AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE}%</strong> interest rate, the Freddie Mac{' '}
          <Link href={AFFORD_HOUSE_100K_RATE_SOURCE.url}>Primary Mortgage Market Survey</Link> average for
          30-year fixed loans as of {AFFORD_HOUSE_100K_RATE_AS_OF}. That is a national average used here for
          estimation only — not an APR, a quote, or an offer.
        </li>
        <li>
          <strong>30-year</strong> fixed, fully amortizing loan
        </li>
        <li>
          <strong>1.2%</strong> annual property tax and <strong>$1,800</strong> annual homeowners insurance
          (the affordability calculator&apos;s defaults; your local costs will differ)
        </li>
        <li>
          <strong>740</strong> credit-score band, the calculator&apos;s default for estimating conventional PMI
        </li>
      </ul>

      <GuideAffordabilityWorkedExample />

      <h3>Show me the mid-range math</h3>
      <p>
        With {formatCurrency(AFFORD_HOUSE_100K_SCENARIO.annualIncome)} of gross income, monthly income is{' '}
        {formatCurrency(monthlyIncome)}. A 36% total-debt cap is {formatCurrency(back36)}. Subtract{' '}
        {formatCurrency(AFFORD_HOUSE_100K_SCENARIO.monthlyDebts)} of other debts and the housing budget left is{' '}
        {formatCurrency(housingBudget)}. That {formatCurrency(housingBudget)} has to cover principal and
        interest, property tax, insurance, and PMI — not just the loan payment. In this example the mid-range
        price is {formatCurrency(moderatePrice)}: a {formatCurrency(moderateLoan)} loan at{' '}
        {AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE}% for {AFFORD_HOUSE_100K_SCENARIO.loanTerm} years, plus estimated
        taxes, insurance, and PMI, lands on a {formatCurrency(moderatePayment)} total payment. The conservative
        cap is tighter because it limits housing alone to 28% of gross income, or {formatCurrency(front28)},
        which supports about {formatCurrency(conservativePrice)}.
      </p>

      <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Gross income is not take-home pay.</strong> The leftover amounts shown after housing are
          calculated from pre-tax income. Federal and state taxes, retirement contributions, utilities, food,
          transportation, and savings all still have to come out of what&apos;s left. Compare any payment to your
          actual monthly budget, not only to a DTI percentage.
        </Typography>
      </Alert>

      <h2>What changes the answer</h2>
      <p>
        In this same $100,000 income example, small changes move the mid-range price by tens of thousands of
        dollars:
      </p>
      <Box sx={{ overflowX: 'auto', mb: 3 }}>
        <Box component="table" sx={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th>If you change this</th>
              <th>Mid-range price</th>
              <th>Full monthly housing cost</th>
            </tr>
          </thead>
          <tbody>
            {AFFORD_HOUSE_100K_VARIANTS.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{formatCurrency(row.result.details.moderatePrice as number)}</td>
                <td>{formatCurrency(row.result.details.moderatePayment as number)}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
      <p>
        Other debts are often the binding constraint. In the starting example, the 36% total-debt rule caps
        housing at {formatCurrency(moderatePayment)} a month instead of {formatCurrency(back36)}. Paying down
        those debts raises the housing budget dollar for dollar. A larger down payment can also remove{' '}
        <Link href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
          private mortgage insurance
        </Link>
        , which the CFPB notes is typically required on a conventional loan with less than 20% down.
      </p>
      <p>
        Local taxes and insurance matter as much as the rate. A buyer in a high-tax county will support a lower
        price at the same payment than a buyer in a low-tax county. Enter your own estimates above, or use
        Dett&apos;s{' '}
        <Link href="/calculators/mortgage-cost">true monthly cost calculator</Link> once you have a specific
        property in mind.
      </p>

      <h2>Why the highest number may not fit your budget</h2>
      <p>
        The top-of-guideline estimate in this example is about <strong>{formatCurrency(aggressivePrice)}</strong>,
        with a full housing payment of about <strong>{formatCurrency(aggressivePayment)}</strong>. That is{' '}
        {base.aggressiveDTI}% of gross income for housing alone, and {base.aggressiveBackEndDTI}% once the $400
        in other debts is included. Some lenders will consider loans in that range; that does not make it a
        comfortable payment.
      </p>
      <p>
        <Link href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
          HUD has long treated housing costs above 30% of income as a cost burden
        </Link>
        , and costs above 50% as a severe cost burden. The mid-range payment in this example is about{' '}
        {base.moderateDTI}% of gross income — already near that line — and it still does not include utilities
        or maintenance. If the higher payment would crowd out savings or leave no room for repairs, it does not
        fit this budget, even if it fits a guideline.
      </p>
      <p>
        For 2026, the{' '}
        <Link href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026">
          FHFA conforming loan limit
        </Link>{' '}
        for a one-unit home is $832,750 in most counties, and up to $1,249,125 in high-cost areas. All three
        prices in this $100,000 example stay well below that baseline, so jumbo-loan limits are not the
        constraint here. Income, debts, and the payment are.
      </p>

      <h2>Frequently asked questions</h2>
      <Box>
        {faqItems.map((item, index) => (
          <Accordion
            key={item.question}
            disableGutters
            elevation={0}
            defaultExpanded={index === 0}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0 }}>
              <Typography variant="body1" color="text.secondary" component="div">
                {item.question === 'Do car payments or student loans change how much house I can afford?' ? (
                  <>
                    Yes. Lenders look at back-end DTI: housing costs plus other monthly debt payments, divided by
                    gross monthly income. In this example, $400 a month in other debts caps the mid-range housing
                    payment at {formatCurrency(moderatePayment)} instead of {formatCurrency(back36)}, which lowers
                    the mid-range home price from about {formatCurrency(debtFreeMid)} to about{' '}
                    {formatCurrency(moderatePrice)}. Rent and utilities usually are not counted as debts in that
                    ratio, but they still have to be paid from your budget.
                  </>
                ) : (
                  item.answer
                )}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <h2>Sources</h2>
      <ul className="sources">
        <li>
          <Link href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
            CFPB, &ldquo;What is a debt-to-income ratio?&rdquo;
          </Link>
        </li>
        <li>
          <Link href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
            CFPB, &ldquo;What is private mortgage insurance?&rdquo;
          </Link>
        </li>
        <li>
          <Link href="https://www.consumerfinance.gov/owning-a-home/">CFPB, Owning a Home tools</Link>
        </li>
        <li>
          <Link href="https://www.freddiemac.com/pmms">
            Freddie Mac Primary Mortgage Market Survey, {AFFORD_HOUSE_100K_RATE_AS_OF}
          </Link>{' '}
          (30-year fixed average {AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE}%)
        </li>
        <li>
          <Link href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026">
            FHFA, 2026 conforming loan limits
          </Link>{' '}
          (baseline $832,750 for a one-unit home in most counties)
        </li>
        <li>
          <Link href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
            HUD USER, &ldquo;Defining Housing Affordability&rdquo;
          </Link>{' '}
          (cost-burden threshold of 30% of income)
        </li>
        <li>
          <Link href={buildAffordabilityGuideHref()}>Dett affordability calculator</Link> and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, lineHeight: 1.7 }}>
        Last reviewed November 17, 2026. This page provides estimates for educational purposes only. Dett.io is
        not a lender, broker, or financial advisor. Actual rates, terms, payments, and eligibility are determined
        by lenders based on your complete financial profile, credit history, property, and market conditions.
      </Typography>

      <Box sx={{ mt: 5 }}>
        <ClozableBlurb placement="calculator" calculatorSlug="afford-house-100k-salary" />
      </Box>
    </>
  );
}