'use client';

import { Button, ButtonProps } from '@mui/material';
import { Calculate } from '@mui/icons-material';

interface CalculatorButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function CalculatorButton({ 
  variant = 'primary', 
  fullWidth = true,
  children,
  ...props 
}: CalculatorButtonProps) {
  return (
    <Button
      variant={variant === 'primary' ? 'contained' : 'outlined'}
      size="large"
      fullWidth={fullWidth}
      startIcon={<Calculate />}
      sx={{
        py: 1.5,
        fontWeight: 600,
        fontSize: '1rem',
        ...(variant === 'primary' && {
          background: 'linear-gradient(135deg, #196bc0 0%, #0F4F8F 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0F4F8F 0%, #0A3A6B 100%)',
            boxShadow: '0 6px 20px rgba(25, 107, 192, 0.3)',
          },
        }),
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
