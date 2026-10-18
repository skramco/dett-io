/**
 * Compact currency labels for chart axes.
 *
 * Examples: 0 → "$0", 5000 → "$5K", 1_200_000 → "$1.2M"
 */
export function formatAxisCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0';

  const sign = value < 0 ? '−' : '';
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
