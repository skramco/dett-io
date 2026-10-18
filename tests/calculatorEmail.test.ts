import { describe, expect, it } from 'vitest';
import { render } from '@react-email/render';
import CalculatorResultsEmail from '../emails/CalculatorResultsEmail';

describe('CalculatorResultsEmail', () => {
  it('includes current inputs, headline summary, and a deep link', async () => {
    const html = await render(
      CalculatorResultsEmail({
        calculatorName: 'How Much House Can I Afford?',
        summary: 'You can afford about $520,000.',
        details: { moderatePrice: 520000, backEndDTI: 36 },
        insights: ['Keep housing under 30% of income.'],
        inputs: { annualIncome: 120000, interestRate: 6.5 },
        calculatorUrl: 'https://dett.io/calculators/affordability?annualIncome=120000&interestRate=6.5',
      })
    );

    expect(html).toContain('YOUR RESULT');
    expect(html).toContain('You can afford about $520,000.');
    expect(html).toContain('Your Inputs');
    expect(html).toContain('Annual Income');
    expect(html).toContain('$120,000');
    expect(html).toContain('Headline Results');
    expect(html).toContain('Moderate Price');
    expect(html).toContain('YOUR SAVED CALCULATION');
    expect(html).toContain('https://dett.io/calculators/affordability?annualIncome=120000&amp;interestRate=6.5');
    expect(html).toContain('Knowe LLC');
    expect(html).toContain('https://knowe.one');
    expect(html).not.toContain('Skramco');
  });
});
