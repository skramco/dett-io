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
import { calculateRefinance } from '@/lib/calculators/refinance';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import { calcHref } from '@/lib/guides/calcHref';

const SLUG = 'should-i-refinance';

const REFI_EXAMPLE = calculateRefinance({
  currentBalance: 300_000,
  currentRate: 7.0,
  currentMonthlyPayment: 1995,
  yearsRemaining: 28,
  newRate: 6.75,
  newTerm: 30,
  closingCosts: 5_000,
});

const rd = REFI_EXAMPLE.details;
const REFI_CALC_HREF = calcHref('refinance', {
  currentBalance: 300_000,
  currentRate: 7.0,
  currentMonthlyPayment: 1995,
  yearsRemaining: 28,
  newRate: 6.75,
  newTerm: 30,
  closingCosts: 5_000,
});

const faqs = guideFaqs[SLUG] ?? [];

export function ShouldIRefinance() {
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
          Compare monthly savings, closing costs, and how long you will keep the loan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Refinancing is a break-even problem: upfront closing costs divided by monthly payment savings tells you how
          many months you need to stay before the refi &quot;pays for itself.&quot; If you sell or refinance again before
          that point, you may not recover the costs — even when the new rate is lower.
        </Typography>
      </Paper>

      <h2>What refinancing changes</h2>
      <p>
        A rate-and-term refinance replaces your current mortgage with a new one: new rate, new term (often 30 years
        again), and new closing costs. The{' '}
        <a href="https://www.consumerfinance.gov/owning-a-home/refinance/">
          CFPB&apos;s refinance overview
        </a>{' '}
        walks through Loan Estimate and Closing Disclosure comparisons — the same documents you used at purchase.
      </p>
      <p>
        Refinancing is not the same as a cash-out refinance (pulling equity) or a recast (lump sum to principal with the
        same loan). This guide focuses on lowering your rate or changing your term when you are not taking cash out.
      </p>

      <h2 id="break-even">Refinance break-even on a small rate drop</h2>
      <p>
        Lenders sometimes advertise a &quot;no-brainer&quot; refi after a quarter-point rate move. The math is still:
      </p>
      <Box
        component="p"
        sx={{
          fontFamily: 'monospace',
          bgcolor: 'grey.100',
          p: 2,
          borderRadius: 2,
          fontSize: '1rem',
        }}
      >
        Break-even months ≈ closing costs ÷ monthly savings
      </Box>
      <p>
        <strong>Monthly savings</strong> here means principal and interest only — the same payment slice your
        refinance calculator should compare. Taxes and insurance usually ride along unchanged.
      </p>
      <p>
        <strong>How long you plan to stay</strong> (or keep this loan) must exceed break-even months for the refi to
        recover closing costs on cash flow alone. Also compare <em>total</em> cost over your actual time horizon: a new
        30-year loan can lower your payment but restart the amortization clock.
      </p>

      <h3>Worked example: 7.0% → 6.75% on a small balance</h3>
      <p>
        Open the{' '}
        <Link href={REFI_CALC_HREF}>pre-filled refinance calculator</Link>. Dett uses 6.75% as an illustrative new rate
        (calculator default, not an offer):
      </p>
      <Box component="table">
        <thead>
          <tr>
            <th>Input</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Current balance</td>
            <td>{formatCurrency(300_000)}</td>
          </tr>
          <tr>
            <td>Current rate / years left</td>
            <td>7.0% / 28 years</td>
          </tr>
          <tr>
            <td>New rate / new term</td>
            <td>6.75% / 30 years</td>
          </tr>
          <tr>
            <td>Closing costs (not rolled in)</td>
            <td>{formatCurrency(5_000)}</td>
          </tr>
          <tr>
            <td>Current P&amp;I (computed)</td>
            <td>{formatCurrency(rd.impliedCurrentPayment as number)}</td>
          </tr>
          <tr>
            <td>New P&amp;I</td>
            <td>{formatCurrency(rd.newMonthlyPayment as number)}</td>
          </tr>
          <tr>
            <td>Monthly savings</td>
            <td>{formatCurrency(rd.monthlySavings as number)}</td>
          </tr>
          <tr>
            <td>
              <strong>Break-even</strong>
            </td>
            <td>
              <strong>{rd.breakEvenMonths as number} months (~{(rd.breakEvenYears as number).toFixed(1)} years)</strong>
            </td>
          </tr>
        </tbody>
      </Box>
      <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          In this example, monthly savings are only about {formatCurrency(rd.monthlySavings as number)}, so{' '}
          {formatCurrency(5_000)} of closing costs take roughly {rd.breakEvenMonths as number} months to recover. Dett
          also flags that lifetime cash cost can rise when the new loan resets to 30 years (
          {formatCurrency(Math.abs(rd.totalSavings as number))} more total payments in this run). A lower rate does not
          always mean lower <em>total</em> cost — especially with a small drop and a fresh 30-year term.
        </Typography>
      </Alert>
      <p>
        Rule of thumb for readiness: if your planned tenure in the home (and on this loan) is shorter than break-even,
        lean toward keeping the current loan unless you have a non-cash-flow reason (for example, removing PMI or fixing
        an ARM reset). See{' '}
        <Link href={calcHref('interest-sensitivity', { loanAmount: 300_000, baseRate: 6.75, loanTerm: 30 })}>
          rate sensitivity
        </Link>{' '}
        for how a 0.25% move changes the payment.
      </p>

      <h2>When a refinance often makes sense</h2>
      <ul>
        <li>
          <strong>Large enough savings</strong> relative to costs, and you will keep the loan past break-even.
        </li>
        <li>
          <strong>Removing PMI</strong> after appreciation brings you to 80% LTV on a new appraisal — if the combined
          payment still fits your budget.
        </li>
        <li>
          <strong>ARM reset risk</strong> — moving to a fixed rate before adjustments, if the new payment fits.
        </li>
        <li>
          <strong>Shortening the term</strong> — higher payment, less interest; only worthwhile if the payment still fits
          income and other debts.
        </li>
      </ul>

      <h2>When to pause</h2>
      <ul>
        <li>
          <strong>Moving soon</strong> — closing costs may not recover before you sell.
        </li>
        <li>
          <strong>Late in amortization</strong> — restarting a 30-year clock can add interest even at a lower rate.
        </li>
        <li>
          <strong>Extending the term just for payment relief</strong> — lower payment, more years of payments.
        </li>
        <li>
          <strong>Tiny rate drops</strong> — as in the example above, break-even can stretch past five years.
        </li>
      </ul>

      <h2>Closing costs to budget</h2>
      <p>
        The{' '}
        <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/">
          CFPB&apos;s Loan Estimate explainer
        </a>{' '}
        lists origination charges, appraisal, title, prepaid interest, and escrow setup. Refinance costs are often quoted
        as a percent of the loan — typically a few thousand dollars on a $300,000 balance, but your LE is the real
        number. Dett&apos;s calculator treats closing costs as cash you need to earn back through monthly savings.
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
          <a href="https://www.consumerfinance.gov/owning-a-home/refinance/">CFPB — Refinancing your mortgage</a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/">CFPB — Loan Estimate guide</a>
        </li>
        <li>
          <Link href={REFI_CALC_HREF}>Dett refinance calculator</Link> (this example) and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 19, 2026. Estimates for education only. Dett.io is not a lender or broker.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}