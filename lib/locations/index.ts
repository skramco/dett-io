export { zipToState, normalizeZip, isCompleteZip } from './zipToState';
export {
  STATE_HOUSING_DEFAULTS,
  NATIONAL_HOUSING_DEFAULTS,
  ZIP_HOUSING_OVERRIDES,
  findZipHousingOverride,
} from './housingDefaults';
export type { StateHousingDefaults, ZipHousingOverride } from './housingDefaults';
export { resolveLocationDefaults, hasSpecificLocation, roundDollars } from './resolveLocation';
export type { LocationValue, ResolvedLocationDefaults } from './resolveLocation';
export {
  applyLocationToMortgageCost,
  rescaleMortgageCostOnPrice,
  applyLocationToAffordability,
  applyLocationToRentVsBuy,
  rescaleRentVsBuyOnPrice,
  applyLocationToClosingCosts,
  rescaleClosingCostsOnPrice,
  estimateClosingCostsFromLocation,
  locationHelperText,
} from './applyLocation';
