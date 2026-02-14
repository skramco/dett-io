'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import {
  AttachMoney,
  CompareArrows,
  Receipt,
  AccessTime,
  ArrowForward,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { guides, guideCategories } from '@/lib/guides/guideData';

const categoryIcons: Record<string, React.ReactNode> = {
  salary: <AttachMoney />,
  decision: <CompareArrows />,
  cost: <Receipt />,
};

const categoryColors: Record<string, { bg: string; fg: string }> = {
  salary: { bg: '#EBF5FF', fg: '#006397' },
  decision: { bg: '#F0FDF4', fg: '#15803D' },
  cost: { bg: '#FFF7ED', fg: '#C2410C' },
};

export default function GuidesPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 8, md: 10 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Chip
                label="Free Guides • No Signup Required"
                variant="outlined"
                sx={{ px: 2, py: 2.5, bgcolor: 'background.paper' }}
              />
              <Typography
                variant="h1"
                component="h1"
                sx={{ maxWidth: 800, fontSize: { xs: 36, sm: 48, md: 56 } }}
              >
                Mortgage Guides
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, fontWeight: 400 }}
              >
                Plain-English answers to the questions you're actually asking. No jargon, no sales pitch.
              </Typography>
            </Stack>
          </Container>
        </Box>

        {/* Guide Categories */}
        {guideCategories.map((cat, catIndex) => {
          const colors = categoryColors[cat.key];
          const catGuides = guides.filter(g => g.category === cat.key);

          return (
            <Box
              key={cat.key}
              sx={{
                py: { xs: 6, md: 8 },
                bgcolor: catIndex % 2 === 0 ? 'background.paper' : 'grey.50',
              }}
            >
              <Container maxWidth="lg">
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                  <Avatar sx={{ bgcolor: colors.bg, width: 48, height: 48 }}>
                    <Box sx={{ color: colors.fg, display: 'flex' }}>
                      {categoryIcons[cat.key]}
                    </Box>
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
                      {cat.label}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {cat.description}
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={3}>
                  {catGuides.map((guide) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guide.slug}>
                      <Link href={`/guides/${guide.slug}`} style={{ textDecoration: 'none' }}>
                        <Card
                          sx={{
                            height: '100%',
                            p: 1,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: colors.fg,
                              '& .guide-title': { color: colors.fg },
                              '& .guide-arrow': { transform: 'translateX(4px)' },
                            },
                          }}
                        >
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  label={cat.label.replace(' Guides', '')}
                                  size="small"
                                  sx={{
                                    bgcolor: colors.bg,
                                    color: colors.fg,
                                    fontWeight: 600,
                                    height: 22,
                                    fontSize: '0.7rem',
                                  }}
                                />
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                                  <Typography variant="caption" color="text.disabled">
                                    {guide.readTime}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Typography
                                variant="h6"
                                className="guide-title"
                                sx={{ fontWeight: 700, transition: 'color 0.2s', lineHeight: 1.3 }}
                              >
                                {guide.title}
                              </Typography>

                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                {guide.description}
                              </Typography>

                              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.fg }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Read guide
                                </Typography>
                                <ArrowForward
                                  className="guide-arrow"
                                  sx={{ fontSize: 16, transition: 'transform 0.2s' }}
                                />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
          );
        })}
      </Box>

      <Footer />
    </Box>
  );
}
