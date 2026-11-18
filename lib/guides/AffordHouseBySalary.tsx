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
  HUB_GUIDE_SLUG,
  HUB_PMMS_THIRTY_YEAR,
  HUB_SHARED_ASSUMPTIONS,
  SALARY_BAND_ROWS,
} from '@/lib/guides/salaryAffordabilityHub';

const SLUG = HUB_GUIDE_SLUG;

function formatSalaryLabel(income: number): string {
  if (income >= 1_000_000) return `$${(income / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(income / 1000)}K`;
}

export function AffordHouseBySalary() {
  const faqs = guideFaqs[SLUG] ?? [];
  const firstRow = SALARY_BAND_ROWS[0];
  const lastRow = SALARY_BAND_ROWS[SALARY_BAND_ROWS.length - 1];

  const shortAnswer =
    firstRow.moderatePrice > 0 && lastRow.moderatePrice > 0
      ? `From about ${formatCurrency(firstRow.conservativePrice)}–${formatCurrency(firstRow.moderatePrice)} on ${formatSalaryLabel(firstRow.annualIncome)} to about ${formatCurrency(lastRow.conservativePrice)}–${formatCurrency(lastRow.moderatePrice)} on ${formatSalaryLabel(lastRow.annualIncome)}, using shared assumptions and Dett's affordability math — estimates only, not a loan offer.`
      : 'Use the table below and the affordability calculator for estimates at your income.';

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
          It depends on debts, down payment, taxes, insurance, and the rate you are offered
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
          {shortAnswer}
        </Typography>
      </Paper>

      <p>
        A common shortcut is &quot;two to four times your salary.&quot; That range is a conversation starter, not a
        budget. Two households with the same income can support very different payments once car loans, student loans,
        credit-card minimums, local taxes, insurance, and the down payment are included.
      </p>
      <p>
        The{' '}
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
          Consumer Financial Protection Bureau
        </a>{' '}
        defines debt-to-income ratio (DTI) as monthly debt payments divided by gross monthly income — one way lenders
        measure the ability to repay. This table uses the same three tiers as Dett&apos;s{' '}
        <Link href="/calculators/affordability">How Much House Can I Afford?</Link> calculator: conservative 28/36,
        mid-range 36% total debt, and top-of-guideline 43% at the high end.
      </p>

      <h2>Salary band estimates</h2>
      <p>
        Each row is computed with Dett&apos;s shared affordability formulas (including PMI when the down payment is
        under 20%), not hand-typed ranges. The mid-range column is the 36% total-debt guideline — a common planning
        anchor, not a promise of what a lender will offer.
      </p>

      <Alert severity="info" sx={{ my: 2, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Example rate:</strong> {HUB_SHARED_ASSUMPTIONS.rateLabel}. Dett&apos;s calculators still default to
          6.75% when you open them without a prefill — only this guide&apos;s table and prefill links use the
          illustrative PMMS average for consistency across salary bands.
        </Typography>
      </Alert>

      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Gross salary</th>
              <th>Conservative (28/36)</th>
              <th>Mid-range (36%)</th>
              <th>Full monthly housing cost</th>
              <th>Run your numbers</th>
            </tr>
          </thead>
          <tbody>
            {SALARY_BAND_ROWS.map((row) => (
              <tr key={row.annualIncome}>
                <td>{formatCurrency(row.annualIncome)}</td>
                <td>{row.conservativePrice > 0 ? formatCurrency(row.conservativePrice) : '—'}</td>
                <td>{row.moderatePrice > 0 ? formatCurrency(row.moderatePrice) : '—'}</td>
                <td>{row.moderatePayment > 0 ? `${formatCurrency(row.moderatePayment)}/mo` : '—'}</td>
                <td>
                  {row.annualIncome === 100_000 ? (
                    <>
                      <Link href="/guides/afford-house-100k-salary">Worked $100K example</Link>
                      {' · '}
                      <Link href={row.calculatorHref}>Calculator</Link>
                    </>
                  ) : (
                    <Link href={row.calculatorHref}>Affordability calculator</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>

      <h3>Assumptions behind every row</h3>
      <ul>
        <li>
          <strong>Other monthly debts:</strong> {HUB_SHARED_ASSUMPTIONS.monthlyDebtsNote}
        </li>
        <li>
          <strong>Down payment:</strong> {HUB_SHARED_ASSUMPTIONS.downPaymentNote}
        </li>
        <li>
          <strong>Taxes &amp; insurance:</strong> {HUB_SHARED_ASSUMPTIONS.taxesInsurance}
        </li>
        <li>
          <strong>Loan term:</strong> {HUB_SHARED_ASSUMPTIONS.term}
        </li>
        <li>
          <strong>Illustrative rate:</strong> {HUB_PMMS_THIRTY_YEAR}% 30-year fixed (
          <a href="https://www.freddiemac.com/pmms">Freddie Mac PMMS</a>, week of November 12, 2026) — estimation only,
          not an APR or offer
        </li>
        <li>
          <strong>DTI guidelines:</strong> {HUB_SHARED_ASSUMPTIONS.dtiTiers}
        </li>
        <li>
          <strong>Credit-score band:</strong> {HUB_SHARED_ASSUMPTIONS.creditScore} (for PMI estimates on conventional
          loans)
        </li>
      </ul>

      <h2>Go deeper on $100,000 income</h2>
      <p>
        For a full walkthrough with a live calculator, sensitivity table, and sources, see{' '}
        <Link href="/guides/afford-house-100k-salary">
          How Much House Can I Afford on a $100,000 Salary?
        </Link>
        . That page is the worked example; this hub is the map across salary bands.
      </p>

      <Alert
        severity="warning"
        sx={{
          my: 3,
          borderRadius: 2,
          borderLeft: '4px solid',
          borderColor: '#C2410C',
          bgcolor: '#FFF7ED',
          '& .MuiAlert-icon': { color: '#C2410C' },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <strong>Gross income is not take-home pay.</strong> Compare any payment to your actual monthly budget, not
          only to a DTI percentage. A payment that fits a guideline may still be tight after taxes, utilities,
          maintenance, and savings.
        </Typography>
      </Alert>

      <h2>Why the highest number may not fit your budget</h2>
      <p>
        The top-of-guideline tier in the calculator (43% total debt) can produce a higher price than the mid-range column
        in the table. That does not make it a comfortable payment.{' '}
        <a href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
          HUD has long treated housing costs above 30% of income as a cost burden
        </a>
        . If a payment would crowd out savings or repairs, it does not fit your budget even when it fits a guideline.
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
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">
            CFPB, &quot;What is a debt-to-income ratio?&quot;
          </a>
        </li>
        <li>
          <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">
            CFPB, &quot;What is private mortgage insurance?&quot;
          </a>
        </li>
        <li>
          <a href="https://www.freddiemac.com/pmms">
            Freddie Mac Primary Mortgage Market Survey, week of November 12, 2026
          </a>{' '}
          (30-year fixed average {HUB_PMMS_THIRTY_YEAR}%)
        </li>
        <li>
          <a href="https://selling-guide.fanniemae.com/">
            Fannie Mae Selling Guide
          </a>{' '}
          (agency underwriting standards, including DTI considerations)
        </li>
        <li>
          <a href="https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-081417.html">
            HUD USER, &quot;Defining Housing Affordability&quot;
          </a>
        </li>
        <li>
          <Link href="/calculators/affordability">Dett affordability calculator</Link> and{' '}
          <Link href="/methodology">methodology</Link>
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 18, 2026. This page provides estimates for educational purposes only. Dett.io is not a
        lender, broker, or financial advisor. Actual rates, terms, payments, and eligibility are determined by lenders
        based on your complete financial profile, credit history, property, and market conditions.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}