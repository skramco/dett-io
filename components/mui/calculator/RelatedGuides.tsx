'use client';

import Link from 'next/link';
import { Box, Typography, Stack, Paper, Avatar, Chip } from '@mui/material';
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
      <Stack spacing={2}>
        {relatedGuides.map((guide) => {
          const colors = categoryColors[guide.category] || categoryColors.salary;
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: colors.fg,
                    bgcolor: colors.bg,
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                      color: colors.fg,
                    },
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: colors.bg,
                      color: colors.fg,
                      flexShrink: 0,
                    }}
                  >
                    <Article sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }} noWrap>
                      {guide.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
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
                    </Stack>
                  </Box>
                </Stack>
                <ArrowForward
                  className="arrow-icon"
                  sx={{
                    fontSize: 20,
                    color: 'text.secondary',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                    ml: 1,
                  }}
                />
              </Paper>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
}
