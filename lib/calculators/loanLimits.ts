/**
 * 2026 loan limits for one-unit properties.
 *
 * Sources:
 * - Conforming limits: FHFA announcement, Nov 25, 2025 (effective Jan 1, 2026).
 * - FHA limits: HUD Mortgagee Letter 2025-23 (case numbers assigned on or
 *   after Jan 1, 2026). The FHA floor is 65% of the conforming baseline and
 *   the ceiling is 150%; actual limits vary by county between the two.
 */

export const LOAN_LIMIT_YEAR = 2026;

/** FHFA baseline conforming loan limit — applies in most U.S. counties. */
export const CONFORMING_LOAN_LIMIT = 832750;

/** Conforming ceiling for designated high-cost areas (150% of baseline). */
export const CONFORMING_HIGH_COST_LIMIT = 1249125;

/** FHA "floor" loan limit — applies in most (low-cost) counties. */
export const FHA_LOAN_LIMIT_FLOOR = 541287;

/** FHA "ceiling" loan limit — the max in high-cost counties. */
export const FHA_LOAN_LIMIT_CEILING = 1249125;

const fmtUSD = (v: number) => `$${v.toLocaleString()}`;

export const CONFORMING_LOAN_LIMIT_DISPLAY = fmtUSD(CONFORMING_LOAN_LIMIT);
export const CONFORMING_HIGH_COST_LIMIT_DISPLAY = fmtUSD(CONFORMING_HIGH_COST_LIMIT);
export const FHA_LOAN_LIMIT_FLOOR_DISPLAY = fmtUSD(FHA_LOAN_LIMIT_FLOOR);
export const FHA_LOAN_LIMIT_CEILING_DISPLAY = fmtUSD(FHA_LOAN_LIMIT_CEILING);

/**
 * A loan above the local conforming limit is a jumbo (non-conforming) loan.
 * Uses the baseline limit that applies in most counties.
 */
export function isJumboLoan(loanAmount: number): boolean {
  return loanAmount > CONFORMING_LOAN_LIMIT;
}
