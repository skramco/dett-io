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
          background: 'linear-gradient(135deg, #006397 0%, #004B73 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #004B73 0%, #003554 100%)',
            boxShadow: '0 6px 20px rgba(0, 99, 151, 0.3)',
          },
        }),
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
