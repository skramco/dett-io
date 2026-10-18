'use client';

import { useEffect, useRef } from 'react';
import { useIsEmbed } from '@/lib/embedContext';
import {
  mapProfileToInputs,
  scenarioMappedKeys,
} from '@/lib/scenario/mapInputs';
import { useScenario } from '@/lib/scenario/ScenarioProvider';
import { hasScenarioValues } from '@/lib/scenario/types';

const EMPTY_TOKEN = '__empty__';

/**
 * Prefills calculator inputs from the shared "My scenario" profile.
 *
 * Priority (highest last, so it wins):
 *   1. Calculator static defaults
 *   2. My scenario profile (this hook)
 *   3. URL query params (`useUrlInputs` — call this hook first)
 *
 * Live market rates (`useLiveRateDefaults`) skip any field the user or this
 * profile already changed, so a saved scenario rate is not overwritten.
 *
 * Embeds skip the profile entirely so a partner page never inherits the
 * visitor's personal numbers from dett.io localStorage.
 */
export function useScenarioPrefill<T extends object>(
  defaults: T,
  setInputs: (updater: (prev: T) => T) => void
) {
  const { profile, hydrated } = useScenario();
  const isEmbed = useIsEmbed();
  const defaultsRef = useRef(defaults);
  const lastAppliedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || isEmbed) return;

    const token = hasScenarioValues(profile) && profile ? profile.updatedAt : EMPTY_TOKEN;
    if (lastAppliedRef.current === token) return;
    const previous = lastAppliedRef.current;
    lastAppliedRef.current = token;

    const urlParams = new URLSearchParams(window.location.search);

    if (token === EMPTY_TOKEN) {
      // Restore mapped keys to defaults only if we had previously applied a profile.
      if (previous && previous !== EMPTY_TOKEN) {
        const keys = scenarioMappedKeys(defaultsRef.current);
        setInputs((prev) => {
          const next = { ...prev };
          for (const key of keys) {
            if (urlParams.has(key)) continue;
            (next as Record<string, unknown>)[key] = (defaultsRef.current as Record<string, unknown>)[key];
          }
          return next;
        });
      }
      return;
    }

    if (!profile) return;

    const overrides = mapProfileToInputs(defaultsRef.current, profile, urlParams);
    if (Object.keys(overrides).length === 0) return;

    setInputs((prev) => ({ ...prev, ...overrides }));
  }, [hydrated, isEmbed, profile, setInputs]);
}
