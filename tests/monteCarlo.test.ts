import { describe, expect, it } from 'vitest';
import {
  clamp,
  createRng,
  gaussian,
  meanRevertingStep,
  percentile,
  shareWhere,
  truncatedNormal,
} from '../lib/calculators/monteCarlo';

describe('createRng', () => {
  it('is deterministic for a given seed', () => {
    const a = createRng(34901);
    const b = createRng(34901);
    const seqA = [a(), a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('differs across seeds', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toBe(b());
  });
});

describe('percentile', () => {
  it('returns endpoints and interpolates', () => {
    expect(percentile([1, 2, 3, 4], 0)).toBe(1);
    expect(percentile([1, 2, 3, 4], 100)).toBe(4);
    expect(percentile([10, 20, 30], 50)).toBe(20);
  });

  it('sorts a copy so callers keep order', () => {
    const values = [3, 1, 2];
    expect(percentile(values, 50)).toBe(2);
    expect(Array.from(values)).toEqual([3, 1, 2]);
  });
});

describe('truncatedNormal', () => {
  it('stays inside bounds', () => {
    const rng = createRng(99);
    for (let i = 0; i < 80; i++) {
      const draw = truncatedNormal(rng, 3, 2, -1, 8);
      expect(draw).toBeGreaterThanOrEqual(-1);
      expect(draw).toBeLessThanOrEqual(8);
    }
  });
});

describe('meanRevertingStep / gaussian helpers', () => {
  it('mean-reverts toward the mean on average', () => {
    const rng = createRng(7);
    let x = 10;
    for (let i = 0; i < 200; i++) {
      x = meanRevertingStep(x, 5, 0.4, 0.1, 0.5, rng);
    }
    expect(x).toBeGreaterThan(3);
    expect(x).toBeLessThan(8);
  });

  it('gaussian draws are finite and mixed sign', () => {
    const rng = createRng(21);
    const draws = Array.from({ length: 40 }, () => gaussian(rng));
    expect(draws.every((d) => Number.isFinite(d))).toBe(true);
    expect(Math.min(...draws)).toBeLessThan(0);
    expect(Math.max(...draws)).toBeGreaterThan(0);
  });

  it('clamp and shareWhere behave', () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(shareWhere([1, -2, 3, 0], (v) => v > 0)).toBeCloseTo(50, 10);
  });
});
