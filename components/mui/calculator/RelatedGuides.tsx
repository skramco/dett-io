'use client';

import Link from 'next/link';
import { Box, Typography, Grid, Stack, Paper, Avatar, Chip } from '@mui/material';
import { Article, ArrowForward } from '@mui/icons-material';
import { guides, type Guide } from '@/lib/guides/guideData';

const categoryColors: Record<string, { bg: string; fg: string }> = {
  salary: { bg: '#EBF5FF', fg: '#196bc0' },
  decision: { bg: '#F0FDF4', fg: '#15803D' },
  cost: { bg: '#FFF7ED', fg: '#C2410C' },
};

const categoryLabels: Record<string, string> = {
  salary: 'Salary Guide',
  decision: 'Decision Guide',
  cost: 'Cost Guide',
};

/**
 * Build a reverse map: calculator slug → guides that reference it.
 * Extracts the slug from each guide's calculator href (e.g. "/calculators/affordability" → "affordability").
 */
function getGuidesForCalculator(calculatorSlug: string): Guide[] {
  return guides.filter((guide) =>
    guide.calculators.some((calc) => {
      const slug = calc.href.replace('/calculators/', '');
      return slug === calculatorSlug;
    })
  );
}

interface RelatedGuidesProps {
  calculatorSlug: string;
}

export function RelatedGuides({ calculatorSlug }: RelatedGuidesProps) {
  const relatedGuides = getGuidesForCalculator(calculatorSlug).slice(0, 3);
  if (relatedGuides.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Related Guides
      </Typography>
      <Grid container spacing={2}>
        {relatedGuides.map((guide) => {
          const colors = categoryColors[guide.category] || categoryColors.salary;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      borderColor: colors.fg,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-2px)',
                      '& .arrow-icon': {
                        transform: 'translateX(4px)',
                        color: colors.fg,
                      },
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: colors.bg,
                      color: colors.fg,
                      mb: 2,
                    }}
                  >
                    <Article sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    {guide.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto', pt: 1 }}>
                    <Chip
                      label={categoryLabels[guide.category]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: colors.bg,
                        color: colors.fg,
                        fontWeight: 600,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {guide.readTime} read
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <ArrowForward
                      className="arrow-icon"
                      sx={{ fontSize: 18, color: 'text.secondary', transition: 'all 0.2s' }}
                    />
                  </Stack>
                </Paper>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
