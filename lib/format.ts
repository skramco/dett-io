/**
 * Shared number/currency formatters used across all calculator surfaces.
 *
 * Formatting policy:
 * - Currency displays whole dollars with thousands separators: "$3,719".
 *   Monthly amounts, totals, and savings all round to whole dollars.
 * - Compact "$480k" output is reserved for tight spaces (chart axis ticks,
 *   slider labels) via formatCompactCurrency — never on result cards or copy.
 * - Locale is pinned to en-US so server and client render identically.
 */

const safeNumber = (value: number): number => (Number.isFinite(value) ? value : 0);

/** "1,234" — thousands separators, fixed number of decimals (default 0). */
export function formatNumber(value: number, decimals = 0): string {
  return safeNumber(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** "$1,234" (or "-$1,234" for negative values). */
export function formatCurrency(value: number, decimals = 0): string {
  const v = safeNumber(value);
  return `${v < 0 ? '-' : ''}$${formatNumber(Math.abs(v), decimals)}`;
}

/** Currency with an explicit minus sign (U+2212) for negative values, e.g. "−$217". */
export function formatSignedCurrency(value: number): string {
  const v = safeNumber(value);
  return `${v < 0 ? '−' : ''}$${formatNumber(Math.abs(v))}`;
}

/**
 * Compact currency for chart axes and slider labels only: "$480k", "$1.2M".
 * Not for calculator result cards or prose.
 */
export function formatCompactCurrency(value: number): string {
  const v = safeNumber(value);
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    return `${sign}$${formatNumber(millions, millions >= 10 ? 0 : 1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${formatNumber(Math.round(abs / 1_000))}k`;
  }
  return `${sign}$${formatNumber(abs)}`;
}

/** "6.5%" — fixed number of decimals (default 1). */
export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}
