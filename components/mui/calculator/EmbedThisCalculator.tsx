'use client';

import Link from 'next/link';
import { Paper, Stack, Typography, Button, Box } from '@mui/material';
import { Code, ArrowForward } from '@mui/icons-material';

export function EmbedThisCalculator({ slug, name }: { slug?: string; name: string }) {
  const href = slug ? `/embed?calc=${slug}` : '/embed';

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(25,107,192,0.06) 0%, rgba(16,185,129,0.06) 100%)',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Code sx={{ color: 'primary.main', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
              Embed this calculator — free, forever
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
            Realtors, brokers, lenders, and bloggers: add {name} to your own site. No signup, no API key,
            no tracking of your visitors&apos; numbers.
          </Typography>
        </Box>
        <Button
          component={Link}
          href={href}
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{ textTransform: 'none', fontWeight: 600, flexShrink: 0 }}
        >
          Get the embed code
        </Button>
      </Stack>
    </Paper>
  );
}
