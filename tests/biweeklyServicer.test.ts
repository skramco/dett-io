import { describe, expect, it } from 'vitest';
import { calculatePayoff } from '../lib/calculators';

describe('biweekly servicer disclosure', () => {
  it('warns that some servicers will not accept partial or true biweekly payments', () => {
    const result = calculatePayoff({
      loanAmount: 300000,
      interestRate: 6.5,
      loanTerm: 30,
      biweeklyFee: 300,
    });

    expect(
      result.insights.some(
        (insight) =>
          /servicer/i.test(insight) &&
          /partial/i.test(insight) &&
          /true biweekly/i.test(insight)
      )
    ).toBe(true);
  });
});
