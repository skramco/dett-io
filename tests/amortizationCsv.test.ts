import { describe, expect, it } from 'vitest';
import { calculateAmortization } from '../lib/calculators/amortization';
import {
  amortizationCsvFilename,
  buildAmortizationCsv,
  csvNumber,
  escapeCsvValue,
  rowsToCsv,
} from '../lib/calculators/amortizationCsv';

const inputs = {
  loanAmount: 300000,
  interestRate: 6.5,
  loanTerm: 30,
  extraMonthlyPayment: 0,
  startDate: '2026-01',
};

describe('amortization CSV helpers', () => {
  it('escapes commas, quotes, and line breaks', () => {
    expect(escapeCsvValue(12.5)).toBe('12.5');
    expect(escapeCsvValue('Jan 2026')).toBe('Jan 2026');
    expect(escapeCsvValue('1,200')).toBe('"1,200"');
    expect(escapeCsvValue('say "hello"')).toBe('"say ""hello"""');
  });

  it('formats money as two-decimal spreadsheet values', () => {
    expect(csvNumber(1896.204)).toBe('1896.20');
    expect(csvNumber(0)).toBe('0.00');
  });

  it('joins rows with a trailing newline', () => {
    expect(rowsToCsv([['A', 'B'], [1, 2]])).toBe('A,B\n1,2\n');
  });
});

describe('buildAmortizationCsv', () => {
  const result = calculateAmortization(inputs);
  const { schedule, yearlySummary } = result.amortizationSchedule;

  it('exports a yearly schedule with one data row per year', () => {
    const csv = buildAmortizationCsv(result.amortizationSchedule, 'yearly');
    const lines = csv.trimEnd().split('\n');

    expect(lines[0]).toBe('Year,Total Payment,Principal,Interest,Ending Balance');
    expect(lines).toHaveLength(1 + yearlySummary.length);
    expect(lines[1]).toBe(
      [
        yearlySummary[0].year,
        csvNumber(yearlySummary[0].totalPayment),
        csvNumber(yearlySummary[0].totalPrincipal),
        csvNumber(yearlySummary[0].totalInterest),
        csvNumber(yearlySummary[0].endingBalance),
      ].join(',')
    );
    expect(lines.at(-1)).toMatch(/^30,/);
    expect(lines.at(-1)).toContain(csvNumber(0));
  });

  it('exports a monthly schedule with payment-level columns', () => {
    const csv = buildAmortizationCsv(result.amortizationSchedule, 'monthly');
    const lines = csv.trimEnd().split('\n');

    expect(lines[0]).toBe(
      'Payment Number,Date,Scheduled Payment,Principal,Interest,Extra Payment,Total Payment,Remaining Balance,Cumulative Interest,Cumulative Principal'
    );
    expect(lines).toHaveLength(1 + schedule.length);
    expect(lines[1].startsWith('1,')).toBe(true);
    expect(lines[1]).toContain(csvNumber(schedule[0].principal));
    expect(lines[1]).toContain(csvNumber(schedule[0].interest));
    expect(lines.at(-1)?.startsWith(`${schedule.length},`)).toBe(true);
    expect(lines.at(-1)).toContain(csvNumber(0));
  });

  it('includes extra principal in the monthly export', () => {
    const extra = calculateAmortization({ ...inputs, extraMonthlyPayment: 250 });
    const csv = buildAmortizationCsv(extra.amortizationSchedule, 'monthly');
    const firstRow = csv.trimEnd().split('\n')[1];
    expect(firstRow).toContain('250.00');
    expect(extra.amortizationSchedule.schedule.length).toBeLessThan(360);
  });
});

describe('amortizationCsvFilename', () => {
  it('names the file from the current view and date', () => {
    expect(amortizationCsvFilename('yearly', new Date('2026-10-18T12:00:00Z'))).toBe(
      'amortization-yearly-2026-10-18.csv'
    );
    expect(amortizationCsvFilename('monthly', new Date('2026-03-01T00:00:00Z'))).toBe(
      'amortization-monthly-2026-03-01.csv'
    );
  });
});
