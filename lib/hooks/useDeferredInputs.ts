import { useDeferredValue } from 'react';

/**
 * Returns a deferred copy of the inputs object.
 * Use this to feed into expensive useMemo calculations (charts, amortization tables)
 * so that React prioritizes keeping input fields responsive over re-rendering results.
 *
 * Usage:
 *   const deferredInputs = useDeferredInputs(inputs);
 *   const result = useMemo(() => calculate(deferredInputs), [deferredInputs]);
 */
export function useDeferredInputs<T>(inputs: T): T {
  return useDeferredValue(inputs);
}
