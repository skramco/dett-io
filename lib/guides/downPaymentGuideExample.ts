import { calcHref } from '@/lib/guides/calcHref';
import { calculateDownPayment } from '@/lib/calculators/downPayment';
import {
  backEndDtiPercent,
  conventionalPmiRatePercent,
  frontEndDtiPercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
} from '@/lib/calculators/mortgageMath';
import { DEFAULT_RATES, RATES_AS_OF_LABEL } from '@/lib/rates/defaultRates';

/** Page slug. Also the Clozable utm_content value. */
export const DOWN_PAYMENT_GUIDE_SLUG = 'how-much-should-i-put-down-on-a-house';

/** Visible "Last reviewed" date and Article dateModified. Not a future date. */
export const DOWN_PAYMENT_GUIDE_REVIEWED_ISO = '2026-11-28';
export const DOWN_PAYMENT_GUIDE_REVIEWED_LABEL = 'November 28, 2026';

export const DOWN_PAYMENT_GUIDE_TITLE = 'How Much Should I Put Down on a House?';

export const DOWN_PAYMENT_GUIDE_DESCRIPTION =
  'Compare 3%, 5%, 10%, and 20% down on one labeled example. It weighs cash left in reserve against the higher payment and PMI, then checks that payment against example income and monthly debts.';

/**
 * Labeled example. The rate is the calculator default (6.75%). Do not
 * substitute a different rate here.
 */
export const EXAMPLE_HOME_PRICE = 400_000;
export const EXAMPLE_RATE = DEFAULT_RATES.thirtyYearFixed;
export const EXAMPLE_TERM_YEARS = 30;
export const EXAMPLE_TAX_RATE = 1.2;
export const EXAMPLE_INSURANCE_ANNUAL = 1_800;
export const EXAMPLE_CREDIT_SCORE = 740;
export const EXAMPLE_ANNUAL_INCOME = 132_000;
export const EXAMPLE_MONTHLY_INCOME = EXAMPLE_ANNUAL_INCOME / 12;
export const EXAMPLE_OTHER_DEBTS = 800;
export const EXAMPLE_SAVINGS = 100_000;
/** Selected in the prefilled link. The calculator still charts every percent. */
export const EXAMPLE_SELECTED_PERCENT = 10;

/** CFPB home loan toolkit housing rule of thumb, used as a planning line. */
export const HOUSING_SHARE_LINE = 28;
/** Fannie Mae manual total-DTI maximum before the higher matrix band. */
export const TOTAL_DEBT_SHARE_LINE = 36;

export const EXAMPLE_RATE_AS_OF_LABEL = RATES_AS_OF_LABEL;

const COMPARED_PERCENTS = [3, 5, 10, 20] as const;
export type ComparedDownPercent = (typeof COMPARED_PERCENTS)[number];

export interface DownPaymentExampleRow {
  percent: ComparedDownPercent;
  downPaymentAmount: number;
  loanAmount: number;
  cashToClose: number;
  closingCosts: number;
  monthlyHousing: number;
  monthlyPI: number;
  monthlyPMI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  cashLeft: number;
  housingShare: number;
  totalDebtShare: number;
  fitsHousingLine: boolean;
  fitsTotalDebtLine: boolean;
  /** True only when both planning lines are met. A false row is not the amount to use. */
  fitsBudget: boolean;
  threeMonthObligations: number;
  sixMonthObligations: number;
  cushionCoversThreeMonths: boolean;
  cushionCoversSixMonths: boolean;
}

function roundDollars(value: number): number {
  return Math.round(value);
}

function buildRows(): DownPaymentExampleRow[] {
  const calculated = calculateDownPayment({
    homePrice: EXAMPLE_HOME_PRICE,
    downPaymentPercent: EXAMPLE_SELECTED_PERCENT,
    interestRate: EXAMPLE_RATE,
    loanTerm: EXAMPLE_TERM_YEARS,
    propertyTaxRate: EXAMPLE_TAX_RATE,
    homeInsuranceAnnual: EXAMPLE_INSURANCE_ANNUAL,
    creditScore: EXAMPLE_CREDIT_SCORE,
  });

  const chart = calculated.chartData as {
    downPayment: string;
    cashToClose: number;
    closingCosts: number;
    monthlyPayment: number;
  }[];

  const monthlyTax = roundDollars((EXAMPLE_HOME_PRICE * EXAMPLE_TAX_RATE) / 100 / 12);
  const monthlyInsurance = roundDollars(EXAMPLE_INSURANCE_ANNUAL / 12);
  const termMonths = EXAMPLE_TERM_YEARS * 12;

  return COMPARED_PERCENTS.map((percent) => {
    const chartRow = chart.find((item) => item.downPayment === `${percent}%`);
    if (!chartRow) {
      throw new Error(`Down payment calculator did not return ${percent}%`);
    }

    const loanAmount = EXAMPLE_HOME_PRICE * (1 - percent / 100);
    const needsPmi = percent < 20;
    const pmiRate = needsPmi
      ? conventionalPmiRatePercent(ltvPercent(loanAmount, EXAMPLE_HOME_PRICE), EXAMPLE_CREDIT_SCORE)
      : 0;
    const monthlyPI = roundDollars(monthlyPayment(loanAmount, EXAMPLE_RATE, termMonths));
    const monthlyPMI = needsPmi ? roundDollars(monthlyPmiAmount(loanAmount, pmiRate)) : 0;
    const monthlyHousing = chartRow.monthlyPayment;

    const housingShare = frontEndDtiPercent(monthlyHousing, EXAMPLE_MONTHLY_INCOME);
    const totalDebtShare = backEndDtiPercent(
      monthlyHousing,
      EXAMPLE_OTHER_DEBTS,
      EXAMPLE_MONTHLY_INCOME
    );
    const fitsHousingLine = housingShare <= HOUSING_SHARE_LINE;
    const fitsTotalDebtLine = totalDebtShare <= TOTAL_DEBT_SHARE_LINE;
    const cashLeft = EXAMPLE_SAVINGS - chartRow.cashToClose;
    const threeMonthObligations = (monthlyHousing + EXAMPLE_OTHER_DEBTS) * 3;
    const sixMonthObligations = (monthlyHousing + EXAMPLE_OTHER_DEBTS) * 6;

    return {
      percent,
      downPaymentAmount: EXAMPLE_HOME_PRICE * (percent / 100),
      loanAmount,
      cashToClose: chartRow.cashToClose,
      closingCosts: chartRow.closingCosts,
      monthlyHousing,
      monthlyPI,
      monthlyPMI,
      monthlyTax,
      monthlyInsurance,
      cashLeft,
      housingShare,
      totalDebtShare,
      fitsHousingLine,
      fitsTotalDebtLine,
      fitsBudget: fitsHousingLine && fitsTotalDebtLine,
      threeMonthObligations,
      sixMonthObligations,
      cushionCoversThreeMonths: cashLeft >= threeMonthObligations,
      cushionCoversSixMonths: cashLeft >= sixMonthObligations,
    };
  });
}

export const DOWN_PAYMENT_EXAMPLE_ROWS = buildRows();

export function exampleRow(percent: ComparedDownPercent): DownPaymentExampleRow {
  const row = DOWN_PAYMENT_EXAMPLE_ROWS.find((item) => item.percent === percent);
  if (!row) throw new Error(`Missing example row ${percent}`);
  return row;
}

export const DOWN_PAYMENT_EXAMPLE_HREF = calcHref('down-payment', {
  homePrice: EXAMPLE_HOME_PRICE,
  downPaymentPercent: EXAMPLE_SELECTED_PERCENT,
  interestRate: EXAMPLE_RATE,
  loanTerm: EXAMPLE_TERM_YEARS,
  propertyTaxRate: EXAMPLE_TAX_RATE,
  homeInsuranceAnnual: EXAMPLE_INSURANCE_ANNUAL,
  creditScore: EXAMPLE_CREDIT_SCORE,
});

const tenPercent = exampleRow(10);

/** DTI tool has no PMI field, so the example PMI is included in the mortgage line. */
export const DOWN_PAYMENT_EXAMPLE_DTI_HREF = calcHref('dti', {
  monthlyGrossIncome: EXAMPLE_MONTHLY_INCOME,
  mortgagePayment: tenPercent.monthlyPI + tenPercent.monthlyPMI,
  propertyTax: (EXAMPLE_HOME_PRICE * EXAMPLE_TAX_RATE) / 100,
  homeInsurance: EXAMPLE_INSURANCE_ANNUAL,
  hoaFees: 0,
  carPayments: 0,
  studentLoans: 0,
  creditCardMinimums: 0,
  personalLoans: 0,
  childSupport: 0,
  otherDebts: EXAMPLE_OTHER_DEBTS,
});

export const DOWN_PAYMENT_GUIDE_SOURCES = [
  {
    id: 'cfpbDown',
    label: 'Consumer Financial Protection Bureau, determine your down payment',
    href: 'https://www.consumerfinance.gov/owning-a-home/prepare/determine-your-down-payment/',
  },
  {
    id: 'cfpbDti',
    label: 'Consumer Financial Protection Bureau, what is a debt-to-income ratio?',
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-why-is-the-43-debt-to-income-ratio-important-en-1791/',
  },
  {
    id: 'cfpbToolkit',
    label: 'Consumer Financial Protection Bureau, Your home loan toolkit',
    href: 'https://files.consumerfinance.gov/f/documents/cfpb_your-home-loan-toolkit_print.pdf',
  },
  {
    id: 'cfpbPmi',
    label: 'Consumer Financial Protection Bureau, what is private mortgage insurance?',
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/',
  },
  {
    id: 'fanniePurchase',
    label: 'Fannie Mae Selling Guide B2-1.3-01, purchase transactions',
    href: 'https://selling-guide.fanniemae.com/sel/b2-1.3-01/purchase-transactions',
  },
  {
    id: 'fannieDti',
    label: 'Fannie Mae Selling Guide B3-6-02, debt-to-income ratios',
    href: 'https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios',
  },
  {
    id: 'freddieHomePossible',
    label: 'Freddie Mac, Home Possible and a 3% down payment',
    href: 'https://myhome.freddiemac.com/buying/3-percent-down-payment',
  },
  {
    id: 'freddiePmms',
    label: 'Freddie Mac Primary Mortgage Market Survey (example rate context)',
    href: 'https://www.freddiemac.com/pmms',
  },
  {
    id: 'hudFha',
    label: 'HUD, FHA loans',
    href: 'https://www.hud.gov/helping-americans/loans',
  },
  {
    id: 'vaLoans',
    label: 'U.S. Department of Veterans Affairs, VA-backed home loans',
    href: 'https://www.va.gov/housing-assistance/home-loans/',
  },
] as const;

export type DownPaymentGuideSourceId = (typeof DOWN_PAYMENT_GUIDE_SOURCES)[number]['id'];

export function guideSource(id: DownPaymentGuideSourceId): string {
  const source = DOWN_PAYMENT_GUIDE_SOURCES.find((item) => item.id === id);
  if (!source) throw new Error(`Missing source ${id}`);
  return source.href;
}

export const downPaymentGuideFaqs: { question: string; answer: string }[] = [
  {
    question: 'How much should I put down on a house?',
    answer:
      'Put down an amount that leaves cash for closing costs and an emergency cushion, while the full monthly housing payment plus your other debts still fits your income. In Dett\'s labeled example (a $400,000 home, $132,000 of income, $800 of other monthly debts, $100,000 of savings, and a 6.75% illustrative rate), 3% and 5% leave the most cash but the payment is over the 28/36 planning lines. 20% fits those lines and has no estimated PMI, but the cash left is short of a three-month cushion of the illustrated obligations. 10% fits both checks in that example. Your price, taxes, insurance, income, and debts will change the result.',
  },
  {
    question: 'Is 20% down required?',
    answer:
      'No. The CFPB says many loan types require 5% or more, and that 20% is where buyers often reduce loan costs the most, including conventional PMI. It is not a minimum on every loan. FHA loans can go as low as 3.5% down. Some conventional programs allow 3% with extra rules. VA-backed loans are often made with no down payment. A 20% down payment only helps when the payment fits and you still have cash left for expenses.',
  },
  {
    question: 'Should I choose 3% down so I can keep more cash?',
    answer:
      'Only when the higher payment still fits your income and your other monthly debts. Cash left in the bank does not help if the monthly payment is more than the budget can carry. In the labeled example, 3% leaves the most cash and is also over both the 28% housing line and the 36% total-debt line. This page does not treat that option as the one to use for the example.',
  },
  {
    question: 'Does a larger down payment lower the rate in this example?',
    answer:
      'The example holds the rate at 6.75% on every row so the payment gap is the loan size and estimated PMI. That figure is Dett\'s calculator default, the Freddie Mac PMMS 30-year average for the week of October 15, 2026, and it is an illustration. The CFPB says a higher down payment generally means the loan is likely to cost less. This page does not estimate a rate change.',
  },
  {
    question: 'Is 3% down the same as an FHA loan?',
    answer:
      'No. The worked example is a conventional comparison in Dett\'s down payment calculator. HUD says an FHA down payment can be as low as 3.5% of the purchase price, which is a different number, and FHA mortgage insurance works differently from conventional PMI. Those insurance details are in the PMI guide.',
  },
  {
    question: 'If my total debt share is under 36%, does that decide the loan?',
    answer:
      'No. Debt-to-income is one way lenders measure whether the payments fit the income, and the CFPB notes that different products use different limits. Fannie Mae\'s manual maximum is 36% of stable monthly income, with room up to 45% when credit score and reserve rules are met, and up to 50% in Desktop Underwriter. A share under a planning line in this example is not a decision on a loan.',
  },
];
