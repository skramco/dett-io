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
import { calculateAffordability } from '@/lib/calculators/affordability';
import { calculateDTI } from '@/lib/calculators/dti';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import { DEFAULT_RATES } from '@/lib/rates/defaultRates';

const SLUG = 'car-student-loans-house-affordability';

const INCOME_ANNUAL = 100_000;
const MONTHLY_GROSS = Math.round(INCOME_ANNUAL / 12);
const DOWN = 50_000;
const RATE = DEFAULT_RATES.thirtyYearFixed;

const CAR = 450;
const STUDENT = 350;
const CARDS = 120;
const DEBTS_LOW = CAR + STUDENT + CARDS; // 920
const DEBTS_HIGH = 1_600; // adds second car, higher student, etc.

const affordLow = calculateAffordability({
  annualIncome: INCOME_ANNUAL,
  monthlyDebts: DEBTS_LOW,
  downPayment: DOWN,
  interestRate: RATE,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  hoaFees: 0,
  creditScore: 740,
  state: '',
  zip: '',
});

const affordHigh = calculateAffordability({
  annualIncome: INCOME_ANNUAL,
  monthlyDebts: DEBTS_HIGH,
  downPayment: DOWN,
  interestRate: RATE,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  hoaFees: 0,
  creditScore: 740,
  state: '',
  zip: '',
});

const dtiWithHousing = calculateDTI({
  monthlyGrossIncome: MONTHLY_GROSS,
  mortgagePayment: affordLow.details.moderatePayment as number,
  propertyTax: 3_600,
  homeInsurance: 1800,
  hoaFees: 0,
  carPayments: CAR,
  studentLoans: STUDENT,
  creditCardMinimums: CARDS,
  personalLoans: 0,
  childSupport: 0,
  otherDebts: 0,
});

function calcHref(path: string, params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `${path}?${search.toString()}`;
}

const AFFORD_LOW_PREFILL = calcHref('/calculators/affordability', {
  annualIncome: INCOME_ANNUAL,
  monthlyDebts: DEBTS_LOW,
  downPayment: DOWN,
  interestRate: RATE,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  creditScore: 740,
});

const AFFORD_HIGH_PREFILL = calcHref('/calculators/affordability', {
  annualIncome: INCOME_ANNUAL,
  monthlyDebts: DEBTS_HIGH,
  downPayment: DOWN,
  interestRate: RATE,
});

const DTI_PREFILL = calcHref('/calculators/dti', {
  monthlyGrossIncome: MONTHLY_GROSS,
  carPayments: CAR,
  studentLoans: STUDENT,
  creditCardMinimums: CARDS,
  mortgagePayment: 2200,
  propertyTax: 4500,
  homeInsurance: 1800,
});

const faqs = guideFaqs[SLUG] ?? [];

export function CarStudentLoansHouseAffordability() {
  const priceDrop =
    (affordLow.details.moderatePrice as number) - (affordHigh.details.moderatePrice as number);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 4,
          borderRadius: 3,
          bgcolor: '#EBF5FF',
          border: '1px solid #93c5fd',
        }}
      >
        <Typography variant="overline" sx={{ fontWeight: 700, color: '#196bc0', letterSpacing: 1 }}>
          The short answer
        </Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 700, my: 1 }}>
          Every dollar of car and student loan payment reduces the housing payment you can carry under common DTI guidelines
          — often by more than a dollar-for-dollar drop in purchase price
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lenders and affordability tools count minimum required payments on installment loans and revolving accounts. A
          $400 car payment and $350 student loan payment are {formatCurrency(CAR + STUDENT)} of monthly obligations before
          you shop for a house.
        </Typography>
      </Paper>

      <p>
        Debt-to-income ratios compare monthly debt payments to gross income. The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
          CFPB&apos;s DTI explainer
        </a>{' '}
        notes that lenders look at recurring obligations — auto loans, student loans, credit card minimums, and the new
        housing payment including taxes and insurance. Income alone does not set your price range; the whole payment stack
        does.
      </p>

      <h2>Worked example: $100,000 income, two debt levels</h2>
      <p>
        Same income and down payment; only non-housing debts change. Rates use Dett&apos;s {RATE}% default (Freddie Mac PMMS,
        week of October 15, 2026, illustrative).
      </p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Non-housing debts/mo</th>
              <th>Mid-range price (36% cap)</th>
              <th>Total housing payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link href={AFFORD_LOW_PREFILL}>Moderate car + student debt</Link>
              </td>
              <td>{formatCurrency(DEBTS_LOW)}</td>
              <td>{formatCurrency(affordLow.details.moderatePrice as number)}</td>
              <td>{formatCurrency(affordLow.details.moderatePayment as number)}/mo</td>
            </tr>
            <tr>
              <td>
                <Link href={AFFORD_HIGH_PREFILL}>Higher total debts</Link>
              </td>
              <td>{formatCurrency(DEBTS_HIGH)}</td>
              <td>{formatCurrency(affordHigh.details.moderatePrice as number)}</td>
              <td>{formatCurrency(affordHigh.details.moderatePayment as number)}/mo</td>
            </tr>
          </tbody>
        </Box>
      </Box>
      <p>
        In this illustration, adding {formatCurrency(DEBTS_HIGH - DEBTS_LOW)}/month in other debts shrinks the mid-range
        purchase price by about {formatCurrency(priceDrop)}. A home at the higher-debt cap still &quot;fits&quot; the math,
        but the payment may feel tight — shop below the calculator&apos;s top number if you need margin in your budget.
      </p>

      <h2>Worked example: DTI with car, student, and a housing payment</h2>
      <p>
        <Link href={DTI_PREFILL}>Open the DTI preset</Link> with {formatCurrency(MONTHLY_GROSS)} gross monthly income,
        {formatCurrency(CAR)} car, {formatCurrency(STUDENT)} student loans, {formatCurrency(CARDS)} card minimums, and a{' '}
        {formatCurrency(2200)} principal-and-interest payment plus tax and insurance. Back-end DTI in this example is about{' '}
        {(dtiWithHousing.details.backEndDTI as number).toFixed(1)}%.
      </p>
      <p>
        Agency and lender programs publish different DTI ceilings; many conventional frameworks cite 36% for housing-only
        and 43%–50% total depending on compensating factors. Treat those as guidelines for planning, not a promise that a
        particular loan will be available to you. The{' '}
        <a href="https://www.fhfa.gov/data/fhlb-stress-test-scenarios">FHFA</a> and GSE selling guides set underwriting
        standards lenders follow in practice.
      </p>

      <h2>What counts in DTI</h2>
      <ul>
        <li>
          <strong>Auto loans and leases:</strong> the contractual monthly payment counts, even if you plan to pay the car
          off early.
        </li>
        <li>
          <strong>Student loans:</strong> lenders often use the payment on your credit report; income-driven plans may use
          documented rules for deferred or $0 payments.
        </li>
        <li>
          <strong>Credit cards:</strong> minimum payments, not balances, unless a lender applies a specific percentage
          rule for high balances.
        </li>
        <li>
          <strong>Co-signed debt:</strong> may still count unless you can document another borrower has paid for 12 months.
        </li>
      </ul>

      <h2>Tradeoffs before you house-hunt</h2>
      <ul>
        <li>
          <strong>Pay down or refinance cars</strong> only if the new payment truly drops and fits your budget; extending an
          auto term to lower DTI can backfire if the car is worth less than the loan.
        </li>
        <li>
          <strong>Student loan strategy:</strong> switching plans changes the counted payment; verify with a lender what
          documentation they need before you assume a lower payment counts.
        </li>
        <li>
          <strong>Buy below the calculator cap:</strong> leave room for maintenance, childcare, and savings — a price that
          fits a 36% guideline is not automatically comfortable for your household.
        </li>
      </ul>

      <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
        If the mid-range price hits zero in the affordability tool, your non-housing debts may already consume the
        back-end guideline for your income. Paying down or restructuring debt may expand your range more than chasing a
        lower mortgage rate.
      </Alert>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
            CFPB, debt-to-income ratio
          </a>
        </li>
        <li>
          <a href="https://www.freddiemac.com/pmms">Freddie Mac PMMS</a>
        </li>
        <li>
          <a href="https://www.fhfa.gov/">Federal Housing Finance Agency</a> (GSE underwriting context)
        </li>
        <li>
          <Link href="/calculators/dti">Dett DTI Calculator</Link> and{' '}
          <Link href="/calculators/affordability">Affordability Calculator</Link>
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
        Last reviewed November 19, 2026. Educational estimates only. Dett.io is not a lender.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}