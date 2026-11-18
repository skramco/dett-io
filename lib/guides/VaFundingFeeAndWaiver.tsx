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
import { vaFundingFeeRatePercent } from '@/lib/calculators/mortgageMath';
import { ClozableBlurb } from '@/components/mui/ClozableBlurb';
import { guideFaqs } from '@/lib/guides/guideFaqs';

const SLUG = 'va-funding-fee-and-waiver';

function fundingFeeAmount(homePrice: number, downPaymentPercent: number, opts: {
  firstTimeUse: boolean;
  disabilityExempt: boolean;
  loanPurpose: 'purchase' | 'cash-out' | 'irrrl';
  serviceType?: 'regular' | 'reserves-guard' | 'surviving-spouse';
}): { baseLoan: number; rate: number; fee: number } {
  const baseLoan = Math.round(homePrice * (1 - downPaymentPercent / 100));
  const rate = vaFundingFeeRatePercent(
    downPaymentPercent,
    opts.firstTimeUse,
    opts.serviceType ?? 'regular',
    opts.disabilityExempt,
    opts.loanPurpose
  );
  const fee = Math.round(baseLoan * (rate / 100));
  return { baseLoan, rate, fee };
}

const EX1 = fundingFeeAmount(400_000, 0, { firstTimeUse: true, disabilityExempt: false, loanPurpose: 'purchase' });
const EX2 = fundingFeeAmount(400_000, 5, { firstTimeUse: true, disabilityExempt: false, loanPurpose: 'purchase' });
const EX3 = fundingFeeAmount(400_000, 0, { firstTimeUse: false, disabilityExempt: false, loanPurpose: 'purchase' });
const EX_IRRRL = fundingFeeAmount(320_000, 0, {
  firstTimeUse: false,
  disabilityExempt: false,
  loanPurpose: 'irrrl',
});

function calcHref(params: Record<string, string | number | boolean>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/calculators/va?${search.toString()}`;
}

const EX1_HREF = calcHref({
  homePrice: 400000,
  downPaymentPercent: 0,
  loanPurpose: 'purchase',
  firstTimeUse: true,
  disabilityExempt: false,
});

const EX2_HREF = calcHref({
  homePrice: 400000,
  downPaymentPercent: 5,
  loanPurpose: 'purchase',
  firstTimeUse: true,
  disabilityExempt: false,
});

const EX3_HREF = calcHref({
  homePrice: 400000,
  downPaymentPercent: 0,
  loanPurpose: 'purchase',
  firstTimeUse: false,
  disabilityExempt: false,
});

const EX_WAIVER_HREF = calcHref({
  homePrice: 400000,
  downPaymentPercent: 0,
  loanPurpose: 'purchase',
  firstTimeUse: true,
  disabilityExempt: true,
});

const faqs = guideFaqs[SLUG] ?? [];

export function VaFundingFeeAndWaiver() {
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
          A percentage of the base loan amount — often 1.25% to 3.3% on purchases, unless you qualify for a waiver
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
          On most VA-backed purchase loans, the{' '}
          <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/">
            VA funding fee
          </a>{' '}
          is a one-time charge set as a percentage of the loan amount (not the purchase price). The rate depends on loan
          purpose, whether it is your first or a subsequent use of VA entitlement, and — on purchases — how much you put
          down. Many veterans, some active-duty members, and eligible surviving spouses qualify for a full waiver. You can
          pay the fee at closing or finance it into the loan. Figures below match Dett&apos;s{' '}
          <Link href="/calculators/va">VA Loan Calculator</Link> and VA&apos;s published rate charts effective April 7,
          2023.
        </Typography>
      </Paper>

      <p>
        VA loans do not require monthly mortgage insurance, which is a major savings compared with many low-down-payment
        conventional or FHA loans. In exchange, most borrowers pay a VA funding fee that helps keep the program running for
        taxpayers. The fee is separate from lender closing costs, discount points, and prepaid taxes or insurance.
      </p>
      <p>
        Eligibility for a VA loan — including your Certificate of Eligibility (COE) and whether a lender finds your file
        ready for underwriting — is distinct from whether you owe a funding fee. You can be eligible for the loan program
        and still pay the fee, or qualify for a waiver and owe $0. This page is educational only; it is not a loan offer or a
        decision on a loan.
      </p>

      <h2>How the funding fee is calculated</h2>
      <p>
        For purchases and cash-out refinances, VA calculates the fee on the <strong>base loan amount</strong> — the home
        price minus your down payment — not on the purchase price itself.{' '}
        <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/">
          VA.gov&apos;s example
        </a>{' '}
        illustrates a $200,000 home with $10,000 down (5%): the loan is $190,000 and a 1.5% fee equals $2,850.
      </p>
      <p>
        Dett applies the same rule in{' '}
        <Link href="/methodology">published mortgage math</Link>: funding fee dollars = base loan × rate, rounded to the
        nearest dollar. If you finance the fee, the total loan amount includes that one-time charge, which slightly
        increases principal and interest — the calculator shows both the fee line and the total loan.
      </p>

      <h3>Purchase and construction loans (Veterans, active duty, Reserve/Guard)</h3>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table">
          <thead>
            <tr>
              <th>Down payment</th>
              <th>First use of VA loan benefit</th>
              <th>Subsequent use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Less than 5%</td>
              <td>2.15%</td>
              <td>3.30%</td>
            </tr>
            <tr>
              <td>5% to 9.99%</td>
              <td>1.50%</td>
              <td>1.50%</td>
            </tr>
            <tr>
              <td>10% or more</td>
              <td>1.25%</td>
              <td>1.25%</td>
            </tr>
          </tbody>
        </Box>
      </Box>
      <p>
        Since the Blue Water Navy Vietnam Veterans Act of 2019, members of the Reserve and National Guard use the same
        purchase tiers as active-duty service members. Dett&apos;s calculator treats Reserve/Guard and regular military
        identically for the fee table.
      </p>

      <h3>Cash-out refinance and IRRRL</h3>
      <ul>
        <li>
          <strong>VA cash-out refinance:</strong> 2.15% on first use, 3.30% on subsequent use. Down payment does not
          change these rates — equity does not reduce the funding fee on cash-out loans.
        </li>
        <li>
          <strong>Interest Rate Reduction Refinance Loan (IRRRL):</strong> a flat 0.50% of the loan amount, regardless of
          prior use or down payment.
        </li>
      </ul>
      <p>
        VA.gov also lists fees for other loan types (Native American Direct Loan, manufactured housing, assumptions, and
        others). Dett&apos;s VA calculator models purchase, cash-out, and IRRRL — the three paths most buyers use on this
        site.
      </p>

      <h2>When the funding fee is waived</h2>
      <p>
        According to{' '}
        <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/">
          VA&apos;s current guidance
        </a>
        , you generally will not pay a funding fee if any of the following apply:
      </p>
      <ul>
        <li>
          You receive VA disability compensation for a service-connected disability (commonly discussed as a 10% or
          higher rating, but VA makes the determination on your award letter).
        </li>
        <li>
          You are eligible for VA compensation for a service-connected disability but are receiving retirement or
          active-duty pay instead of that compensation.
        </li>
        <li>
          You receive Dependency and Indemnity Compensation (DIC) as an eligible surviving spouse of a Veteran. In
          Dett&apos;s calculator, selecting surviving-spouse service type with the DIC waiver models this exemption.
        </li>
        <li>
          You have a proposed or memorandum rating before loan closing that says you are eligible for compensation
          because of a pre-discharge claim.
        </li>
        <li>
          You are on active duty, and on or before the loan closing date you provide evidence that you received a Purple
          Heart.
        </li>
      </ul>
      <p>
        VA notes that if compensation is awarded only after closing, you may still have paid the fee at closing but could
        qualify for a refund if the effective date of the disability rating is retroactive to before the loan closed. If
        you receive a proposed rating after closing, the fee is not refundable on that basis alone.
      </p>
      <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          A waiver is about the funding fee, not about whether you qualify for a VA loan. You still need to meet lender
          requirements, obtain a COE, and satisfy underwriting — including VA residual income guidelines for your region
          and family size, which the calculator estimates separately from the fee.
        </Typography>
      </Alert>

      <h2>Paying up front vs financing the fee</h2>
      <p>
        VA lets you pay the funding fee in cash at closing or add it to the loan balance. Financing spreads the cost over
        the loan term and increases interest paid over time, but it preserves cash for moving expenses, reserves, or other
        closing costs. On a purchase loan, VA allows only the funding fee to be financed into the loan amount — other
        closing charges are still due at closing unless the seller or lender provides credits, as VA describes on the same
        funding-fee page.
      </p>

      <h2>Worked examples (same fee table as the calculator)</h2>
      <p>
        Each example uses a $400,000 home price and an illustrative 6.25% interest rate (Dett&apos;s VA calculator default
        from Freddie Mac PMMS data — an example rate for math only, not a quote). Open the prefilled calculator to see
        payment, residual income, and total loan with the fee financed.
      </p>

      <h3>Example 1: First-time purchase, $0 down</h3>
      <p>
        Base loan: {formatCurrency(EX1.baseLoan)}. Rate: {EX1.rate}%. Funding fee:{' '}
        <strong>{formatCurrency(EX1.fee)}</strong>. Total loan if financed: {formatCurrency(EX1.baseLoan + EX1.fee)}.
      </p>
      <p>
        <Link href={EX1_HREF}>Open this scenario in the VA calculator →</Link>
      </p>

      <h3>Example 2: First-time purchase, 5% down</h3>
      <p>
        Down payment {formatCurrency(20_000)}; base loan {formatCurrency(EX2.baseLoan)}. Rate drops to {EX2.rate}%.
        Funding fee: <strong>{formatCurrency(EX2.fee)}</strong> — {formatCurrency(EX1.fee - EX2.fee)} less than the
        zero-down first-use case in Example 1.
      </p>
      <p>
        <Link href={EX2_HREF}>Open this scenario in the VA calculator →</Link>
      </p>

      <h3>Example 3: Subsequent use, $0 down</h3>
      <p>
        If you have used VA entitlement before on a purchase, the sub-5% tier rises from 2.15% to 3.30%. On a{' '}
        {formatCurrency(400_000)} home with no down payment, the fee is{' '}
        <strong>{formatCurrency(EX3.fee)}</strong> ({EX3.rate}% × {formatCurrency(EX3.baseLoan)}).
      </p>
      <p>
        <Link href={EX3_HREF}>Open this scenario in the VA calculator →</Link>
      </p>

      <p>
        If you qualify for a funding-fee waiver on the same {formatCurrency(400_000)} purchase, the fee drops to{' '}
        <strong>{formatCurrency(0)}</strong> —{' '}
        <Link href={EX_WAIVER_HREF}>model the exemption in the VA calculator</Link>.
      </p>

      <p>
        For an IRRRL on a {formatCurrency(320_000)} loan balance, the flat {EX_IRRRL.rate}% fee would be{' '}
        {formatCurrency(EX_IRRRL.fee)} — use loan purpose &quot;IRRRL&quot; in the calculator to model streamline
        refinances.
      </p>

      <h2>Calculator vs VA.gov fee table</h2>
      <p>
        Dett audited this page against{' '}
        <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/">
          VA.gov&apos;s rate charts (effective April 7, 2023)
        </a>{' '}
        on November 18, 2026. Purchase tiers (2.15% / 1.5% / 1.25% and 3.3% / 1.5% / 1.25%), cash-out rates (2.15% / 3.3%),
        and the 0.5% IRRRL fee match the calculator&apos;s{' '}
        <code>vaFundingFeeRatePercent</code> logic and VA&apos;s published tables. VA.gov additionally lists NADL,
        manufactured-home, assumption, and vendee loan fees that are outside this calculator&apos;s loan-purpose options —
        not a mismatch for the paths modeled here.
      </p>

      <h2>Getting ready with your COE and fee status</h2>
      <p>
        Before closing, confirm your funding-fee status with your lender and your COE. Lenders typically verify exemption
        through VA&apos;s systems — award letters, proposed ratings, or surviving-spouse DIC documentation. If you are not sure
        whether a rating will be in place by closing, model both scenarios in the calculator (fee on vs waiver) so cash-to-close
        estimates stay realistic.
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
          <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/">
            U.S. Department of Veterans Affairs, &quot;VA funding fee and loan closing costs&quot;
          </a>{' '}
          (rate charts effective April 7, 2023; page last updated October 5, 2026 per VA.gov)
        </li>
        <li>
          <a href="https://www.ecfr.gov/current/title-38/chapter-I/part-36">
            Code of Federal Regulations, Title 38, Part 36 (VA home loan program)
          </a>
        </li>
        <li>
          <a href="https://www.benefits.va.gov/homeloans/">
            VA Home Loans program overview
          </a>
        </li>
        <li>
          <Link href="/calculators/va">Dett VA Loan Calculator</Link> and{' '}
          <Link href="/methodology">calculation methodology</Link>
        </li>
        <li>
          <Link href="/compare/va-vs-fha-vs-conventional">VA vs FHA vs conventional comparison</Link> for program
          context (not a substitute for fee tables)
        </li>
      </ul>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 3, lineHeight: 1.7 }}>
        Last reviewed November 18, 2026. This page provides estimates for educational purposes only. Dett.io is not a
        lender, broker, or financial advisor. Actual rates, fees, exemptions, and eligibility are determined by VA and your
        lender based on your service record, disability status, loan file, and closing date.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <ClozableBlurb placement="guide" calculatorSlug={SLUG} align="left" />
      </Box>
    </>
  );
}