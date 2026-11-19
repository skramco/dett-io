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

const SLUG = 'pay-extra-mortgage-or-invest';

const EXAMPLE_LOAN = 360_000;
const EXAMPLE_RATE = DEFAULT_RATES.thirtyYearFixed;
const EXAMPLE_TERM = 30;
const EXAMPLE_EXTRA = 300;
const EXAMPLE_INVEST_RETURN = 7;

const payoffResult = calculatePayoff({
  loanAmount: EXAMPLE_LOAN,
  interestRate: EXAMPLE_RATE,
  loanTerm: EXAMPLE_TERM,
  extraMonthlyPayment: EXAMPLE_EXTRA,
  extraAnnualPayment: 0,
  lumpSumAmount: 0,
  lumpSumYear: 0,
  biweeklyFee: 400,
  investmentReturn: EXAMPLE_INVEST_RETURN,
});

function calcHref(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/calculators/payoff?${search.toString()}`;
}

const EX_PREFILL = calcHref({
  loanAmount: EXAMPLE_LOAN,
  interestRate: EXAMPLE_RATE,
  loanTerm: EXAMPLE_TERM,
  extraMonthlyPayment: EXAMPLE_EXTRA,
  investmentReturn: EXAMPLE_INVEST_RETURN,
});

const LUMP_SUM_PREFILL = calcHref({
  loanAmount: EXAMPLE_LOAN,
  interestRate: EXAMPLE_RATE,
  loanTerm: EXAMPLE_TERM,
  lumpSumAmount: 10_000,
  lumpSumYear: 3,
  investmentReturn: EXAMPLE_INVEST_RETURN,
});

const faqs = guideFaqs[SLUG] ?? [];

export function PayExtraMortgageOrInvest() {
  const investAhead = (payoffResult.details.netWorthDifference as number) > 0;
  const prepayPortfolio = payoffResult.details.prepayPortfolio as number;
  const investPortfolio = payoffResult.details.investPortfolio as number;
  const netDiff = Math.abs(payoffResult.details.netWorthDifference as number);

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
          Prepay when the guaranteed return from your mortgage rate beats what you can earn after tax and risk — otherwise
          invest, but only if you will actually invest the cash every month
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Extra principal on a {EXAMPLE_RATE}% mortgage is a guaranteed &quot;return&quot; equal to that rate (minus any
          mortgage interest deduction you might claim). Investing targets higher long-run returns but comes with volatility
          and taxes. Dett&apos;s{' '}
          <Link href="/calculators/payoff">Pay Off Faster calculator</Link> compares prepay vs invest under identical cash
          outflow over {EXAMPLE_TERM} years — not a promise of future market performance.
        </Typography>
      </Paper>

      <p>
        The right choice is not ideological. It depends on your mortgage rate, tax situation, emergency fund, other debt
        costs, and whether you will stick with an investment plan or silently spend the &quot;extra&quot; payment. The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-mortgage-amortization-schedule-en-1955/">
          CFPB
        </a>{' '}
        explains that early payments are mostly interest; extra principal attacks the balance directly and shortens the
        schedule.
      </p>

      <h2>Worked example: $300/month extra on a $360,000 loan</h2>
      <p>
        Assumptions match{' '}
        <Link href={EX_PREFILL}>this prefilled payoff scenario</Link>: {formatCurrency(EXAMPLE_LOAN)} balance,{' '}
        {EXAMPLE_RATE}% fixed for {EXAMPLE_TERM} years (Dett&apos;s default rate is the Freddie Mac PMMS 30-year figure from
        the week of October 15, 2026 — illustrative, not a live quote), {formatCurrency(EXAMPLE_EXTRA)}/month extra, and a{' '}
        {EXAMPLE_INVEST_RETURN}% assumed long-term investment return for the invest path only.
      </p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Prepay the extra $300</th>
              <th>Invest the extra $300</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Interest saved vs no extras</td>
              <td colSpan={2}>{formatCurrency(payoffResult.details.interestSaved as number)}</td>
            </tr>
            <tr>
              <td>Years shaved off loan</td>
              <td colSpan={2}>{(payoffResult.details.yearsSaved as number).toFixed(1)} years</td>
            </tr>
            <tr>
              <td>Portfolio at year {EXAMPLE_TERM} (same total cash out)</td>
              <td>{formatCurrency(prepayPortfolio)}</td>
              <td>{formatCurrency(investPortfolio)}</td>
            </tr>
          </tbody>
        </Box>
      </Box>
      <p>
        In this illustration, investing the extra at {EXAMPLE_INVEST_RETURN}% ends about {formatCurrency(netDiff)}{' '}
        {investAhead ? 'ahead of' : 'behind'} prepaying at year {EXAMPLE_TERM}, because {EXAMPLE_INVEST_RETURN}% is above
        the {EXAMPLE_RATE}% mortgage rate. If your rate were higher than your realistic after-tax investment return,
        prepaying would lead — the calculator flips the result when you change inputs.
      </p>

      <h2>Worked example: $10,000 lump sum in year 3</h2>
      <p>
        Windfalls create the same tradeoff.{' '}
        <Link href={LUMP_SUM_PREFILL}>Open the lump-sum scenario</Link> to compare applying {formatCurrency(10_000)} in
        year 3 vs investing it instead. The <a href="https://www.federalreserve.gov/releases/h15/">Federal Reserve</a>{' '}
        publishes benchmark yields if you want a conservative comparison rate for cash or short-term bonds rather than
        equities.
      </p>

      <h2>When prepaying tends to fit</h2>
      <ul>
        <li>
          <strong>Higher-cost debt is gone.</strong> The{' '}
          <a href="https://www.ftc.gov/legal-library/browse/rules/truth-lending-act-regulation-z">
            FTC&apos;s Regulation Z
          </a>{' '}
          disclosure regime applies to many consumer loans; revolving card APRs often sit well above mortgage rates. Pay
          those down before accelerating a low-rate mortgage.
        </li>
        <li>
          <strong>You want a guaranteed return.</strong> Prepaying earns your note rate with no market risk (you still lose
          liquidity).
        </li>
        <li>
          <strong>You are near retirement</strong> and want fewer required payments, not more market exposure.
        </li>
        <li>
          <strong>Private mortgage insurance still applies.</strong> Reaching 20% equity faster can remove PMI; see our{' '}
          <Link href="/guides/how-much-is-pmi">PMI guide</Link> for how that interacts with payments that fit your budget.
        </li>
      </ul>

      <h2>When investing the extra tends to fit</h2>
      <ul>
        <li>
          <strong>Emergency fund is fully funded</strong> (often cited as 3–6 months of expenses by planners; adjust to
          your job stability and fixed costs).
        </li>
        <li>
          <strong>Employer retirement match is unclaimed.</strong> The{' '}
          <a href="https://www.irs.gov/retirement-plans">IRS</a> sets annual 401(k) and IRA contribution limits; a match is
          often cited as an immediate return that prepaying cannot replicate.
        </li>
        <li>
          <strong>Your mortgage rate is below long-run expected returns</strong> and you can tolerate downturns without
          skipping the mortgage.
        </li>
        <li>
          <strong>You will automate investments.</strong> The payoff calculator&apos;s invest path assumes every dollar
          not sent to the loan is actually invested at the stated return — behavior matters as much as math.
        </li>
      </ul>

      <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
        Investment returns in the calculator are a user-editable assumption, not historical performance or a forecast.
        Past performance does not predict future results. Tax treatment of mortgage interest and investment gains varies;
        the calculator does not model taxes.
      </Alert>

      <h2>How to run your numbers</h2>
      <ol>
        <li>
          Enter your loan balance, rate, and term in the{' '}
          <Link href="/calculators/payoff">Pay Off Faster calculator</Link>.
        </li>
        <li>Add monthly extras, annual extras, or a lump sum — or set extras to zero and use only the invest comparison.</li>
        <li>Adjust the investment return to something conservative (after tax, if you want a margin of safety).</li>
        <li>Read the portfolio comparison at the end of the original loan term — that is the fair apples-to-apples view.</li>
      </ol>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-mortgage-amortization-schedule-en-1955/">
            Consumer Financial Protection Bureau, mortgage amortization overview
          </a>
        </li>
        <li>
          <a href="https://www.freddiemac.com/pmms">Freddie Mac Primary Mortgage Market Survey</a> (example rate context)
        </li>
        <li>
          <a href="https://www.federalreserve.gov/releases/h15/">Federal Reserve H.15 selected interest rates</a>
        </li>
        <li>
          <a href="https://www.irs.gov/retirement-plans">IRS retirement plan guidance</a>
        </li>
        <li>
          <Link href="/calculators/payoff">Dett Pay Off Faster calculator</Link> and{' '}
          <Link href="/methodology">methodology</Link>
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
        Last reviewed November 19, 2026. Educational estimates only. Dett.io is not a lender, broker, tax advisor, or
        investment adviser.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}