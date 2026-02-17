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
import { CompareArrows, ArrowForward } from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { comparisons } from '@/lib/comparisons/comparisonData';

export const metadata: Metadata = {
  title: 'Mortgage Comparisons | Dett.io',
  description: 'Side-by-side mortgage comparisons to help you choose the right loan. Compare FHA vs conventional, ARM vs fixed, 15 vs 30-year, rent vs buy, and more.',
  keywords: ['mortgage comparison', 'compare mortgages', 'FHA vs conventional', 'ARM vs fixed', 'rent vs buy', '15 vs 30 year mortgage'],
  alternates: {
    canonical: 'https://dett.io/compare',
  },
  openGraph: {
    title: 'Mortgage Comparisons | Dett.io',
    description: 'Side-by-side mortgage comparisons to help you choose the right loan.',
    url: 'https://dett.io/compare',
    siteName: 'Dett.io',
    type: 'website',
  },
};

export default function ComparePage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 4, md: 6 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
            backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(25, 107, 192, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                <CompareArrows sx={{ fontSize: 40 }} />
              </Paper>
              <Box sx={{ flex: 1 }}>
                <Chip
                  label="Decision Guides"
                  size="small"
                  sx={{ mb: 2, bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 600 }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontSize: { xs: 28, sm: 36, md: 44 }, mb: 2, fontWeight: 600 }}
                >
                  Mortgage Comparisons
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 700, fontWeight: 400, fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  Side-by-side comparisons to help you choose the right mortgage. Each guide includes pros, cons, feature tables, and links to our free calculators.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Comparison Cards */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={3}>
            {comparisons.map((comp) => (
              <Grid key={comp.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Link href={`/compare/${comp.slug}`} style={{ textDecoration: 'none' }}>
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
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Chip
                        label={comp.optionAName}
                        size="small"
                        sx={{ bgcolor: '#196bc0', color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" color="text.disabled">vs</Typography>
                      <Chip
                        label={comp.optionBName}
                        size="small"
                        sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {comp.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {comp.subtitle}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#196bc0' }}>
                        Read comparison
                      </Typography>
                      <ArrowForward sx={{ fontSize: 16, color: '#196bc0' }} />
                    </Stack>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
