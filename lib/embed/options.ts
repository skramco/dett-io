export const EMBED_FONTS = ['system', 'sans', 'serif', 'mono'] as const;
export type EmbedFont = (typeof EMBED_FONTS)[number];

export const EMBED_THEMES = ['light', 'dark'] as const;
export type EmbedTheme = (typeof EMBED_THEMES)[number];

export interface EmbedWidgetOptions {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  font: EmbedFont;
  theme: EmbedTheme;
  borderRadius: number;
  showTitle: boolean;
  showCharts: boolean;
  inputs: Record<string, number>;
}

export const DEFAULT_EMBED_OPTIONS: EmbedWidgetOptions = {
  primaryColor: '#196bc0',
  accentColor: '#10B981',
  backgroundColor: '#ffffff',
  font: 'system',
  theme: 'light',
  borderRadius: 16,
  showTitle: true,
  showCharts: true,
  inputs: {},
};

export const THEME_QUERY_KEYS = [
  'primary',
  'accent',
  'bg',
  'font',
  'theme',
  'radius',
  'title',
  'charts',
] as const;

export const FONT_STACKS: Record<EmbedFont, string> = {
  system:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

const HEX3 = /^[0-9a-fA-F]{3}$/;
const HEX6 = /^[0-9a-fA-F]{6}$/;

/** Normalize a user color to `#rrggbb`. Returns fallback when invalid. */
export function normalizeHex(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const raw = value.trim().replace(/^#/, '');
  if (HEX6.test(raw)) return `#${raw.toLowerCase()}`;
  if (HEX3.test(raw)) {
    return `#${raw
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toLowerCase()}`;
  }
  return fallback;
}

export function hexForQuery(hex: string): string {
  return hex.replace(/^#/, '').toLowerCase();
}

function parseBooleanFlag(value: string | null, fallback: boolean): boolean {
  if (value === null || value === '') return fallback;
  return !(value === '0' || value === 'false' || value === 'off' || value === 'no');
}

function parseFont(value: string | null): EmbedFont {
  return EMBED_FONTS.includes(value as EmbedFont) ? (value as EmbedFont) : DEFAULT_EMBED_OPTIONS.font;
}

function parseTheme(value: string | null): EmbedTheme {
  return EMBED_THEMES.includes(value as EmbedTheme)
    ? (value as EmbedTheme)
    : DEFAULT_EMBED_OPTIONS.theme;
}

function parseRadius(value: string | null): number {
  if (value === null || value === '') return DEFAULT_EMBED_OPTIONS.borderRadius;
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_EMBED_OPTIONS.borderRadius;
  return Math.min(32, Math.max(0, Math.round(num)));
}

export function parseEmbedOptions(search: string | URLSearchParams): EmbedWidgetOptions {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const reserved = new Set<string>(THEME_QUERY_KEYS);
  const inputs: Record<string, number> = {};

  params.forEach((raw, key) => {
    if (reserved.has(key)) return;
    const num = Number(raw);
    if (raw !== '' && Number.isFinite(num)) {
      inputs[key] = num;
    }
  });

  return {
    primaryColor: normalizeHex(params.get('primary'), DEFAULT_EMBED_OPTIONS.primaryColor),
    accentColor: normalizeHex(params.get('accent'), DEFAULT_EMBED_OPTIONS.accentColor),
    backgroundColor: normalizeHex(params.get('bg'), DEFAULT_EMBED_OPTIONS.backgroundColor),
    font: parseFont(params.get('font')),
    theme: parseTheme(params.get('theme')),
    borderRadius: parseRadius(params.get('radius')),
    showTitle: parseBooleanFlag(params.get('title'), true),
    showCharts: parseBooleanFlag(params.get('charts'), true),
    inputs,
  };
}

export function serializeEmbedOptions(
  options: EmbedWidgetOptions,
  defaults: Partial<EmbedWidgetOptions> = DEFAULT_EMBED_OPTIONS
): URLSearchParams {
  const params = new URLSearchParams();
  const mergedDefaults = { ...DEFAULT_EMBED_OPTIONS, ...defaults };

  if (options.primaryColor !== mergedDefaults.primaryColor) {
    params.set('primary', hexForQuery(options.primaryColor));
  }
  if (options.accentColor !== mergedDefaults.accentColor) {
    params.set('accent', hexForQuery(options.accentColor));
  }
  if (options.backgroundColor !== mergedDefaults.backgroundColor) {
    params.set('bg', hexForQuery(options.backgroundColor));
  }
  if (options.font !== mergedDefaults.font) {
    params.set('font', options.font);
  }
  if (options.theme !== mergedDefaults.theme) {
    params.set('theme', options.theme);
  }
  if (options.borderRadius !== mergedDefaults.borderRadius) {
    params.set('radius', String(options.borderRadius));
  }
  if (options.showTitle !== mergedDefaults.showTitle) {
    params.set('title', options.showTitle ? '1' : '0');
  }
  if (options.showCharts !== mergedDefaults.showCharts) {
    params.set('charts', options.showCharts ? '1' : '0');
  }

  Object.entries(options.inputs).forEach(([key, value]) => {
    if (Number.isFinite(value)) {
      params.set(key, String(value));
    }
  });

  return params;
}

export function buildEmbedSrc(
  slug: string,
  options: EmbedWidgetOptions,
  origin = 'https://dett.io'
): string {
  const params = serializeEmbedOptions(options);
  const query = params.toString();
  return `${origin}/embed/${slug}${query ? `?${query}` : ''}`;
}

export function shadeHex(hex: string, percent: number): string {
  const raw = normalizeHex(hex, '#196bc0').slice(1);
  const num = parseInt(raw, 16);
  const adjust = (channel: number) =>
    Math.min(255, Math.max(0, Math.round(channel + 255 * percent)));
  const r = adjust((num >> 16) & 255);
  const g = adjust((num >> 8) & 255);
  const b = adjust(num & 255);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
