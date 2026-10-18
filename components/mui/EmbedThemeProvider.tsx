'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import { FONT_STACKS, shadeHex, type EmbedWidgetOptions } from '@/lib/embed/options';

export function EmbedThemeProvider({
  options,
  children,
}: {
  options: EmbedWidgetOptions;
  children: ReactNode;
}) {
  const theme = useMemo(() => {
    const dark = options.theme === 'dark';
    const paper = dark ? shadeHex(options.backgroundColor, 0.08) : '#ffffff';
    const textPrimary = dark ? '#F9FAFB' : '#1A1C1E';
    const textSecondary = dark ? '#D1D5DB' : '#42474E';
    const divider = dark ? 'rgba(255,255,255,0.12)' : '#E5E7EB';
    const radius = options.borderRadius;

    return createTheme({
      breakpoints: {
        values: { xs: 0, sm: 768, md: 1024, lg: 1266, xl: 1440 },
      },
      palette: {
        mode: options.theme,
        primary: {
          light: shadeHex(options.primaryColor, 0.25),
          main: options.primaryColor,
          dark: shadeHex(options.primaryColor, -0.2),
          contrastText: '#ffffff',
        },
        secondary: {
          light: shadeHex(options.accentColor, 0.25),
          main: options.accentColor,
          dark: shadeHex(options.accentColor, -0.2),
          contrastText: '#ffffff',
        },
        text: {
          primary: textPrimary,
          secondary: textSecondary,
        },
        divider,
        background: {
          default: options.backgroundColor,
          paper: dark ? paper : '#ffffff',
        },
      },
      typography: {
        fontFamily: FONT_STACKS[options.font],
        button: { textTransform: 'none', fontWeight: 600 },
      },
      shape: { borderRadius: radius },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            html: { backgroundColor: options.backgroundColor },
            body: {
              backgroundColor: options.backgroundColor,
              fontFamily: FONT_STACKS[options.font],
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { borderRadius: Math.max(radius, 4) },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: Math.max(radius - 4, 4) },
          },
        },
      },
    });
  }, [options]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
