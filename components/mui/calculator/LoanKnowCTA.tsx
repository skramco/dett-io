'use client';

import { Box, Typography, Stack, Paper, Chip } from '@mui/material';
import { Rocket, ArrowForward } from '@mui/icons-material';

export function LoanKnowCTA() {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        border: '1px solid',
        borderColor: '#C7D2FE',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.08)',
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Rocket sx={{ color: '#6366F1', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#312E81' }}>
            Ready for the Next Step?
          </Typography>
          <Chip
            label="Coming Soon"
            size="small"
            sx={{
              bgcolor: '#6366F1',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Stack>
        <Typography variant="body1" sx={{ color: '#4338CA', maxWidth: 600 }}>
          <strong>LoanKnow</strong> takes your numbers and helps lenders compete for your business — 
          anonymously and for free. Your calculated data transfers seamlessly so you never re-enter information.
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#6366F1',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'default',
            opacity: 0.7,
          }}
        >
          loanknow.com — Launching Soon
          <ArrowForward sx={{ fontSize: 16 }} />
        </Box>
      </Stack>
    </Paper>
  );
}
