'use client';

import { createTheme, type Theme } from '@mui/material/styles';
import { RESULT_TOKENS } from '@/lib/theme/resultTokens';

declare module '@mui/material/styles' {
  interface Palette {
    result: typeof RESULT_TOKENS;
  }
  interface PaletteOptions {
    result?: typeof RESULT_TOKENS;
  }
}

export const DETT_PRIMARY = '#196bc0';
export const DETT_ACCENT = '#10B981';

const FONT_STACKS: Record<string, string> = {
  geist: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  system: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
};

export type DettFontId = keyof typeof FONT_STACKS;

export function fontStack(font: string): string {
  return FONT_STACKS[font] ?? FONT_STACKS.geist;
}

export interface DettThemeOptions {
  mode?: 'light' | 'dark';
  primary?: string;
  accent?: string;
  background?: string;
  font?: string;
  radius?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  if (full.length !== 6) return null;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mix(hex: string, toward: 'white' | 'black', amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const t = toward === 'white' ? 255 : 0;
  const r = Math.round(rgb.r + (t - rgb.r) * amount);
  const g = Math.round(rgb.g + (t - rgb.g) * amount);
  const b = Math.round(rgb.b + (t - rgb.b) * amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function createDettTheme(options: DettThemeOptions = {}): Theme {
  const mode = options.mode ?? 'light';
  const primary = options.primary ?? DETT_PRIMARY;
  const accent = options.accent ?? DETT_ACCENT;
  const isDark = mode === 'dark';
  const defaultBg = isDark ? '#121212' : '#ffffff';
  const background = options.background ?? defaultBg;
  const paper = isDark ? mix(background, 'white', 0.06) : '#ffffff';
  const radius = options.radius ?? 16;
  const family = fontStack(options.font ?? 'geist');
  return createTheme({
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
      mode,
      primary: {
        light: mix(primary, 'white', 0.35),
        main: primary,
        dark: mix(primary, 'black', 0.25),
        contrastText: '#ffffff',
      },
      secondary: {
        light: mix(accent, 'white', 0.35),
        main: accent,
        dark: mix(accent, 'black', 0.2),
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
      text: isDark
        ? { primary: '#F3F4F6', secondary: '#D1D5DB' }
        : { primary: '#1A1C1E', secondary: '#42474E' },
      divider: isDark ? 'rgba(255,255,255,0.12)' : RESULT_TOKENS.border,
      background: {
        default: background,
        paper: paper,
      },
      result: RESULT_TOKENS,
    },
    typography: {
      fontFamily: family,
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
      borderRadius: radius,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
            backgroundColor: background,
            fontFamily: family,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: Math.max(8, radius - 4),
            padding: '12px 28px',
            fontSize: '0.9375rem',
            fontWeight: 600,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 4px 12px ${primary}40`,
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
              backgroundColor: `${primary}0A`,
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
            borderRadius: Math.max(12, radius + 4),
            boxShadow: 'none',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB',
            transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB',
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
            borderColor: isDark ? 'rgba(255,255,255,0.16)' : '#E5E7EB',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB'}`,
            backgroundColor: paper,
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
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: radius,
          },
        },
      },
    },
  });
}
