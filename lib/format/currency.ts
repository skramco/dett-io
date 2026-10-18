/**
 * Shared number/currency formatters used across all calculator surfaces.
 *
 * Formatting policy (ENG-333):
 * - Currency on result surfaces is whole dollars with thousands separators:
 *   "$3,719", "$480,583". No decimals, no "$Xk" abbreviations.
 * - Compact currency ("$5K", "$1.2M") is reserved for chart axis ticks via
 *   formatAxisCurrency, where space is constrained.
 * - Locale is pinned to en-US so server and client render identically.
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
