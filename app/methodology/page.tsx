'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import {
  CONFORMING_LOAN_LIMIT_DISPLAY,
  FHA_LOAN_LIMIT_CEILING_DISPLAY,
  FHA_LOAN_LIMIT_FLOOR_DISPLAY,
  LOAN_LIMIT_YEAR,
} from '@/lib/calculators/loanLimits';
import { ARM_RATE_PATH_ASSUMPTIONS } from '@/lib/calculators/armVsFixed';
import { RENT_VS_BUY_SCENARIO_ASSUMPTIONS } from '@/lib/calculators/rentVsBuy';

const dataSources = [
  {
    area: 'Mortgage interest rates',
    how: 'You enter the rate you were quoted. We never guess your rate for you.',
    source: 'For a market reference point, see the Freddie Mac Primary Mortgage Market Survey (PMMS), published weekly.',
    link: 'https://www.freddiemac.com/pmms',
    linkLabel: 'freddiemac.com/pmms',
  },
  {
    area: 'Conforming & FHA loan limits',
    how: `The FHA calculator checks your base loan against the ${LOAN_LIMIT_YEAR} FHA floor (${FHA_LOAN_LIMIT_FLOOR_DISPLAY}) and ceiling (${FHA_LOAN_LIMIT_CEILING_DISPLAY}). Conventional loans above the conforming baseline (${CONFORMING_LOAN_LIMIT_DISPLAY}) are flagged as jumbo. Limits vary by county.`,
    source: 'FHFA conforming loan limits and HUD FHA mortgage limits.',
    link: 'https://www.fhfa.gov/data/conforming-loan-limit-cll-values',
    linkLabel: 'fhfa.gov',
  },
  {
    area: 'FHA mortgage insurance (MIP)',
    how: 'Upfront MIP of 1.75% of the base loan, plus annual MIP of 0.15%–0.75% depending on loan term, LTV, and amount.',
    source: 'HUD FHA annual MIP schedule (Mortgagee Letter 2023-05).',
    link: 'https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1',
    linkLabel: 'hud.gov',
  },
  {
    area: 'VA funding fee',
    how: 'Rates from 1.25% to 3.3% based on down payment, first vs. subsequent use, and service type; waived with a qualifying disability rating.',
    source: 'Official VA funding fee rate tables.',
    link: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/',
    linkLabel: 'va.gov',
  },
  {
    area: 'Private mortgage insurance (PMI)',
    how: 'Estimated annual rates of roughly 0.2%–1.5% of the loan amount, scaled by LTV and credit score band.',
    source: 'Modeled on published rate cards from major private mortgage insurers (e.g., MGIC, Radian). Your actual quote will vary.',
    link: 'https://www.mgic.com/rates',
    linkLabel: 'mgic.com/rates',
  },
  {
    area: 'Debt-to-income thresholds',
    how: 'The 28%/36% housing and total-debt guideline, the 43% qualified-mortgage benchmark, and FHA allowances up to ~50% with compensating factors.',
    source: 'CFPB qualified mortgage rule and HUD Handbook 4000.1 underwriting guidelines.',
    link: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/43/',
    linkLabel: 'consumerfinance.gov',
  },
  {
    area: 'Closing costs',
    how: 'Itemized estimates that total the commonly cited 2%–5% of the home price, broken into lender, third-party, and prepaid items. State selection switches attorney-closing vs title/escrow custom and the statewide transfer-tax rate.',
    source: 'CFPB closing cost guidance and industry averages; state transfer-tax and attorney-closing customs from published state tables.',
    link: 'https://www.consumerfinance.gov/owning-a-home/closing-disclosure/',
    linkLabel: 'consumerfinance.gov',
  },
  {
    area: 'Property tax (by state / ZIP)',
    how: 'A State/ZIP input prefills an effective annual tax rate as a percent of home value. ZIP prefixes refine a few large metros where local rates diverge from the statewide average. You can always override the number.',
    source: 'Tax Foundation effective property tax rates on owner-occupied housing, latest published figures.',
    link: 'https://taxfoundation.org/data/all/state/property-taxes-by-state/',
    linkLabel: 'taxfoundation.org',
  },
  {
    area: 'Homeowners insurance (by state / ZIP)',
    how: 'Typical annual HO-3 premiums as a percent of dwelling value. Hurricane, hail, and wildfire states are higher than the inland band. Scaled to the home price you enter.',
    source: 'NAIC / Insurance Information Institute average homeowners premium by state, expressed as a percent of value.',
    link: 'https://www.iii.org/fact-statistic/facts-statistics-homeowners-and-renters-insurance',
    linkLabel: 'iii.org',
  },
  {
    area: 'ARM index scenarios',
    how: `Named paths hold the index at expected ${ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift} / 0 / +${ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift} points. Monte Carlo draws ${ARM_RATE_PATH_ASSUMPTIONS.samples} seeded mean-reverting index paths (σ = ${ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent}% / year, κ = ${ARM_RATE_PATH_ASSUMPTIONS.meanReversion}). Caps still bind every path. Worst case is the cap-driven upper bound, not a random draw.`,
    source: 'Modeled on historical SOFR / Treasury-bill volatility; not a forecast. Caps follow typical CFPB ARM disclosures (initial / periodic / lifetime).',
    link: 'https://www.consumerfinance.gov/owning-a-home/adjustable-rate-mortgages/',
    linkLabel: 'consumerfinance.gov',
  },
  {
    area: 'Rent vs buy scenario range',
    how: `Named paths jointly shift appreciation, rent inflation, and investment return. Monte Carlo draws ${RENT_VS_BUY_SCENARIO_ASSUMPTIONS.samples} seeded truncated-normal samples (σ = ${RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.appreciation} / ${RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.rentInflation} / ${RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.investmentReturn} pts). Results are shown as P10–P90 bands and the share of paths where buying ends ahead.`,
    source: 'Illustrative long-run dispersion around your inputs — not a prediction of local housing, rents, or market returns.',
    link: 'https://www.fhfa.gov/data/hpi',
    linkLabel: 'fhfa.gov/data/hpi',
  },
];

export default function MethodologyPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 36, md: 48 } }}>
              Methodology &amp; Data Sources
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
              Every number our calculators produce comes from a documented formula and a cited
              assumption. This page explains the math, where the data comes from, and how we keep
              it current.
            </Typography>
          </Container>
        </Box>

        <Container
          maxWidth="md"
          sx={{
            py: { xs: 6, md: 8 },
            '& h2': { fontSize: { xs: 22, md: 26 }, fontWeight: 700, mt: 5, mb: 1.5 },
            '& p': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 2 },
            '& ul': { pl: 3, mb: 2, '& li': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 0.5 } },
          }}
        >
          <Stack spacing={0}>
            <h2>How the calculators work</h2>
            <p>
              All calculations run locally in your browser. Nothing you type is sent to our
              servers, and results appear instantly. Each calculator also includes a{' '}
              <strong>&ldquo;Show Me the Math&rdquo;</strong> panel that walks through the exact
              formula behind every number on the page, with your own inputs plugged in.
            </p>

            <h2>Core formulas</h2>
            <p>
              Monthly principal &amp; interest uses the standard amortization formula that lenders
              use:
            </p>
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                mb: 2,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                overflowX: 'auto',
              }}
            >
              M = P × r × (1 + r)ⁿ ÷ [(1 + r)ⁿ − 1]
            </Box>
            <ul>
              <li><strong>M</strong> — monthly principal &amp; interest payment</li>
              <li><strong>P</strong> — loan principal</li>
              <li><strong>r</strong> — monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
              <li><strong>n</strong> — total number of monthly payments (term in years × 12)</li>
            </ul>
            <p>
              Amortization schedules, payoff timelines, break-even points, and refinance
              comparisons are all derived from this same formula — we recompute the remaining
              balance month by month rather than approximating. Affordability estimates apply the
              28%/36% debt-to-income guideline and solve the amortization formula for principal.
            </p>

            <h2>Data sources and assumptions</h2>
            <p>
              Where a calculator relies on a rate table or guideline rather than your inputs, this
              is where the numbers come from:
            </p>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>What</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>How we model it</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSources.map((row) => (
                    <TableRow key={row.area} sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, verticalAlign: 'top', minWidth: 140 }}>
                        {row.area}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', verticalAlign: 'top' }}>
                        {row.how}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', verticalAlign: 'top' }}>
                        {row.source}{' '}
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          ({row.linkLabel})
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <h2>Rate-path and Monte Carlo scenarios</h2>
            <p>
              Two calculators — <Link href="/calculators/arm-vs-fixed">ARM vs Fixed</Link> and{' '}
              <Link href="/calculators/rent-vs-buy">Rent vs Buy</Link> — no longer rest on a single
              expected line plus a best/base/worst trio. They show a <strong>range of paths</strong>,
              with every assumption on the page and here.
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>ARM vs Fixed</h3>
            <ul>
              <li>
                <strong>Named index paths.</strong> After the fixed period, we hold the index at your
                expected rate, {ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift} percentage points, and +
                {ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift} percentage points (floored at 0%), then
                apply the same initial / periodic / lifetime caps as the loan.
              </li>
              <li>
                <strong>Monte Carlo.</strong> {ARM_RATE_PATH_ASSUMPTIONS.samples} seeded draws of a
                mean-reverting index: x ← x + κ(μ − x)Δt + σ√Δt · Z, with μ = your expected index,
                σ = {ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent}% per year, κ = {ARM_RATE_PATH_ASSUMPTIONS.meanReversion},
                and Δt equal to the adjustment period. The index cannot go negative. The PRNG is
                deterministic (seed {ARM_RATE_PATH_ASSUMPTIONS.seed}) so the same inputs always produce
                the same percentiles.
              </li>
              <li>
                <strong>Worst case is not sampled.</strong> It is the cap-driven path: every adjustment
                hits its cap until the lifetime cap. That is an upper bound, not a probability.
              </li>
            </ul>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Rent vs Buy</h3>
            <ul>
              <li>
                <strong>Named joint paths.</strong> Optimistic (buying-friendly) and pessimistic
                (renting-friendly) shift appreciation, rent inflation, <em>and</em> investment return
                together — not appreciation alone, which used to be the entire best/base/worst story.
              </li>
              <li>
                <strong>Monte Carlo.</strong> {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.samples} seeded draws
                from truncated normals around your three inputs (appreciation σ = {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.appreciation} pts,
                rent inflation σ = {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.rentInflation} pts,
                investment return σ = {RENT_VS_BUY_SCENARIO_ASSUMPTIONS.vol.investmentReturn} pts).
                We report P10 / P50 / P90 of the buy-minus-rent net-worth gap and the share of paths
                where buying ends ahead.
              </li>
              <li>
                <strong>This is a sensitivity range, not a forecast.</strong> Local housing, rent, and
                market returns can move together in ways a simple independent-draw model misses. Use
                the band to see how fragile the base-path verdict is.
              </li>
            </ul>

            <h2>How often everything is reviewed</h2>
            <p>
              Every calculator page shows a <strong>&ldquo;Last updated&rdquo;</strong> date — the
              last time we reviewed that calculator&apos;s formulas, rate tables, and assumptions.
              We re-review whenever the underlying guidelines change (for example, annual FHFA
              loan-limit announcements or HUD MIP schedule updates), and we correct errors as soon
              as they are reported.
            </p>

            <h2>Limitations</h2>
            <p>
              Our results are estimates for education and comparison, not loan offers. Actual
              rates, mortgage insurance premiums, taxes, and fees depend on your full financial
              profile, the property, and the lender. Always compare official Loan Estimates from
              multiple lenders before committing.
            </p>

            <h2>Found a mistake?</h2>
            <p>
              If you spot an error in a formula or an outdated assumption, email{' '}
              <a href="mailto:legal@dett.io" style={{ color: 'inherit' }}>legal@dett.io</a> and
              we&apos;ll fix it. You can read more about who builds and maintains these tools on
              our <Link href="/about" style={{ color: 'inherit' }}>About page</Link>.
            </p>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
