import { describe, expect, it } from 'vitest';
import { calculateTimelineSimulator } from '../lib/calculators/timelineSimulator';
import type { TimelineSimulatorInputs } from '../lib/calculators/types';
import { armAdjustedRate, monthlyPayment } from '../lib/calculators/mortgageMath';

const num = (v: number | string): number => v as number;

/** Dett.io review scenario from ENG-324. */
const siteDefaults = (overrides: Partial<TimelineSimulatorInputs> = {}): TimelineSimulatorInputs => ({
  loanAmount: 360000,
  interestRate: 6.75,
  expectedMoveYear: 7,
  armInitialRate: 5.75,
  armFixedPeriod: 5,
  armMargin: 2.75,
  expectedIndexRate: 5,
  armAdjustmentCap: 2,
  armLifetimeCap: 5,
  pointsCost: 7200,
  pointsRate: 6.25,
  ...overrides,
});

describe('timeline simulator ARM path (ENG-324)', () => {
  it('uses the start rate through the fixed period', () => {
    const result = calculateTimelineSimulator(siteDefaults({ expectedMoveYear: 5 }));
    expect(num(result.details.armAdjusts)).toBe(0);
    expect(num(result.details.armAdjustedRate)).toBe(5.75);
    expect(num(result.details.armPayment)).toBe(num(result.details.armAdjustedPayment));
    expect(num(result.details.armPayment)).toBeCloseTo(monthlyPayment(360000, 5.75, 360), 0);
  });

  it('resets to index + margin after the fixed period, using the shared cap model', () => {
    const result = calculateTimelineSimulator(siteDefaults());
    const expectedRate = armAdjustedRate(5.75, 5, 2.75, 2, 5.75, 5);

    expect(num(result.details.armAdjusts)).toBe(1);
    expect(expectedRate).toBeCloseTo(7.75, 10);
    expect(num(result.details.armAdjustedRate)).toBeCloseTo(expectedRate, 3);
    expect(num(result.details.armPayment)).toBeCloseTo(2101, 0);
    expect(num(result.details.armAdjustedPayment)).toBeCloseTo(2522, 0);
    expect(num(result.details.armAdjustedPayment)).toBeGreaterThan(num(result.details.armPayment));
  });

  it('does not recommend the 5-year ARM as cheapest on a 7-year hold', () => {
    const result = calculateTimelineSimulator(siteDefaults());
    const armRow = result.chartData!.find((r) => r.option === '5-Year ARM')!;
    const naiveFlatPaid = monthlyPayment(360000, 5.75, 360) * 84;

    expect(num(armRow.totalPaid)).toBeGreaterThan(naiveFlatPaid + 9000);
    expect(result.details.bestOption).not.toBe('5-Year ARM');
    expect(result.insights.join(' ')).toMatch(/7\.75%/);
    expect(result.insights.join(' ')).toMatch(/2,522/);
  });

  it('honors the periodic cap on the first reset', () => {
    const result = calculateTimelineSimulator(
      siteDefaults({
        expectedMoveYear: 6,
        expectedIndexRate: 8,
        armMargin: 2.75,
        armAdjustmentCap: 1,
      })
    );
    expect(num(result.details.armAdjustedRate)).toBeCloseTo(
      armAdjustedRate(5.75, 8, 2.75, 1, 5.75, 5),
      3
    );
    expect(num(result.details.armAdjustedRate)).toBeCloseTo(6.75, 3);
  });

  it('honors the lifetime cap', () => {
    const result = calculateTimelineSimulator(
      siteDefaults({
        expectedMoveYear: 10,
        expectedIndexRate: 10,
        armMargin: 3,
        armAdjustmentCap: 5,
        armLifetimeCap: 2,
      })
    );
    expect(num(result.details.armAdjustedRate)).toBeCloseTo(7.75, 3);
  });

  it('stops 15-year payments at month 180', () => {
    const result = calculateTimelineSimulator(siteDefaults({ expectedMoveYear: 20 }));
    const fifteen = result.chartData!.find((r) => r.option === '15-Year Fixed')!;
    const payment = monthlyPayment(360000, 6.25, 180);
    expect(num(fifteen.totalPaid)).toBeCloseTo(payment * 180, 0);
    expect(num(fifteen.remainingBalance)).toBeCloseTo(0, 0);
  });

  it('computes net cost as payments + closing − equity for every option', () => {
    const result = calculateTimelineSimulator(siteDefaults());
    for (const row of result.chartData!) {
      const closing = row.option === '30-Year Fixed (Points)' ? 7200 : 0;
      const equity = 360000 - num(row.remainingBalance);
      expect(num(row.netCost)).toBeCloseTo(num(row.totalPaid) + closing - equity, 0);
    }
  });
});
