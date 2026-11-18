import { describe, expect, it } from 'vitest';
import { calculateAffordability } from '../lib/calculators';
import { AFFORD_100K_GUIDE_DEFAULTS } from '../components/mui/guides/GuideAffordabilityCalculator';
import {
  HUB_PMMS_THIRTY_YEAR,
  SALARY_BAND_ROWS,
  SALARY_GUIDE_REDIRECT_SLUGS,
  computeSalaryBandRow,
  scenarioForAnnualIncome,
} from '../lib/guides/salaryAffordabilityHub';

describe('salaryAffordabilityHub', () => {
  it('uses PMMS 7.11% for the hub table only', () => {
    expect(HUB_PMMS_THIRTY_YEAR).toBe(7.11);
    expect(scenarioForAnnualIncome(100_000).interestRate).toBe(7.11);
  });

  it('matches calculateAffordability for the $100k worked-example defaults', () => {
    const hubInputs = scenarioForAnnualIncome(100_000);
    expect(hubInputs).toEqual(AFFORD_100K_GUIDE_DEFAULTS);

    const direct = calculateAffordability(AFFORD_100K_GUIDE_DEFAULTS);
    const row = computeSalaryBandRow(100_000);
    expect(row.moderatePrice).toBe(direct.details.moderatePrice);
    expect(row.conservativePrice).toBe(direct.details.conservativePrice);
    expect(row.moderatePayment).toBe(direct.details.moderatePayment);
  });

  it('builds one row per existing salary rung with positive mid-range prices', () => {
    expect(SALARY_BAND_ROWS).toHaveLength(13);
    for (const row of SALARY_BAND_ROWS) {
      expect(row.moderatePrice).toBeGreaterThan(0);
      expect(row.calculatorHref).toMatch(/^\/calculators\/affordability\?/);
      expect(row.calculatorHref).toContain(`annualIncome=${row.annualIncome}`);
      expect(row.calculatorHref).toContain('interestRate=7.11');
    }
  });

  it('lists exactly twelve legacy slugs to redirect', () => {
    expect(SALARY_GUIDE_REDIRECT_SLUGS).toHaveLength(12);
    expect(SALARY_GUIDE_REDIRECT_SLUGS).not.toContain('afford-house-100k-salary');
  });
});