import { describe, it, expect } from 'vitest';
import { calculateMortgageCost } from '../lib/calculators/mortgageCost';
import { monthlyPayment } from '../lib/calculators/mortgageMath';
import {
  MORTGAGE_COST_DEFAULT_INPUTS,
  formatWholeDollars,
  getMortgageCostHeroData,
} from '../lib/calculators/mortgageCostDefaults';

/**
 * Guards against the homepage hero mock result drifting from the live
 * True Monthly Cost calculator (ENG-351). The hero data must be derived
 * from the same calculation function and the same default inputs.
 */
describe('homepage hero vs True Monthly Cost calculator defaults', () => {
  const calculatorResult = calculateMortgageCost(MORTGAGE_COST_DEFAULT_INPUTS);
  const hero = getMortgageCostHeroData();

  it('hero headline total equals the calculator default output', () => {
    expect(hero.total).toBe(
      formatWholeDollars(calculatorResult.details.totalMonthlyPayment as number)
    );
  });

  it('hero breakdown lines match the calculator breakdown exactly (labels, values, order)', () => {
    const expected = (calculatorResult.chartData ?? []).map((item) => ({
      label: item.name as string,
      value: formatWholeDollars(item.value as number),
      pct: item.percentage as number,
    }));
    expect(hero.breakdown).toEqual(expected);
  });

  it('breakdown line totals sum to the headline total', () => {
    const sum = (calculatorResult.chartData ?? []).reduce(
      (acc, item) => acc + (item.value as number),
      0
    );
    expect(formatWholeDollars(sum)).toBe(hero.total);
  });

  it('matches the known default output snapshot (whole dollars, thousands separators)', () => {
    // Defaults: $450k home, 20% down (no PMI), DEFAULT_RATES.thirtyYearFixed (6.75%),
    // 30yr, $5,400 tax, $1,800 insurance. P&I is owned by mortgageMath (ENG-332).
    const loanAmount =
      MORTGAGE_COST_DEFAULT_INPUTS.homePrice - MORTGAGE_COST_DEFAULT_INPUTS.downPayment;
    const expectedPI = monthlyPayment(
      loanAmount,
      MORTGAGE_COST_DEFAULT_INPUTS.interestRate,
      MORTGAGE_COST_DEFAULT_INPUTS.loanTerm * 12
    );
    expect(formatWholeDollars(expectedPI)).toBe('$2,335');
    expect(hero.total).toBe('$2,935');
    expect(hero.breakdown.map(({ label, value }) => ({ label, value }))).toEqual([
      { label: 'Principal & Interest', value: '$2,335' },
      { label: 'Property Tax', value: '$450' },
      { label: 'Home Insurance', value: '$150' },
    ]);
  });

  it('excludes zero-value lines (no PMI/HOA at the 20%-down default)', () => {
    const labels = hero.breakdown.map((line) => line.label);
    expect(labels).not.toContain('PMI');
    expect(labels).not.toContain('HOA Fees');
  });

  it('formats as whole dollars with thousands separators', () => {
    expect(formatWholeDollars(2934.95)).toBe('$2,935');
    expect(formatWholeDollars(450)).toBe('$450');
    expect(formatWholeDollars(1234567.89)).toBe('$1,234,568');
  });
});
