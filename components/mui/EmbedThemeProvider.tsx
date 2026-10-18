'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import { createDettTheme } from '@/lib/theme/createDettTheme';
import type { EmbedAppearance } from '@/lib/embed/options';
import { DEFAULT_EMBED_APPEARANCE } from '@/lib/embed/options';

export function EmbedThemeProvider({
  appearance = DEFAULT_EMBED_APPEARANCE,
  children,
}: {
  appearance?: EmbedAppearance;
  children: ReactNode;
}) {
  const theme = useMemo(() => {
    const isDark = appearance.mode === 'dark';
    const defaultBg = isDark ? '#121212' : '#ffffff';
    const background =
      appearance.bg.toLowerCase() === DEFAULT_EMBED_APPEARANCE.bg.toLowerCase() && isDark
        ? defaultBg
        : appearance.bg;

    return createDettTheme({
      mode: appearance.mode,
      primary: appearance.primary,
      accent: appearance.accent,
      background,
      font: appearance.font,
      radius: appearance.radius,
    });
  }, [appearance]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
