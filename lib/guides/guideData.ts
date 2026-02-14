export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: 'salary' | 'decision' | 'cost';
  readTime: string;
  calculators: { name: string; href: string }[];
}

export const guides: Guide[] = [
  // Salary-based
  {
    slug: 'afford-house-50k-salary',
    title: 'Can I Afford a House on a $50K Salary?',
    description: 'A realistic look at homeownership on a $50,000 income — what you can afford, what to expect, and how to make it work.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'FHA Loan Calculator', href: '/calculators/fha' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
    ],
  },
  {
    slug: 'afford-house-60k-salary',
    title: 'Can I Afford a House on a $60K Salary?',
    description: 'What a $60,000 income means for your home buying budget, monthly payments, and loan options.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
    ],
  },
  {
    slug: 'afford-house-75k-salary',
    title: 'Can I Afford a House on a $75K Salary?',
    description: 'A detailed breakdown of home buying power at $75,000 per year — including taxes, insurance, and real monthly costs.',
    category: 'salary',
    readTime: '7 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
    ],
  },
  {
    slug: 'afford-house-80k-salary',
    title: 'Can I Afford a House on an $80K Salary?',
    description: 'How far $80,000 a year goes in today\'s housing market — realistic budgets, loan scenarios, and what lenders look for.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'PMI Calculator', href: '/calculators/pmi' },
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
    ],
  },
  {
    slug: 'afford-house-100k-salary',
    title: 'Can I Afford a House on a $100K Salary?',
    description: 'What $100,000 in income really buys you — home price ranges, monthly payment scenarios, and smart strategies.',
    category: 'salary',
    readTime: '7 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
      { name: 'Points & Buydown', href: '/calculators/points-buydown' },
    ],
  },
  {
    slug: 'afford-house-120k-salary',
    title: 'Can I Afford a House on a $120K Salary?',
    description: 'A $120K household income opens doors — but how much house is too much? Here\'s the math.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
    ],
  },
  {
    slug: 'afford-house-150k-salary',
    title: 'Can I Afford a House on a $150K Salary?',
    description: 'High income doesn\'t always mean easy approval. See what $150K really gets you and the traps to avoid.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
      { name: 'ARM vs Fixed Rate', href: '/calculators/arm-vs-fixed' },
    ],
  },
  // Decision articles
  {
    slug: 'should-i-refinance',
    title: 'Should I Refinance My Mortgage?',
    description: 'A clear framework for deciding whether refinancing makes sense — break-even analysis, rate thresholds, and hidden costs.',
    category: 'decision',
    readTime: '8 min',
    calculators: [
      { name: 'Refinance Break-Even', href: '/calculators/refinance' },
      { name: 'Rate Sensitivity', href: '/calculators/interest-sensitivity' },
      { name: 'Amortization Schedule', href: '/calculators/amortization' },
    ],
  },
  {
    slug: 'rent-vs-buy-guide',
    title: 'Rent vs Buy: The Complete Guide',
    description: 'The honest math behind renting vs buying — when each makes sense, what most advice gets wrong, and how to decide.',
    category: 'decision',
    readTime: '9 min',
    calculators: [
      { name: 'Rent vs Buy Analysis', href: '/calculators/rent-vs-buy' },
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
    ],
  },
  {
    slug: 'fha-vs-conventional',
    title: 'FHA vs Conventional: Which Loan Is Right for You?',
    description: 'Compare FHA and conventional loans side by side — down payments, mortgage insurance, credit requirements, and total cost.',
    category: 'decision',
    readTime: '8 min',
    calculators: [
      { name: 'FHA Loan Calculator', href: '/calculators/fha' },
      { name: 'PMI Calculator', href: '/calculators/pmi' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
    ],
  },
  // Cost articles
  {
    slug: 'what-are-closing-costs',
    title: 'What Are Closing Costs? A Complete Breakdown',
    description: 'Every fee explained — lender charges, third-party costs, prepaid items, and how to negotiate them down.',
    category: 'cost',
    readTime: '7 min',
    calculators: [
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
    ],
  },
  {
    slug: 'how-much-is-pmi',
    title: 'How Much Is PMI and How to Avoid It',
    description: 'What PMI costs, when it drops off, and five strategies to eliminate it — including one most people don\'t know about.',
    category: 'cost',
    readTime: '6 min',
    calculators: [
      { name: 'PMI Calculator', href: '/calculators/pmi' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
      { name: 'Extra Payment Impact', href: '/calculators/extra-payment' },
    ],
  },
  {
    slug: 'true-monthly-mortgage-payment',
    title: 'Understanding Your True Monthly Mortgage Payment',
    description: 'Why your real payment is higher than the number your lender quoted — PITI, HOA, PMI, and the costs nobody mentions.',
    category: 'cost',
    readTime: '7 min',
    calculators: [
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
      { name: 'PMI Calculator', href: '/calculators/pmi' },
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
    ],
  },
];

export const guideCategories = [
  { key: 'salary' as const, label: 'Salary Guides', description: 'Can I afford a house on my salary?' },
  { key: 'decision' as const, label: 'Decision Guides', description: 'Should I rent, buy, or refinance?' },
  { key: 'cost' as const, label: 'Cost Guides', description: 'What does it really cost?' },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug);
}
