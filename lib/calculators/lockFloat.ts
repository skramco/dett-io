/**
 * Lock vs. float recommendation from an expected closing date.
 *
 * Standard purchase locks are typically free for 30–45 days. Longer locks or
 * extensions usually cost a fee or a slightly higher rate. This helper maps
 * calendar days-to-close onto that market convention — it is guidance, not a
 * quote.
 */

export type LockFloatRecommendation = 'lock' | 'float' | 'past';
export type RecommendedLockDays = 15 | 30 | 45 | 60;

export interface LockFloatDecision {
  daysUntilClosing: number;
  recommendation: LockFloatRecommendation;
  recommendedLockDays: RecommendedLockDays | null;
  title: string;
  rationale: string;
  extensionLikely: boolean;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

export function parseDateOnly(iso: string): Date | null {
  const match = ISO_DATE.exec(iso.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

/** Calendar date in the local timezone, stored as a UTC date-only value. */
export function toUtcDateOnly(now: Date): Date {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function daysBetweenUtc(from: Date, to: Date): number {
  const start = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const end = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.round((end - start) / MS_PER_DAY);
}

export function evaluateLockFloat(
  closingDate: string,
  asOf: Date = new Date()
): LockFloatDecision | null {
  const closing = parseDateOnly(closingDate);
  if (!closing) return null;

  const daysUntilClosing = daysBetweenUtc(toUtcDateOnly(asOf), closing);

  if (daysUntilClosing < 0) {
    return {
      daysUntilClosing,
      recommendation: 'past',
      recommendedLockDays: null,
      title: 'Closing date has passed',
      rationale:
        'Enter a future closing date to see whether a standard lock still covers you or whether you should keep floating.',
      extensionLikely: false,
    };
  }

  if (daysUntilClosing <= 15) {
    return {
      daysUntilClosing,
      recommendation: 'lock',
      recommendedLockDays: 15,
      title: 'Lock now — closing is imminent',
      rationale:
        'You are inside a 15-day lock window. A rate rise between now and closing would hit this loan immediately, so lock today if the quoted rate still works for your budget.',
      extensionLikely: false,
    };
  }

  if (daysUntilClosing <= 30) {
    return {
      daysUntilClosing,
      recommendation: 'lock',
      recommendedLockDays: 30,
      title: 'Lock a 30-day rate',
      rationale:
        'Closing is within a standard 30-day lock, which most lenders offer at no extra cost. Lock now unless you have a specific reason to bet on rates falling.',
      extensionLikely: false,
    };
  }

  if (daysUntilClosing <= 45) {
    return {
      daysUntilClosing,
      recommendation: 'lock',
      recommendedLockDays: 45,
      title: 'Lock a 45-day rate',
      rationale:
        'A 45-day lock typically covers this closing without an extension. Ask your lender for a 45-day lock so a short delay does not force a costly extension.',
      extensionLikely: false,
    };
  }

  if (daysUntilClosing <= 60) {
    return {
      daysUntilClosing,
      recommendation: 'lock',
      recommendedLockDays: 60,
      title: 'Ask for a 60-day lock',
      rationale:
        'You are just outside the usual free 30–45 day window. A 60-day lock (or a 45-day lock plus a budgeted extension) protects the rate if underwriting or the appraisal slips.',
      extensionLikely: true,
    };
  }

  const daysUntilTypicalLock = daysUntilClosing - 45;
  return {
    daysUntilClosing,
    recommendation: 'float',
    recommendedLockDays: 45,
    title: 'Float for now, then lock',
    rationale: `Standard locks are 30–45 days. Floating for about ${daysUntilTypicalLock} more day${
      daysUntilTypicalLock === 1 ? '' : 's'
    } avoids extension fees, but you take the risk that rates rise before you can lock. Revisit when you are 45 days from closing.`,
    extensionLikely: false,
  };
}
