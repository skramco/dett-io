'use client';

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
import { calculateCashOutRefi } from '@/lib/calculators/cashOutRefi';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import { DEFAULT_RATES } from '@/lib/rates/defaultRates';

const SLUG = 'cash-out-refinance-pay-credit-card-debt';

const SCENARIO = {
  currentBalance: 280_000,
  currentRate: 4.5,
  yearsRemaining: 25,
  homeValue: 500_000,
  cashOutAmount: 25_000,
  newRate: DEFAULT_RATES.thirtyYearFixed,
  newTerm: 30,
  closingCosts: 8_000,
  alternativeRate: 22,
};

const result = calculateCashOutRefi(SCENARIO);

function calcHref(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/calculators/cash-out-refi?${search.toString()}`;
}

const EX_PREFILL = calcHref(SCENARIO);

const LOWER_DEBT_PREFILL = calcHref({ ...SCENARIO, cashOutAmount: 15_000 });

const faqs = guideFaqs[SLUG] ?? [];

export function CashOutRefinancePayCreditCardDebt() {
  const paymentIncrease =
    (result.details.newPayment as number) - (result.details.currentPayment as number);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 4,
          borderRadius: 3,
          bgcolor: '#F0FDF4',
          border: '1px solid #bbf7d0',
        }}
      >
        <Typography variant="overline" sx={{ fontWeight: 700, color: '#15803D', letterSpacing: 1 }}>
          The short answer
        </Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 700, my: 1 }}>
          A cash-out refinance can lower card payments, but it stretches unsecured debt across decades, puts your home on
          the line, and only works if you stop adding new card balances
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The tradeoff is not just rate — it is payment shock, closing costs, and behavior. Compare the new mortgage
          payment to your budget before you choose any path; a lower rate does not help if the combined housing payment no
          longer fits your income.
        </Typography>
      </Paper>

      <p>
        Credit card debt is unsecured: a lender cannot take your home if you default (though collections and credit damage
        still apply). A cash-out refinance is secured by your home. The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-cash-out-refinance-en-1957/">
          CFPB
        </a>{' '}
        describes cash-out refinances as replacing your mortgage with a larger loan and giving you the difference in cash
        at closing — often used for debt consolidation, with different risks than a personal loan or balance transfer.
      </p>

      <h2>Worked example: $25,000 cash out to clear cards</h2>
      <p>
        This matches{' '}
        <Link href={EX_PREFILL}>this prefilled cash-out scenario</Link>: {formatCurrency(SCENARIO.currentBalance)}{' '}
        remaining on a {SCENARIO.currentRate}% loan with {SCENARIO.yearsRemaining} years left, home value{' '}
        {formatCurrency(SCENARIO.homeValue)}, cash out {formatCurrency(SCENARIO.cashOutAmount)}, new{' '}
        {SCENARIO.newRate}% fixed for {SCENARIO.newTerm} years (Dett default = Freddie Mac PMMS week of October 15, 2026,
        illustrative), closing costs {formatCurrency(SCENARIO.closingCosts)}, and card APR modeled at{' '}
        {SCENARIO.alternativeRate}% in the calculator&apos;s alternative-rate field.
      </p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Example result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Current P&I payment</td>
              <td>{formatCurrency(result.details.currentPayment as number)}/mo</td>
            </tr>
            <tr>
              <td>New P&I payment</td>
              <td>{formatCurrency(result.details.newPayment as number)}/mo</td>
            </tr>
            <tr>
              <td>Payment increase</td>
              <td>+{formatCurrency(paymentIncrease)}/mo</td>
            </tr>
            <tr>
              <td>Added interest cost for the cash (vs keeping current loan)</td>
              <td>{formatCurrency(result.details.totalInterestIncrease as number)} over the life shown</td>
            </tr>
            <tr>
              <td>New loan-to-value</td>
              <td>{result.details.newLTV}%</td>
            </tr>
          </tbody>
        </Box>
      </Box>
      <p>
        Paying roughly {formatCurrency(paymentIncrease)} more per month for {SCENARIO.newTerm} years is the real cost of
        swapping card bills for mortgage principal — even though the nominal mortgage rate is far below a{' '}
        {SCENARIO.alternativeRate}% card APR. The{' '}
        <a href="https://www.ftc.gov/legal-library/browse/rules/truth-lending-act-regulation-z">
          Truth in Lending rules
        </a>{' '}
        require lenders to disclose mortgage costs on forms such as the Loan Estimate and Closing Disclosure; closing costs
        here are entered as {formatCurrency(SCENARIO.closingCosts)} in the example.
      </p>

      <h2>Worked example: smaller $15,000 cash out</h2>
      <p>
        If your cards total less, try{' '}
        <Link href={LOWER_DEBT_PREFILL}>the $15,000 cash-out preset</Link>. Smaller cash-outs reduce payment shock and LTV,
        but still extend unsecured debt over the mortgage term unless you prepay the mortgage after consolidating.
      </p>

      <h2>Closing costs and rate reset</h2>
      <ul>
        <li>
          <strong>Closing costs:</strong> appraisal, title, lender fees, and prepaid items add thousands upfront. The
          calculator finances closing costs into the new loan when you model it that way — cash at closing lowers the new
          balance.
        </li>
        <li>
          <strong>Rate reset:</strong> many homeowners today hold mortgages below current market rates. Trading a{' '}
          {SCENARIO.currentRate}% loan for a {SCENARIO.newRate}% loan to access cash can raise your base payment even before
          the cash-out portion.
        </li>
        <li>
          <strong>Term extension:</strong> resetting to {SCENARIO.newTerm} years can add years of payments compared with your
          remaining {SCENARIO.yearsRemaining}-year schedule.
        </li>
      </ul>

      <h2>Secured vs unsecured debt</h2>
      <p>
        After a cash-out refinance, missed mortgage payments can lead to foreclosure. Card issuers cannot foreclose, though
        default still hurts credit and may trigger lawsuits or settlement. The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-secured-debt-and-an-unsecured-debt-en-1989/">
          CFPB&apos;s secured vs unsecured overview
        </a>{' '}
        is a useful primer before you move card balances onto your home.
      </p>

      <h2>The &quot;run the cards back up&quot; risk</h2>
      <p>
        Consolidation only works if total spending stays within your budget. Research on households that consolidate
        without changing habits often shows new card balances appearing within a year. Treat a cash-out refi as one-time
        surgery, not a recurring strategy: build a written budget, remove saved card numbers from checkout sites, and keep
        an emergency fund so future shocks do not land back on plastic.
      </p>

      <h2>Who tends to fit — and who should look elsewhere</h2>
      <ul>
        <li>
          <strong>May fit:</strong> stable income, equity cushion, mortgage payment after refi still fits lender-style DTI
          guidelines and your own budget, and you will not re-borrow on cards.
        </li>
        <li>
          <strong>Often a poor fit:</strong> thin emergency fund, job uncertainty, housing payment already at the top of
          your comfort range, or a history of re-running card balances after payoff.
        </li>
        <li>
          <strong>Alternatives to model:</strong> avalanche or snowball payoff (see our{' '}
          <Link href="/guides/debt-avalanche-vs-snowball">debt payoff guide</Link>), a fixed-payment personal loan, or a
          promotional balance transfer — each keeps the home out of the equation.
        </li>
      </ul>

      <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
        This is not a recommendation to borrow. Lenders evaluate income, credit, equity, and property condition; a
        scenario that looks good on a calculator may not fit your file or local programs.
      </Alert>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-cash-out-refinance-en-1957/">
            CFPB, cash-out refinance overview
          </a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-secured-debt-and-an-unsecured-debt-en-1989/">
            CFPB, secured vs unsecured debt
          </a>
        </li>
        <li>
          <a href="https://www.freddiemac.com/pmms">Freddie Mac PMMS</a> (example mortgage rate context)
        </li>
        <li>
          <Link href="/calculators/cash-out-refi">Dett Cash-Out Refinance calculator</Link>
        </li>
      </ul>

      <h2>FAQs</h2>
      <Stack spacing={1}>
        {faqs.map((faq) => (
          <Accordion key={faq.question} disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight={600}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 19, 2026. Educational estimates only. Dett.io is not a lender or financial advisor.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}