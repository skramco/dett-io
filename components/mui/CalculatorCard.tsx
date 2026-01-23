'use client';

import { ReactNode } from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

interface CalculatorCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
}

export function CalculatorCard({ title, children, icon, color = 'default' }: CalculatorCardProps) {
  const colorMap = {
    primary: {
      bg: 'primary.light',
      color: 'primary.main',
    },
    secondary: {
      bg: 'secondary.light',
      color: 'secondary.main',
    },
    default: {
      bg: 'grey.100',
      color: 'text.primary',
    },
  };

  const colors = colorMap[color];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderColor: color === 'default' ? 'divider' : `${color}.main`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: colors.bg,
              color: colors.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {children}
      </Box>
    </Paper>
  );
}
