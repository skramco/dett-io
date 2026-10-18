'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import { ArrowForward, Place, Map } from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

export interface HubLocationSummary {
  slug: string;
  name: string;
  stateCode: string;
  type: 'state' | 'county';
  medianHomePrice: number;
  totalClosingCosts: number;
  closingCostPercent: number;
}

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

function LocationCard({ loc }: { loc: HubLocationSummary }) {
  return (
    <Paper
      component={Link}
      href={`/closing-costs/${loc.slug}`}
      elevation={0}
      sx={{
        p: 2.5,
        display: 'block',
        textDecoration: 'none',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'border-color 0.2s, background-color 0.2s',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {loc.type === 'state' ? loc.name : `${loc.name}, ${loc.stateCode}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ≈ {fmt(loc.totalClosingCosts)} closing costs ({loc.closingCostPercent.toFixed(1)}%) on a{' '}
            {fmt(loc.medianHomePrice)} home
          </Typography>
        </Box>
        <ArrowForward sx={{ color: 'text.disabled', fontSize: 20 }} />
      </Stack>
    </Paper>
  );
}

export function LocationHubContent({
  states,
  counties,
}: {
  states: HubLocationSummary[];
  counties: HubLocationSummary[];
}) {
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
            <Chip
              label="Location Guides"
              size="small"
              sx={{ mb: 2, bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }}
            />
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, mb: 2 }}>
              Closing Costs by Location
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 740, lineHeight: 1.6 }}
            >
              Closing costs vary dramatically by market — transfer taxes range from zero to over 2%,
              and property tax prepaids can triple between states. See estimated line-item costs on a
              median-priced home in your market, no signup required.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={6}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                <Place sx={{ color: 'primary.main' }} />
                <Typography variant="h4" component="h2" sx={{ fontSize: { xs: 24, md: 28 } }}>
                  Counties & Metros
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {counties.map((loc) => (
                  <Grid key={loc.slug} size={{ xs: 12, sm: 6 }}>
                    <LocationCard loc={loc} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                <Map sx={{ color: 'primary.main' }} />
                <Typography variant="h4" component="h2" sx={{ fontSize: { xs: 24, md: 28 } }}>
                  States
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {states.map((loc) => (
                  <Grid key={loc.slug} size={{ xs: 12, sm: 6 }}>
                    <LocationCard loc={loc} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Calculator CTA */}
            <Paper
              elevation={0}
              sx={{ p: { xs: 3, md: 4 }, bgcolor: 'grey.900', borderRadius: 4, textAlign: 'center' }}
            >
              <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>
                Don&apos;t See Your Market?
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', mb: 3, maxWidth: 520, mx: 'auto' }}>
                Use the closing cost calculator with your own price, down payment, and local tax rates
                to get a personalized estimate anywhere in the U.S.
              </Typography>
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
            </Paper>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
