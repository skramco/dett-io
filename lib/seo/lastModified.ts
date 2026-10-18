import { execFileSync } from 'node:child_process';
import { CONTENT_LAST_REVIEWED } from '@/lib/seo/contentDates';

/**
 * Build-time helpers to derive per-URL last-modified dates from git history.
 *
 * The sitemap and JSON-LD `dateModified` values use the last commit that
 * touched the source files behind each route, so lastmod updates automatically
 * when page content changes — no manual date bumping. If git is unavailable
 * (e.g. the build runs outside a git checkout), we fall back to
 * CONTENT_LAST_REVIEWED (lib/seo/contentDates.ts) as a safety net.
 *
 * Server/build-time only: do not import from client components or edge
 * runtimes (it uses node:child_process).
 */

const cache = new Map<string, string | null>();

function gitLastCommitIso(paths: string[]): string | null {
  const key = paths.join('\u0000');
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  let result: string | null = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5_000,
    }).trim();
    result = out || null;
  } catch {
    result = null;
  }
  cache.set(key, result);
  return result;
}

/** Last-modified date for a route, from the newest commit touching any of `paths`. */
export function lastModified(paths: string[]): Date {
  const iso = gitLastCommitIso(paths);
  return iso ? new Date(iso) : new Date(CONTENT_LAST_REVIEWED);
}

/** Shared content files that affect every calculator page. */
const SHARED_CALCULATOR_PATHS = [
  'lib/seo/calculatorSeo.ts',
  'lib/seo/calculatorFaqs.ts',
  'lib/rates.ts',
];

/** Last-modified date for a calculator page (its route dir, math lib, and shared SEO content). */
export function calculatorLastModified(slug: string): Date {
  const libFile = slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  return lastModified([
    `app/calculators/${slug}`,
    `lib/calculators/${libFile}.ts`,
    'lib/calculators/formulas.ts',
    ...SHARED_CALCULATOR_PATHS,
  ]);
}
