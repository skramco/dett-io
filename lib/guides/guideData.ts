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
    slug: 'afford-house-40k-salary',
    title: 'Can I Afford a House on a $40K Salary?',
    description: 'On a $40,000 salary, you can afford a home in the $120,000 to $170,000 range using FHA or USDA loans with 3.5% or 0% down. Here\'s the full breakdown of what lenders look for and how to make it work.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'FHA Loan Calculator', href: '/calculators/fha' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
    ],
  },
  {
    slug: 'afford-house-50k-salary',
    title: 'Can I Afford a House on a $50K Salary?',
    description: 'On a $50,000 salary, you can afford a home in the $150,000 to $215,000 range. Your max monthly housing payment is about $1,167 using the 28% DTI rule. Here\'s what to expect.',
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
    description: 'On a $60,000 salary, you can afford a home in the $180,000 to $260,000 range with a max housing payment of about $1,400/month. Here\'s how loan type and down payment affect your budget.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
    ],
  },
  {
    slug: 'afford-house-65k-salary',
    title: 'Can I Afford a House on a $65K Salary?',
    description: 'On a $65,000 salary, you can afford a home in the $195,000 to $280,000 range. Your max monthly payment is about $1,517 at the 28% DTI threshold. Here\'s how to stretch your budget.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
      { name: 'FHA Loan Calculator', href: '/calculators/fha' },
    ],
  },
  {
    slug: 'afford-house-75k-salary',
    title: 'Can I Afford a House on a $75K Salary?',
    description: 'On a $75,000 salary, you can afford a home in the $225,000 to $325,000 range with a max housing payment of about $1,750/month. Here\'s the real cost including taxes, insurance, and PMI.',
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
    description: 'On an $80,000 salary, you can afford a home in the $240,000 to $345,000 range. Your max housing payment is about $1,867/month. Here\'s what lenders look for and how to maximize your budget.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'PMI Calculator', href: '/calculators/pmi' },
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
    ],
  },
  {
    slug: 'afford-house-90k-salary',
    title: 'Can I Afford a House on a $90K Salary?',
    description: 'On a $90,000 salary, you can afford a home in the $270,000 to $390,000 range with a max housing payment of about $2,100/month. Here\'s how to use that buying power wisely.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'Points & Buydown', href: '/calculators/points-buydown' },
      { name: 'PMI Calculator', href: '/calculators/pmi' },
    ],
  },
  {
    slug: 'afford-house-100k-salary',
    title: 'Can I Afford a House on a $100K Salary?',
    description: 'On a $100,000 salary, you can afford a home in the $300,000 to $430,000 range with a max housing payment of about $2,333/month. Here\'s how to optimize your purchase.',
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
    description: 'On a $120,000 salary, you can afford a home in the $360,000 to $515,000 range with a max housing payment of about $2,800/month. Here\'s where the line is between smart buy and overstretch.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
    ],
  },
  {
    slug: 'afford-house-125k-salary',
    title: 'Can I Afford a House on a $125K Salary?',
    description: 'On a $125,000 salary, you can afford a home in the $375,000 to $540,000 range with a max housing payment of about $2,917/month. The gap between smart buy and overstretch is smaller than you think.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
      { name: 'DTI Calculator', href: '/calculators/dti' },
    ],
  },
  {
    slug: 'afford-house-150k-salary',
    title: 'Can I Afford a House on a $150K Salary?',
    description: 'On a $150,000 salary, you can afford a home in the $450,000 to $650,000 range with a max housing payment of about $3,500/month. High income doesn\'t guarantee easy approval — here\'s what to watch for.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
      { name: 'ARM vs Fixed Rate', href: '/calculators/arm-vs-fixed' },
    ],
  },
  {
    slug: 'afford-house-175k-salary',
    title: 'Can I Afford a House on a $175K Salary?',
    description: 'On a $175,000 salary, you can afford a home in the $525,000 to $755,000 range with a max housing payment of about $4,083/month. Here\'s how to avoid overbuying and build wealth instead.',
    category: 'salary',
    readTime: '6 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'ARM vs Fixed Rate', href: '/calculators/arm-vs-fixed' },
      { name: 'Points & Buydown', href: '/calculators/points-buydown' },
    ],
  },
  {
    slug: 'afford-house-200k-salary',
    title: 'Can I Afford a House on a $200K Salary?',
    description: 'On a $200,000 salary, you can afford a home in the $600,000 to $860,000 range with a max housing payment of about $4,667/month. Here\'s how to maximize your position with jumbo loans, tax strategy, and smart budgeting.',
    category: 'salary',
    readTime: '7 min',
    calculators: [
      { name: 'How Much House Can I Afford?', href: '/calculators/affordability' },
      { name: 'True Monthly Mortgage Cost', href: '/calculators/mortgage-cost' },
      { name: 'Closing Cost Estimator', href: '/calculators/closing-costs' },
    ],
  },
  // Decision articles
  {
    slug: 'should-i-refinance',
    title: 'Should I Refinance My Mortgage?',
    description: 'Refinancing is worth it if you can lower your rate by at least 0.75%, plan to stay past the break-even point (typically 2-4 years), and the closing costs don\'t exceed your savings. Here\'s the full framework.',
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
    description: 'Buying beats renting if you\'ll stay at least 5-7 years. Below that, renting is usually cheaper after closing costs, selling costs, and opportunity cost. Here\'s the honest math.',
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
    description: 'FHA loans require 3.5% down with a 580 credit score; conventional loans require 3-5% down with a 620+ score. FHA has lifetime mortgage insurance; conventional PMI drops at 80% LTV. Here\'s the full comparison.',
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
    description: 'Closing costs are 2-5% of the purchase price and include lender fees, title insurance, appraisal, and prepaid taxes/insurance. On a $400K home, expect $8,000-$20,000. Here\'s every fee explained.',
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
    description: 'PMI costs $50-$450/month depending on your loan amount and credit score. It\'s required with less than 20% down and drops off at 80% LTV. Here are five strategies to eliminate it.',
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
    description: 'Your true monthly mortgage payment is 25-40% higher than the principal and interest your lender quotes. Property taxes, insurance, PMI, and HOA fees add $500-$1,500/month. Here\'s the full breakdown.',
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
