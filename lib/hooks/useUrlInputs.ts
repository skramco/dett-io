'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  applyInputsToUrl,
  inputsEqual,
  parseInputsFromLocation,
  type CalculatorInputs,
} from '@/lib/share/calculatorState';

/**
 * Bidirectional calculator URL sync.
 *
 * - On mount, reads query (or hash) params and merges valid values into state.
 * - After restore, writes current inputs back to the query string via
 *   history.replaceState whenever they change.
 * - Fresh visits (no encoded inputs) keep a clean URL until the user — or live
 *   market-rate defaults — change a value, so shared links and /api/rates
 *   still work together.
 */
export function useUrlInputs<T extends object>(
  inputs: T,
  setInputs: (updater: (prev: T) => T) => void
) {
  const defaultsRef = useRef(inputs);
  const knownKeysRef = useRef(Object.keys(inputs as object));
  const restoredFromUrlRef = useRef(false);
  const waitingForRestoreRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const overrides = parseInputsFromLocation(
      window.location.search,
      defaultsRef.current,
      window.location.hash
    );

    if (!overrides) return;

    restoredFromUrlRef.current = true;
    waitingForRestoreRef.current = true;
    setInputs((prev) => ({ ...prev, ...overrides }));
  }, [setInputs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const defaults = defaultsRef.current as CalculatorInputs;
    const current = inputs as CalculatorInputs;

    if (waitingForRestoreRef.current) {
      if (inputsEqual(current, defaults)) return;
      waitingForRestoreRef.current = false;
    }

    if (!restoredFromUrlRef.current && inputsEqual(current, defaults)) return;

    const next = applyInputsToUrl(
      window.location.href,
      current,
      knownKeysRef.current
    );
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== currentPath) {
      window.history.replaceState(window.history.state, '', next);
    }
  }, [inputs]);
}
