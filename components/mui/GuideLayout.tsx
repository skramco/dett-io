'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Paper,
  Breadcrumbs,
  Avatar,
} from '@mui/material';
import {
  ArrowForward,
  AccessTime,
  Calculate,
  ArrowBack,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import type { Guide } from '@/lib/guides/guideData';
import { ArticleJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { guideFaqs } from '@/lib/guides/guideFaqs';

interface GuideLayoutProps {
  guide: Guide;
  children: React.ReactNode;
}

const categoryLabels: Record<string, string> = {
  salary: 'Salary Guide',
  decision: 'Decision Guide',
  cost: 'Cost Guide',
};

const categoryColors: Record<string, { bg: string; fg: string }> = {
  salary: { bg: '#EBF5FF', fg: '#006397' },
  decision: { bg: '#F0FDF4', fg: '#15803D' },
  cost: { bg: '#FFF7ED', fg: '#C2410C' },
};

export function GuideLayout({ guide, children }: GuideLayoutProps) {
  const colors = categoryColors[guide.category] || categoryColors.salary;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ArticleJsonLd
        title={guide.title}
        description={guide.description}
        slug={guide.slug}
        datePublished="2026-02-13"
        readTime={guide.readTime}
      />
      {guideFaqs[guide.slug] && (
        <FAQJsonLd questions={guideFaqs[guide.slug]} />
      )}
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 4, md: 6 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Breadcrumbs sx={{ mb: 3 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="text.secondary">Home</Typography>
              </Link>
              <Link href="/guides" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="text.secondary">Guides</Typography>
              </Link>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {guide.title}
              </Typography>
            </Breadcrumbs>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={categoryLabels[guide.category]}
                  size="small"
                  sx={{ bgcolor: colors.bg, color: colors.fg, fontWeight: 600 }}
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {guide.readTime} read
                  </Typography>
                </Stack>
              </Stack>

              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, lineHeight: 1.15 }}
              >
                {guide.title}
              </Typography>

              <Typography variant="h6" color="text.secondary" data-speakable sx={{ fontWeight: 400 }}>
                {guide.description}
              </Typography>
            </Stack>
          </Container>
        </Box>

        {/* Article Content */}
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              '& h2': {
                fontSize: { xs: 24, md: 30 },
                fontWeight: 700,
                mt: 6,
                mb: 2,
                color: 'text.primary',
              },
              '& h3': {
                fontSize: { xs: 20, md: 24 },
                fontWeight: 600,
                mt: 4,
                mb: 1.5,
                color: 'text.primary',
              },
              '& p': {
                fontSize: '1.075rem',
                lineHeight: 1.8,
                color: 'text.secondary',
                mb: 2,
              },
              '& ul, & ol': {
                pl: 3,
                mb: 2,
                '& li': {
                  fontSize: '1.075rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  mb: 1,
                },
              },
              '& strong': {
                color: 'text.primary',
                fontWeight: 600,
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                mb: 3,
                mt: 1,
                '& th': {
                  textAlign: 'left',
                  p: 1.5,
                  bgcolor: 'grey.100',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                },
                '& td': {
                  p: 1.5,
                  fontSize: '0.9375rem',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  color: 'text.secondary',
                },
              },
            }}
          >
            {children}
          </Box>
        </Container>

        {/* Related Calculators */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
          <Container maxWidth="md">
            <Stack spacing={3}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                  <Calculate sx={{ color: 'primary.main', fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Run the Numbers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try these calculators to apply what you learned
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={1.5}>
                {guide.calculators.map((calc, i) => (
                  <Link key={i} href={calc.href} style={{ textDecoration: 'none' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {calc.name}
                        </Typography>
                        <ArrowForward sx={{ color: 'primary.main', fontSize: 18 }} />
                      </Stack>
                    </Paper>
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Back to Guides */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Link href="/guides" style={{ textDecoration: 'none' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main' }}>
              <ArrowBack sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Back to All Guides
              </Typography>
            </Stack>
          </Link>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
