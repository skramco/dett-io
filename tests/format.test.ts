import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatSignedCurrency,
  formatYears,
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
