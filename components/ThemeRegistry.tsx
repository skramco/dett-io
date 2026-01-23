'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

// SaaSable-inspired theme for Dett
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1266,
      xl: 1440,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      light: '#92CCFF',
      main: '#006397',
      dark: '#004B73',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#6EE7B7',
      main: '#10B981',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    text: {
      primary: '#1A1C1E',
      secondary: '#42474E',
    },
    divider: '#E5E7EB',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: 56,
      lineHeight: 1.12,
      letterSpacing: -0.5,
    },
    h2: {
      fontWeight: 600,
      fontSize: 44,
      lineHeight: 1.16,
      letterSpacing: -0.25,
    },
    h3: {
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.29,
    },
    h4: {
      fontWeight: 600,
      fontSize: 22,
      lineHeight: 1.36,
    },
    h5: {
      fontWeight: 500,
      fontSize: 18,
      lineHeight: 1.44,
    },
    h6: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.6,
      letterSpacing: 0.15,
    },
    body2: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.5,
      letterSpacing: 0.1,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 1.43,
      letterSpacing: 0.1,
    },
    caption: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.33,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '0.9375rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 99, 151, 0.25)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(0, 99, 151, 0.04)',
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: 'none',
          border: '1px solid',
          borderColor: '#E5E7EB',
          transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            borderColor: '#D1D5DB',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
          '@media (min-width: 768px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
  },
});

export function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
