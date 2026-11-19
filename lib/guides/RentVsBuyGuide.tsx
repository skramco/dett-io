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
import { calculateRentVsBuy } from '@/lib/calculators/rentVsBuy';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import { calcHref } from '@/lib/guides/calcHref';

const SLUG = 'rent-vs-buy-guide';

const RVB_INPUTS = {
  homePrice: 350_000,
  downPayment: 70_000,
  interestRate: 6.75,
  loanTerm: 30,
  monthlyRent: 2_200,
  rentInflation: 3,
  homeAppreciation: 3,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  maintenanceRate: 1,
  pmiRate: 0.5,
  closingCosts: 10_500,
  sellingCosts: 6,
  investmentReturn: 7,
  yearsToAnalyze: 10,
  state: '',
  zip: '',
};

const RVB = calculateRentVsBuy(RVB_INPUTS);
const vd = RVB.details;

const RVB_CALC_HREF = calcHref('rent-vs-buy', RVB_INPUTS);

const AFFORD_HREF = calcHref('affordability', {
  annualIncome: 95_000,
  monthlyDebts: 350,
  downPayment: 70_000,
  interestRate: 6.75,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  creditScore: 740,
});

const faqs = guideFaqs[SLUG] ?? [];

export function RentVsBuyGuide() {
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
          It depends on how long you stay — and on rent vs the full cost of owning
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Buying builds equity but ties up your down payment, adds maintenance, and costs 6–10% to sell. Renting keeps
          cash flexible. In Dett&apos;s worked example below, buying pulls ahead of renting around{' '}
          <strong>year {String(vd.baseCrossover)}</strong> on net worth after {RVB_INPUTS.yearsToAnalyze} years — with
          about {formatCurrency(Math.abs(vd.baseDifference as number))} separating the paths at that horizon. Your market
          can look very different.
        </Typography>
      </Paper>

      <p>
        This page is the <strong>worked-example guide</strong>. For a structured pros-and-cons comparison table, see{' '}
        <Link href="/compare/rent-vs-buy">Rent vs buy comparison</Link>. Both should agree on the question — they should
        not duplicate each other&apos;s format.
      </p>

      <h2>What to compare (beyond rent vs mortgage)</h2>
      <p>
        The{' '}
        <a href="https://www.consumerfinance.gov/owning-a-home/">CFPB&apos;s homeownership tools</a> emphasize budgeting
        for taxes, insurance, maintenance, and upfront cash — not just the loan payment. A fair rent-vs-buy test
        includes:
      </p>
      <ul>
        <li>
          <strong>Cash to close</strong> — down payment plus closing costs when you buy.
        </li>
        <li>
          <strong>Monthly owner costs</strong> — P&amp;I, taxes, insurance, PMI, HOA, maintenance.
        </li>
        <li>
          <strong>Rent path</strong> — rent inflation plus what happens to the down payment if invested.
        </li>
        <li>
          <strong>Selling costs</strong> — often 6–10% of value when you leave.
        </li>
        <li>
          <strong>Time horizon</strong> — how many years until buying overtakes renting (if it ever does).
        </li>
      </ul>

      <h2>Worked example you can change</h2>
      <p>
        Open the{' '}
        <Link href={RVB_CALC_HREF}>pre-filled rent vs buy calculator</Link>. Assumptions use Dett&apos;s default{' '}
        <strong>6.75%</strong> 30-year rate (not a quote), plus illustrative appreciation and rent growth:
      </p>
      <Box component="ul">
        <li>{formatCurrency(RVB_INPUTS.homePrice)} home, {formatCurrency(RVB_INPUTS.downPayment)} down (20%)</li>
        <li>{formatCurrency(RVB_INPUTS.monthlyRent)}/month rent, 3% annual rent inflation</li>
        <li>3% home appreciation, 7% investment return on the down payment if renting</li>
        <li>1.2% property tax, 1% maintenance, {formatCurrency(RVB_INPUTS.closingCosts)} buyer closing costs</li>
        <li>10-year horizon</li>
      </Box>
      <p>
        Dett&apos;s model estimates buying&apos;s all-in monthly housing cost around{' '}
        <strong>{formatCurrency(vd.monthlyBuyTotal as number)}</strong> early on (P&amp;I, taxes, insurance,
        maintenance; PMI drops when equity builds). In this scenario, crossover net worth is about{' '}
        <strong>year {String(vd.baseCrossover)}</strong> — buying overtakes renting then, holding the assumptions constant.
      </p>
      <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          {RVB.summary} Scenario bands (optimistic / pessimistic) matter as much as the base case — run your own rent,
          appreciation, and investment return in the calculator.
        </Typography>
      </Alert>

      <h2>How horizon changes the answer</h2>
      <ul>
        <li>
          <strong>Under ~3–5 years:</strong> Closing and selling costs often dominate; renting can be cheaper even when
          the mortgage payment looks similar to rent.
        </li>
        <li>
          <strong>5–7 years:</strong> Gray zone — small assumption changes flip the winner.
        </li>
        <li>
          <strong>Longer stays:</strong> Fixed P&amp;I and appreciation have more time to offset upfront costs — if
          payments fit your budget along the way.
        </li>
      </ul>
      <p>
        Before you buy, stress-test the payment with{' '}
        <Link href={AFFORD_HREF}>affordability</Link> and{' '}
        <Link
          href={calcHref('mortgage-cost', {
            homePrice: RVB_INPUTS.homePrice,
            downPayment: RVB_INPUTS.downPayment,
            interestRate: 6.75,
            loanTerm: 30,
            propertyTaxRate: 1.2,
            homeInsuranceAnnual: 1800,
          })}
        >
          true monthly cost
        </Link>
        . A price that &quot;wins&quot; on a 10-year rent-vs-buy chart can still be too tight month to month.
      </p>

      <h2>Renting is not &quot;throwing money away&quot;</h2>
      <p>
        Rent buys housing services and flexibility. Forgone equity is real, but so is the opportunity to invest the down
        payment and avoid maintenance risk. Compare <em>net worth</em> at your horizon, not slogans.
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
          <a href="https://www.consumerfinance.gov/owning-a-home/">CFPB — Owning a home</a>
        </li>
        <li>
          <Link href="/compare/rent-vs-buy">Dett rent vs buy comparison</Link> (pros/cons table)
        </li>
        <li>
          <Link href={RVB_CALC_HREF}>Dett rent vs buy calculator</Link> (this example) and{' '}
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