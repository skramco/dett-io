/**
 * Sanity-check the state location dataset without booting Next.
 * Run after `npm run build` so we can also inspect the prerendered HTML,
 * or standalone against the source via dynamic import of compiled output.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const data = readFileSync('lib/locations/locationData.ts', 'utf8');
const slugs = [...data.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const unique = new Set(slugs);

const COUNTY_RE = /orange-county|los-angeles-county|san-diego-county|maricopa-county|harris-county|travis-county|king-county|miami-dade|cook-county|clark-county|fulton-county|mecklenburg/;

const failures = [];
if (slugs.length !== 51) failures.push(`expected 51 slugs, got ${slugs.length}`);
if (unique.size !== 51) failures.push(`duplicate slugs: ${slugs.length - unique.size}`);
if (!slugs.includes('district-of-columbia')) failures.push('missing district-of-columbia');
if (!slugs.includes('california')) failures.push('missing california');
if (COUNTY_RE.test(data)) failures.push('county/metro slugs still present in locationData');

const sitemap = readFileSync('app/sitemap.ts', 'utf8');
if (!sitemap.includes('closing-costs/${loc.slug}')) failures.push('sitemap missing location URLs');
if (sitemap.includes('orange-county')) failures.push('sitemap still references a county slug');

const footer = readFileSync('components/mui/Footer.tsx', 'utf8');
if (!footer.includes("href: '/closing-costs'")) failures.push('footer missing closing-costs link');
if (/city|county|metro/i.test(footer.match(/Closing Costs[^']+/)?.[0] ?? '')) {
  failures.push('footer link still says city/county');
}

const indexPage = readFileSync('app/closing-costs/page.tsx', 'utf8');
if (/Counties|Metros|City &/.test(indexPage)) failures.push('index page still mentions counties/metros/cities');

if (existsSync('.next/server/app/closing-costs')) {
  const built = readdirSync('.next/server/app/closing-costs', { withFileTypes: true });
  const dirs = built.filter((d) => d.isDirectory()).map((d) => d.name);
  const countyBuilt = dirs.filter((d) => COUNTY_RE.test(d));
  if (countyBuilt.length) failures.push(`built county routes: ${countyBuilt.join(',')}`);
}

if (failures.length) {
  console.error('FAIL\n' + failures.map((f) => ` - ${f}`).join('\n'));
  process.exit(1);
}

console.log(`OK: ${slugs.length} state/DC slugs, no county/metro/city routes in source.`);
console.log(slugs.join(', '));
