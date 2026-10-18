import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatCurrencyInput,
  formatCurrencyInputValue,
  formatNumber,
  formatPercent,
  formatSignedCurrency,
  formatYears,
  mapFormattedCaret,
  parseCurrencyInput,
} from '../lib/format';

describe('formatCurrency', () => {
  it('formats whole dollars with thousands separators', () => {
    expect(formatCurrency(3719.4)).toBe('$3,719');
    expect(formatCurrency(480583)).toBe('$480,583');
    expect(formatCurrency(2934.95)).toBe('$2,935');
    expect(formatCurrency(450)).toBe('$450');
  });

  it('renders negatives with a minus sign before the dollar sign', () => {
    expect(formatCurrency(-218)).toBe('−$218');
    expect(formatCurrency(-1234.6)).toBe('−$1,235');
  });

  it('treats non-finite values as $0', () => {
    expect(formatCurrency(Number.NaN)).toBe('$0');
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe('$0');
  });
});

describe('formatSignedCurrency', () => {
  it('prefixes positives with + and negatives with −', () => {
    expect(formatSignedCurrency(218)).toBe('+$218');
    expect(formatSignedCurrency(-218)).toBe('−$218');
  });
});

describe('formatNumber', () => {
  it('pins en-US grouping and fixed decimals', () => {
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(12.34, 1)).toBe('12.3');
  });
});

describe('formatPercent', () => {
  it('defaults to one decimal', () => {
    expect(formatPercent(28)).toBe('28.0%');
    expect(formatPercent(6.75, 2)).toBe('6.75%');
  });
});

describe('formatYears', () => {
  it('pluralizes durations', () => {
    expect(formatYears(1.5)).toBe('1.5 years');
    expect(formatYears(1, 0)).toBe('1 year');
  });
});

describe('formatCurrency cents opt-in', () => {
  it('keeps cents only when decimals is set', () => {
    expect(formatCurrency(12.5, 2)).toBe('$12.50');
    expect(formatCurrency(2019.55)).toBe('$2,020');
  });
});

describe('parseCurrencyInput / formatCurrencyInput', () => {
  it('formats digits with thousands separators while typing', () => {
    expect(formatCurrencyInput('320000')).toBe('320,000');
    expect(formatCurrencyInput('3')).toBe('3');
    expect(formatCurrencyInput('32')).toBe('32');
    expect(formatCurrencyInput('320')).toBe('320');
    expect(formatCurrencyInput('3200')).toBe('3,200');
  });

  it('parses pasted currency with $ and commas', () => {
    expect(parseCurrencyInput('$320,000')).toBe(320000);
    expect(parseCurrencyInput(' $320,000.00 ')).toBe(320000);
    expect(parseCurrencyInput('320000')).toBe(320000);
  });

  it('preserves a trailing decimal while typing', () => {
    expect(formatCurrencyInput('320000.')).toBe('320,000.');
    expect(formatCurrencyInput('320000.5')).toBe('320,000.5');
    expect(formatCurrencyInput('320000.50')).toBe('320,000.50');
    expect(parseCurrencyInput('320,000.50')).toBe(320000.5);
  });

  it('returns null for empty / decoration-only input', () => {
    expect(parseCurrencyInput('')).toBeNull();
    expect(parseCurrencyInput('$')).toBeNull();
    expect(parseCurrencyInput(',')).toBeNull();
    expect(parseCurrencyInput('-')).toBeNull();
  });

  it('formats numeric state back into the input', () => {
    expect(formatCurrencyInputValue(320000)).toBe('320,000');
    expect(formatCurrencyInputValue(0)).toBe('0');
    expect(formatCurrencyInputValue(1999.5)).toBe('1,999.5');
  });
});

describe('mapFormattedCaret', () => {
  it('keeps the caret after the same digit when commas are inserted', () => {
    expect(mapFormattedCaret('3200', '3,200', 4)).toBe(5);
    expect(mapFormattedCaret('320000', '320,000', 6)).toBe(7);
  });

  it('stays in the middle when editing before a comma', () => {
    expect(mapFormattedCaret('320,000', '320,000', 3)).toBe(3);
  });
});
