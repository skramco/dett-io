/**
 * Seeded sampling helpers for rate-path / scenario-range calculators.
 *
 * Results must be deterministic: the same inputs always produce the same
 * percentiles so tests and "Show Me the Math" stay stable. Mulberry32 is a
 * tiny 32-bit PRNG; Box–Muller turns its uniforms into standard normals.
 */

/** Mulberry32 — small, fast, deterministic PRNG in (0, 1]. */
export function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal via Box–Muller. */
export function gaussian(rng: () => number): number {
  const u1 = Math.max(rng(), Number.EPSILON);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Draw N(mean, sd²) and reject draws outside [min, max]. Falls back to a
 * clamped mean after several misses so a tight window cannot hang.
 */
export function truncatedNormal(
  rng: () => number,
  mean: number,
  sd: number,
  min: number,
  max: number
): number {
  if (sd <= 0) return clamp(mean, min, max);
  for (let i = 0; i < 24; i++) {
    const draw = mean + sd * gaussian(rng);
    if (draw >= min && draw <= max) return draw;
  }
  return clamp(mean, min, max);
}

/**
 * One step of a discrete Ornstein–Uhlenbeck (mean-reverting) process:
 * x ← x + κ(μ − x)Δt + σ√Δt · Z
 */
export function meanRevertingStep(
  current: number,
  mean: number,
  kappa: number,
  sigma: number,
  dtYears: number,
  rng: () => number
): number {
  const shock = sigma * Math.sqrt(Math.max(dtYears, 0)) * gaussian(rng);
  return current + kappa * (mean - current) * dtYears + shock;
}

/** Linear-interpolated percentile. `p` is 0–100. Sorts a copy. */
export function percentile(values: ArrayLike<number>, p: number): number {
  const n = values.length;
  if (n === 0) return 0;
  const sorted = Array.from(values).sort((a, b) => a - b);
  if (n === 1) return sorted[0];
  const clamped = clamp(p, 0, 100);
  const idx = (clamped / 100) * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const w = idx - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

export function mean(values: ArrayLike<number>): number {
  const n = values.length;
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += values[i];
  return sum / n;
}

export function shareWhere(values: ArrayLike<number>, pred: (v: number) => boolean): number {
  const n = values.length;
  if (n === 0) return 0;
  let hits = 0;
  for (let i = 0; i < n; i++) if (pred(values[i])) hits++;
  return (hits / n) * 100;
}
