import { Metadata } from 'next';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { Place, ArrowForward } from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import {
  locations,
  LOCATION_REGIONS,
  locationLabel,
} from '@/lib/locations/locationData';
import { formatCurrency } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Closing Costs by State (2026) | Dett.io',
  description:
    'How much are closing costs in your state? Guides for all 50 states and D.C. with server-rendered numbers — itemized estimates, property tax rates, 2026 conforming loan limits, and cash needed to close.',
  keywords: [
    'closing costs by state',
    'property tax rates by state',
    'conforming loan limits 2026',
    'transfer tax by state',
    'how much are closing costs',
  ],
  alternates: {
    canonical: 'https://dett.io/closing-costs',
  },
  openGraph: {
    title: 'Closing Costs by State (2026) | Dett.io',
    description:
      'State-by-state closing cost guides with itemized estimates, property tax rates, and 2026 conforming loan limits.',
    url: 'https://dett.io/closing-costs',
    siteName: 'Dett.io',
    type: 'website',
  },
};

const usd = formatCurrency;

function StateCard({
  slug,
  label,
  medianHomePrice,
  propertyTaxRate,
  conformingLoanLimit,
}: {
  slug: string;
  label: string;
  medianHomePrice: number;
  propertyTaxRate: number;
  conformingLoanLimit: number;
}) {
  return (
    <Link href={`/closing-costs/${slug}`} style={{ textDecoration: 'none' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: '#196bc0',
            boxShadow: '0 8px 24px rgba(25, 107, 192, 0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          Median price {usd(medianHomePrice)} · {propertyTaxRate}% property tax ·
          2026 loan limit {usd(conformingLoanLimit)}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#196bc0' }}>
            See the breakdown
          </Typography>
          <ArrowForward sx={{ fontSize: 16, color: '#196bc0' }} />
        </Stack>
      </Paper>
    </Link>
  );
}

export default function ClosingCostsIndexPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <Box
          sx={{
            pt: { xs: 4, md: 6 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#196bc0',
                  color: 'white',
                  borderRadius: 3,
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Place sx={{ fontSize: 40 }} />
              </Paper>
              <Box sx={{ flex: 1 }}>
                <Chip
                  label="50 states + D.C."
                  size="small"
                  sx={{ mb: 2, bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 600 }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontSize: { xs: 28, sm: 36, md: 44 }, mb: 2, fontWeight: 600 }}
                >
                  Closing Costs by State
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 720, fontWeight: 400, fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  Closing costs vary a lot by state — transfer taxes, property taxes, insurance,
                  attorney customs, and 2026 conforming loan limits all change the math. Pick a
                  state for an itemized estimate on a median-priced home.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {LOCATION_REGIONS.map((region) => {
            const regionStates = locations.filter((l) => l.region === region.id);
            return (
              <Box key={region.id} sx={{ mb: 6 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 26 } }}>
                  {region.label}
                </Typography>
                <Grid container spacing={3}>
                  {regionStates.map((loc) => (
                    <Grid key={loc.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <StateCard
                        slug={loc.slug}
                        label={locationLabel(loc)}
                        medianHomePrice={loc.medianHomePrice}
                        propertyTaxRate={loc.propertyTaxRate}
                        conformingLoanLimit={loc.conformingLoanLimit}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
