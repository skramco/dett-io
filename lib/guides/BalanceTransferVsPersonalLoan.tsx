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
import { calculateDTI } from '@/lib/calculators/dti';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';

const SLUG = 'balance-transfer-vs-personal-loan';

const INCOME_MONTHLY = 7_500;
const CARD_MINIMUMS = 420;
const PERSONAL_LOAN_PAYMENT = 355;
const CARD_BALANCE = 15_000;

const dtiRevolving = calculateDTI({
  monthlyGrossIncome: INCOME_MONTHLY,
  mortgagePayment: 0,
  propertyTax: 0,
  homeInsurance: 0,
  hoaFees: 0,
  carPayments: 350,
  studentLoans: 0,
  creditCardMinimums: CARD_MINIMUMS,
  personalLoans: 0,
  childSupport: 0,
  otherDebts: 0,
});

const dtiPersonalLoan = calculateDTI({
  monthlyGrossIncome: INCOME_MONTHLY,
  mortgagePayment: 0,
  propertyTax: 0,
  homeInsurance: 0,
  hoaFees: 0,
  carPayments: 350,
  studentLoans: 0,
  creditCardMinimums: 0,
  personalLoans: PERSONAL_LOAN_PAYMENT,
  childSupport: 0,
  otherDebts: 0,
});

function calcHref(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/calculators/dti?${search.toString()}`;
}

const REVOLVING_PREFILL = calcHref({
  monthlyGrossIncome: INCOME_MONTHLY,
  carPayments: 350,
  creditCardMinimums: CARD_MINIMUMS,
});

const LOAN_PREFILL = calcHref({
  monthlyGrossIncome: INCOME_MONTHLY,
  carPayments: 350,
  creditCardMinimums: 0,
  personalLoans: PERSONAL_LOAN_PAYMENT,
});

const faqs = guideFaqs[SLUG] ?? [];

/** Fixed-rate personal loan: 60 months at 11.5% example APR on $15k → ~$355/mo (illustrative). */
function personalLoanInterestExample(principal: number, annualRate: number, months: number): {
  payment: number;
  totalInterest: number;
} {
  const r = annualRate / 100 / 12;
  const payment = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPaid = payment * months;
  return { payment: Math.round(payment), totalInterest: Math.round(totalPaid - principal) };
}

const PL_EXAMPLE = personalLoanInterestExample(CARD_BALANCE, 11.5, 60);

export function BalanceTransferVsPersonalLoan() {
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
          A 0% balance transfer wins only if you pay off during the promo and fees stay small; a fixed personal loan trades
          a higher rate for a predictable payment and a set payoff date
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Neither option fixes overspending. Compare total cost, monthly payment vs your budget, and what happens when the
          promo ends.
        </Typography>
      </Paper>

      <p>
        Both tools address credit card debt without tying it to your home. The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-balance-transfer-en-1954/">
          CFPB&apos;s balance-transfer overview
        </a>{' '}
        notes promotional APRs, transfer fees (often 3%–5% of the amount moved), and penalty rates if you miss a payment.{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-personal-loan-en-1958/">
          Personal loans
        </a>{' '}
        are typically installment debt with a fixed payment and term disclosed up front under federal truth-in-lending
        rules.
      </p>

      <h2>Worked example: monthly obligations in DTI</h2>
      <p>
        Suppose gross income is {formatCurrency(INCOME_MONTHLY)}/month, a {formatCurrency(350)} car payment, and{' '}
        {formatCurrency(CARD_BALANCE)} on cards with {formatCurrency(CARD_MINIMUMS)} of minimum payments.{' '}
        <Link href={REVOLVING_PREFILL}>Open the revolving-heavy DTI preset</Link> — back-end DTI is about{' '}
        {(dtiRevolving.details.backEndDTI as number).toFixed(1)}%.
      </p>
      <p>
        Consolidating into a 60-month personal loan at an <strong>example</strong> 11.5% APR (rates vary by lender and
        credit profile; this is not a quote) produces about {formatCurrency(PL_EXAMPLE.payment)}/month and roughly{' '}
        {formatCurrency(PL_EXAMPLE.totalInterest)} interest over five years if you pay on schedule.{' '}
        <Link href={LOAN_PREFILL}>See the personal-loan DTI preset</Link> with{' '}
        {formatCurrency(PERSONAL_LOAN_PAYMENT)}/month counted — DTI drops to about{' '}
        {(dtiPersonalLoan.details.backEndDTI as number).toFixed(1)}% in this illustration because the fixed payment is
        lower than the old card minimums.
      </p>
      <Alert severity="info" sx={{ my: 2, borderRadius: 2 }}>
        A lower minimum is not automatically a better choice for your budget if you extend the payoff for years. Check
        that you can afford {formatCurrency(PL_EXAMPLE.payment)} every month including emergencies.
      </Alert>

      <h2>Worked example: 0% balance transfer for 18 months</h2>
      <p>
        Imagine a card offers 0% APR for 18 months on transfers with a 3% fee on {formatCurrency(CARD_BALANCE)} — about{' '}
        {formatCurrency(CARD_BALANCE * 0.03)} upfront. To clear the balance before the promo ends, you need about{' '}
        {formatCurrency(Math.ceil(CARD_BALANCE / 18))}/month toward principal (plus the fee in month one). If any balance
        remains when the promo expires, the go-to APR on your agreement — often in the high teens or higher — applies to
        what is left. The CFPB advises reading the Schumer box on solicitations for the post-promo rate and payment
        allocation rules.
      </p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Balance transfer (0% promo)</th>
              <th>Personal loan (fixed example)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Payment predictability</td>
              <td>You set the pace; must hit ~{formatCurrency(Math.ceil(CARD_BALANCE / 18))}/mo in this example</td>
              <td>Fixed {formatCurrency(PL_EXAMPLE.payment)}/mo for 60 months</td>
            </tr>
            <tr>
              <td>Upfront cost</td>
              <td>~3% transfer fee in example ({formatCurrency(CARD_BALANCE * 0.03)})</td>
              <td>Origination fee varies; may be financed or paid upfront</td>
            </tr>
            <tr>
              <td>If you miss payments</td>
              <td>Promo may end; penalty APR possible</td>
              <td>Late fees; credit damage; no promo to lose</td>
            </tr>
            <tr>
              <td>Revolving temptation</td>
              <td>Old cards may stay open</td>
              <td>Cards remain unless you close them</td>
            </tr>
          </tbody>
        </Box>
      </Box>

      <h2>Who each option tends to fit</h2>
      <ul>
        <li>
          <strong>Balance transfer:</strong> you can pay aggressively during the promo, have good credit for approvals,
          and will not charge the old cards back up.
        </li>
        <li>
          <strong>Personal loan:</strong> you want one fixed payment that fits your budget, need several years at a modest
          rate, or cannot commit to a short promo window.
        </li>
        <li>
          <strong>Neither:</strong> if even the consolidated payment strains income, address spending and consider nonprofit
          counseling before opening new credit.
        </li>
      </ul>

      <h2>How Dett&apos;s DTI calculator helps</h2>
      <p>
        Lenders count the payment shown on your credit report after consolidation. Modeling{' '}
        <Link href="/calculators/dti">before-and-after DTI</Link> shows whether a home purchase or refinance remains within
        the payments that fit your income — not whether a particular consolidation product is offered to you.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-balance-transfer-en-1954/">
            CFPB, balance transfers
          </a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-personal-loan-en-1958/">
            CFPB, personal loans
          </a>
        </li>
        <li>
          <a href="https://www.ftc.gov/legal-library/browse/rules/truth-lending-act-regulation-z">
            FTC / Regulation Z (loan disclosures)
          </a>
        </li>
        <li>
          <Link href="/calculators/dti">Dett DTI Calculator</Link>
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
        Last reviewed November 19, 2026. Educational estimates only. Dett.io is not a lender or debt settlement firm.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}