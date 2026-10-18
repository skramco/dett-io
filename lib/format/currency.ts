/**
 * Shared number/currency formatters used across all calculator surfaces.
 *
 * Formatting policy (ENG-333 / ENG-356):
 * - Currency on result surfaces is whole dollars with thousands separators:
 *   "$3,719", "$480,583". No stray cents, no "$Xk" abbreviations.
 * - Cents are opt-in via the `decimals` argument (e.g. per-point costs).
 * - Compact currency ("$5K", "$1.2M") is reserved for chart axis ticks via
 *   formatAxisCurrency, where space is constrained.
 * - Locale is pinned to en-US so server and client render identically.
 * - Currency inputs share parse/format helpers so typed values stay numeric
 *   in state while the field shows thousands separators.
 */

const LOCALE = 'en-US';

const safe = (value: number): number => (Number.isFinite(value) ? value : 0);

/** "1,234" — thousands separators, fixed number of decimals (default 0). */
export function formatNumber(value: number, decimals = 0): string {
  return safe(value).toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** "$1,234" (whole dollars). Negative values render as "−$1,234". */
export function formatCurrency(value: number, decimals = 0): string {
  const v = safe(value);
  const sign = v < 0 ? '\u2212' : '';
  return `${sign}$${formatNumber(Math.abs(v), decimals)}`;
}

/** "+$1,234" / "−$1,234" — explicit sign for savings/deltas. */
export function formatSignedCurrency(value: number, decimals = 0): string {
  const v = safe(value);
  if (v < 0) return formatCurrency(v, decimals);
  return `+$${formatNumber(v, decimals)}`;
}

/** "12.3%" — one decimal by default. */
export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

/** "1.5 years" / "1 year" — consistent year duration. */
export function formatYears(value: number, decimals = 1): string {
  const text = formatNumber(value, decimals);
  const unit = text === '1' || text === '1.0' ? 'year' : 'years';
  return `${text} ${unit}`;
}

/**
 * Compact currency labels for chart axes ONLY.
 *
 * Examples: 0 → "$0", 5000 → "$5K", 1_200_000 → "$1.2M"
 * Never use this on calculator result cards or copy.
 */
export function formatAxisCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0';

  const sign = value < 0 ? '\u2212' : '';
  const abs = Math.abs(value);

  if (abs === 0) return '$0';

  if (abs >= 1_000_000) {
    return `${sign}$${trimCompact(abs / 1_000_000)}M`;
  }

  if (abs >= 1_000) {
    return `${sign}$${trimCompact(abs / 1_000)}K`;
  }

  return `${sign}$${Math.round(abs)}`;
}

function trimCompact(n: number): string {
  const rounded = n >= 10 ? n.toFixed(0) : n.toFixed(1);
  return rounded.replace(/\.0$/, '');
}

const SIGNIFICANT = /[\d.-]/;

/**
 * Parse a typed or pasted currency string into a number.
 * Accepts "$320,000", "320000", "320,000.50", and whitespace.
 * Returns null when there is no numeric value yet (empty / decorations only).
 */
export function parseCurrencyInput(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, '').replace(/−/g, '-');
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
    return null;
  }
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * Format a currency input as the user types: "320000" → "320,000".
 * Preserves a trailing decimal point and typed fractional digits.
 * Strips `$` and extra punctuation so paste of "$320,000" works.
 */
export function formatCurrencyInput(raw: string): string {
  if (!raw) return '';

  const stripped = raw.replace(/[$,\s]/g, '').replace(/−/g, '-');
  const isNeg = stripped.startsWith('-');
  const unsigned = stripped.replace(/-/g, '').replace(/[^\d.]/g, '');

  const dot = unsigned.indexOf('.');
  const hasDot = dot !== -1;
  let intPart = hasDot ? unsigned.slice(0, dot) : unsigned;
  const decPart = hasDot ? unsigned.slice(dot + 1).replace(/\./g, '') : null;

  intPart = intPart.replace(/^0+(?=\d)/, '');

  if (intPart === '' && decPart === null && !hasDot) {
    return isNeg ? '-' : '';
  }
  if (intPart === '') intPart = '0';

  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = hasDot ? `${grouped}.${decPart ?? ''}` : grouped;
  return isNeg ? `-${body}` : body;
}

/** Format a numeric value for the currency input (no `$` — the adornment provides it). */
export function formatCurrencyInputValue(value: number): string {
  if (!Number.isFinite(value)) return '';
  const abs = Math.abs(value);
  const decimals = Number.isInteger(abs)
    ? 0
    : Math.min(2, (abs.toString().split('.')[1] ?? '').length);
  const text = formatNumber(abs, decimals);
  return value < 0 ? `-${text}` : text;
}

/**
 * Map a caret index from the pre-format string onto the formatted string
 * by counting digits, a decimal point, and a leading minus.
 */
export function mapFormattedCaret(before: string, after: string, caret: number): number {
  const clamped = Math.max(0, Math.min(caret, before.length));
  const left = before.slice(0, clamped);
  let significant = 0;
  for (const ch of left) {
    if (SIGNIFICANT.test(ch)) significant += 1;
  }
  if (significant === 0) return 0;

  let seen = 0;
  for (let i = 0; i < after.length; i += 1) {
    if (SIGNIFICANT.test(after[i])) {
      seen += 1;
      if (seen === significant) return i + 1;
    }
  }
  return after.length;
}
