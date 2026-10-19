/**
 * ENG-362: Loan Timeline recommendations must consider income / DTI,
 * not just lowest net cost.
 */
import { describe, expect, it } from 'vitest';
import { calculateLoanTimeline } from '../lib/calculators/loanTimeline';
import type { LoanTimelineInputs } from '../lib/calculators/types';
import {
  backEndDtiPercent,
  extraMonthlyToPayoffIn,
  frontEndDtiPercent,
  monthlyHousingPayment,
  monthlyPayment,
} from '../lib/calculators/mortgageMath';

const num = (v: number | string): number => v as number;

const baseInputs = (overrides: Partial<LoanTimelineInputs> = {}): LoanTimelineInputs => ({
  loanAmount: 360000,
  loanTerm: 30,
  expectedYearsInHome: 7,
  parRate: 6.75,
  pointsRate: 6.25,
  pointsCost: 7200,
  lenderCredit: 3600,
  lenderCreditRate: 7,
  armInitialRate: 5.75,
  armFixedPeriod: 5,
  armAdjustmentFrequency: 12,
  armInitialCap: 2,
  armMargin: 2.75,
  expectedIndexRate: 5,
  armAdjustmentCap: 2,
  armLifetimeCap: 5,
  fifteenYearRate: 6.25,
  ...overrides,
});

function copyHasQualify(result: { summary: string; insights: string[] }): boolean {
  return [result.summary, ...result.insights].some((text) =>
    /\b(you|you'll|you will|would|can|can't|cannot)\s+qualif/i.test(text)
  );
}

describe('loan-timeline affordability (ENG-362)', () => {
  it('does not declare a winner when no income is entered', () => {
    const result = calculateLoanTimeline(baseInputs());
    const fifteen = result.scenarios.find((s) => s.option === '15-Year Fixed')!;

    expect(num(result.details.hasIncomeForRecommendation)).toBe(0);
    expect(result.details.bestOption).toBe('');
    expect(result.details.recommendedOption).toBe('');
    expect(result.details.balancedOption).toBe('');
    expect(result.details.mostAffordableOption).toBe('');
    expect(result.details.lowestCostOption).toBeTruthy();
    expect(result.fifteenYearAlternative).toBeNull();
    expect(result.summary).toMatch(/enter income/i);
    expect(result.insights.join(' ')).toMatch(/enter your gross monthly income/i);
    expect(fifteen.affordabilityBand).toBe('unknown');
    expect(result.scenarios.every((s) => s.badges.length === 0)).toBe(true);
    expect(copyHasQualify(result)).toBe(false);
  });

  it('lets a high-income 15-year be recommended when it may fit typical guidelines', () => {
    const result = calculateLoanTimeline(
      baseInputs({ monthlyGrossIncome: 15000, otherMonthlyDebts: 400 })
    );
    const fifteen = result.scenarios.find((s) => s.option === '15-Year Fixed')!;
    const housing = monthlyHousingPayment({
      loanAmount: 360000,
      annualRatePercent: 6.25,
      termMonths: 180,
      principalAndInterest: monthlyPayment(360000, 6.25, 180),
    });

    expect(fifteen.housingPayment).toBe(Math.round(housing.total));
    expect(fifteen.frontEndDti).toBeCloseTo(frontEndDtiPercent(housing.total, 15000), 1);
    expect(fifteen.backEndDti).toBeCloseTo(backEndDtiPercent(housing.total, 400, 15000), 1);
    expect(fifteen.affordabilityBand).toBe('comfortable');
    expect(fifteen.badges).toContain('lowest-total-cost');
    expect(fifteen.badges).toContain('balanced');
    expect(result.details.lowestCostOption).toBe('15-Year Fixed');
    expect(result.details.recommendedOption).toBe('15-Year Fixed');
    expect(result.details.balancedOption).toBe('15-Year Fixed');
    expect(
      result.scenarios.find((s) => s.option === result.details.recommendedOption)?.affordabilityBand
    ).not.toBe('not-recommended');
    expect(result.fifteenYearAlternative).toBeNull();
    expect(num(result.details.fifteenYearUnaffordable)).toBe(0);
    expect(result.details.bestOption).toBe(result.details.recommendedOption);
    expect(copyHasQualify(result)).toBe(false);
    expect(result.summary).toMatch(/may fit typical guidelines|balanced pick/i);
  });

  it('does not recommend an unaffordable 15-year and offers a 30-year extra-principal alternative', () => {
    const result = calculateLoanTimeline(
      baseInputs({ monthlyGrossIncome: 6000, otherMonthlyDebts: 300 })
    );
    const fifteen = result.scenarios.find((s) => s.option === '15-Year Fixed')!;
    const recommended = result.scenarios.find((s) => s.option === result.details.recommendedOption);

    expect(fifteen.affordabilityBand).toBe('not-recommended');
    expect(fifteen.backEndDti).toBeGreaterThan(50);
    expect(fifteen.badges).not.toContain('most-affordable');
    expect(fifteen.badges).not.toContain('balanced');
    expect(result.details.recommendedOption).not.toBe('15-Year Fixed');
    expect(result.details.bestOption).not.toBe('15-Year Fixed');
    expect(result.details.lowestCostOption).toBe('15-Year Fixed');
    expect(fifteen.badges).toContain('lowest-total-cost');
    expect(recommended?.affordabilityBand).not.toBe('not-recommended');
    expect(result.scenarios.filter((s) => s.badges.includes('most-affordable'))).toHaveLength(1);
    expect(result.scenarios.filter((s) => s.badges.includes('balanced'))).toHaveLength(1);
    expect(
      result.scenarios
        .filter((s) => s.affordabilityBand === 'not-recommended')
        .every((s) => !s.badges.includes('most-affordable') && !s.badges.includes('balanced'))
    ).toBe(true);

    expect(result.fifteenYearAlternative).not.toBeNull();
    const extra = extraMonthlyToPayoffIn(360000, 6.75, 360, 180);
    expect(result.fifteenYearAlternative!.extraMonthly).toBe(Math.round(extra));
    expect(result.fifteenYearAlternative!.payoffMonths).toBe(180);
    expect(result.fifteenYearAlternative!.interestSaved).toBeGreaterThan(0);
    expect(result.insights.join(' ')).toMatch(/may not fit typical guidelines/i);
    expect(result.insights.join(' ')).toMatch(/extra principal/i);
    expect(copyHasQualify(result)).toBe(false);
  });

  it('uses full PITI + PMI + HOA from the shared housing-payment helper when those costs are entered', () => {
    const result = calculateLoanTimeline(
      baseInputs({
        monthlyGrossIncome: 12000,
        otherMonthlyDebts: 500,
        homePrice: 450000,
        propertyTaxAnnual: 5400,
        homeInsuranceAnnual: 1800,
        hoaFees: 125,
        creditScore: 740,
      })
    );
    const thirty = result.scenarios.find((s) => s.option === '30-Year Fixed (Par)')!;
    const expected = monthlyHousingPayment({
      loanAmount: 360000,
      annualRatePercent: 6.75,
      termMonths: 360,
      annualPropertyTax: 5400,
      annualInsurance: 1800,
      monthlyHoa: 125,
      homeValue: 450000,
      creditScore: 740,
    });

    expect(thirty.housingPayment).toBe(Math.round(expected.total));
    expect(thirty.housingPayment).toBeGreaterThan(thirty.initialPayment);
    expect(thirty.frontEndDti).toBeCloseTo(frontEndDtiPercent(expected.total, 12000), 1);
    expect(thirty.backEndDti).toBeCloseTo(backEndDtiPercent(expected.total, 500, 12000), 1);
    expect(thirty.paymentVsBaseline).toBe(0);
    const fifteen = result.scenarios.find((s) => s.option === '15-Year Fixed')!;
    expect(fifteen.paymentVsBaseline).toBeGreaterThan(0);
  });
});
