export type EmbedInputKind = 'currency' | 'percent' | 'number' | 'years';

export interface EmbedInputField {
  key: string;
  label: string;
  kind: EmbedInputKind;
  defaultValue: number;
}

export interface EmbedCalculator {
  slug: string;
  name: string;
  category: string;
  fields: EmbedInputField[];
}

export const EMBED_CALCULATORS: EmbedCalculator[] = [
  {
    slug: 'affordability',
    name: 'How Much House Can I Afford?',
    category: 'Buying a Home',
    fields: [
      { key: 'annualIncome', label: 'Annual income', kind: 'currency', defaultValue: 120000 },
      { key: 'monthlyDebts', label: 'Monthly debts', kind: 'currency', defaultValue: 500 },
      { key: 'downPayment', label: 'Down payment', kind: 'currency', defaultValue: 80000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'mortgage-cost',
    name: 'True Monthly Mortgage Cost',
    category: 'Current Homeowners',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPayment', label: 'Down payment', kind: 'currency', defaultValue: 90000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term (years)', kind: 'years', defaultValue: 30 },
    ],
  },
  {
    slug: 'down-payment',
    name: 'Down Payment Strategy',
    category: 'Buying a Home',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 10 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'rent-vs-buy',
    name: 'Rent vs Buy Analysis',
    category: 'Buying a Home',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'monthlyRent', label: 'Monthly rent', kind: 'currency', defaultValue: 2200 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'downPayment', label: 'Down payment', kind: 'currency', defaultValue: 90000 },
    ],
  },
  {
    slug: 'refinance',
    name: 'Refinance Break-Even',
    category: 'Current Homeowners',
    fields: [
      { key: 'currentBalance', label: 'Current balance', kind: 'currency', defaultValue: 320000 },
      { key: 'currentRate', label: 'Current rate', kind: 'percent', defaultValue: 7.5 },
      { key: 'newRate', label: 'New rate', kind: 'percent', defaultValue: 6.25 },
      { key: 'closingCosts', label: 'Closing costs', kind: 'currency', defaultValue: 8000 },
    ],
  },
  {
    slug: 'cash-out-refi',
    name: 'Cash-Out Refinance',
    category: 'Current Homeowners',
    fields: [
      { key: 'currentBalance', label: 'Current balance', kind: 'currency', defaultValue: 280000 },
      { key: 'homeValue', label: 'Home value', kind: 'currency', defaultValue: 500000 },
      { key: 'cashOutAmount', label: 'Cash out', kind: 'currency', defaultValue: 50000 },
      { key: 'newRate', label: 'New rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'recast-vs-refi',
    name: 'Recast vs Refinance',
    category: 'Current Homeowners',
    fields: [
      { key: 'currentBalance', label: 'Current balance', kind: 'currency', defaultValue: 320000 },
      { key: 'lumpSumAmount', label: 'Lump sum', kind: 'currency', defaultValue: 50000 },
      { key: 'currentRate', label: 'Current rate', kind: 'percent', defaultValue: 6.5 },
      { key: 'newRate', label: 'New rate', kind: 'percent', defaultValue: 6 },
    ],
  },
  {
    slug: 'points-buydown',
    name: 'Points & Buydown',
    category: 'Rate & Structure',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'parRate', label: 'Par rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'pointsRate', label: 'Rate with points', kind: 'percent', defaultValue: 6.25 },
      { key: 'yearsToHold', label: 'Years you will hold', kind: 'years', defaultValue: 7 },
    ],
  },
  {
    slug: 'arm-vs-fixed',
    name: 'ARM vs Fixed Rate',
    category: 'Rate & Structure',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'fixedRate', label: 'Fixed rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'armInitialRate', label: 'ARM initial rate', kind: 'percent', defaultValue: 5.75 },
      { key: 'armFixedPeriod', label: 'ARM fixed years', kind: 'years', defaultValue: 5 },
    ],
  },
  {
    slug: 'timeline-simulator',
    name: 'Decision Timeline',
    category: 'Rate & Structure',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'expectedMoveYear', label: 'Expected move year', kind: 'years', defaultValue: 7 },
    ],
  },
  {
    slug: 'extra-payment',
    name: 'Extra Payment Impact',
    category: 'Payoff Strategy',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term (years)', kind: 'years', defaultValue: 30 },
      { key: 'extraMonthlyPayment', label: 'Extra monthly', kind: 'currency', defaultValue: 300 },
    ],
  },
  {
    slug: 'acceleration',
    name: 'Payoff Acceleration',
    category: 'Payoff Strategy',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'extraMonthly', label: 'Extra monthly', kind: 'currency', defaultValue: 200 },
    ],
  },
  {
    slug: 'biweekly',
    name: 'Biweekly Payments',
    category: 'Payoff Strategy',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term (years)', kind: 'years', defaultValue: 30 },
    ],
  },
  {
    slug: 'interest-sensitivity',
    name: 'Rate Sensitivity',
    category: 'Advanced Analysis',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'baseRate', label: 'Base rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term (years)', kind: 'years', defaultValue: 30 },
    ],
  },
  {
    slug: 'amortization',
    name: 'Amortization Schedule',
    category: 'Current Homeowners',
    fields: [
      { key: 'loanAmount', label: 'Loan amount', kind: 'currency', defaultValue: 360000 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'loanTerm', label: 'Loan term (years)', kind: 'years', defaultValue: 30 },
    ],
  },
  {
    slug: 'dti',
    name: 'DTI Calculator',
    category: 'Buying a Home',
    fields: [
      { key: 'monthlyGrossIncome', label: 'Monthly income', kind: 'currency', defaultValue: 10000 },
      { key: 'mortgagePayment', label: 'Mortgage payment', kind: 'currency', defaultValue: 2200 },
      { key: 'carPayments', label: 'Car payments', kind: 'currency', defaultValue: 450 },
    ],
  },
  {
    slug: 'closing-costs',
    name: 'Closing Cost Estimator',
    category: 'Buying a Home',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 20 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
    ],
  },
  {
    slug: 'pmi',
    name: 'PMI Calculator',
    category: 'Buying a Home',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 450000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 10 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.75 },
      { key: 'creditScore', label: 'Credit score', kind: 'number', defaultValue: 740 },
    ],
  },
  {
    slug: 'fha',
    name: 'FHA Loan Calculator',
    category: 'Buying a Home',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 350000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 3.5 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.5 },
    ],
  },
  {
    slug: 'va',
    name: 'VA Loan Calculator',
    category: 'Buying a Home',
    fields: [
      { key: 'homePrice', label: 'Home price', kind: 'currency', defaultValue: 400000 },
      { key: 'downPaymentPercent', label: 'Down payment %', kind: 'percent', defaultValue: 0 },
      { key: 'interestRate', label: 'Interest rate', kind: 'percent', defaultValue: 6.25 },
    ],
  },
];

export const EMBED_CALCULATOR_SLUGS = EMBED_CALCULATORS.map((calc) => calc.slug);

export function getEmbedCalculator(slug: string): EmbedCalculator | undefined {
  return EMBED_CALCULATORS.find((calc) => calc.slug === slug);
}

export function isEmbedCalculatorSlug(slug: string): boolean {
  return EMBED_CALCULATOR_SLUGS.includes(slug);
}
