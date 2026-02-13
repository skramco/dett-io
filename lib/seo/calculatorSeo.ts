import type { Metadata } from 'next';

export interface CalculatorSeoConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  relatedCalculators: { slug: string; name: string }[];
  jsonLd: {
    name: string;
    description: string;
    applicationCategory: string;
  };
}

const BASE_URL = 'https://dett.io';

export const calculatorSeoConfigs: Record<string, CalculatorSeoConfig> = {
  'mortgage-cost': {
    slug: 'mortgage-cost',
    title: 'Mortgage Payment Calculator - Free Monthly Payment Estimator | Dett',
    description:
      'Calculate your true monthly mortgage payment including principal, interest, taxes, insurance, PMI, and HOA fees. Free, no signup required. See the real cost of your home loan.',
    keywords: [
      'mortgage calculator',
      'mortgage payment calculator',
      'home loan calculator',
      'monthly mortgage payment',
      'mortgage calculator with taxes and insurance',
      'mortgage calculator with PMI',
      'PITI calculator',
      'house payment calculator',
    ],
    relatedCalculators: [
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'down-payment', name: 'Down Payment Strategy' },
      { slug: 'refinance', name: 'Should I Refinance?' },
    ],
    jsonLd: {
      name: 'Mortgage Payment Calculator',
      description:
        'Calculate your true monthly mortgage payment including PITI, HOA, and PMI. See the real cost of your home loan.',
      applicationCategory: 'FinanceApplication',
    },
  },
  affordability: {
    slug: 'affordability',
    title: 'How Much House Can I Afford? - Free Home Affordability Calculator | Dett',
    description:
      'Calculate how much house you can afford based on your income, debts, and down payment. See conservative, moderate, and aggressive price ranges with DTI analysis. Free, no signup.',
    keywords: [
      'how much house can I afford',
      'home affordability calculator',
      'mortgage affordability calculator',
      'how much mortgage can I qualify for',
      'house I can afford calculator',
      'DTI calculator mortgage',
      'home buying budget calculator',
    ],
    relatedCalculators: [
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'down-payment', name: 'Down Payment Strategy' },
      { slug: 'rent-vs-buy', name: 'Rent vs Buy Analysis' },
    ],
    jsonLd: {
      name: 'Home Affordability Calculator',
      description:
        'Calculate how much house you can afford based on income, debts, and down payment with DTI analysis.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'down-payment': {
    slug: 'down-payment',
    title: 'Down Payment Calculator - Compare 5%, 10%, 20% Down | Dett',
    description:
      'Compare different down payment amounts and see how they affect your monthly payment, PMI costs, and total interest. Find the right down payment strategy for your budget.',
    keywords: [
      'down payment calculator',
      'how much down payment for a house',
      'down payment percentage calculator',
      'PMI calculator',
      'mortgage down payment comparison',
      '20 percent down payment calculator',
    ],
    relatedCalculators: [
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'pmi', name: 'PMI Calculator' },
    ],
    jsonLd: {
      name: 'Down Payment Calculator',
      description:
        'Compare different down payment amounts and see PMI costs, monthly payments, and total interest impact.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'rent-vs-buy': {
    slug: 'rent-vs-buy',
    title: 'Rent vs Buy Calculator - Should I Rent or Buy a Home? | Dett',
    description:
      'Compare the true cost of renting vs buying a home. Includes rent inflation, home appreciation, tax benefits, maintenance costs, and investment alternatives. Free analysis.',
    keywords: [
      'rent vs buy calculator',
      'should I rent or buy',
      'is it better to rent or buy',
      'rent or buy comparison',
      'renting vs buying a house calculator',
      'cost of renting vs buying',
    ],
    relatedCalculators: [
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'down-payment', name: 'Down Payment Strategy' },
    ],
    jsonLd: {
      name: 'Rent vs Buy Calculator',
      description:
        'Compare the true cost of renting vs buying including appreciation, tax benefits, and investment alternatives.',
      applicationCategory: 'FinanceApplication',
    },
  },
  refinance: {
    slug: 'refinance',
    title: 'Refinance Calculator - Should I Refinance My Mortgage? | Dett',
    description:
      'Calculate if refinancing is worth it. See monthly savings, break-even timeline, and total cost comparison. Compare your current mortgage to a new loan. Free, no signup.',
    keywords: [
      'refinance calculator',
      'should I refinance my mortgage',
      'mortgage refinance calculator',
      'refinance break even calculator',
      'refinance savings calculator',
      'is it worth refinancing',
    ],
    relatedCalculators: [
      { slug: 'cash-out-refi', name: 'Cash-Out Refinance' },
      { slug: 'recast-vs-refi', name: 'Recast vs Refinance' },
      { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
    ],
    jsonLd: {
      name: 'Refinance Calculator',
      description:
        'Calculate if refinancing your mortgage is worth it with break-even analysis and total savings comparison.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'cash-out-refi': {
    slug: 'cash-out-refi',
    title: 'Cash-Out Refinance Calculator - True Cost of Home Equity | Dett',
    description:
      'Analyze the true cost of a cash-out refinance. Compare to HELOC and personal loans. See new payment, cash received, and long-term cost analysis. Free calculator.',
    keywords: [
      'cash out refinance calculator',
      'home equity calculator',
      'cash out refi calculator',
      'how much equity can I pull out',
      'cash out refinance vs HELOC',
    ],
    relatedCalculators: [
      { slug: 'refinance', name: 'Should I Refinance?' },
      { slug: 'recast-vs-refi', name: 'Recast vs Refinance' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
    ],
    jsonLd: {
      name: 'Cash-Out Refinance Calculator',
      description:
        'Analyze the true cost of accessing your home equity through a cash-out refinance.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'recast-vs-refi': {
    slug: 'recast-vs-refi',
    title: 'Mortgage Recast vs Refinance Calculator - Compare Options | Dett',
    description:
      'Compare mortgage recast, refinance, and prepayment strategies. See which option saves you the most money based on your lump sum amount and current loan terms.',
    keywords: [
      'mortgage recast calculator',
      'recast vs refinance',
      'mortgage recast vs refinance comparison',
      'should I recast my mortgage',
      'lump sum mortgage payment calculator',
    ],
    relatedCalculators: [
      { slug: 'refinance', name: 'Should I Refinance?' },
      { slug: 'extra-payment', name: 'Extra Payment Impact' },
      { slug: 'cash-out-refi', name: 'Cash-Out Refinance' },
    ],
    jsonLd: {
      name: 'Recast vs Refinance Calculator',
      description:
        'Compare mortgage recast, refinance, and prepayment strategies to find the best use of a lump sum.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'points-buydown': {
    slug: 'points-buydown',
    title: 'Mortgage Points Calculator - Should I Buy Points? | Dett',
    description:
      'Calculate if buying mortgage points is worth it. Compare par rate, discount points, and lender credits. See break-even timeline and total interest savings.',
    keywords: [
      'mortgage points calculator',
      'should I buy points on my mortgage',
      'discount points calculator',
      'mortgage buydown calculator',
      'points vs no points mortgage',
      'is it worth buying points',
    ],
    relatedCalculators: [
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate' },
      { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
    ],
    jsonLd: {
      name: 'Mortgage Points Calculator',
      description:
        'Calculate if buying mortgage discount points is worth it with break-even analysis.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'arm-vs-fixed': {
    slug: 'arm-vs-fixed',
    title: 'ARM vs Fixed Rate Mortgage Calculator - Compare Loan Types | Dett',
    description:
      'Compare adjustable-rate (ARM) vs fixed-rate mortgages. Model rate caps, adjustment timelines, and worst-case scenarios. See which loan type saves you more.',
    keywords: [
      'ARM vs fixed rate calculator',
      'adjustable rate mortgage calculator',
      'ARM vs fixed rate comparison',
      'should I get an ARM or fixed rate',
      '5/1 ARM calculator',
      '7/1 ARM vs 30 year fixed',
    ],
    relatedCalculators: [
      { slug: 'points-buydown', name: 'Points & Buydown' },
      { slug: 'timeline-simulator', name: 'Decision Timeline' },
      { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
    ],
    jsonLd: {
      name: 'ARM vs Fixed Rate Calculator',
      description:
        'Compare adjustable-rate and fixed-rate mortgages with rate cap modeling and worst-case scenarios.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'timeline-simulator': {
    slug: 'timeline-simulator',
    title: 'Mortgage Decision Timeline Simulator | Dett',
    description:
      'Find the best mortgage structure for your timeline. Compare 15-year vs 30-year vs ARM based on how long you plan to stay in your home.',
    keywords: [
      '15 year vs 30 year mortgage calculator',
      'mortgage timeline calculator',
      'best mortgage for my timeline',
      'how long should my mortgage be',
      'mortgage term comparison',
    ],
    relatedCalculators: [
      { slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate' },
      { slug: 'refinance', name: 'Should I Refinance?' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
    ],
    jsonLd: {
      name: 'Mortgage Decision Timeline Simulator',
      description:
        'Find the best mortgage structure based on how long you plan to stay in your home.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'extra-payment': {
    slug: 'extra-payment',
    title: 'Extra Mortgage Payment Calculator - See How Much You Save | Dett',
    description:
      'See how extra mortgage payments save interest and shorten your loan. Calculate the impact of paying $100, $200, or $500 extra per month. Free calculator.',
    keywords: [
      'extra mortgage payment calculator',
      'additional mortgage payment calculator',
      'how much do I save paying extra on mortgage',
      'mortgage payoff calculator with extra payments',
      'should I pay extra on my mortgage',
    ],
    relatedCalculators: [
      { slug: 'biweekly', name: 'Biweekly Payments' },
      { slug: 'acceleration', name: 'Acceleration Planner' },
      { slug: 'refinance', name: 'Should I Refinance?' },
    ],
    jsonLd: {
      name: 'Extra Mortgage Payment Calculator',
      description:
        'Calculate how extra mortgage payments save interest and shorten your loan term.',
      applicationCategory: 'FinanceApplication',
    },
  },
  acceleration: {
    slug: 'acceleration',
    title: 'Mortgage Acceleration Planner - Pay Off Your Mortgage Faster | Dett',
    description:
      'Compare strategies to pay off your mortgage faster: extra monthly payments, annual lump sums, biweekly payments, or refinancing to a shorter term.',
    keywords: [
      'mortgage acceleration calculator',
      'pay off mortgage faster calculator',
      'mortgage payoff strategies',
      'early mortgage payoff calculator',
      'mortgage prepayment calculator',
    ],
    relatedCalculators: [
      { slug: 'extra-payment', name: 'Extra Payment Impact' },
      { slug: 'biweekly', name: 'Biweekly Payments' },
      { slug: 'recast-vs-refi', name: 'Recast vs Refinance' },
    ],
    jsonLd: {
      name: 'Mortgage Acceleration Planner',
      description:
        'Compare prepayment strategies to find the fastest way to pay off your mortgage.',
      applicationCategory: 'FinanceApplication',
    },
  },
  biweekly: {
    slug: 'biweekly',
    title: 'Biweekly Mortgage Payment Calculator - True Savings | Dett',
    description:
      'Calculate the real savings from biweekly mortgage payments. Compare to monthly extra payments. See if biweekly programs are worth the fees or if DIY is better.',
    keywords: [
      'biweekly mortgage calculator',
      'biweekly mortgage payment calculator',
      'biweekly vs monthly mortgage payments',
      'how much do biweekly payments save',
      'biweekly mortgage payment savings',
    ],
    relatedCalculators: [
      { slug: 'extra-payment', name: 'Extra Payment Impact' },
      { slug: 'acceleration', name: 'Acceleration Planner' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
    ],
    jsonLd: {
      name: 'Biweekly Mortgage Payment Calculator',
      description:
        'Calculate the true savings from biweekly mortgage payments vs monthly payments.',
      applicationCategory: 'FinanceApplication',
    },
  },
  va: {
    slug: 'va',
    title: 'VA Loan Calculator - $0 Down, No PMI Payment Estimator | Dett',
    description:
      'Calculate your VA mortgage payment with zero down and no PMI. See your VA funding fee, compare VA vs FHA vs conventional, and understand the full financial benefit of your VA loan.',
    keywords: [
      'VA loan calculator',
      'VA mortgage calculator',
      'VA home loan calculator',
      'VA funding fee calculator',
      'VA loan no down payment',
      'VA loan vs FHA',
      'VA loan benefits',
    ],
    relatedCalculators: [
      { slug: 'fha', name: 'FHA Loan Calculator' },
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'dti', name: 'DTI Calculator' },
    ],
    jsonLd: {
      name: 'VA Loan Calculator',
      description:
        'Calculate your VA mortgage payment with $0 down and no PMI. Includes funding fee calculation and VA vs FHA vs conventional comparison.',
      applicationCategory: 'FinanceApplication',
    },
  },
  fha: {
    slug: 'fha',
    title: 'FHA Loan Calculator - Monthly Payment with MIP | Dett',
    description:
      'Calculate your FHA mortgage payment including upfront and monthly MIP. Check eligibility, compare FHA vs conventional, and understand the true cost of FHA mortgage insurance.',
    keywords: [
      'FHA loan calculator',
      'FHA mortgage calculator',
      'FHA MIP calculator',
      'FHA mortgage insurance',
      'FHA loan requirements',
      'FHA vs conventional',
      'FHA down payment',
    ],
    relatedCalculators: [
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'dti', name: 'DTI Calculator' },
      { slug: 'closing-costs', name: 'Closing Cost Estimator' },
    ],
    jsonLd: {
      name: 'FHA Loan Calculator',
      description:
        'Calculate your FHA mortgage payment including upfront and monthly mortgage insurance premiums.',
      applicationCategory: 'FinanceApplication',
    },
  },
  pmi: {
    slug: 'pmi',
    title: 'PMI Calculator - How Much Is Private Mortgage Insurance? | Dett',
    description:
      'Calculate your PMI cost based on down payment, credit score, and loan details. See when PMI drops off, compare scenarios, and learn how to eliminate it faster.',
    keywords: [
      'PMI calculator',
      'private mortgage insurance calculator',
      'how much is PMI',
      'PMI cost calculator',
      'when does PMI drop off',
      'how to remove PMI',
      'mortgage insurance calculator',
    ],
    relatedCalculators: [
      { slug: 'down-payment', name: 'Down Payment Strategy' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
    ],
    jsonLd: {
      name: 'PMI Calculator',
      description:
        'Calculate your private mortgage insurance cost and see when it drops off based on your down payment and credit score.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'closing-costs': {
    slug: 'closing-costs',
    title: 'Closing Cost Calculator - Estimate Your Total Cash Needed | Dett',
    description:
      'Get a detailed estimate of mortgage closing costs including lender fees, title insurance, prepaid items, and government charges. Know exactly how much cash you need at closing.',
    keywords: [
      'closing cost calculator',
      'mortgage closing costs',
      'how much are closing costs',
      'closing cost estimator',
      'home buying closing costs',
      'what are closing costs on a house',
      'closing costs breakdown',
    ],
    relatedCalculators: [
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'down-payment', name: 'Down Payment Strategy' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
    ],
    jsonLd: {
      name: 'Closing Cost Calculator',
      description:
        'Estimate your total mortgage closing costs with an itemized breakdown of lender fees, third-party fees, government charges, and prepaid items.',
      applicationCategory: 'FinanceApplication',
    },
  },
  dti: {
    slug: 'dti',
    title: 'Debt-to-Income (DTI) Calculator - Check Your Mortgage Eligibility | Dett',
    description:
      'Calculate your front-end and back-end DTI ratios — the key numbers lenders use to qualify you for a mortgage. See if you meet conventional, FHA, and VA loan requirements.',
    keywords: [
      'DTI calculator',
      'debt to income ratio calculator',
      'mortgage DTI calculator',
      'front end DTI',
      'back end DTI',
      'what DTI do I need for a mortgage',
      'debt to income ratio for mortgage',
    ],
    relatedCalculators: [
      { slug: 'affordability', name: 'How Much House Can I Afford?' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'refinance', name: 'Should I Refinance?' },
    ],
    jsonLd: {
      name: 'Debt-to-Income (DTI) Calculator',
      description:
        'Calculate your front-end and back-end DTI ratios to see if you qualify for a mortgage.',
      applicationCategory: 'FinanceApplication',
    },
  },
  amortization: {
    slug: 'amortization',
    title: 'Amortization Schedule Calculator - Free Monthly Breakdown | Dett',
    description:
      'Generate a complete mortgage amortization schedule showing every payment. See month-by-month principal, interest, and balance breakdown. Free, no signup.',
    keywords: [
      'amortization schedule calculator',
      'mortgage amortization calculator',
      'amortization table',
      'loan amortization schedule',
      'mortgage payment schedule',
      'amortization calculator with extra payments',
      'monthly mortgage breakdown',
    ],
    relatedCalculators: [
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
      { slug: 'extra-payment', name: 'Extra Payment Impact' },
      { slug: 'refinance', name: 'Should I Refinance?' },
    ],
    jsonLd: {
      name: 'Amortization Schedule Calculator',
      description:
        'Generate a complete month-by-month mortgage amortization schedule with principal, interest, and balance breakdown.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'interest-sensitivity': {
    slug: 'interest-sensitivity',
    title: 'Mortgage Rate Sensitivity Calculator - How Rates Affect Your Payment | Dett',
    description:
      'See how interest rate changes affect your monthly payment and total cost. Analyze rate lock decisions and find refinance trigger points.',
    keywords: [
      'mortgage rate calculator',
      'how do interest rates affect mortgage payments',
      'mortgage rate comparison calculator',
      'interest rate sensitivity analysis',
      'mortgage rate lock calculator',
    ],
    relatedCalculators: [
      { slug: 'refinance', name: 'Should I Refinance?' },
      { slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate' },
      { slug: 'points-buydown', name: 'Points & Buydown' },
    ],
    jsonLd: {
      name: 'Rate Sensitivity Calculator',
      description:
        'Analyze how interest rate changes affect your mortgage payment and total cost.',
      applicationCategory: 'FinanceApplication',
    },
  },
};

export function getCalculatorMetadata(slug: string): Metadata {
  const config = calculatorSeoConfigs[slug];
  if (!config) {
    return {
      title: 'Mortgage Calculator | Dett',
      description: 'Free mortgage calculators with no signup required.',
    };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${BASE_URL}/calculators/${config.slug}`,
      siteName: 'Dett',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: `${BASE_URL}/calculators/${config.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getCalculatorJsonLd(slug: string): Record<string, unknown> | null {
  const config = calculatorSeoConfigs[slug];
  if (!config) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.jsonLd.name,
    description: config.jsonLd.description,
    url: `${BASE_URL}/calculators/${config.slug}`,
    applicationCategory: config.jsonLd.applicationCategory,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Dett',
      url: BASE_URL,
    },
    featureList: calculatorSeoConfigs[slug]?.keywords?.slice(0, 5).join(', '),
    isAccessibleForFree: true,
  };
}
