/**
 * Encode / decode calculator inputs for shareable URLs and export payloads.
 *
 * Query params are the source of truth. Hash params are accepted as a fallback
 * so older or manually-built links still restore.
 */

import { formatCurrency, formatNumber } from '@/lib/format';

export type CalculatorInputValue = string | number | boolean;
export type CalculatorInputs = Record<string, unknown>;

export type ExportRow = {
  key: string;
  label: string;
  value: string;
};

export type CalculatorExportDocument = {
  calculatorName: string;
  generatedAt: string;
  summary: string;
  insights: string[];
  inputRows: ExportRow[];
  resultRows: ExportRow[];
};

const HASH_PREFIXES = ['#', '#!'] as const;

export function isCalculatorInputValue(value: unknown): value is CalculatorInputValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

export function pickSerializableInputs(
  inputs: unknown
): Record<string, CalculatorInputValue> | undefined {
  if (!inputs || typeof inputs !== 'object') return undefined;

  const out: Record<string, CalculatorInputValue> = {};
  for (const [key, value] of Object.entries(inputs as Record<string, unknown>)) {
    if (isCalculatorInputValue(value) && value !== '') {
      out[key] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function camelCaseTokens(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z]+)$/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean);
}

function hasToken(key: string, tokens: string[]): boolean {
  const parts = camelCaseTokens(key).map((part) => part.toLowerCase());
  return tokens.some((token) => parts.includes(token));
}

export function formatInputLabel(key: string): string {
  return camelCaseTokens(key)
    .map((part, index) => (index === 0 ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
    .replace(/\b(dti|ltv|hoa|pmi|arm)\b/gi, (match) => match.toUpperCase())
    .trim();
}

export function formatInputValue(key: string, value: CalculatorInputValue): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    if (hasToken(key, ['percent', 'rate', 'dti', 'likelihood'])) {
      return `${value}%`;
    }
    if (hasToken(key, ['months', 'years', 'month', 'year', 'term', 'days', 'score'])) {
      return value.toString();
    }
    if (
      hasToken(key, [
        'price',
        'payment',
        'income',
        'debt',
        'debts',
        'cost',
        'costs',
        'fee',
        'fees',
        'balance',
        'amount',
        'value',
        'insurance',
        'tax',
        'credit',
        'hoa',
      ])
    ) {
      return formatCurrency(value);
    }
    return formatNumber(value);
  }

  return value;
}

export function serializeInputs(inputs: CalculatorInputs): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(inputs)) {
    if (!isCalculatorInputValue(value) || value === '') continue;
    params.set(key, String(value));
  }
  return params;
}

export function parseInputValue(raw: string, defaultValue: unknown): CalculatorInputValue | undefined {
  if (typeof defaultValue === 'boolean') {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return undefined;
  }

  if (typeof defaultValue === 'number') {
    const num = Number(raw);
    return Number.isFinite(num) ? num : undefined;
  }

  if (typeof defaultValue === 'string') {
    return raw;
  }

  return undefined;
}

export function parseInputsFromSearchParams<T extends object>(
  params: URLSearchParams,
  defaults: T
): Partial<T> | null {
  const overrides: Record<string, CalculatorInputValue> = {};
  let hasOverrides = false;

  for (const key of Object.keys(defaults as object)) {
    const raw = params.get(key);
    if (raw === null) continue;
    const parsed = parseInputValue(raw, (defaults as Record<string, unknown>)[key]);
    if (parsed === undefined) continue;
    overrides[key] = parsed;
    hasOverrides = true;
  }

  return hasOverrides ? (overrides as Partial<T>) : null;
}

export function getSearchParamsFromLocation(
  search: string,
  hash = ''
): URLSearchParams {
  const query = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (query.toString()) return query;

  let hashQuery = hash;
  for (const prefix of HASH_PREFIXES) {
    if (hashQuery.startsWith(prefix)) {
      hashQuery = hashQuery.slice(prefix.length);
      break;
    }
  }
  if (hashQuery.startsWith('?')) hashQuery = hashQuery.slice(1);
  return new URLSearchParams(hashQuery);
}

export function parseInputsFromLocation<T extends object>(
  search: string,
  defaults: T,
  hash = ''
): Partial<T> | null {
  return parseInputsFromSearchParams(getSearchParamsFromLocation(search, hash), defaults);
}

export function inputsEqual(a: CalculatorInputs, b: CalculatorInputs): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

/**
 * Merge serialized calculator inputs into an existing URL, preserving
 * unrelated query params (UTM, embed flags, etc.).
 */
export function applyInputsToUrl(
  href: string,
  inputs: CalculatorInputs,
  knownKeys: string[]
): string {
  const url = new URL(href);
  for (const key of knownKeys) {
    url.searchParams.delete(key);
  }
  const encoded = serializeInputs(inputs);
  encoded.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return `${url.pathname}${url.search}${url.hash}`;
}

export function buildShareUrl(
  origin: string,
  pathname: string,
  inputs: CalculatorInputs,
  search = '',
  hash = ''
): string {
  const href = `${origin}${pathname}${search}${hash}`;
  const relative = applyInputsToUrl(href, inputs, Object.keys(inputs));
  return `${origin}${relative}`;
}

export function buildExportDocument(options: {
  calculatorName: string;
  summary: string;
  details: Record<string, number | string>;
  insights?: string[];
  inputs: CalculatorInputs;
  generatedAt?: Date;
}): CalculatorExportDocument {
  const generatedAt = (options.generatedAt ?? new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const inputRows: ExportRow[] = Object.entries(options.inputs)
    .filter((entry): entry is [string, CalculatorInputValue] => isCalculatorInputValue(entry[1]))
    .map(([key, value]) => ({
      key,
      label: formatInputLabel(key),
      value: formatInputValue(key, value),
    }));

  const resultRows: ExportRow[] = Object.entries(options.details).map(([key, value]) => ({
    key,
    label: formatInputLabel(key),
    value: formatInputValue(key, value),
  }));

  return {
    calculatorName: options.calculatorName,
    generatedAt,
    summary: options.summary,
    insights: options.insights ?? [],
    inputRows,
    resultRows,
  };
}
