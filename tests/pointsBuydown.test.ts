/**
 * ENG-325: Points & Buydown totals must include remaining balance, and
 * temporary 1-0 / 2-1 / 3-2-1 buydowns must actually be modeled.
 */
import { describe, expect, it } from 'vitest';
import { calculatePointsBuydown } from '../lib/calculators';
import { monthlyPayment, remainingBalance } from '../lib/calculators/mortgageMath';

const num = (v: number | string): number => v as number;

const defaultInputs = {
  loanAmount: 360000,
  parRate: 6.75,
  loanTerm: 30,
  pointsCost: 7200,
  pointsRate: 6.25,
  lenderCredit: 3600,
  lenderCreditRate: 7.0,
  buydownType: 'none' as const,
  yearsToHold: 7,
};

describe('points-buydown net cost (ENG-325)', () => {
  const result = calculatePointsBuydown(defaultInputs);
  const holdMonths = 84;

  it('matches the issue-cited ending balances after a 7-year hold', () => {
    expect(num(result.details.parEndingBalance)).toBeCloseTo(
      remainingBalance(360000, 6.75, 360, holdMonths),
      0
    );
    expect(num(result.details.pointsEndingBalance)).toBeCloseTo(
      remainingBalance(360000, 6.25, 360, holdMonths),
      0
    );
    expect(num(result.details.parEndingBalance)).toBeCloseTo(326835, 0);
    expect(num(result.details.pointsEndingBalance)).toBeCloseTo(324121, 0);
  });

  it('ranks Buy Points ahead of par and lender credit when balances diverge', () => {
    const rows = Object.fromEntries(
      result.chartData!.map((r) => [r.option as string, r])
    );
    expect(num(rows['Buy Points'].totalCost)).toBeLessThan(num(rows['Par Rate'].totalCost));
    expect(num(rows['Par Rate'].totalCost)).toBeLessThan(num(rows['Lender Credit'].totalCost));
    expect(result.details.bestOption).toBe('Buy Points');
    expect(num(rows['Buy Points'].totalCost)).toBeCloseTo(157514, 0);
    expect(num(rows['Par Rate'].totalCost)).toBeCloseTo(162971, 0);
    expect(num(rows['Lender Credit'].totalCost)).toBeCloseTo(165718, 0);
  });

  it('caps the hold at the loan term', () => {
    const fullTerm = calculatePointsBuydown({ ...defaultInputs, yearsToHold: 40 });
    expect(num(fullTerm.details.parEndingBalance)).toBe(0);
    expect(num(fullTerm.details.pointsEndingBalance)).toBe(0);
  });

  it('handles a 0% par rate without dividing by zero', () => {
    const zero = calculatePointsBuydown({
      ...defaultInputs,
      parRate: 0,
      pointsRate: 0,
      lenderCreditRate: 0,
    });
    expect(num(zero.details.parPayment)).toBe(1000);
    expect(Number.isFinite(num(zero.details.bestTotalCost))).toBe(true);
  });
});

describe('temporary buydowns (ENG-325)', () => {
  it('models 1-0, 2-1, and 3-2-1 as their own comparison rows', () => {
    for (const buydownType of ['1-0', '2-1', '3-2-1'] as const) {
      const result = calculatePointsBuydown({ ...defaultInputs, buydownType });
      const row = result.chartData!.find((r) => r.option === `${buydownType} Buydown`);
      expect(row, `${buydownType} should appear in the comparison`).toBeDefined();
      expect(num(row!.monthlyPayment)).toBeLessThan(num(result.details.parPayment));
      expect(num(result.details.buydownCost)).toBeGreaterThan(0);
    }
  });

  it('prices a 2-1 subsidy as the sum of payment reductions', () => {
    const result = calculatePointsBuydown({ ...defaultInputs, buydownType: '2-1' });
    const parPayment = monthlyPayment(360000, 6.75, 360);
    const year1 = monthlyPayment(360000, 4.75, 360);
    const year2 = monthlyPayment(360000, 5.75, 360);
    const expectedSubsidy = (parPayment - year1) * 12 + (parPayment - year2) * 12;
    expect(num(result.details.buydownCost)).toBeCloseTo(expectedSubsidy, 0);

    const row = result.chartData!.find((r) => r.option === '2-1 Buydown')!;
    expect(num(row.monthlyPayment)).toBeCloseTo(year1, 0);
    expect(num(row.endingBalance)).toBeCloseTo(remainingBalance(360000, 6.75, 360, 84), 0);
  });

  it('credits unused 3-2-1 subsidy when the hold ends mid-buydown', () => {
    const result = calculatePointsBuydown({
      ...defaultInputs,
      buydownType: '3-2-1',
      yearsToHold: 2,
    });
    const parPayment = monthlyPayment(360000, 6.75, 360);
    const year3 = monthlyPayment(360000, 5.75, 360);
    const unused = (parPayment - year3) * 12;
    const expectedEnding = remainingBalance(360000, 6.75, 360, 24) - unused;
    const row = result.chartData!.find((r) => r.option === '3-2-1 Buydown')!;
    expect(num(row.endingBalance)).toBeCloseTo(expectedEnding, 0);
  });

  it('nets a borrower-paid buydown to roughly the same cost as par', () => {
    const result = calculatePointsBuydown({ ...defaultInputs, buydownType: '2-1' });
    const par = result.chartData!.find((r) => r.option === 'Par Rate')!;
    const buydown = result.chartData!.find((r) => r.option === '2-1 Buydown')!;
    expect(num(buydown.totalCost)).toBeCloseTo(num(par.totalCost), 0);
  });
});
