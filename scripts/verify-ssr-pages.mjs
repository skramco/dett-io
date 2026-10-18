import { readFileSync } from 'node:fs';

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">(.*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(JSON.parse(m[1]));
  }
  return blocks;
}

function decode(html) {
  return html
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, '/');
}

const checks = [
  {
    file: '.next/server/app/closing-costs/california.html',
    expect: ['Closing Costs in California', '$866,100', '0.74%', '$832,750', 'FAQPage'],
  },
  {
    file: '.next/server/app/closing-costs/texas.html',
    expect: ['Closing Costs in Texas', '$339,500', '1.69%', '$832,750', 'FAQPage'],
  },
  {
    file: '.next/server/app/closing-costs/district-of-columbia.html',
    expect: ['Closing Costs in District of Columbia', '$920,000', '$1,249,125', 'FAQPage'],
  },
  {
    file: '.next/server/app/closing-costs/hawaii.html',
    expect: ['Closing Costs in Hawaii', '$1,249,125', '$1,299,500', 'FAQPage'],
  },
  {
    file: '.next/server/app/closing-costs/delaware.html',
    expect: ['Closing Costs in Delaware', '4%', 'FAQPage'],
  },
];

let failed = 0;
for (const check of checks) {
  const html = decode(readFileSync(check.file, 'utf8'));
  const missing = check.expect.filter((s) => !html.includes(s));
  const jsonld = extractJsonLd(html);
  const faq = jsonld.find((j) => j['@type'] === 'FAQPage');
  const crumbs = jsonld.find((j) => j['@type'] === 'BreadcrumbList');
  const faqCount = faq?.mainEntity?.length ?? 0;
  const problems = [...missing.map((s) => `missing "${s}"`)];
  if (!faq) problems.push('no FAQPage JSON-LD');
  if (faqCount < 5) problems.push(`FAQ count ${faqCount} < 5`);
  if (!crumbs) problems.push('no BreadcrumbList');
  if (faq) {
    const loanQ = faq.mainEntity.find((q) => /loan limit/i.test(q.name));
    if (!loanQ) problems.push('no loan-limit FAQ');
    const taxQ = faq.mainEntity.find((q) => /property tax/i.test(q.name));
    if (!taxQ) problems.push('no property-tax FAQ');
  }
  if (problems.length) {
    failed++;
    console.error(`FAIL ${check.file}\n  ${problems.join('\n  ')}`);
  } else {
    console.log(`OK ${check.file} (${faqCount} FAQs)`);
  }
}

if (failed) process.exit(1);
console.log('SSR + FAQ schema checks passed.');
