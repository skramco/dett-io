import type { AmortizationSchedule } from './amortization';

export type AmortizationCsvView = 'yearly' | 'monthly';

const MONTHLY_HEADERS = [
  'Payment Number',
  'Date',
  'Scheduled Payment',
  'Principal',
  'Interest',
  'Extra Payment',
  'Total Payment',
  'Remaining Balance',
  'Cumulative Interest',
  'Cumulative Principal',
] as const;

const YEARLY_HEADERS = [
  'Year',
  'Total Payment',
  'Principal',
  'Interest',
  'Ending Balance',
] as const;

/** Format a schedule number so spreadsheet apps can sum the column. */
export function csvNumber(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function escapeCsvValue(value: string | number): string {
  const raw = String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function rowsToCsv(rows: Array<Array<string | number>>): string {
  return rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n') + '\n';
}

export function buildAmortizationCsv(
  schedule: AmortizationSchedule,
  view: AmortizationCsvView
): string {
  if (view === 'yearly') {
    return rowsToCsv([
      [...YEARLY_HEADERS],
      ...schedule.yearlySummary.map((year) => [
        year.year,
        csvNumber(year.totalPayment),
        csvNumber(year.totalPrincipal),
        csvNumber(year.totalInterest),
        csvNumber(year.endingBalance),
      ]),
    ]);
  }

  return rowsToCsv([
    [...MONTHLY_HEADERS],
    ...schedule.schedule.map((row) => [
      row.month,
      row.date,
      csvNumber(row.payment),
      csvNumber(row.principal),
      csvNumber(row.interest),
      csvNumber(row.extraPayment),
      csvNumber(row.totalPayment),
      csvNumber(row.balance),
      csvNumber(row.cumulativeInterest),
      csvNumber(row.cumulativePrincipal),
    ]),
  ]);
}

export function amortizationCsvFilename(
  view: AmortizationCsvView,
  generatedAt = new Date()
): string {
  const ymd = generatedAt.toISOString().slice(0, 10);
  return `amortization-${view}-${ymd}.csv`;
}

/** Trigger a browser file download. No-op outside the DOM. */
export function triggerCsvDownload(filename: string, csv: string): void {
  if (typeof document === 'undefined') return;

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
