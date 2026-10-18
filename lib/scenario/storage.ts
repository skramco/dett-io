import {
  SCENARIO_NUMERIC_FIELDS,
  SCENARIO_STORAGE_KEY,
  SCENARIO_VERSION,
  emptyScenario,
  type ScenarioProfile,
} from './types';

/**
 * Persistence contract for the shared scenario profile.
 *
 * `localScenarioStore` is the current implementation (browser localStorage).
 * An account-backed store can implement the same methods later and be
 * swapped in at the provider — no calculator code has to change.
 */
export interface ScenarioPersistence {
  load(): ScenarioProfile | null;
  save(profile: ScenarioProfile): void;
  clear(): void;
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    // Safari private mode / blocked storage
    return null;
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Sanitize untrusted JSON from localStorage into a well-formed profile. */
export function parseScenario(raw: unknown): ScenarioProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Record<string, unknown>;
  const profile = emptyScenario();
  if (typeof rec.updatedAt === 'string' && rec.updatedAt.length > 0) {
    profile.updatedAt = rec.updatedAt;
  }
  if (rec.version === SCENARIO_VERSION) {
    profile.version = SCENARIO_VERSION;
  }
  let hasValue = false;
  for (const field of SCENARIO_NUMERIC_FIELDS) {
    if (isFiniteNumber(rec[field])) {
      profile[field] = rec[field];
      hasValue = true;
    }
  }
  return hasValue ? profile : null;
}

export function createLocalScenarioStore(storage?: StorageLike | null): ScenarioPersistence {
  const readStorage = (): StorageLike | null => storage ?? getBrowserStorage();

  return {
    load() {
      const store = readStorage();
      if (!store) return null;
      try {
        const raw = store.getItem(SCENARIO_STORAGE_KEY);
        if (!raw) return null;
        return parseScenario(JSON.parse(raw));
      } catch {
        return null;
      }
    },
    save(profile: ScenarioProfile) {
      const store = readStorage();
      if (!store) return;
      try {
        store.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(profile));
      } catch {
        // Quota exceeded or storage blocked — fail silently.
      }
    },
    clear() {
      const store = readStorage();
      if (!store) return;
      try {
        store.removeItem(SCENARIO_STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  };
}

export const localScenarioStore = createLocalScenarioStore();
