'use client';

import Link from 'next/link';
import { Box, Typography, Grid, Paper, Avatar, Stack } from '@mui/material';
import { Calculate, ArrowForward } from '@mui/icons-material';

interface RelatedCalculator {
  slug: string;
  name: string;
}

interface RelatedCalculatorsProps {
  calculators: RelatedCalculator[];
}

export function RelatedCalculators({ calculators }: RelatedCalculatorsProps) {
  if (!calculators || calculators.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Related Calculators
      </Typography>
      <Grid container spacing={2}>
        {calculators.map((calc) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={calc.slug}>
            <Link
              href={`/calculators/${calc.slug}`}
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
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 16px rgba(29, 107, 192, 0.12)',
                    transform: 'translateY(-2px)',
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  <Calculate sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                  {calc.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Try it free
                  </Typography>
                  <ArrowForward
                    className="arrow-icon"
                    sx={{ fontSize: 16, color: 'primary.main', transition: 'all 0.2s' }}
                  />
                </Stack>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
