import { getEmbedCalculator, type EmbedCalculator } from './catalog';

export const EMBED_APPEARANCE_KEYS = [
  'primary',
  'accent',
  'bg',
  'font',
  'mode',
  'radius',
  'title',
  'charts',
] as const;

export type EmbedFont = 'geist' | 'system' | 'serif' | 'mono';
export type EmbedMode = 'light' | 'dark';
export type EmbedHeight = 'auto' | number;

export interface EmbedAppearance {
  primary: string;
  accent: string;
  bg: string;
  font: EmbedFont;
  mode: EmbedMode;
  radius: number;
  showTitle: boolean;
  showCharts: boolean;
  width: string;
  height: EmbedHeight;
}

export const DEFAULT_EMBED_APPEARANCE: EmbedAppearance = {
  primary: '#196bc0',
  accent: '#10B981',
  bg: '#ffffff',
  font: 'geist',
  mode: 'light',
  radius: 16,
  showTitle: true,
  showCharts: true,
  width: '100%',
  height: 'auto',
};

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const FONTS: EmbedFont[] = ['geist', 'system', 'serif', 'mono'];

export function isValidHexColor(value: string): boolean {
  return HEX.test(value);
}

function parseBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  if (raw === '0' || raw === 'false' || raw === 'hide' || raw === 'off') return false;
  if (raw === '1' || raw === 'true' || raw === 'show' || raw === 'on') return true;
  return fallback;
}

function clampRadius(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_EMBED_APPEARANCE.radius;
  return Math.min(32, Math.max(0, Math.round(value)));
}

export function parseAppearance(search: string | URLSearchParams): EmbedAppearance {
  const params = typeof search === 'string' ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search) : search;
  const primary = params.get('primary') ?? '';
  const accent = params.get('accent') ?? '';
  const bg = params.get('bg') ?? '';
  const fontRaw = (params.get('font') ?? '') as EmbedFont;
  const modeRaw = params.get('mode') ?? '';
  const radiusRaw = params.get('radius');
  const widthRaw = params.get('width');
  const heightRaw = params.get('height');

  const height: EmbedHeight =
    heightRaw == null || heightRaw === '' || heightRaw === 'auto'
      ? 'auto'
      : Number.isFinite(Number(heightRaw))
        ? Math.min(4000, Math.max(240, Math.round(Number(heightRaw))))
        : 'auto';

  let width = DEFAULT_EMBED_APPEARANCE.width;
  if (widthRaw) {
    if (widthRaw === '100%' || widthRaw === 'auto') width = '100%';
    else if (/^\d{2,4}$/.test(widthRaw)) width = `${Math.min(1400, Math.max(280, Number(widthRaw)))}px`;
  }

  return {
    primary: isValidHexColor(primary) ? primary : DEFAULT_EMBED_APPEARANCE.primary,
    accent: isValidHexColor(accent) ? accent : DEFAULT_EMBED_APPEARANCE.accent,
    bg: isValidHexColor(bg) ? bg : DEFAULT_EMBED_APPEARANCE.bg,
    font: FONTS.includes(fontRaw) ? fontRaw : DEFAULT_EMBED_APPEARANCE.font,
    mode: modeRaw === 'dark' ? 'dark' : 'light',
    radius: radiusRaw != null && radiusRaw !== '' ? clampRadius(Number(radiusRaw)) : DEFAULT_EMBED_APPEARANCE.radius,
    showTitle: parseBool(params.get('title'), true),
    showCharts: parseBool(params.get('charts'), true),
    width,
    height,
  };
}

export function parseDefaultInputs(
  search: string | URLSearchParams,
  calculator?: EmbedCalculator
): Record<string, number> {
  if (!calculator) return {};
  const params = typeof search === 'string' ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search) : search;
  const out: Record<string, number> = {};
  for (const input of calculator.inputs) {
    const raw = params.get(input.key);
    if (raw == null || raw === '') continue;
    const num = Number(raw);
    if (!Number.isNaN(num)) out[input.key] = num;
  }
  return out;
}

function stripHash(hex: string): string {
  return hex.replace('#', '');
}

export function buildEmbedQuery(
  appearance: EmbedAppearance,
  inputs: Record<string, number> = {},
  calculator?: EmbedCalculator
): string {
  const params = new URLSearchParams();
  const d = DEFAULT_EMBED_APPEARANCE;

  if (appearance.primary.toLowerCase() !== d.primary.toLowerCase()) {
    params.set('primary', stripHash(appearance.primary));
  }
  if (appearance.accent.toLowerCase() !== d.accent.toLowerCase()) {
    params.set('accent', stripHash(appearance.accent));
  }
  if (appearance.bg.toLowerCase() !== d.bg.toLowerCase()) {
    params.set('bg', stripHash(appearance.bg));
  }
  if (appearance.font !== d.font) params.set('font', appearance.font);
  if (appearance.mode !== d.mode) params.set('mode', appearance.mode);
  if (appearance.radius !== d.radius) params.set('radius', String(appearance.radius));
  if (!appearance.showTitle) params.set('title', '0');
  if (!appearance.showCharts) params.set('charts', '0');

  const catalog = calculator ?? undefined;
  for (const [key, value] of Object.entries(inputs)) {
    const def = catalog?.inputs.find((i) => i.key === key)?.defaultValue;
    if (def !== undefined && value === def) continue;
    if (!Number.isFinite(value)) continue;
    params.set(key, String(value));
  }

  return params.toString();
}

/** Normalize hex so query values without # still parse. */
export function normalizeSearchParams(search: string): URLSearchParams {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  for (const key of ['primary', 'accent', 'bg']) {
    const raw = params.get(key);
    if (raw && !raw.startsWith('#') && /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) {
      params.set(key, `#${raw}`);
    }
  }
  return params;
}

export function appearanceFromSearch(search: string): EmbedAppearance {
  return parseAppearance(normalizeSearchParams(search));
}

export function inputsFromSearch(search: string, slug: string): Record<string, number> {
  const calc = getEmbedCalculator(slug);
  return parseDefaultInputs(normalizeSearchParams(search), calc);
}

export const EMBED_BASE_URL = 'https://dett.io';

export function buildEmbedSrc(
  slug: string,
  appearance: EmbedAppearance,
  inputs: Record<string, number> = {},
  origin: string = EMBED_BASE_URL
): string {
  const calc = getEmbedCalculator(slug);
  const query = buildEmbedQuery(appearance, inputs, calc);
  const path = `${origin.replace(/\/$/, '')}/embed/${slug}`;
  return query ? `${path}?${query}` : path;
}

export function iframeSnippet(src: string, calcName: string, appearance: EmbedAppearance): string {
  const width = appearance.width === '100%' ? '100%' : appearance.width;
  const auto = appearance.height === 'auto';
  const heightAttr = auto ? '' : ` height="${appearance.height}"`;
  const styleHeight = auto ? 'min-height:480px;' : `height:${appearance.height}px;`;
  const autoFlag = auto ? ' data-dett-embed="1"' : '';
  return `<iframe src="${src}" title="${calcName} – Dett.io" width="${width}"${heightAttr}${autoFlag} loading="lazy" style="width:${width};${styleHeight}border:0;border-radius:${appearance.radius}px;overflow:hidden;"></iframe>`;
}

export function loaderSnippet(src: string, calcName: string, appearance: EmbedAppearance): string {
  const iframe = iframeSnippet(src, calcName, appearance);
  if (appearance.height !== 'auto') return iframe;
  return `${iframe}\n<script src="${EMBED_BASE_URL}/embed.js" async></script>`;
}

export function sanitizeReferringDomain(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let host = raw.trim().toLowerCase();
  if (!host) return null;
  try {
    if (host.includes('://')) {
      host = new URL(host).hostname;
    } else if (host.includes('/')) {
      host = host.split('/')[0];
    }
  } catch {
    return null;
  }
  host = host.replace(/:\d+$/, '').replace(/^www\./, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost')) return null;
  if (host === 'dett.io' || host.endsWith('.dett.io')) return null;
  if (!/^[a-z0-9.-]+$/.test(host) || !host.includes('.')) return null;
  if (host.length > 253) return null;
  return host;
}
