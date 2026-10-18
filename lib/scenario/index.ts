export {
  SCENARIO_STORAGE_KEY,
  SCENARIO_VERSION,
  SCENARIO_NUMERIC_FIELDS,
  SCENARIO_CORE_FIELDS,
  SCENARIO_FIELD_LABELS,
  emptyScenario,
  hasScenarioValues,
  countScenarioValues,
} from './types';
export type { ScenarioProfile, ScenarioNumericField } from './types';

export { parseScenario, createLocalScenarioStore, localScenarioStore } from './storage';
export type { ScenarioPersistence } from './storage';

export {
  mapProfileToInputs,
  mapInputsToProfile,
  scenarioMappedKeys,
  getDownPaymentPercent,
  getLoanAmount,
  formatScenarioChip,
} from './mapInputs';

export { ScenarioProvider, useScenario } from './ScenarioProvider';
