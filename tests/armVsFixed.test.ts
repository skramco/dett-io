import { describe, expect, it } from 'vitest';
import {
  calculateLoanTimeline,
  getArmProductName,
  getWorstCaseRatePath,
} from '../lib/calculators/loanTimeline';
import type { LoanTimelineInputs } from '../lib/calculators/types';
import { monthlyPayment } from '../lib/calculators/mortgageMath';

const sofr56 = (overrides: Partial<LoanTimelineInputs> = {}): LoanTimelineInputs => ({
  loanAmount: 400000,
  loanTerm: 30,
  expectedYearsInHome: 30,
  parRate: 6.75,
  pointsRate: 6.25,
  pointsCost: 0,
  armInitialRate: 5.75,
  armFixedPeriod: 5,
  armAdjustmentFrequency: 6,
  armInitialCap: 2,
  armAdjustmentCap: 1,
  armLifetimeCap: 5,
  armMargin: 2.75,
  expectedIndexRate: 5,
  ...overrides,
});

describe('getArmProductName', () => {
  it('names a 6-month SOFR ARM as 5/6 and an annual ARM as 5/1', () => {
    expect(getArmProductName(5, 6)).toBe('5/6 ARM');
    expect(getArmProductName(5, 12)).toBe('5/1 ARM');
    expect(getArmProductName(7, 6)).toBe('7/6 ARM');
  });
});

describe('getWorstCaseRatePath', () => {
  it('walks 2/1/5 caps: 5.75 → 7.75 → … → 10.75', () => {
    const path = getWorstCaseRatePath(sofr56());
    expect(path[0]).toMatchObject({ month: 61, rate: 7.75 });
    expect(path[path.length - 1].rate).toBeCloseTo(10.75, 10);
    expect(path.map((s) => s.rate)).toEqual([7.75, 8.75, 9.75, 10.75]);
  });
});

describe('loan-timeline ARM path (ENG-330)', () => {
  it('worst-case rate equals initial + lifetime cap (2/1/5 on 5.75%)', () => {
    const result = calculateLoanTimeline(sofr56());
    expect(result.details.productName).toBe('5/6 ARM');
    expect(result.details.capStructure).toBe('2/1/5');
    expect(Number(result.details.worstCaseRate)).toBeCloseTo(10.75, 3);
  });

  it('reaches the lifetime max in year 7 on a 5/6 with 2/1/5 caps', () => {
    // Month 61 (year 6): 7.75%, +6mo 8.75%, +6mo 9.75%, +6mo (month 79) 10.75%
    const result = calculateLoanTimeline(sofr56());
    expect(Number(result.details.worstCaseYear)).toBe(7);
  });

  it('reaches the lifetime max later on a legacy 5/1 with annual adjustments', () => {
    const result = calculateLoanTimeline(sofr56({ armAdjustmentFrequency: 12 }));
    expect(result.details.productName).toBe('5/1 ARM');
    expect(Number(result.details.worstCaseRate)).toBeCloseTo(10.75, 3);
    // Month 61: 7.75, 73: 8.75, 85: 9.75, 97: 10.75 → year 9
    expect(Number(result.details.worstCaseYear)).toBe(9);
  });

  it('tighter caps lower the worst-case rate', () => {
    const loose = calculateLoanTimeline(sofr56());
    const tight = calculateLoanTimeline(sofr56({ armLifetimeCap: 3, armInitialCap: 1, armAdjustmentCap: 0.5 }));
    expect(Number(tight.details.worstCaseRate)).toBeCloseTo(8.75, 3);
    expect(Number(tight.details.worstCaseRate)).toBeLessThan(Number(loose.details.worstCaseRate));
    expect(Number(tight.details.worstCasePayment)).toBeLessThan(Number(loose.details.worstCasePayment));
  });

  it('peak worst-case payment is along the amortized path, not max rate from day one', () => {
    const result = calculateLoanTimeline(sofr56());
    const dayOneMax = monthlyPayment(400000, 10.75, 360);
    expect(Number(result.details.worstCasePayment)).toBeLessThan(dayOneMax);
    expect(Number(result.details.worstCasePayment)).toBeGreaterThan(Number(result.details.armInitialPayment));
  });

  it('exposes named rate paths and a Monte Carlo payment range', () => {
    const result = calculateArmVsFixed(sofr56());
    expect(Number(result.details.mcSamples)).toBe(400);
    expect(Number(result.details.fallingIndex)).toBeCloseTo(3, 5);
    expect(Number(result.details.risingIndex)).toBeCloseTo(7, 5);
    expect(Number(result.details.fallingTotalPaid)).toBeLessThan(Number(result.details.armTotalPaid));
    expect(Number(result.details.armTotalPaid)).toBeLessThan(Number(result.details.risingTotalPaid));
    expect(Number(result.details.risingMaxPayment)).toBeLessThanOrEqual(Number(result.details.worstCasePayment));
    expect(Number(result.details.p10TotalPaid)).toBeLessThanOrEqual(Number(result.details.p50TotalPaid));
    expect(Number(result.details.p50TotalPaid)).toBeLessThanOrEqual(Number(result.details.p90TotalPaid));
    expect(Number(result.details.p10MaxPayment)).toBeLessThanOrEqual(Number(result.details.p90MaxPayment));
    expect(Number(result.details.pctArmCheaper)).toBeGreaterThanOrEqual(0);
    expect(Number(result.details.pctArmCheaper)).toBeLessThanOrEqual(100);

    const yearly = result.chartData as Array<{
      p10Payment: number;
      p50Payment: number;
      p90Payment: number;
      fallingPayment: number;
      risingPayment: number;
      worstPayment: number;
    }>;
    expect(yearly.length).toBe(30);
    const mid = yearly[20];
    expect(mid.p10Payment).toBeLessThanOrEqual(mid.p50Payment);
    expect(mid.p50Payment).toBeLessThanOrEqual(mid.p90Payment);
    expect(mid.fallingPayment).toBeLessThanOrEqual(mid.risingPayment);
    expect(mid.risingPayment).toBeLessThanOrEqual(mid.worstPayment);
  });

  it('Monte Carlo percentiles are deterministic for the same inputs', () => {
    const a = calculateArmVsFixed(sofr56());
    const b = calculateArmVsFixed(sofr56());
    expect(a.details.p10TotalPaid).toBe(b.details.p10TotalPaid);
    expect(a.details.p90TotalPaid).toBe(b.details.p90TotalPaid);
    expect(a.details.pctArmCheaper).toBe(b.details.pctArmCheaper);
  });

  it('falling-rate expected path respects downward caps and the margin floor', () => {
    // Fully indexed = 0.5 + 2.75 = 3.25%. From 5.75%, first adj (month 61) is
    // capped at −2% → 3.75%; the next 6-month adj (month 67) reaches 3.25%.
    const result = calculateLoanTimeline(
      sofr56({ expectedIndexRate: 0.5, armInitialCap: 2, armAdjustmentCap: 1 })
    );
    const yearly = result.armSchedule;
    const year5 = yearly.find((r) => r.year === 5)!;
    const year6 = yearly.find((r) => r.year === 6)!;
    expect(year5.armRate).toBeCloseTo(5.75, 5);
    expect(year6.armRate).toBeCloseTo(3.25, 5);
    const laterRates = yearly.filter((r) => r.year >= 6).map((r) => r.armRate);
    expect(Math.min(...laterRates)).toBeGreaterThanOrEqual(2.75);
    expect(Math.min(...laterRates)).toBeCloseTo(3.25, 5);
  });
});
