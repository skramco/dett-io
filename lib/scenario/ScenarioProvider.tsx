'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { localScenarioStore } from './storage';
import {
  SCENARIO_STORAGE_KEY,
  emptyScenario,
  hasScenarioValues,
  type ScenarioProfile,
} from './types';

const SCENARIO_CHANGE_EVENT = 'dett-scenario-change';

interface ScenarioContextValue {
  profile: ScenarioProfile | null;
  hydrated: boolean;
  hasProfile: boolean;
  saveProfile: (profile: ScenarioProfile) => void;
  clearProfile: () => void;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

let snapshotKey = '__uninit__';
let snapshotValue: ScenarioProfile | null = null;

function readSnapshot(): ScenarioProfile | null {
  const loaded = localScenarioStore.load();
  const key = loaded ? JSON.stringify(loaded) : '';
  if (key === snapshotKey) return snapshotValue;
  snapshotKey = key;
  snapshotValue = loaded;
  return snapshotValue;
}

function subscribeToScenario(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== SCENARIO_STORAGE_KEY) return;
    onStoreChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(SCENARIO_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(SCENARIO_CHANGE_EVENT, onStoreChange);
  };
}

function notifyScenarioChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SCENARIO_CHANGE_EVENT));
}

const hydratedSubscribe = () => () => {};
const getHydratedSnapshot = () => true;
const getHydratedServerSnapshot = () => false;
const getServerSnapshot = (): ScenarioProfile | null => null;

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const profile = useSyncExternalStore(subscribeToScenario, readSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    hydratedSubscribe,
    getHydratedSnapshot,
    getHydratedServerSnapshot
  );

  const saveProfile = useCallback((next: ScenarioProfile) => {
    const saved: ScenarioProfile = {
      ...next,
      version: 1,
      updatedAt: next.updatedAt || new Date().toISOString(),
    };
    if (!hasScenarioValues(saved)) {
      localScenarioStore.clear();
      notifyScenarioChange();
      return;
    }
    localScenarioStore.save(saved);
    notifyScenarioChange();
  }, []);

  const clearProfile = useCallback(() => {
    localScenarioStore.clear();
    notifyScenarioChange();
  }, []);

  const value = useMemo<ScenarioContextValue>(
    () => ({
      profile,
      hydrated,
      hasProfile: hasScenarioValues(profile),
      saveProfile,
      clearProfile,
    }),
    [profile, hydrated, saveProfile, clearProfile]
  );

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export function useScenario(): ScenarioContextValue {
  const ctx = useContext(ScenarioContext);
  if (!ctx) {
    // Safe fallback for pages rendered outside the provider (tests, stray trees).
    return {
      profile: null,
      hydrated: true,
      hasProfile: false,
      saveProfile: () => {},
      clearProfile: () => {},
    };
  }
  return ctx;
}

export { emptyScenario };
