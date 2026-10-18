export interface EmbedDefaultInput {
  key: string;
  label: string;
  kind: 'currency' | 'percent' | 'number';
  defaultValue: number;
}

export interface EmbedCalculator {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  inputs: EmbedDefaultInput[];
}

export const EMBED_CALCULATORS: EmbedCalculator[] = [
  {
    slug: 'mortgage-cost',
    name: 'True Monthly Mortgage Cost',
    shortName: 'True Monthly Cost',
    category: 'Core',
    description: 'PITI, HOA, and PMI — the real monthly payment.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPayment', label: 'Down payment', kind: 'currency', defaultValue: 90000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'affordability',
    name: 'How Much House Can I Afford?',
    shortName: 'Affordability',
    category: 'Core',
    description: 'Max home price from income, debts, and down payment.',
    inputs: [
      { key: 'annualIncome', label: 'Annual income', kind: 'currency', defaultValue: 120000 },
      { key: 'monthlyDebts', label: 'Monthly debts', kind: 'currency', defaultValue: 500 },
      { key: 'downPayment', label: 'Down payment', kind: 'currency', defaultValue: 80000 },
    ],
  },
  {
    slug: 'down-payment',
    name: 'Down Payment Strategy',
    shortName: 'Down Payment',
    category: 'Core',
    description: 'Compare 5%, 10%, and 20% down — including PMI.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 10 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'rent-vs-buy',
    name: 'Rent vs Buy Analysis',
    shortName: 'Rent vs Buy',
    category: 'Core',
    description: 'Full comparison with inflation and appreciation.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'monthlyRent', label: 'Monthly rent', kind: 'currency', defaultValue: 2200 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'refinance',
    name: 'Refinance Break-Even',
    shortName: 'Refinance',
    category: 'Core',
    description: 'When refinancing actually saves money.',
    inputs: [
      { key: 'currentBalance', label: 'Current balance', kind: 'currency', defaultValue: 320000 },
      { key: 'currentRate', label: 'Current rate', kind: 'percent', defaultValue: 7.5 },
      { key: 'newRate', label: 'New rate', kind: 'percent', defaultValue: 6.25 },
    ],
  },
  {
    slug: 'cash-out-refi',
    name: 'Cash-Out Refinance',
    shortName: 'Cash-Out Refi',
    category: 'Core',
    description: 'True cost of pulling equity from a home.',
    inputs: [
      { key: 'currentBalance', label: 'Current balance', kind: 'currency', defaultValue: 280000 },
      { key: 'cashOutAmount', label: 'Cash out', kind: 'currency', defaultValue: 50000 },
      { key: 'newRate', label: 'New rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'recast-vs-refi',
    name: 'Recast vs Refinance',
    shortName: 'Recast vs Refi',
    category: 'Core',
    description: 'Lump-sum recast vs refinance vs prepay.',
    inputs: [
      { key: 'currentBalance', label: 'Current balance', kind: 'currency', defaultValue: 320000 },
      { key: 'lumpSumAmount', label: 'Lump sum', kind: 'currency', defaultValue: 50000 },
      { key: 'newRate', label: 'New rate', kind: 'percent', defaultValue: 6.0 },
    ],
  },
  {
    slug: 'loan-timeline',
    name: 'Best Loan for My Timeline',
    shortName: 'Loan Timeline',
    category: 'Comparison',
    description: 'Fixed vs points vs ARM vs 15-year for how long you will stay.',
    inputs: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'parRate', label: 'Par rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'expectedYearsInHome', label: 'Years in home', kind: 'number', defaultValue: 7 },
    ],
  },
  {
    slug: 'payoff',
    name: 'Pay Off Faster',
    shortName: 'Pay Off Faster',
    category: 'Payoff',
    description: 'Extra payments, lump sums, and biweekly strategies in one tool.',
    inputs: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'extraMonthlyPayment', label: 'Extra monthly', kind: 'currency', defaultValue: 300 },
    ],
  },
  {
    slug: 'interest-sensitivity',
    name: 'Rate Sensitivity',
    shortName: 'Rate Sensitivity',
    category: 'Payoff',
    description: 'How a 0.25% rate change moves the payment.',
    inputs: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'baseRate', label: 'Base rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term', kind: 'number', defaultValue: 30 },
    ],
  },
  {
    slug: 'amortization',
    name: 'Amortization Schedule',
    shortName: 'Amortization',
    category: 'Payoff',
    description: 'Month-by-month principal vs interest.',
    inputs: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term', kind: 'number', defaultValue: 30 },
    ],
  },
  {
    slug: 'dti',
    name: 'DTI Calculator',
    shortName: 'DTI',
    category: 'Qualification',
    description: 'Front-end and back-end ratios lenders actually use.',
    inputs: [
      { key: 'monthlyGrossIncome', label: 'Monthly income', kind: 'currency', defaultValue: 10000 },
      { key: 'mortgagePayment', label: 'Housing payment', kind: 'currency', defaultValue: 2200 },
      { key: 'carPayments', label: 'Car payments', kind: 'currency', defaultValue: 450 },
    ],
  },
  {
    slug: 'closing-costs',
    name: 'Closing Cost Estimator',
    shortName: 'Closing Costs',
    category: 'Qualification',
    description: 'Cash needed at the table, itemized.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 20 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'pmi',
    name: 'PMI Calculator',
    shortName: 'PMI',
    category: 'Qualification',
    description: 'Monthly PMI and when it drops off.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 10 },
      { key: 'creditScore', label: 'Credit score', kind: 'number', defaultValue: 740 },
    ],
  },
  {
    slug: 'fha',
    name: 'FHA Loan Calculator',
    shortName: 'FHA',
    category: 'Qualification',
    description: 'FHA payment with MIP and eligibility check.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 350000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 3.5 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.5 },
    ],
  },
  {
    slug: 'va',
    name: 'VA Loan Calculator',
    shortName: 'VA',
    category: 'Qualification',
    description: '$0 down, no PMI — funding fee included.',
    inputs: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 400000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.25 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 0 },
    ],
  },
];

export const EMBED_CALCULATOR_SLUGS = EMBED_CALCULATORS.map((c) => c.slug);

export function getEmbedCalculator(slug: string): EmbedCalculator | undefined {
  return EMBED_CALCULATORS.find((c) => c.slug === slug);
}

export interface EmbedAudience {
  id: string;
  title: string;
  eyebrow: string;
  tagline: string;
  body: string;
  suggestedSlugs: string[];
  suggestedLabel: string;
}

export const EMBED_AUDIENCES: EmbedAudience[] = [
  {
    id: 'realtors',
    title: 'For Realtors',
    eyebrow: 'Real estate agents',
    tagline: 'Help buyers see the budget before the first showing.',
    body: 'Put Affordability, True Monthly Cost, and Rent vs Buy on listing pages and your site. Serious buyers arrive already oriented — and you look like the agent who tells the truth.',
    suggestedSlugs: ['affordability', 'mortgage-cost', 'rent-vs-buy'],
    suggestedLabel: 'Affordability, True Monthly Cost, Rent vs Buy',
  },
  {
    id: 'brokers',
    title: 'For Brokers & Loan Officers',
    eyebrow: 'Mortgage brokers & LOs',
    tagline: 'Clients run the numbers before they call you.',
    body: 'Refinance, DTI, and Best Loan for My Timeline turn your website into a resource hub. People show up pre-educated, and you never pay for another lead-gen widget.',
    suggestedSlugs: ['refinance', 'dti', 'loan-timeline'],
    suggestedLabel: 'Refinance, DTI, Best Loan for My Timeline',
  },
  {
    id: 'lenders',
    title: 'For Lenders, Banks & CUs',
    eyebrow: 'Lenders, banks & credit unions',
    tagline: 'The full suite, on your site, with zero engineering.',
    body: 'Offer every Dett calculator — FHA, VA, conventional, closing costs — without building or maintaining tools. Borrowers self-select the right product and submit cleaner applications.',
    suggestedSlugs: ['fha', 'va', 'dti', 'pmi', 'refinance', 'affordability'],
    suggestedLabel: 'Full suite — FHA, VA, DTI, PMI, and more',
  },
  {
    id: 'bloggers',
    title: 'For Financial Bloggers',
    eyebrow: 'Writers & publishers',
    tagline: 'Turn a static post into an interactive tool.',
    body: 'Drop the relevant calculator next to the article. Readers stay longer, share more, and you never pay an affiliate for a widget that spies on them.',
    suggestedSlugs: ['mortgage-cost', 'rent-vs-buy', 'affordability', 'payoff'],
    suggestedLabel: 'True Monthly Cost, Rent vs Buy, Affordability',
  },
];
