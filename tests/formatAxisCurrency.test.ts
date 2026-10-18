import { describe, expect, it } from 'vitest';
import { formatAxisCurrency } from '../lib/format/currency';

describe('formatAxisCurrency', () => {
  it('formats zero as $0 (not $0k)', () => {
    expect(formatAxisCurrency(0)).toBe('$0');
  });

  it('formats thousands with a K suffix', () => {
    expect(formatAxisCurrency(5000)).toBe('$5K');
    expect(formatAxisCurrency(10_000)).toBe('$10K');
  });

  it('keeps one decimal for values under 10K / 10M', () => {
    expect(formatAxisCurrency(1500)).toBe('$1.5K');
    expect(formatAxisCurrency(1_200_000)).toBe('$1.2M');
  });

  it('drops a trailing .0', () => {
    expect(formatAxisCurrency(1_000_000)).toBe('$1M');
    expect(formatAxisCurrency(2000)).toBe('$2K');
  });

  it('keeps whole dollars under $1,000', () => {
    expect(formatAxisCurrency(850)).toBe('$850');
  });

  it('prefixes negatives with a minus sign', () => {
    expect(formatAxisCurrency(-2500)).toBe('−$2.5K');
    expect(formatAxisCurrency(-1_200_000)).toBe('−$1.2M');
  });

  it('treats non-finite values as $0', () => {
    expect(formatAxisCurrency(Number.NaN)).toBe('$0');
    expect(formatAxisCurrency(Number.POSITIVE_INFINITY)).toBe('$0');
  });
});
