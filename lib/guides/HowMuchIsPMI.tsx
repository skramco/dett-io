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
import { calculatePMI } from '@/lib/calculators/pmi';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import { calcHref } from '@/lib/guides/calcHref';

const SLUG = 'how-much-is-pmi';

const PMI_EXAMPLE = calculatePMI({
  homePrice: 400_000,
  downPaymentPercent: 10,
  loanAmount: 360_000,
  interestRate: 6.75,
  loanTerm: 30,
  creditScore: 720,
  pmiType: 'borrower-paid',
});

const PMI_CALC_HREF = calcHref('pmi', {
  homePrice: 400_000,
  downPaymentPercent: 10,
  loanAmount: 360_000,
  interestRate: 6.75,
  loanTerm: 30,
  creditScore: 720,
  pmiType: 'borrower-paid',
});

const d = PMI_EXAMPLE.details;
const faqs = guideFaqs[SLUG] ?? [];

export function HowMuchIsPMI() {
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 4,
          borderRadius: 3,
          bgcolor: '#FFF7ED',
          border: '1px solid #fed7aa',
        }}
      >
        <Typography variant="overline" sx={{ fontWeight: 700, color: '#C2410C', letterSpacing: 1 }}>
          The short answer
        </Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 700, my: 1 }}>
          PMI costs depend on loan size, down payment, and credit — then it comes off
        </Typography>
        <Typography variant="body1" color="text.secondary">
          On a {formatCurrency(400_000)} home with 10% down and a 720 credit score, Dett&apos;s PMI calculator
          estimates about <strong>{formatCurrency(d.monthlyPMI as number)}/month</strong> in borrower-paid PMI (
          {d.pmiRate}% of the loan annually) on top of principal and interest, for about{' '}
          <strong>{d.yearsUntilRemoval as number} years</strong> until the balance reaches 78% of the original value
          (about {formatCurrency(d.totalPMICost as number)} total). These are estimates, not a quote or a loan offer.
        </Typography>
      </Paper>

      <h2>How PMI is priced</h2>
      <p>
        Private mortgage insurance (PMI) protects the lender if you stop paying — not you. On a conventional loan, the{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
          Consumer Financial Protection Bureau (CFPB)
        </a>{' '}
        notes that PMI is usually required when you put less than 20% down. You pay it monthly (or sometimes upfront)
        until you have enough equity for the lender to drop it.
      </p>
      <p>
        Insurers set the annual rate as a percent of the loan amount. In Dett&apos;s model, the rate rises when{' '}
        <strong>loan-to-value (LTV)</strong> is higher and when <strong>credit score</strong> is lower. Down payment,
        loan size, and loan type also matter. There is no single national price — your lender&apos;s mortgage insurer
        files the actual rate.
      </p>
      <p>
        PMI is different from <strong>FHA mortgage insurance (MIP)</strong> and from VA loans, which do not require PMI
        in the conventional sense. This page focuses on conventional borrower-paid PMI; see the FHA section below for
        MIP.
      </p>

      <h2>When PMI goes away (conventional loans)</h2>
      <p>
        Federal law — the{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/">
          Homeowners Protection Act
        </a>
        , explained by the CFPB — sets two important thresholds on most conventional loans:
      </p>
      <ul>
        <li>
          <strong>Automatic termination at 78% LTV:</strong> On a loan with a good payment history, PMI must end when
          your balance hits 78% of the home&apos;s value at closing (based on the original amortization schedule, even
          if you prepaid).
        </li>
        <li>
          <strong>Borrower-requested cancellation at 80% LTV:</strong> You can ask to cancel PMI once you reach 80% LTV,
          often sooner if you prepay principal or if the home&apos;s value rose. The lender may require a new appraisal
          and evidence you are current on payments.
        </li>
      </ul>
      <p>
        PMI stays until one of those thresholds is met — it does not automatically end just because your market value
        jumped. If appreciation is your argument, you typically need an appraisal and a cancellation request at 80%
        LTV using current value, following your servicer&apos;s process.
      </p>

      <h2>FHA MIP is not the same as PMI</h2>
      <p>
        FHA loans use <strong>upfront MIP</strong> and <strong>annual MIP</strong>, collected monthly — not private
        mortgage insurance.{' '}
        <a href="https://www.hud.gov/program_offices/housing/sfh/ins/sfhmip-premium">
          HUD publishes FHA mortgage insurance premium rates
        </a>{' '}
        for purchase and refinance loans. Key differences from conventional PMI:
      </p>
      <ul>
        <li>
          <strong>Upfront premium</strong> is typically financed into the loan (HUD&apos;s charts show percentages by
          term and down payment tier).
        </li>
        <li>
          <strong>Annual MIP duration</strong> depends on down payment and loan term. For loans with less than 10% down,
          annual MIP often lasts for the life of the loan unless you refinance out or pay off the loan. With 10% down or
          more, HUD&apos;s tables show annual MIP for 11 years on many 30-year loans — still longer than typical
          conventional PMI removal at 78–80% LTV.
        </li>
        <li>
          Removing FHA MIP without refinancing is generally <em>not</em> the same as conventional PMI cancellation
          rules. Many borrowers refinance into a conventional loan once they have 20% equity.
        </li>
      </ul>
      <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Compare programs in Dett&apos;s{' '}
          <Link href="/guides/fha-vs-conventional">FHA vs conventional guide</Link> or{' '}
          <Link href="/compare/fha-vs-conventional">side-by-side comparison</Link> — and run FHA MIP in the{' '}
          <Link href="/calculators/fha">FHA loan calculator</Link>.
        </Typography>
      </Alert>

      <h2>Worked example (open in the PMI calculator)</h2>
      <p>
        This scenario uses Dett&apos;s default <strong>6.75%</strong> 30-year rate (calculator default, not a live
        quote). Change any field in the{' '}
        <Link href={PMI_CALC_HREF}>pre-filled PMI calculator</Link>:
      </p>
      <Box component="ul">
        <li>{formatCurrency(400_000)} purchase price, 10% down → {formatCurrency(360_000)} loan</li>
        <li>720 credit score, borrower-paid PMI</li>
        <li>
          Estimated PMI rate {d.pmiRate}% → {formatCurrency(d.monthlyPMI as number)}/month ({formatCurrency(d.annualPMI as number)}
          /year)
        </li>
        <li>
          P&amp;I about {formatCurrency(d.monthlyPI as number)}/month; payment with PMI about{' '}
          {formatCurrency(d.monthlyPaymentWithPMI as number)}/month
        </li>
        <li>
          Automatic removal around month {d.monthsUntilRemoval as number} (~{d.yearsUntilRemoval as number} years), when
          balance reaches {formatCurrency(d.targetBalance as number)} (78% of original value)
        </li>
        <li>Total estimated PMI paid until removal: about {formatCurrency(d.totalPMICost as number)}</li>
      </Box>
      <p>
        You can request cancellation closer to {formatCurrency(d.requestRemovalBalance as number)} (80% LTV) if your
        servicer agrees and you meet their conditions — potentially a few months earlier than automatic termination.
      </p>

      <h2>Ways to avoid or shorten PMI</h2>
      <ol>
        <li>
          <strong>20% down</strong> — no PMI on a standard conventional loan.
        </li>
        <li>
          <strong>Piggyback second mortgage (80/10/10)</strong> — avoids PMI on the first lien; the second lien has its
          own rate and payment.
        </li>
        <li>
          <strong>Prepay principal</strong> — reach 80% LTV faster; see{' '}
          <Link href={calcHref('payoff', { loanAmount: 360_000, interestRate: 6.75, loanTerm: 30, extraMonthlyPayment: 200 })}>
            payoff with extra payments
          </Link>
          .
        </li>
        <li>
          <strong>Lender-paid PMI (LPMI)</strong> — higher interest rate instead of a separate line item; usually
          cannot be canceled the same way as borrower-paid PMI.
        </li>
        <li>
          <strong>VA or USDA</strong> if you qualify — different insurance/fee structures, not conventional PMI.
        </li>
      </ol>

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
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
            CFPB — What is private mortgage insurance?
          </a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/">
            CFPB — When can PMI be removed? (Homeowners Protection Act)
          </a>
        </li>
        <li>
          <a href="https://www.hud.gov/program_offices/housing/sfh/ins/sfhmip-premium">
            HUD — FHA mortgage insurance premiums
          </a>
        </li>
        <li>
          <Link href={PMI_CALC_HREF}>Dett PMI calculator</Link> (this example) and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 19, 2026. Estimates for education only. Dett.io is not a lender, broker, or insurer.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}