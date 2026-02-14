'use client';

import { useEffect, useRef } from 'react';

/**
 * Reads URL query params on mount and merges numeric values into calculator inputs.
 * Only overrides fields that exist in the defaults object and have valid numeric values.
 * Uses window.location.search directly to avoid needing a Suspense boundary.
 * Runs once on mount.
 */
export function useUrlInputs<T extends object>(
  defaults: T,
  setInputs: (updater: (prev: T) => T) => void
) {
  const defaultsRef = useRef(defaults);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.toString()) return;

    const overrides: Record<string, number> = {};
    let hasOverrides = false;

    for (const key of Object.keys(defaultsRef.current as object)) {
      const raw = searchParams.get(key);
      if (raw !== null) {
        const num = Number(raw);
        if (!isNaN(num)) {
          overrides[key] = num;
          hasOverrides = true;
        }
      }
    }

    if (hasOverrides) {
      setInputs((prev) => ({ ...prev, ...overrides }));
    }
  }, [setInputs]);
}
