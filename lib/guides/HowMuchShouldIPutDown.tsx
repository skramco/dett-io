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
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';
import {
  DOWN_PAYMENT_EXAMPLE_DTI_HREF,
  DOWN_PAYMENT_EXAMPLE_HREF,
  DOWN_PAYMENT_EXAMPLE_ROWS,
  DOWN_PAYMENT_GUIDE_REVIEWED_LABEL,
  DOWN_PAYMENT_GUIDE_SLUG,
  DOWN_PAYMENT_GUIDE_SOURCES,
  EXAMPLE_ANNUAL_INCOME,
  EXAMPLE_CREDIT_SCORE,
  EXAMPLE_HOME_PRICE,
  EXAMPLE_INSURANCE_ANNUAL,
  EXAMPLE_MONTHLY_INCOME,
  EXAMPLE_OTHER_DEBTS,
  EXAMPLE_RATE,
  EXAMPLE_RATE_AS_OF_LABEL,
  EXAMPLE_SAVINGS,
  EXAMPLE_SELECTED_PERCENT,
  EXAMPLE_TAX_RATE,
  EXAMPLE_TERM_YEARS,
  HOUSING_SHARE_LINE,
  TOTAL_DEBT_SHARE_LINE,
  exampleRow,
  guideSource,
  type DownPaymentExampleRow,
} from '@/lib/guides/downPaymentGuideExample';

const SLUG = DOWN_PAYMENT_GUIDE_SLUG;
const faqs = guideFaqs[SLUG] ?? [];
const row3 = exampleRow(3);
const row5 = exampleRow(5);
const row10 = exampleRow(10);
const row20 = exampleRow(20);

function formatShare(value: number): string {
  return `${value.toFixed(1)}%`;
}

function budgetLabel(row: DownPaymentExampleRow): string {
  if (row.fitsBudget) return 'Within both lines';
  if (!row.fitsHousingLine && !row.fitsTotalDebtLine) return 'Over both lines';
  if (!row.fitsHousingLine) return 'Over the housing line';
  return 'Over the total-debt line';
}

function cushionLabel(row: DownPaymentExampleRow): string {
  return row.cushionCoversThreeMonths ? 'Covers 3 months' : 'Short of 3 months';
}

export function HowMuchShouldIPutDown() {
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
          Keep a cash cushion, and only use a down payment whose full payment still fits your income and other debts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          In the labeled example below, 3% and 5% leave the most cash, and the payment is over the {HOUSING_SHARE_LINE}/
          {TOTAL_DEBT_SHARE_LINE} planning lines. 20% fits those lines and has no estimated PMI, and the cash left is short
          of a three-month cushion. {EXAMPLE_SELECTED_PERCENT}% is the option among these four that fits the payment lines
          and still leaves that cushion. Every dollar on this page is an example.
        </Typography>
      </Paper>

      <p>
        A smaller down payment keeps money in the bank and raises the loan, the monthly payment, and, under 20% down on
        a conventional loan, private mortgage insurance. A larger down payment does the reverse. The{' '}
        <a href={guideSource('cfpbDown')}>Consumer Financial Protection Bureau (CFPB)</a> tells buyers to start from the
        monthly payment they can carry, then subtract an emergency cushion of at least three to six months of expenses
        before deciding how much cash to bring to closing. Money that goes into the down payment is hard to take back out.
      </p>
      <p>
        This guide runs one labeled example through Dett&apos;s{' '}
        <Link href={DOWN_PAYMENT_EXAMPLE_HREF}>down payment calculator</Link>. It compares 3%, 5%, 10%, and 20% on the same
        home, then checks each payment against example income and example monthly debts. It does not promise a rate, a
        payment, or a loan.
      </p>

      <h2>What 3%, 5%, 10%, and 20% refer to</h2>
      <p>
        The <a href={guideSource('cfpbDown')}>CFPB</a> says that, in most cases, buyers need a down payment of at least 3%
        of the price, and that many loan types and lenders require 5% or more. It also says a higher down payment
        generally means the loan is likely to cost less, that buyers can often save money at 10% or more, and that the
        savings are usually largest at 20%. The same page says lenders typically look at the down payment in steps of
        5% when they set loan costs. This example holds the rate fixed, so it does not estimate a rate change.
      </p>
      <ul>
        <li>
          <strong>3% down (97% of the price borrowed).</strong>{' '}
          <a href={guideSource('fanniePurchase')}>Fannie Mae</a> allows a purchase loan-to-value ratio from 95.01% to 97%
          only on a fixed-rate loan of up to 30 years, secured by a one-unit principal residence, with at least one
          borrower who is a first-time homebuyer under the definition on that page.{' '}
          <a href={guideSource('freddieHomePossible')}>Freddie Mac Home Possible</a> offers a down payment as low as 3%
          and limits income to 80% of area median income. A 3% down payment is not available on every conventional loan.
        </li>
        <li>
          <strong>5% down.</strong> The CFPB says many loan types and lenders require 5% or more. Use this when a 3%
          program is not available for the loan you are comparing.
        </li>
        <li>
          <strong>10% down.</strong> The loan is smaller than at 3% or 5%, so the example payment is lower. In this
          example the payment still includes estimated PMI. How that premium works is in the{' '}
          <Link href="/guides/how-much-is-pmi">PMI guide</Link>.
        </li>
        <li>
          <strong>20% down.</strong> The <a href={guideSource('cfpbPmi')}>CFPB</a> says conventional private mortgage
          insurance is usually required when the down payment is under 20%. At 20%, the example payment has no PMI line.
          How that premium is priced, and when it can end, is covered in the{' '}
          <Link href="/guides/how-much-is-pmi">PMI guide</Link>, not here.
        </li>
      </ul>
      <p>
        Two other programs use different minimums. <a href={guideSource('hudFha')}>HUD</a> says an FHA down payment can
        be as low as 3.5% of the purchase price. That is not the same as 3%, and FHA mortgage insurance is not
        conventional PMI. See the <Link href="/guides/how-much-is-pmi">PMI guide</Link> for that difference.{' '}
        <a href={guideSource('vaLoans')}>VA</a> reports that nearly 90% of VA-backed loans are made with no down payment,
        for borrowers who meet VA credit and income requirements. The funding fee on those loans is a separate cost,
        covered in the <Link href="/guides/va-funding-fee-and-waiver">VA funding fee guide</Link>.
      </p>

      <h2>Labeled example: a {formatCurrency(EXAMPLE_HOME_PRICE)} home</h2>
      <p>
        Open <Link href={DOWN_PAYMENT_EXAMPLE_HREF}>this labeled example</Link> in the down payment calculator. The link
        selects {EXAMPLE_SELECTED_PERCENT}% because that is the row among 3%, 5%, 10%, and 20% that fits both checks
        below. The calculator still charts 3%, 5%, 10%, 15%, and 20% from the same price. Read the 15% row there before
        you treat 10% as the only midpoint.
      </p>
      <ul>
        <li>Example home price: {formatCurrency(EXAMPLE_HOME_PRICE)}</li>
        <li>
          Example rate: {EXAMPLE_RATE}% fixed for {EXAMPLE_TERM_YEARS} years. This is Dett&apos;s calculator default, the{' '}
          <a href={guideSource('freddiePmms')}>Freddie Mac PMMS</a> 30-year figure for the {EXAMPLE_RATE_AS_OF_LABEL}. It
          is an illustration. The link passes {EXAMPLE_RATE}% so the comparison stays on that default.
        </li>
        <li>
          Example property tax: {EXAMPLE_TAX_RATE}% of the price ({formatCurrency(row10.monthlyTax)} per month in this
          example). Example insurance: {formatCurrency(EXAMPLE_INSURANCE_ANNUAL)} a year (
          {formatCurrency(row10.monthlyInsurance)} per month).
        </li>
        <li>Example credit score: {EXAMPLE_CREDIT_SCORE}, used only to estimate PMI inside the calculator.</li>
        <li>
          Example income: {formatCurrency(EXAMPLE_ANNUAL_INCOME)} a year ({formatCurrency(EXAMPLE_MONTHLY_INCOME)} a
          month, before taxes). Example other debts: {formatCurrency(EXAMPLE_OTHER_DEBTS)} a month.
        </li>
        <li>
          Example savings before closing: {formatCurrency(EXAMPLE_SAVINGS)}. Cash left is this amount minus example cash
          to close.
        </li>
      </ul>
      <p>
        Each example monthly housing figure is principal and interest, property tax, insurance, and estimated PMI when
        the down payment is under 20%. Cash to close adds the down payment to estimated closing costs from the same
        engine as the <Link href="/calculators/closing-costs">closing cost calculator</Link>, using that tool&apos;s
        California defaults. The <a href={guideSource('cfpbDown')}>CFPB</a> says closing costs, not counting the down
        payment, are typically 2% to 5% of the price. Your state, lender, and insurer will differ. These are examples.
      </p>

      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Down payment</th>
              <th>Example cash to close</th>
              <th>Example cash left</th>
              <th>Example monthly housing</th>
              <th>Example PMI in that payment</th>
            </tr>
          </thead>
          <tbody>
            {DOWN_PAYMENT_EXAMPLE_ROWS.map((row) => (
              <tr key={row.percent}>
                <td>
                  {row.percent}% ({formatCurrency(row.downPaymentAmount)})
                </td>
                <td>{formatCurrency(row.cashToClose)}</td>
                <td>{formatCurrency(row.cashLeft)}</td>
                <td>{formatCurrency(row.monthlyHousing)}</td>
                <td>{formatCurrency(row.monthlyPMI)}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>

      <h2>Cash left versus the higher payment</h2>
      <p>
        The <a href={guideSource('cfpbDown')}>CFPB</a> rule of thumb is to keep at least three to six months of expenses
        out of the down payment. Real expenses include food, utilities, and transportation, so the floor below is only
        an illustration: three months of the example housing payment plus the {formatCurrency(EXAMPLE_OTHER_DEBTS)} of
        other debts. A real cushion is often larger.
      </p>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Down payment</th>
              <th>Example housing share of income</th>
              <th>Example housing plus debts, share of income</th>
              <th>{HOUSING_SHARE_LINE}/{TOTAL_DEBT_SHARE_LINE} lines in this example</th>
              <th>3-month cushion in this example</th>
            </tr>
          </thead>
          <tbody>
            {DOWN_PAYMENT_EXAMPLE_ROWS.map((row) => (
              <tr key={row.percent}>
                <td>{row.percent}%</td>
                <td>{formatShare(row.housingShare)}</td>
                <td>{formatShare(row.totalDebtShare)}</td>
                <td>{budgetLabel(row)}</td>
                <td>{cushionLabel(row)}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
      <p>Every figure in both tables is an example from the assumptions above.</p>
      <ul>
        <li>
          <strong>3% in this example.</strong> Cash to close is {formatCurrency(row3.cashToClose)}, so{' '}
          {formatCurrency(row3.cashLeft)} of the example savings is left. That covers three months of the illustrated
          obligations ({formatCurrency(row3.threeMonthObligations)}) and six months (
          {formatCurrency(row3.sixMonthObligations)}). The example payment is {formatCurrency(row3.monthlyHousing)},
          which is {formatShare(row3.housingShare)} of income for housing and {formatShare(row3.totalDebtShare)} once the{' '}
          {formatCurrency(EXAMPLE_OTHER_DEBTS)} of other debts is included. Both shares are over the planning lines. The
          extra cash does not make this the amount to use in the example.
        </li>
        <li>
          <strong>5% in this example.</strong> Cash left is {formatCurrency(row5.cashLeft)}. The example payment is{' '}
          {formatCurrency(row5.monthlyHousing)}: {formatShare(row5.housingShare)} housing and{' '}
          {formatShare(row5.totalDebtShare)} with the other debts. That is still over both lines, so this page does not
          treat 5% as the amount to use here either.
        </li>
        <li>
          <strong>{EXAMPLE_SELECTED_PERCENT}% in this example.</strong> Cash to close is{' '}
          {formatCurrency(row10.cashToClose)} and cash left is {formatCurrency(row10.cashLeft)}. The example payment is{' '}
          {formatCurrency(row10.monthlyHousing)}, including {formatCurrency(row10.monthlyPMI)} of estimated PMI. Housing
          is {formatShare(row10.housingShare)} of income and the total with other debts is{' '}
          {formatShare(row10.totalDebtShare)}. Both are within the planning lines. Cash left also covers three months (
          {formatCurrency(row10.threeMonthObligations)}) and six months ({formatCurrency(row10.sixMonthObligations)}) of
          those illustrated obligations.
        </li>
        <li>
          <strong>20% in this example.</strong> The example payment falls to {formatCurrency(row20.monthlyHousing)} and
          estimated PMI is {formatCurrency(row20.monthlyPMI)}. Housing is {formatShare(row20.housingShare)} and the total
          with other debts is {formatShare(row20.totalDebtShare)}, so the payment lines fit. Cash to close is{' '}
          {formatCurrency(row20.cashToClose)}, which leaves {formatCurrency(row20.cashLeft)}. Three months of the
          illustrated obligations are {formatCurrency(row20.threeMonthObligations)}. The cash left is short of that
          floor, so 20% is not the amount to use in this example just because the payment is lower.
        </li>
      </ul>

      <h2>Check the payment against income and monthly debts</h2>
      <p>
        The <a href={guideSource('cfpbDti')}>CFPB defines debt-to-income</a> as all monthly debt payments divided by
        gross monthly income. Gross income is pay before taxes. The housing share in the table is the example housing
        payment divided by the example gross income. The total share adds the {formatCurrency(EXAMPLE_OTHER_DEBTS)} of
        other debts first. Different products use different limits, and a share under a line is not a decision on a loan.
      </p>
      <p>
        The <a href={guideSource('cfpbToolkit')}>CFPB home loan toolkit</a> describes a mortgage rule of thumb that the
        monthly housing payment stay at or below {HOUSING_SHARE_LINE}% of gross income. Lenders may go higher or lower
        once they see the rest of the file. <a href={guideSource('fannieDti')}>Fannie Mae</a> sets a 36% maximum total
        debt-to-income ratio for manually underwritten loans. That maximum can go up to 45% when the credit score and
        reserve requirements in the Eligibility Matrix are met, and Desktop Underwriter allows up to 50%. In this
        example, 3% ({formatShare(row3.totalDebtShare)}) and 5% ({formatShare(row5.totalDebtShare)}) are over the 36%
        planning line and still under those higher program maximums. Being under a program maximum is not the same as
        the payment fitting the budget.
      </p>
      <p>
        Because 3% and 5% miss the planning lines in this example, this page does not call either one the amount to put
        down, even though both leave more cash than 10% or 20%. The payment has to fit the income and the monthly debts
        first.
      </p>
      <p>
        <Link href={DOWN_PAYMENT_EXAMPLE_DTI_HREF}>Open the 10% example in the DTI calculator</Link> to change the income
        or the other debts. The prefilled mortgage line includes principal, interest, and the example PMI (
        {formatCurrency(row10.monthlyPI + row10.monthlyPMI)}). Taxes and insurance are on their own lines, so the housing
        total matches the {formatCurrency(row10.monthlyHousing)} example payment. A payment inside these lines can still
        feel tight after utilities, maintenance, and saving.
      </p>

      <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
        Planning lines are for education. They are not a promise that a payment will fit your budget, and they are not a
        decision on a loan. Change the price, the rate you were quoted, taxes, insurance, income, and debts before you
        rely on this example.
      </Alert>

      <h2>How to run your numbers</h2>
      <ol>
        <li>
          Open the <Link href={DOWN_PAYMENT_EXAMPLE_HREF}>labeled down payment example</Link>, or start a fresh scenario
          in the <Link href="/calculators/down-payment">down payment calculator</Link> with your price.
        </li>
        <li>
          Replace {EXAMPLE_RATE}% with the rate you were actually quoted. The default is an illustration from the{' '}
          {EXAMPLE_RATE_AS_OF_LABEL}, not a rate you will be offered.
        </li>
        <li>Read cash to close and the full monthly housing payment at 3%, 5%, 10%, and 20%.</li>
        <li>
          Subtract cash to close from the savings you can actually use. Compare what is left with three to six months of
          your expenses, the cushion the <a href={guideSource('cfpbDown')}>CFPB</a> describes. Keep moving costs and
          repairs in that cushion too.
        </li>
        <li>
          Add the housing payment to your other monthly debts and divide by gross monthly income. If that share is over
          the line you can live with, a lower down payment is not a fit, even when it leaves more cash in the bank.
        </li>
        <li>
          For how PMI is priced and when it can come off, use the{' '}
          <Link href="/guides/how-much-is-pmi">PMI guide</Link> instead of guessing from the down payment alone.
        </li>
      </ol>

      <h2>Sources</h2>
      <ul>
        {DOWN_PAYMENT_GUIDE_SOURCES.map((source) => (
          <li key={source.id}>
            <a href={source.href}>{source.label}</a>
          </li>
        ))}
        <li>
          <Link href={DOWN_PAYMENT_EXAMPLE_HREF}>Dett down payment calculator</Link> (this example) and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <h2>FAQs</h2>
      <Stack spacing={1}>
        {faqs.map((faq) => (
          <Accordion
            key={faq.question}
            disableGutters
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:before': { display: 'none' } }}
          >
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
        Last reviewed {DOWN_PAYMENT_GUIDE_REVIEWED_LABEL}. Educational estimates only. Dett.io is not a lender or broker.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}
