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
import { calculatePayoff } from '@/lib/calculators/payoff';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import { DEFAULT_RATES } from '@/lib/rates/defaultRates';

const SLUG = 'debt-avalanche-vs-snowball';

const AVALANCHE_EXTRA = 400;
const SNOWBALL_EXTRA = 400;

// Illustrate impact of disciplined extra payments using one mortgage as a proxy for "any debt"
const avalancheProxy = calculatePayoff({
  loanAmount: 24_000,
  interestRate: 22,
  loanTerm: 5,
  extraMonthlyPayment: AVALANCHE_EXTRA,
  extraAnnualPayment: 0,
  lumpSumAmount: 0,
  lumpSumYear: 0,
  biweeklyFee: 400,
  investmentReturn: 0,
});

const snowballProxy = calculatePayoff({
  loanAmount: 4_500,
  interestRate: 18,
  loanTerm: 3,
  extraMonthlyPayment: SNOWBALL_EXTRA,
  extraAnnualPayment: 0,
  lumpSumAmount: 0,
  lumpSumYear: 0,
  biweeklyFee: 400,
  investmentReturn: 0,
});

const mortgageExtra = calculatePayoff({
  loanAmount: 200_000,
  interestRate: DEFAULT_RATES.thirtyYearFixed,
  loanTerm: 30,
  extraMonthlyPayment: 200,
  extraAnnualPayment: 0,
  lumpSumAmount: 0,
  lumpSumYear: 0,
  biweeklyFee: 400,
  investmentReturn: 7,
});

function calcHref(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/calculators/payoff?${search.toString()}`;
}

const MORTGAGE_EXTRA_PREFILL = calcHref({
  loanAmount: 200_000,
  interestRate: DEFAULT_RATES.thirtyYearFixed,
  loanTerm: 30,
  extraMonthlyPayment: 200,
});

const HIGH_RATE_PREFILL = calcHref({
  loanAmount: 24_000,
  interestRate: 22,
  loanTerm: 5,
  extraMonthlyPayment: AVALANCHE_EXTRA,
});

const faqs = guideFaqs[SLUG] ?? [];

export function DebtAvalancheVsSnowball() {
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
          Avalanche saves the most interest by attacking the highest APR first; snowball builds momentum by clearing the
          smallest balances first — pick the one you will stick with
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Both methods require the same total monthly budget: minimums on every account, plus one focused extra payment.
          The CFPB&apos;s debt collection and repayment resources emphasize paying on time and paying more than the minimum
          when you can.
        </Typography>
      </Paper>

      <p>
        These are behavioral strategies for multiple debts — credit cards, personal loans, or even a mortgage you are
        accelerating. Dett does not yet model a multi-card ledger; use the{' '}
        <Link href="/calculators/payoff">Pay Off Faster calculator</Link> to see how a fixed extra payment shortens a
        single loan, then apply that same monthly discipline to whichever account your strategy targets first.
      </p>

      <h2>How avalanche works</h2>
      <ol>
        <li>Pay minimums on all debts.</li>
        <li>Send every extra dollar to the balance with the highest APR.</li>
        <li>When that debt is gone, roll its payment to the next highest APR.</li>
      </ol>
      <p>
        Mathematically, avalanche minimizes interest because you starve the most expensive balance first. The{' '}
        <a href="https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act-text">
          FTC&apos;s consumer credit rules
        </a>{' '}
        do not prescribe an order, but disclosures on your statements show APRs so you can rank debts honestly.
      </p>

      <h2>How snowball works</h2>
      <ol>
        <li>Pay minimums on all debts.</li>
        <li>Attack the smallest balance first, regardless of rate.</li>
        <li>When it is paid off, roll that payment to the next smallest balance.</li>
      </ol>
      <p>
        Snowball trades a small amount of extra interest for quick wins. Research on habit formation suggests visible
        progress helps some households stay consistent — the right method is the one that keeps extra dollars flowing
        month after month.
      </p>

      <h2>Worked example: $400/month extra on a high-rate balance</h2>
      <p>
        Pretend a {formatCurrency(24_000)} revolving balance sits at 22% APR (an example card rate you might see on a
        statement — not a national average).{' '}
        <Link href={HIGH_RATE_PREFILL}>This payoff preset</Link> adds {formatCurrency(AVALANCHE_EXTRA)}/month on top of the
        scheduled payment.
      </p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>With $400/mo extra</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Interest saved vs minimum path</td>
              <td>{formatCurrency(avalancheProxy.details.interestSaved as number)}</td>
            </tr>
            <tr>
              <td>Time saved</td>
              <td>{(avalancheProxy.details.yearsSaved as number).toFixed(1)} years</td>
            </tr>
          </tbody>
        </Box>
      </Box>
      <p>
        In a multi-debt avalanche, you would aim that {formatCurrency(AVALANCHE_EXTRA)} at the 22% card while paying minimums
        elsewhere until the card hits zero.
      </p>

      <h2>Worked example: snowball on a smaller $4,500 balance first</h2>
      <p>
        If a {formatCurrency(4_500)} store card at 18% is your smallest balance, snowball sends the same{' '}
        {formatCurrency(SNOWBALL_EXTRA)} extra there first even though a larger card might carry a higher APR. The proxy
        payoff shows about {(snowballProxy.details.yearsSaved as number).toFixed(1)} years saved and{' '}
        {formatCurrency(snowballProxy.details.interestSaved as number)} interest saved on that one account — then you
        redirect the freed payment to the next smallest balance.
      </p>

      <h2>Mortgage extra payments use the same discipline</h2>
      <p>
        Homeowners comparing strategies can still practice the habit on a low-rate mortgage:{' '}
        <Link href={MORTGAGE_EXTRA_PREFILL}>$200/month extra</Link> on a {formatCurrency(200_000)} loan at{' '}
        {DEFAULT_RATES.thirtyYearFixed}% saves{' '}
        {formatCurrency(mortgageExtra.details.interestSaved as number)} and {(mortgageExtra.details.yearsSaved as number).toFixed(1)}{' '}
        years in the calculator. That is not avalanche vs snowball — it is proof that a steady surplus matters more than
        brand name.
      </p>

      <h2>Who each method fits</h2>
      <ul>
        <li>
          <strong>Avalanche:</strong> you are motivated by math, have several high-APR cards, and will not quit when the
          first balance is large.
        </li>
        <li>
          <strong>Snowball:</strong> you need early payoffs to stay engaged, or your smallest balances have painful
          minimums relative to their size.
        </li>
        <li>
          <strong>Hybrid:</strong> knock out one tiny balance for momentum, then avalanche the rest — common and fine if
          the budget still fits.
        </li>
      </ul>

      <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
        Neither method helps if the total payment does not fit your income. If minimums alone strain your budget, contact
        creditors or a nonprofit credit counselor listed with the{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-credit-counseling-en-1455/">CFPB</a> before borrowing to
        make minimums.
      </Alert>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-credit-counseling-en-1455/">
            CFPB, credit counseling overview
          </a>
        </li>
        <li>
          <a href="https://www.ftc.gov/legal-library/browse/rules/truth-lending-act-regulation-z">
            FTC / Regulation Z (APR disclosures)
          </a>
        </li>
        <li>
          <Link href="/calculators/payoff">Dett Pay Off Faster calculator</Link>
        </li>
        <li>
          <Link href="/compare/biweekly-vs-extra-payments">Biweekly vs extra payments comparison</Link>
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
        Last reviewed November 19, 2026. Educational estimates only.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}