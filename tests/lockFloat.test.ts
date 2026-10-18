import { describe, expect, it } from 'vitest';
import {
  daysBetweenUtc,
  evaluateLockFloat,
  parseDateOnly,
  toUtcDateOnly,
} from '../lib/calculators/lockFloat';

const asOf = new Date('2026-10-18T15:30:00-04:00');

describe('lock/float date helpers', () => {
  it('rejects invalid calendar dates', () => {
    expect(parseDateOnly('')).toBeNull();
    expect(parseDateOnly('2026-13-01')).toBeNull();
    expect(parseDateOnly('2026-02-30')).toBeNull();
    expect(parseDateOnly('10/18/2026')).toBeNull();
  });

  it('parses ISO dates as UTC date-only values', () => {
    const parsed = parseDateOnly('2026-11-17');
    expect(parsed?.toISOString()).toBe('2026-11-17T00:00:00.000Z');
  });

  it('counts whole calendar days', () => {
    const from = toUtcDateOnly(asOf);
    const to = parseDateOnly('2026-11-17')!;
    expect(daysBetweenUtc(from, to)).toBe(30);
  });
});

describe('evaluateLockFloat', () => {
  it('returns null when the closing date is missing or invalid', () => {
    expect(evaluateLockFloat('', asOf)).toBeNull();
    expect(evaluateLockFloat('not-a-date', asOf)).toBeNull();
  });

  it('flags a closing date in the past', () => {
    const decision = evaluateLockFloat('2026-10-01', asOf);
    expect(decision?.recommendation).toBe('past');
    expect(decision?.recommendedLockDays).toBeNull();
    expect(decision?.daysUntilClosing).toBe(-17);
  });

  it('recommends locking when closing is 30 days out', () => {
    const decision = evaluateLockFloat('2026-11-17', asOf);
    expect(decision).toMatchObject({
      daysUntilClosing: 30,
      recommendation: 'lock',
      recommendedLockDays: 30,
      extensionLikely: false,
    });
    expect(decision?.title).toMatch(/30-day/i);
  });

  it('recommends a 45-day lock just outside 30 days', () => {
    const decision = evaluateLockFloat('2026-12-01', asOf);
    expect(decision).toMatchObject({
      daysUntilClosing: 44,
      recommendation: 'lock',
      recommendedLockDays: 45,
    });
  });

  it('recommends a 60-day lock when closing is 46–60 days out', () => {
    const decision = evaluateLockFloat('2026-12-17', asOf);
    expect(decision).toMatchObject({
      daysUntilClosing: 60,
      recommendation: 'lock',
      recommendedLockDays: 60,
      extensionLikely: true,
    });
  });

  it('recommends floating when closing is more than 60 days away', () => {
    const decision = evaluateLockFloat('2027-01-16', asOf);
    expect(decision?.recommendation).toBe('float');
    expect(decision?.recommendedLockDays).toBe(45);
    expect(decision?.daysUntilClosing).toBe(90);
    expect(decision?.rationale).toMatch(/45 days from closing/);
  });

  it('recommends locking immediately inside 15 days', () => {
    const decision = evaluateLockFloat('2026-10-25', asOf);
    expect(decision).toMatchObject({
      daysUntilClosing: 7,
      recommendation: 'lock',
      recommendedLockDays: 15,
    });
    expect(decision?.title).toMatch(/imminent/i);
  });
});
