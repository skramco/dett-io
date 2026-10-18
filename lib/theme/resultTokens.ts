/**
 * Result-surface tokens for calculator KPI tiles and charts.
 *
 * One brand accent for the headline metric; neutrals everywhere else.
 * Color is reserved for meaning (savings vs. cost) and used sparingly.
 * Chart label colors are chosen for WCAG AA contrast (≥ 4.5:1 on white).
 */
export const RESULT_TOKENS = {
  surface: '#F9FAFB',
  surfaceMuted: '#F3F4F6',
  border: '#E5E7EB',
  accent: '#196bc0',
  accentText: '#0F4F8F',
  savings: '#047857',
  savingsText: '#047857',
  cost: '#1F2937',
  costText: '#1F2937',
  /** Grey-700 on white ≈ 10.6:1 — safe for 12px axis ticks. */
  chartTick: '#374151',
  /** Grey-800 on white ≈ 14.6:1 — legends and chart labels. */
  chartLabel: '#1F2937',
} as const;

export type ResultTokens = typeof RESULT_TOKENS;
