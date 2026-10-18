'use client';

import { useEffect, useRef } from 'react';
import {
  isCompleteZip,
  resolveLocationDefaults,
  type LocationValue,
  type ResolvedLocationDefaults,
} from '@/lib/locations';

function locationSignature(loc: LocationValue): string {
  const zip = isCompleteZip(loc.zip) ? loc.zip : '';
  return `${loc.state}|${zip}`;
}

function restoreUrlNumericFields<T extends object>(applied: T, previous: T): T {
  const params = new URLSearchParams(window.location.search);
  const restored = { ...applied } as T;
  for (const key of Object.keys(applied) as Array<keyof T>) {
    if (key === 'state' || key === 'zip') continue;
    if (!params.has(String(key))) continue;
    restored[key] = previous[key];
  }
  return restored;
}

/**
 * When the calculator's state/ZIP change (user input or a shared URL),
 * refresh location-driven housing and closing defaults.
 *
 * Skips the initial mount so a page's baked-in national figures stay put
 * until the user picks a location — unless the page already has a state
 * (closing-costs defaults to CA) or the URL has `state`/`zip`.
 */
export function useLocationHousingSync<T extends { state?: string; zip?: string; homePrice?: number }>(
  inputs: T,
  setInputs: (updater: (prev: T) => T) => void,
  apply: (prev: T, resolved: ResolvedLocationDefaults) => T,
) {
  const loc: LocationValue = {
    state: inputs.state ?? '',
    zip: isCompleteZip(inputs.zip ?? '') ? (inputs.zip ?? '') : '',
  };
  const signature = locationSignature(loc);
  const appliedSignature = useRef<string | null>(null);

  useEffect(() => {
    const homePriceOf = (prev: T) =>
      typeof prev.homePrice === 'number' && prev.homePrice > 0 ? prev.homePrice : 450000;

    if (appliedSignature.current === null) {
      const params = new URLSearchParams(window.location.search);
      const urlState = params.get('state') ?? '';
      const rawZip = (params.get('zip') ?? '').replace(/\D/g, '').slice(0, 5);
      const urlZip = isCompleteZip(rawZip) ? rawZip : '';
      const urlHasLocation = Boolean(urlState || urlZip);

      if (!urlHasLocation && !loc.state && !loc.zip) {
        appliedSignature.current = signature;
        return;
      }

      const resolvedLoc: LocationValue = {
        state: urlState || loc.state,
        zip: urlZip || loc.zip,
      };
      setInputs((prev) => {
        const applied = apply(
          prev,
          resolveLocationDefaults(resolvedLoc, homePriceOf(prev)),
        );
        return restoreUrlNumericFields(applied, prev);
      });
      appliedSignature.current = locationSignature(resolvedLoc);
      return;
    }

    if (appliedSignature.current === signature) return;
    appliedSignature.current = signature;

    setInputs((prev) =>
      apply(
        prev,
        resolveLocationDefaults(
          { state: loc.state, zip: prev.zip ?? loc.zip },
          homePriceOf(prev),
        ),
      ),
    );
  }, [signature, loc.state, loc.zip, setInputs, apply]);
}
