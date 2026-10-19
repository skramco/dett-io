import type { Metadata } from 'next';
import { calculatorFaqs } from './calculatorFaqs';
import { getCalculatorLastUpdated } from './contentDates';

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
      'Compare the true cost of renting vs buying a home. Includes rent inflation, home appreciation, maintenance, selling costs, and a Monte Carlo scenario range — not a single path. Free analysis.',
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
        'Compare the true cost of renting vs buying including appreciation, selling costs, investment alternatives, and a sampled scenario range.',
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
      { slug: 'payoff', name: 'Pay Off Faster' },
      { slug: 'cash-out-refi', name: 'Cash-Out Refinance' },
    ],
    jsonLd: {
      name: 'Recast vs Refinance Calculator',
      description:
        'Compare mortgage recast, refinance, and prepayment strategies to find the best use of a lump sum.',
      applicationCategory: 'FinanceApplication',
    },
  },
  'loan-timeline': {
    slug: 'loan-timeline',
    title: 'Best Mortgage for Your Timeline - ARM vs Fixed vs Points Calculator | Dett',
    description:
      'Find the best loan for how long you plan to stay. Compare 30-year fixed, discount points, ARM, and 15-year options by net cost and whether the payment may fit typical income guidelines.',
    keywords: [
      'best mortgage for my timeline',
      'ARM vs fixed rate calculator',
      'mortgage points calculator',
      'should I buy points on my mortgage',
      'discount points calculator',
      'mortgage buydown calculator',
      'points vs no points mortgage',
      'is it worth buying points',
      '5/6 SOFR ARM calculator',
      '5/1 ARM calculator',
      'ARM rate caps calculator',
      '15 year vs 30 year mortgage calculator',
      'adjustable rate mortgage calculator',
      'discount points break even',
    ],
    relatedCalculators: [
      { slug: 'interest-sensitivity', name: 'Rate Sensitivity' },
      { slug: 'refinance', name: 'Should I Refinance?' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
    ],
    jsonLd: {
      name: 'Best Loan for My Timeline Calculator',
      description:
        'Compare fixed-rate, discount points, ARM, and 15-year mortgage options by net cost over your expected stay, with named ARM rate paths, Monte Carlo ranges, and cap-driven worst-case modeling.',
      applicationCategory: 'FinanceApplication',
    },
  },
  payoff: {
    slug: 'payoff',
    title: 'Mortgage Payoff Calculator - Pay Off Your Mortgage Faster | Dett',
    description:
      'See how extra payments, lump sums, and biweekly payments shorten your mortgage and cut interest. Compare every payoff strategy — including the free DIY biweekly alternative — and whether investing beats prepaying.',
    keywords: [
      'mortgage payoff calculator',
      'pay off mortgage faster calculator',
      'extra mortgage payment calculator',
      'biweekly mortgage calculator',
      'mortgage payoff calculator with extra payments',
      'early mortgage payoff calculator',
      'how much do biweekly payments save',
      'should I pay extra on my mortgage',
      'mortgage prepayment calculator',
    ],
    relatedCalculators: [
      { slug: 'recast-vs-refi', name: 'Recast vs Refinance' },
      { slug: 'amortization', name: 'Amortization Schedule' },
      { slug: 'refinance', name: 'Should I Refinance?' },
    ],
    jsonLd: {
      name: 'Mortgage Payoff Calculator',
      description:
        'Compare extra payments, lump sums, and biweekly strategies to pay off your mortgage faster and save interest.',
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
    title: 'Debt-to-Income (DTI) Calculator - See What Lenders See | Dett',
    description:
      'Calculate your front-end and back-end DTI ratios — the key numbers lenders review when sizing a mortgage. Compare your ratios to typical conventional, FHA, and VA guidelines.',
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
        'Calculate your front-end and back-end DTI ratios and compare them to typical mortgage guidelines.',
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
      { slug: 'payoff', name: 'Pay Off Faster' },
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
      { slug: 'loan-timeline', name: 'Best Loan for My Timeline' },
      { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost' },
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
    '@type': ['WebApplication', 'SoftwareApplication'],
    name: config.jsonLd.name,
    description: config.jsonLd.description,
    url: `${BASE_URL}/calculators/${config.slug}`,
    applicationCategory: config.jsonLd.applicationCategory,
    operatingSystem: 'Any',
    dateModified: getCalculatorLastUpdated(slug),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Knowe LLC',
      url: 'https://knowe.one',
    },
    featureList: calculatorSeoConfigs[slug]?.keywords?.slice(0, 5).join(', '),
    isAccessibleForFree: true,
  };
}

export function getCalculatorFaqJsonLd(slug: string): Record<string, unknown> | null {
  const faqs = calculatorFaqs[slug];
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getCalculatorBreadcrumbJsonLd(slug: string): Record<string, unknown> | null {
  const config = calculatorSeoConfigs[slug];
  if (!config) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: `${BASE_URL}/calculators`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.jsonLd.name,
        item: `${BASE_URL}/calculators/${config.slug}`,
      },
    ],
  };
}

/**
 * All structured data for a calculator page:
 * WebApplication/SoftwareApplication + FAQPage + BreadcrumbList.
 */
export function getCalculatorStructuredData(slug: string): Record<string, unknown>[] {
  return [
    getCalculatorJsonLd(slug),
    getCalculatorFaqJsonLd(slug),
    getCalculatorBreadcrumbJsonLd(slug),
  ].filter((d): d is Record<string, unknown> => d !== null);
}
