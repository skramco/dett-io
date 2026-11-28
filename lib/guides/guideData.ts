import {
  DOWN_PAYMENT_EXAMPLE_DTI_HREF,
  DOWN_PAYMENT_EXAMPLE_HREF,
  DOWN_PAYMENT_GUIDE_DESCRIPTION,
  DOWN_PAYMENT_GUIDE_REVIEWED_ISO,
  DOWN_PAYMENT_GUIDE_SLUG,
  DOWN_PAYMENT_GUIDE_TITLE,
} from '@/lib/guides/downPaymentGuideExample';

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: 'salary' | 'decision' | 'cost';
  readTime: string;
  calculators: { name: string; href: string }[];
  /** ISO publication date for Article JSON-LD. Omit to keep the original guide batch date. */
  datePublished?: string;
  /** ISO date for Article JSON-LD dateModified. Omit to match datePublished. */
  dateModified?: string;
}

export const guides: Guide[] = [
  {
    slug: 'how-much-house-can-i-afford-by-salary',
    title: 'How Much House Can I Afford on My Salary?',
    description:
      "Salary-band estimates from $40K to $200K using Dett's affordability calculator math, illustrative 7.11% PMMS rate (week of Nov 12, 2026), and common DTI guidelines. Estimates only — not a loan offer.",
    category: 'salary',
    readTime: '10 min',
    calculators: [
      {
        name: 'How Much House Can I Afford?',
        href: '/calculators/affordability?annualIncome=100000&monthlyDebts=400&downPayment=40000&interestRate=7.11&loanTerm=30&propertyTaxRate=1.2&homeInsuranceAnnual=1800&hoaFees=0&creditScore=740',
      },
      {
        name: 'True Monthly Mortgage Cost',
        href: '/calculators/mortgage-cost?homePrice=340500&downPayment=40000&interestRate=7.11&loanTerm=30&propertyTax=4086&homeInsurance=1800&hoaFees=0&creditScore=740&pmi=0',
      },
      {
        name: 'DTI Calculator',
        href: '/calculators/dti?monthlyGrossIncome=8333&mortgagePayment=2021&propertyTax=4086&homeInsurance=1800&hoaFees=0&carPayments=0&studentLoans=0&creditCardMinimums=0&personalLoans=0&childSupport=0&otherDebts=400',
      },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
    ],
  },
  // Decision articles
  {
    slug: 'pay-extra-mortgage-or-invest',
    title: 'Should I Pay Extra on My Mortgage or Invest the Money?',
    description:
      'Compare prepaying principal vs investing the same cash with identical monthly outflow. Worked examples use Dett\'s payoff calculator and a 6.75% illustrative mortgage rate — not investment advice.',
    category: 'decision',
    readTime: '8 min',
    calculators: [
      {
        name: 'Pay Off Faster (prepay vs invest)',
        href: '/calculators/payoff?loanAmount=360000&interestRate=6.75&loanTerm=30&extraMonthlyPayment=300&investmentReturn=7',
      },
      {
        name: 'Pay Off Faster (lump sum)',
        href: '/calculators/payoff?loanAmount=360000&interestRate=6.75&loanTerm=30&lumpSumAmount=10000&lumpSumYear=3&investmentReturn=7',
      },
    ],
  },
  {
    slug: 'cash-out-refinance-pay-credit-card-debt',
    title: 'Is a Cash-Out Refinance Worth It to Pay Off Credit Card Debt?',
    description:
      'Weigh closing costs, payment shock, secured vs unsecured debt, and the risk of running cards back up. Example uses the cash-out refinance calculator — not a loan offer.',
    category: 'decision',
    readTime: '9 min',
    calculators: [
      {
        name: 'Cash-Out Refinance (card payoff example)',
        href: '/calculators/cash-out-refi?currentBalance=280000&currentRate=4.5&yearsRemaining=25&homeValue=500000&cashOutAmount=25000&newRate=6.75&newTerm=30&closingCosts=8000&alternativeRate=22',
      },
      {
        name: 'DTI Calculator',
        href: '/calculators/dti',
      },
    ],
  },
  {
    slug: 'car-student-loans-house-affordability',
    title: 'How Car Payments and Student Loans Change How Much House You Can Afford',
    description:
      'Auto and student loan payments count in DTI and shrink affordability. Worked examples at $100K income with prefilled DTI and affordability calculators.',
    category: 'decision',
    readTime: '8 min',
    calculators: [
      {
        name: 'Affordability (moderate other debts)',
        href: '/calculators/affordability?annualIncome=100000&monthlyDebts=920&downPayment=50000&interestRate=6.75&loanTerm=30&propertyTaxRate=1.2&homeInsuranceAnnual=1800&creditScore=740',
      },
      {
        name: 'DTI (car, student, housing)',
        href: '/calculators/dti?monthlyGrossIncome=8333&carPayments=450&studentLoans=350&creditCardMinimums=120&mortgagePayment=2200&propertyTax=4500&homeInsurance=1800',
      },
    ],
  },
  {
    slug: 'debt-avalanche-vs-snowball',
    title: 'Debt Avalanche vs. Debt Snowball: Which Payoff Order Fits You?',
    description:
      'Avalanche targets highest APR first; snowball clears the smallest balances for momentum. Examples use the payoff calculator for disciplined extra payments.',
    category: 'decision',
    readTime: '7 min',
    calculators: [
      {
        name: 'Pay Off Faster (high-rate example)',
        href: '/calculators/payoff?loanAmount=24000&interestRate=22&loanTerm=5&extraMonthlyPayment=400',
      },
      {
        name: 'Pay Off Faster (mortgage habit)',
        href: '/calculators/payoff?loanAmount=200000&interestRate=6.75&loanTerm=30&extraMonthlyPayment=200',
      },
    ],
  },
  {
    slug: 'balance-transfer-vs-personal-loan',
    title: 'Balance Transfer Card vs. Personal Loan for Credit Card Debt',
    description:
      '0% promos vs fixed installment payments: fees, deadlines, and whether the monthly payment fits your budget. DTI examples before and after consolidation.',
    category: 'decision',
    readTime: '8 min',
    calculators: [
      {
        name: 'DTI (revolving minimums)',
        href: '/calculators/dti?monthlyGrossIncome=7500&carPayments=350&creditCardMinimums=420',
      },
      {
        name: 'DTI (personal loan payment)',
        href: '/calculators/dti?monthlyGrossIncome=7500&carPayments=350&creditCardMinimums=0&personalLoans=355',
      },
    ],
  },
  {
    slug: 'should-i-refinance',
    title: 'Should I Refinance My Mortgage?',
    description:
      'Refinance break-even is closing costs divided by monthly P&I savings — then compare how long you will keep the loan. Worked example: a 7.0% to 6.75% refi with $5,000 closing costs. CFPB sources; estimates only.',
    category: 'decision',
    readTime: '9 min',
    calculators: [
      {
        name: 'Refinance Break-Even (pre-filled)',
        href: '/calculators/refinance?currentBalance=300000&currentRate=7&currentMonthlyPayment=1995&yearsRemaining=28&newRate=6.75&newTerm=30&closingCosts=5000',
      },
      { name: 'Rate Sensitivity', href: '/calculators/interest-sensitivity?loanAmount=300000&baseRate=6.75&loanTerm=30' },
      { name: 'Amortization Schedule', href: '/calculators/amortization?loanAmount=300000&interestRate=6.75&loanTerm=30' },
    ],
  },
  {
    slug: 'rent-vs-buy-guide',
    title: 'Rent vs Buy: The Complete Guide',
    description:
      'Worked rent vs buy example with a pre-filled calculator, crossover year, and links to the comparison page. Full ownership cost vs renting plus invested down payment — not just mortgage payment vs rent.',
    category: 'decision',
    readTime: '10 min',
    calculators: [
      {
        name: 'Rent vs Buy (pre-filled)',
        href: '/calculators/rent-vs-buy?homePrice=350000&downPayment=70000&interestRate=6.75&loanTerm=30&monthlyRent=2200&rentInflation=3&homeAppreciation=3&propertyTaxRate=1.2&homeInsuranceAnnual=1800&maintenanceRate=1&pmiRate=0.5&closingCosts=10500&sellingCosts=6&investmentReturn=7&yearsToAnalyze=10',
      },
      {
        name: 'Affordability check',
        href: '/calculators/affordability?annualIncome=95000&monthlyDebts=350&downPayment=70000&interestRate=6.75&loanTerm=30&propertyTaxRate=1.2&homeInsuranceAnnual=1800&creditScore=740',
      },
      {
        name: 'True Monthly Mortgage Cost',
        href: '/calculators/mortgage-cost?homePrice=350000&downPayment=70000&interestRate=6.75&loanTerm=30&propertyTaxRate=1.2&homeInsuranceAnnual=1800',
      },
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
  {
    slug: DOWN_PAYMENT_GUIDE_SLUG,
    title: DOWN_PAYMENT_GUIDE_TITLE,
    description: DOWN_PAYMENT_GUIDE_DESCRIPTION,
    category: 'decision',
    readTime: '9 min',
    datePublished: DOWN_PAYMENT_GUIDE_REVIEWED_ISO,
    dateModified: DOWN_PAYMENT_GUIDE_REVIEWED_ISO,
    calculators: [
      {
        name: 'Down Payment Strategy (labeled example)',
        href: DOWN_PAYMENT_EXAMPLE_HREF,
      },
      {
        name: 'DTI check (10% example)',
        href: DOWN_PAYMENT_EXAMPLE_DTI_HREF,
      },
    ],
  },
  // Cost articles
  {
    slug: 'va-funding-fee-and-waiver',
    title: 'How Is the VA Funding Fee Calculated, and When Is It Waived?',
    description:
      'VA funding fee rates by loan purpose, down payment tier, and first vs subsequent use — plus who qualifies for a full waiver. Worked examples match Dett\'s VA calculator and VA.gov charts (effective April 7, 2023). Estimates only.',
    category: 'cost',
    readTime: '8 min',
    calculators: [
      {
        name: 'VA Loan Calculator',
        href: '/calculators/va?homePrice=400000&downPaymentPercent=0&loanPurpose=purchase&firstTimeUse=true&disabilityExempt=false',
      },
      {
        name: 'VA Loan Calculator (5% down)',
        href: '/calculators/va?homePrice=400000&downPaymentPercent=5&loanPurpose=purchase&firstTimeUse=true&disabilityExempt=false',
      },
      {
        name: 'VA Loan Calculator (funding fee waived)',
        href: '/calculators/va?homePrice=400000&downPaymentPercent=0&loanPurpose=purchase&firstTimeUse=true&disabilityExempt=true',
      },
    ],
  },
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
    description:
      'What PMI costs, when it ends at 78% and 80% LTV (CFPB / Homeowners Protection Act), how FHA MIP differs (HUD), and a pre-filled calculator example on a $400,000 home with 10% down.',
    category: 'cost',
    readTime: '9 min',
    calculators: [
      {
        name: 'PMI Calculator (pre-filled)',
        href: '/calculators/pmi?homePrice=400000&downPaymentPercent=10&loanAmount=360000&interestRate=6.75&loanTerm=30&creditScore=720&pmiType=borrower-paid',
      },
      { name: 'Down Payment Strategy', href: '/calculators/down-payment' },
      {
        name: 'Pay Off Faster (reach 80% sooner)',
        href: '/calculators/payoff?loanAmount=360000&interestRate=6.75&loanTerm=30&extraMonthlyPayment=200',
      },
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