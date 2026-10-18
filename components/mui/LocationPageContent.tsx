'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import {
  ExpandMore,
  ArrowBack,
  Calculate,
  Place,
  AccountBalance,
  ReceiptLong,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import type { Location } from '@/lib/locations/locationData';
import type { LocationClosingCostData } from '@/lib/locations/locationClosingCosts';
import { ASSUMED_RATE, ASSUMED_TERM } from '@/lib/locations/locationClosingCosts';

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

const CATEGORY_LABELS: Record<string, string> = {
  lender: 'Lender Fees',
  'third-party': 'Third-Party Fees',
  government: 'Government Fees',
  prepaid: 'Prepaid & Escrow',
};

export function LocationPageContent({
  location,
  data,
  related,
}: {
  location: Location;
  data: LocationClosingCostData;
  related: Location[];
}) {
  const inPlace = location.type === 'state' ? location.name : location.fullName;

  const summaryStats = [
    {
      label: 'Typical closing costs',
      value: fmt(data.totalClosingCosts),
      sub: `${data.closingCostPercent.toFixed(1)}% of a ${fmt(data.medianHomePrice)} home`,
    },
    {
      label: 'Cash to close (20% down)',
      value: fmt(data.cashToClose),
      sub: `${fmt(data.downPayment)} down + ${fmt(data.totalClosingCosts)} costs`,
    },
    {
      label: 'Cash to close (10% down)',
      value: fmt(data.cashToCloseAt10Down),
      sub: 'PMI applies below 20% down',
    },
  ];

  const localFactors = [
    {
      icon: <AccountBalance sx={{ color: 'primary.main', fontSize: 22 }} />,
      label: 'Property tax rate',
      value: `${location.propertyTaxRate}% / year`,
      sub: `≈ ${fmt(data.monthlyPropertyTax)}/month on a median-priced home`,
    },
    {
      icon: <ReceiptLong sx={{ color: 'primary.main', fontSize: 22 }} />,
      label: 'Transfer tax',
      value:
        location.transferTaxRate > 0
          ? `${location.transferTaxRate}% of sale price`
          : 'None',
      sub:
        location.transferTaxRate > 0
          ? `≈ ${fmt(data.transferTaxAmount)} on a median-priced home`
          : 'No real estate transfer tax',
    },
    {
      icon: <Place sx={{ color: 'primary.main', fontSize: 22 }} />,
      label: 'Closing handled by',
      value: location.attorneyState ? 'Real estate attorney' : 'Title / escrow company',
      sub: `Typical homeowners insurance: ${fmt(location.avgAnnualInsurance)}/year`,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
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
                Closing Costs by Location
              </Typography>
            </Link>

            <Chip
              label={location.type === 'state' ? 'State Guide' : `${location.stateName} · County Guide`}
              size="small"
              sx={{ mb: 2, bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }}
            />

            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, mb: 2 }}>
              Closing Costs in {location.name}
            </Typography>

            <Typography
              variant="h6"
              component="p"
              data-speakable
              sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 740, lineHeight: 1.6 }}
            >
              On a median-priced home in {inPlace} (about {fmt(data.medianHomePrice)}), expect roughly{' '}
              <strong>{fmt(data.totalClosingCosts)}</strong> in buyer closing costs —{' '}
              {data.closingCostPercent.toFixed(1)}% of the purchase price. With 20% down, total cash
              needed at closing is about <strong>{fmt(data.cashToClose)}</strong>.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={6}>
            {/* Key numbers */}
            <Grid container spacing={2}>
              {summaryStats.map((stat) => (
                <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      bgcolor: 'grey.50',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {stat.sub}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Local market context */}
            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                What Makes {location.name} Different
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                data-speakable
                sx={{ lineHeight: 1.8, fontSize: '1.05rem', mb: 3 }}
              >
                {location.marketNote}
              </Typography>
              <Grid container spacing={2}>
                {localFactors.map((factor) => (
                  <Grid key={factor.label} size={{ xs: 12, sm: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        {factor.icon}
                        <Typography variant="body2" color="text.secondary">
                          {factor.label}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {factor.value}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {factor.sub}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Line-item breakdown */}
            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 1, fontSize: { xs: 24, md: 28 } }}>
                Closing Cost Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Estimated line items for a {fmt(data.medianHomePrice)} home in {inPlace} with 20% down
                at {ASSUMED_RATE}% on a {ASSUMED_TERM}-year fixed loan.
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
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
                        <TableCell align="right">{fmt(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'primary.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Total estimated closing costs</TableCell>
                      <TableCell />
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {fmt(data.totalClosingCosts)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Costs by price point */}
            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 1, fontSize: { xs: 24, md: 28 } }}>
                Closing Costs by Home Price
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                How costs scale across the {location.name} market (20% down, {ASSUMED_RATE}% rate).
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Home price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Est. closing costs
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        % of price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Cash to close
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.pricePoints.map((pp) => (
                      <TableRow key={pp.homePrice}>
                        <TableCell>{fmt(pp.homePrice)}</TableCell>
                        <TableCell align="right">{fmt(pp.totalClosingCosts)}</TableCell>
                        <TableCell align="right">{pp.closingCostPercent.toFixed(1)}%</TableCell>
                        <TableCell align="right">{fmt(pp.cashToCloseAt20Down)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Calculator CTA */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'grey.900',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <Calculate sx={{ color: 'grey.400', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>
                Run Your Own Numbers
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', mb: 3, maxWidth: 520, mx: 'auto' }}>
                These are market-level estimates. Plug in your actual price, down payment, and rate to
                get a personalized line-item estimate for {location.name}.
              </Typography>
              <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label="Closing Cost Calculator"
                  component={Link}
                  href="/calculators/closing-costs"
                  clickable
                  sx={{
                    bgcolor: 'white',
                    color: 'grey.900',
                    fontWeight: 700,
                    px: 2,
                    py: 2.5,
                    fontSize: '0.95rem',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                />
                <Chip
                  label="How Much House Can I Afford?"
                  component={Link}
                  href="/calculators/affordability"
                  clickable
                  sx={{
                    bgcolor: 'transparent',
                    color: 'white',
                    border: '1px solid',
                    borderColor: 'grey.700',
                    fontWeight: 600,
                    px: 2,
                    py: 2.5,
                    fontSize: '0.95rem',
                    '&:hover': { bgcolor: 'grey.800' },
                  }}
                />
              </Stack>
            </Paper>

            {/* FAQ */}
            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                Frequently Asked Questions
              </Typography>
              {data.faqs.map((item, i) => (
                <Accordion
                  key={i}
                  elevation={0}
                  disableGutters
                  defaultExpanded={i === 0}
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

            {/* Related locations */}
            {related.length > 0 && (
              <Box>
                <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
                  Closing Costs in Other Markets
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {related.map((loc) => (
                    <Chip
                      key={loc.slug}
                      label={loc.type === 'state' ? loc.name : `${loc.name}, ${loc.stateCode}`}
                      component={Link}
                      href={`/closing-costs/${loc.slug}`}
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
            )}

            {/* Methodology note */}
            <Typography variant="caption" color="text.disabled" sx={{ lineHeight: 1.7 }}>
              Figures are editorial estimates for educational purposes, based on an approximate median
              home price of {fmt(data.medianHomePrice)} for {inPlace}, an effective property tax rate of{' '}
              {location.propertyTaxRate}%, a transfer tax of {location.transferTaxRate}%, typical
              homeowners insurance of {fmt(location.avgAnnualInsurance)}/year, and a {ASSUMED_RATE}%{' '}
              {ASSUMED_TERM}-year fixed mortgage. Actual costs vary by lender, title company,
              municipality, and negotiation. Figures last reviewed {location.lastUpdated}. Dett.io is
              not a lender and does not provide financial advice.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
