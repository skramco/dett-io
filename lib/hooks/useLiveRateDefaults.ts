'use client';

import { useEffect, useRef, useState } from 'react';
import type { MarketRates, RatesResponse } from '@/lib/rates/types';

/** Fetches current market rates from /api/rates. Returns null until loaded or on failure. */
export function useMarketRates(): MarketRates | null {
  const [rates, setRates] = useState<MarketRates | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/rates', { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<RatesResponse>) : null))
      .then((data) => {
        if (data?.rates && typeof data.rates.rate30 === 'number') {
          setRates(data.rates);
        }
      })
      .catch(() => {
        // Feed unavailable — calculators keep their static defaults.
      });
    return () => controller.abort();
  }, []);

  return rates;
}

interface LiveRateFields<T> {
  /** Field that receives the live 30-year fixed rate directly. */
  anchorField: Extract<keyof T, string>;
  /**
   * Fields whose static defaults are relative to the anchor (e.g. an ARM
   * teaser rate or a bought-down rate). They are shifted by the same delta
   * as the anchor so the spread between them stays realistic.
   */
  offsetFields?: Array<Extract<keyof T, string>>;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Replaces static rate defaults with the live market rate once it loads.
 *
 * A field is left untouched when:
 * - it was prefilled via a URL query param (shared links win), or
 * - the user already edited it (current value differs from the mount default).
 *
 * Returns the fetched MarketRates (or null) so pages can render an as-of note.
 */
export function useLiveRateDefaults<T extends object>(
  inputs: T,
  setInputs: (updater: (prev: T) => T) => void,
  fields: LiveRateFields<T>
): MarketRates | null {
  const rates = useMarketRates();
  const initialRef = useRef(inputs);
  const fieldsRef = useRef(fields);
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!rates || appliedRef.current) return;
    appliedRef.current = true;

    const { anchorField, offsetFields = [] } = fieldsRef.current;
    const initial = initialRef.current as Record<string, unknown>;
    const anchorDefault = initial[anchorField];
    if (typeof anchorDefault !== 'number') return;
    const delta = rates.rate30 - anchorDefault;

    const urlParams = new URLSearchParams(window.location.search);

    setInputs((prev) => {
      const next = { ...prev } as Record<string, unknown>;
      let changed = false;
      for (const field of [anchorField, ...offsetFields]) {
        if (urlParams.has(field)) continue;
        const initialValue = initial[field];
        const currentValue = (prev as Record<string, unknown>)[field];
        if (typeof initialValue !== 'number' || currentValue !== initialValue) continue;
        const updated = round2(initialValue + delta);
        if (updated > 0) {
          next[field] = updated;
          changed = true;
        }
      }
      return changed ? (next as T) : prev;
    });
  }, [rates, setInputs]);

  return rates;
}
