/**
 * Shared PMI rate grid, keyed by LTV × credit score.
 *
 * Approximate annual borrower-paid PMI rates expressed as a percentage of the
 * loan amount. This single grid drives every calculator that estimates PMI
 * (pmi, mortgage-cost, down-payment, affordability, FHA/VA conventional
 * comparisons) so the numbers stay consistent across the site.
 */

/**
 * Last-resort flat annual PMI rate (% of loan) used only when no credit score
 * is available to look up the grid.
 */
export const FALLBACK_PMI_RATE = 0.5;

/**
 * Annual PMI rate (% of loan) for a given LTV and credit score.
 * Assumes PMI is required (LTV > 80). Use getAnnualPMIRate when the LTV may
 * be at or below 80%.
 */
export function getPMIRate(ltv: number, creditScore: number): number {
  if (creditScore >= 760) {
    if (ltv <= 85) return 0.19;
    if (ltv <= 90) return 0.30;
    if (ltv <= 95) return 0.46;
    return 0.55;
  } else if (creditScore >= 740) {
    if (ltv <= 85) return 0.25;
    if (ltv <= 90) return 0.35;
    if (ltv <= 95) return 0.55;
    return 0.65;
  } else if (creditScore >= 720) {
    if (ltv <= 85) return 0.31;
    if (ltv <= 90) return 0.47;
    if (ltv <= 95) return 0.65;
    return 0.80;
  } else if (creditScore >= 700) {
    if (ltv <= 85) return 0.40;
    if (ltv <= 90) return 0.58;
    if (ltv <= 95) return 0.82;
    return 0.95;
  } else if (creditScore >= 680) {
    if (ltv <= 85) return 0.50;
    if (ltv <= 90) return 0.72;
    if (ltv <= 95) return 1.05;
    return 1.15;
  } else {
    if (ltv <= 85) return 0.65;
    if (ltv <= 90) return 0.90;
    if (ltv <= 95) return 1.25;
    return 1.50;
  }
}

/**
 * Annual PMI rate (% of loan) with the standard rules applied:
 * - 0 when LTV <= 80% (no PMI required)
 * - grid rate when a credit score is provided
 * - FALLBACK_PMI_RATE as a last resort when no credit score is available
 */
export function getAnnualPMIRate(ltv: number, creditScore?: number): number {
  if (ltv <= 80) return 0;
  if (!creditScore || creditScore <= 0) return FALLBACK_PMI_RATE;
  return getPMIRate(ltv, creditScore);
}

/**
 * Estimated monthly PMI payment in dollars (0 when LTV <= 80%).
 */
export function estimateMonthlyPMI(
  loanAmount: number,
  homePrice: number,
  creditScore?: number
): number {
  if (homePrice <= 0 || loanAmount <= 0) return 0;
  const ltv = (loanAmount / homePrice) * 100;
  return (loanAmount * getAnnualPMIRate(ltv, creditScore)) / 100 / 12;
}
