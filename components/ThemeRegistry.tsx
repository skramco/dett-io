'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import { ScenarioProvider } from '@/lib/scenario';
import { createDettTheme } from '@/lib/theme/createDettTheme';

const theme = createDettTheme();

export function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScenarioProvider>
        {children}
      </ScenarioProvider>
    </ThemeProvider>
  );
}
