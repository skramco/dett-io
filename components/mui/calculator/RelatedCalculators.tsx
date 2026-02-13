'use client';

import Link from 'next/link';
import { Box, Typography, Stack, Paper, Avatar } from '@mui/material';
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
      <Stack spacing={2}>
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculators/${calc.slug}`}
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
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  '& .arrow-icon': {
                    transform: 'translateX(4px)',
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'grey.100',
                    color: 'primary.main',
                  }}
                >
                  <Calculate sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {calc.name}
                </Typography>
              </Stack>
              <ArrowForward
                className="arrow-icon"
                sx={{
                  fontSize: 20,
                  color: 'text.secondary',
                  transition: 'all 0.2s',
                }}
              />
            </Paper>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
