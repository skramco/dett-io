'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ExpandMore, Calculate, ArrowBack, Place } from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { FAQJsonLd, JsonLd } from '@/components/JsonLd';
import type { LocationPageData } from '@/lib/locations/locationMath';

const usd = (v: number) => `$${Math.round(v).toLocaleString()}`;

const CATEGORY_LABELS: Record<string, string> = {
  lender: 'Lender fees',
  'third-party': 'Third-party fees',
  government: 'Government fees',
  prepaid: 'Prepaids & escrow',
};

function StatCard({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        flex: '1 1 200px',
        minWidth: 180,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" component="p" sx={{ fontWeight: 700 }} data-speakable>
        {value}
      </Typography>
      {caption && (
        <Typography variant="caption" color="text.secondary">
          {caption}
        </Typography>
      )}
    </Paper>
  );
}

export function LocationPageContent({
  data,
  otherLocations,
}: {
  data: LocationPageData;
  otherLocations: { slug: string; label: string }[];
}) {
  const { location, label, year, assumptions, interestRate } = data;
  const loanLimitCaption = location.highCostLoanLimit
    ? `High-cost counties up to ${usd(location.highCostLoanLimit)}`
    : '2026 one-unit conforming limit';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <FAQJsonLd questions={data.faqs} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dett.io' },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Closing Costs by State',
              item: 'https://dett.io/closing-costs',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: label,
              item: `https://dett.io/closing-costs/${location.slug}`,
            },
          ],
        }}
      />

      <Box component="main" sx={{ flex: 1 }}>
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.50',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Link
              href="/closing-costs"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}
            >
              <ArrowBack sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                All states
              </Typography>
            </Link>

            <Chip
              icon={<Place sx={{ fontSize: 16 }} />}
              label="State Guide"
              size="small"
              sx={{ mb: 2, bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }}
            />

            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, mb: 2 }}>
              Closing Costs in {label} ({year})
            </Typography>

            <Typography
              variant="h6"
              component="p"
              data-speakable
              sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 740, lineHeight: 1.6 }}
            >
              Buyers in {label} typically pay {usd(data.closingCostsLow)} to {usd(data.closingCostsHigh)} in
              closing costs (2–5%) on a median-priced home of {usd(data.medianHomePrice)}. Our itemized
              estimate: about {usd(data.closingCostsTotal)} ({data.closingCostsPercent}% of the price),
              plus a {usd(data.downPayment)} down payment at {assumptions.downPaymentPercent}% down.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={6}>
            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2.5, fontSize: { xs: 24, md: 28 } }}>
                {label} at a Glance
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                <StatCard label="Median home price" value={usd(data.medianHomePrice)} />
                <StatCard
                  label="Estimated closing costs"
                  value={usd(data.closingCostsTotal)}
                  caption={`${data.closingCostsPercent}% of price`}
                />
                <StatCard
                  label="Property tax rate"
                  value={`${location.propertyTaxRate}%`}
                  caption={`≈ ${usd(data.annualPropertyTax)}/year`}
                />
                <StatCard
                  label="2026 conforming loan limit"
                  value={usd(location.conformingLoanLimit)}
                  caption={loanLimitCaption}
                />
                <StatCard
                  label="Cash to close"
                  value={usd(data.cashToClose)}
                  caption={`${assumptions.downPaymentPercent}% down + closing costs`}
                />
                <StatCard
                  label="Monthly payment"
                  value={usd(data.monthlyPayment)}
                  caption={`${assumptions.loanTermYears}-yr at ${interestRate}%`}
                />
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'primary.50',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'primary.100',
              }}
            >
              <Typography variant="h5" component="h2" sx={{ mb: 1.5, fontWeight: 700 }}>
                What Makes {label} Different
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }} data-speakable>
                {location.insight}
              </Typography>
              {data.transferTaxNote && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
                  {data.transferTaxNote}
                </Typography>
              )}
            </Paper>

            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                Local cost factors
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                <StatCard
                  label="Buyer-paid transfer tax"
                  value={data.buyerTransferTax > 0 ? usd(data.buyerTransferTax) : 'None typical'}
                  caption={
                    data.buyerTransferTax > 0
                      ? location.buyerTransferShare === 0.5
                        ? 'Buyer half of the statewide estimate on the median home'
                        : 'Statewide estimate on the median home'
                      : 'Seller-paid or no state transfer tax'
                  }
                />
                <StatCard
                  label="Closing custom"
                  value={data.attorneyCustomary ? 'Attorney closing' : 'Title / escrow'}
                  caption={
                    data.attorneyCustomary
                      ? `${label} typically requires a closing attorney`
                      : 'Closings usually run through a title or escrow company'
                  }
                />
                <StatCard
                  label="Homeowners insurance"
                  value={`${usd(location.annualInsurance)}/yr`}
                  caption="Typical premium scaled to the median-priced example"
                />
                <StatCard
                  label="Example loan vs. limit"
                  value={data.isJumboAtExample ? 'May be jumbo' : 'Conforming'}
                  caption={`${usd(data.loanAmount)} loan at ${assumptions.downPaymentPercent}% down`}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 1, fontSize: { xs: 24, md: 28 } }}>
                Itemized Closing Cost Estimate
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Assumes a {usd(data.medianHomePrice)} purchase with {assumptions.downPaymentPercent}% down
                ({usd(data.loanAmount)} loan) at {interestRate}% for {assumptions.loanTermYears} years,
                a {location.propertyTaxRate}% property tax rate, and {usd(location.annualInsurance)}/year
                insurance. Transfer tax includes only the share buyers in {label} customarily pay.
              </Typography>
              <Paper
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Line Item</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Estimate
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.lineItems.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {CATEGORY_LABELS[item.category]}
                        </TableCell>
                        <TableCell align="right">{usd(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Total estimated closing costs</TableCell>
                      <TableCell />
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {usd(data.closingCostsTotal)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Box>

            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                What You&apos;d Pay Each Month
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                On a median-priced {label} home with {assumptions.downPaymentPercent}% down, the full monthly
                payment is about <strong>{usd(data.monthlyPayment)}</strong>: {usd(data.monthlyPI)} in principal
                and interest, {usd(data.monthlyTax)} in property taxes, and {usd(data.monthlyInsurance)} in
                homeowners insurance. Taxes and insurance here add{' '}
                {Math.round(((data.monthlyTax + data.monthlyInsurance) / data.monthlyPI) * 100)}% on top of the
                loan payment itself.
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Calculate sx={{ color: 'primary.main' }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                  Run Your Own Numbers
                </Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {[
                  { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
                  { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
                  { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
                  { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
                ].map((calc) => (
                  <Chip
                    key={calc.href}
                    label={calc.name}
                    component={Link}
                    href={calc.href}
                    clickable
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 1,
                      py: 2.5,
                      fontSize: '0.9rem',
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                Frequently Asked Questions
              </Typography>
              {data.faqs.map((item) => (
                <Accordion
                  key={item.question}
                  elevation={0}
                  disableGutters
                  defaultExpanded
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px !important',
                    mb: 1.5,
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography component="h3" sx={{ fontWeight: 600 }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {otherLocations.length > 0 && (
              <Box>
                <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
                  Nearby states
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {otherLocations.map((loc) => (
                    <Chip
                      key={loc.slug}
                      label={loc.label}
                      component={Link}
                      href={`/closing-costs/${loc.slug}`}
                      clickable
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: 'block' }}>
              Figures on this page are educational estimates, last reviewed{' '}
              {new Date(location.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
              . Median prices (Redfin via Bankrate), effective property tax rates (Tax Foundation),
              insurance (Bankrate 2026 averages scaled to the median home), and 2026 conforming loan
              limits (FHFA) are approximations that vary by county, property, lender, and transaction.
              They are not a Loan Estimate and not financial advice — your lender&apos;s official Loan
              Estimate is the authoritative document for your closing costs. See our{' '}
              <Link href="/methodology" style={{ color: 'inherit' }}>
                methodology
              </Link>
              .
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
