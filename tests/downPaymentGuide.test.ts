import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { guideFaqs } from '../lib/guides/guideFaqs';
import { guides } from '../lib/guides/guideData';
import {
  DOWN_PAYMENT_EXAMPLE_DTI_HREF,
  DOWN_PAYMENT_EXAMPLE_HREF,
  DOWN_PAYMENT_EXAMPLE_ROWS,
  DOWN_PAYMENT_GUIDE_REVIEWED_ISO,
  DOWN_PAYMENT_GUIDE_REVIEWED_LABEL,
  DOWN_PAYMENT_GUIDE_SLUG,
  DOWN_PAYMENT_GUIDE_SOURCES,
  EXAMPLE_RATE,
  exampleRow,
} from '../lib/guides/downPaymentGuideExample';
import { DEFAULT_RATES } from '../lib/rates/defaultRates';
import { staticPageLastUpdated } from '../lib/seo/contentDates';

const root = path.resolve(__dirname, '..');

function readRepo(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('how much should I put down guide', () => {
  it('keeps the calculator default rate of 6.75%', () => {
    expect(DEFAULT_RATES.thirtyYearFixed).toBe(6.75);
    expect(EXAMPLE_RATE).toBe(DEFAULT_RATES.thirtyYearFixed);
    expect(DOWN_PAYMENT_EXAMPLE_HREF).toContain('interestRate=6.75');
  });

  it('prefills the down payment calculator through its query params', () => {
    const url = new URL(DOWN_PAYMENT_EXAMPLE_HREF, 'https://dett.io');
    expect(url.pathname).toBe('/calculators/down-payment');
    expect(url.searchParams.get('homePrice')).toBe('400000');
    expect(url.searchParams.get('downPaymentPercent')).toBe('10');
    expect(url.searchParams.get('interestRate')).toBe('6.75');
    expect(url.searchParams.get('loanTerm')).toBe('30');
    expect(url.searchParams.get('propertyTaxRate')).toBe('1.2');
    expect(url.searchParams.get('homeInsuranceAnnual')).toBe('1800');
    expect(url.searchParams.get('creditScore')).toBe('740');
  });

  it('checks each payment against income and debts before calling it a fit', () => {
    const three = exampleRow(3);
    const five = exampleRow(5);
    const ten = exampleRow(10);
    const twenty = exampleRow(20);

    expect(three.fitsBudget).toBe(false);
    expect(five.fitsBudget).toBe(false);
    expect(ten.fitsBudget).toBe(true);
    expect(ten.cushionCoversThreeMonths).toBe(true);
    expect(twenty.fitsBudget).toBe(true);
    expect(twenty.cushionCoversThreeMonths).toBe(false);

    for (const row of DOWN_PAYMENT_EXAMPLE_ROWS) {
      expect(row.monthlyPI + row.monthlyPMI + row.monthlyTax + row.monthlyInsurance).toBe(
        row.monthlyHousing
      );
      if (!row.fitsBudget) {
        expect(row.housingShare > 28 || row.totalDebtShare > 36).toBe(true);
      }
    }
  });

  it('prefills the DTI check so housing matches the 10% example', () => {
    const url = new URL(DOWN_PAYMENT_EXAMPLE_DTI_HREF, 'https://dett.io');
    const ten = exampleRow(10);
    const mortgage = Number(url.searchParams.get('mortgagePayment'));
    const tax = Number(url.searchParams.get('propertyTax')) / 12;
    const insurance = Number(url.searchParams.get('homeInsurance')) / 12;
    expect(url.pathname).toBe('/calculators/dti');
    expect(mortgage + tax + insurance).toBe(ten.monthlyHousing);
    expect(url.searchParams.get('monthlyGrossIncome')).toBe('11000');
    expect(url.searchParams.get('otherDebts')).toBe('800');
  });

  it('registers the guide with a 2026-11-28 review date', () => {
    const guide = guides.find((item) => item.slug === DOWN_PAYMENT_GUIDE_SLUG);
    expect(guide).toBeDefined();
    expect(guide?.title).toBe('How Much Should I Put Down on a House?');
    expect(guide?.datePublished).toBe(DOWN_PAYMENT_GUIDE_REVIEWED_ISO);
    expect(guide?.dateModified).toBe('2026-11-28');
    expect(guide?.calculators[0]?.href).toBe(DOWN_PAYMENT_EXAMPLE_HREF);
    expect(guideFaqs[DOWN_PAYMENT_GUIDE_SLUG]?.length).toBeGreaterThanOrEqual(5);
    expect(staticPageLastUpdated['/guides']).toBe('2026-11-28');
    expect(DOWN_PAYMENT_GUIDE_REVIEWED_LABEL).toBe('November 28, 2026');

    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(`${DOWN_PAYMENT_GUIDE_REVIEWED_ISO}T00:00:00Z`));
    expect(formatted).toBe(DOWN_PAYMENT_GUIDE_REVIEWED_LABEL);

    expect(readRepo('lib/guides/guideContent.tsx')).toContain('HowMuchShouldIPutDown');
    expect(readRepo('app/sitemap.ts')).toContain('guide.dateModified ?? guidesLastUpdated');
  });

  it('cites only CFPB, Fannie Mae, Freddie Mac, HUD, and VA pages', () => {
    const allowed = ['consumerfinance.gov', 'fanniemae.com', 'freddiemac.com', 'hud.gov', 'va.gov'];
    expect(DOWN_PAYMENT_GUIDE_SOURCES.length).toBeGreaterThanOrEqual(8);
    for (const source of DOWN_PAYMENT_GUIDE_SOURCES) {
      const host = new URL(source.href).hostname.replace(/^www\./, '');
      expect(allowed.some((domain) => host === domain || host.endsWith(`.${domain}`))).toBe(true);
    }
  });

  it('keeps the new copy free of em dashes, approval language, and rate promises', () => {
    const copy = [
      readRepo('lib/guides/HowMuchShouldIPutDown.tsx'),
      readRepo('lib/guides/downPaymentGuideExample.ts'),
    ].join('\n');

    expect(copy).not.toMatch(/—|–/);
    expect(copy).not.toMatch(/plain english/i);
    expect(copy).not.toMatch(/approv/i);
    expect(copy).not.toMatch(/\bbest\b/i);
    expect(copy).not.toMatch(/guarantee/i);
    expect(copy).toContain('Last reviewed {DOWN_PAYMENT_GUIDE_REVIEWED_LABEL}');
    expect(copy).toContain('calculatorSlug={SLUG}');
    expect(copy).toContain('/guides/how-much-is-pmi');
    expect(copy).not.toContain('78%');
    expect(copy).not.toContain('Homeowners Protection');
  });
});
