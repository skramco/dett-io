// 2026 loan limits (one-unit properties)
// Conforming: FHFA announcement, Nov 25, 2025 — baseline $832,750, high-cost ceiling $1,249,125.
// FHA: HUD Mortgagee Letter 2025-23 — floor $541,287 (65% of conforming), ceiling $1,249,125 (150%).
// Effective for case numbers assigned on or after January 1, 2026.

export const LOAN_LIMIT_YEAR = 2026;

/** FHFA baseline conforming loan limit for most U.S. counties. */
export const CONFORMING_LIMIT = 832750;

/** Maximum conforming limit in designated high-cost areas (150% of baseline). */
export const CONFORMING_LIMIT_HIGH_COST = 1249125;

/** FHA "floor" loan limit for low-cost counties (65% of conforming baseline). */
export const FHA_LIMIT_FLOOR = 541287;

/** FHA "ceiling" loan limit for high-cost counties (150% of conforming baseline). */
export const FHA_LIMIT_CEILING = 1249125;

/**
 * A loan above the baseline conforming limit is jumbo territory in most
 * counties (high-cost counties have limits up to the high-cost ceiling).
 */
export function isJumboLoan(loanAmount: number): boolean {
  return loanAmount > CONFORMING_LIMIT;
}
