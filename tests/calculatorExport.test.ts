import { describe, expect, it } from 'vitest';
import { jsPDF } from 'jspdf';
import { buildExportDocument } from '../lib/share/calculatorState';
import { renderCalculatorPdf } from '../lib/share/writeCalculatorPdf';

describe('renderCalculatorPdf', () => {
  it('embeds the current inputs, headline summary, and result rows', () => {
    const document = buildExportDocument({
      calculatorName: 'True Monthly Mortgage Cost',
      summary: 'Your true monthly cost is $3,214.',
      details: { principalAndInterest: 2276, totalMonthly: 3214 },
      insights: ['Taxes and insurance make up a large share of the payment.'],
      inputs: { homePrice: 450000, interestRate: 6.5, loanTerm: 30 },
      generatedAt: new Date('2026-10-18T12:00:00Z'),
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    renderCalculatorPdf(pdf, document);
    const output = pdf.output();

    expect(output).toContain('Your Inputs');
    expect(output).toContain('Headline Result');
    expect(output).toContain('Headline Results');
    expect(output).toContain('Home Price');
    expect(output).toContain('Interest Rate');
  });
});
