/**
 * Server-side computation for state location pages. All numbers are derived
 * from the shared calculator modules in lib/calculators so the SEO pages
 * and the interactive calculators cannot drift apart.
 */

import {
  calculateClosingCosts,
  STATE_CLOSING_CUSTOMS,
} from '@/lib/calculators/closingCosts';
import { calculateMortgageCost } from '@/lib/calculators/mortgageCost';
import { DEFAULT_RATES } from '@/lib/rates/defaultRates';
import { formatCurrency } from '@/lib/format';
import {
  LOCATION_ASSUMPTIONS,
  locationLabel,
  type LocationData,
} from './locationData';

export interface LocationLineItem {
  name: string;
  category: 'lender' | 'third-party' | 'government' | 'prepaid' | 'outside-closing';
  amount: number;
  note?: string;
}

export interface LocationFaq {
  question: string;
  answer: string;
}

export interface LocationPageData {
  location: LocationData;
  label: string;
  year: number;
  interestRate: number;
  assumptions: typeof LOCATION_ASSUMPTIONS;
  medianHomePrice: number;
  downPayment: number;
  loanAmount: number;
  closingCostsTotal: number;
  closingCostsPercent: number;
  closingCostsLow: number;
  closingCostsHigh: number;
  lenderFees: number;
  thirdPartyFees: number;
  governmentFees: number;
  prepaidItems: number;
  lineItems: LocationLineItem[];
  cashToClose: number;
  monthlyPayment: number;
  monthlyPI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  annualPropertyTax: number;
  buyerTransferTax: number;
  attorneyCustomary: boolean;
  transferTaxNote: string;
  isJumboAtExample: boolean;
  faqs: LocationFaq[];
}

const usd = formatCurrency;

const FHA_2026_FLOOR = 541_288;

export function buildLocationPageData(location: LocationData): LocationPageData {
  const { loanTermYears, downPaymentPercent } = LOCATION_ASSUMPTIONS;
  const interestRate = DEFAULT_RATES.thirtyYearFixed;
  const price = location.medianHomePrice;
  const label = locationLabel(location);
  const year = new Date(location.lastUpdated).getFullYear();
  const customs = STATE_CLOSING_CUSTOMS[location.stateAbbr];

  const fullTransferTax = Math.round(price * (customs.transferTaxRate / 100));
  const buyerTransferTax = Math.round(fullTransferTax * location.buyerTransferShare);

  const closing = calculateClosingCosts({
    homePrice: price,
    downPaymentPercent,
    interestRate,
    loanTerm: loanTermYears,
    state: location.stateAbbr,
    isNewConstruction: false,
    transferTax: buyerTransferTax,
    prepaidInsurance: location.annualInsurance,
    propertyTaxRate: location.propertyTaxRate,
  });

  const annualPropertyTax = Math.round(price * (location.propertyTaxRate / 100));
  const downPayment = Math.round(price * (downPaymentPercent / 100));
  const loanAmount = price - downPayment;
  const isJumboAtExample = loanAmount > location.conformingLoanLimit;

  const monthly = calculateMortgageCost({
    homePrice: price,
    downPayment,
    interestRate,
    loanTerm: loanTermYears,
    propertyTax: annualPropertyTax,
    homeInsurance: location.annualInsurance,
    hoaFees: 0,
    pmi: 0,
  });

  const d = closing.details as Record<string, number>;
  const m = monthly.details as Record<string, number>;

  const closingCostsTotal = d.totalClosingCosts;
  const closingCostsLow = Math.round(price * 0.02);
  const closingCostsHigh = Math.round(price * 0.05);
  const cashToClose = downPayment + closingCostsTotal;

  const transferWho =
    location.buyerTransferShare === 0
      ? 'and in this state the buyer does not customarily pay it, so it is not included in our buyer-side estimate'
      : location.buyerTransferShare === 0.5
        ? 'typically split 50/50 — the buyer\'s half is included in our estimate'
        : 'and in this state the buyer customarily pays it, so it is included in our estimate';

  const loanLimitAnswer = location.highCostLoanLimit
    ? `The 2026 conforming loan limit in most of ${label} is ${usd(location.conformingLoanLimit)} for a one-unit home. Some high-cost counties go as high as ${usd(location.highCostLoanLimit)}. On a median-priced ${usd(price)} home with ${downPaymentPercent}% down, the loan is ${usd(loanAmount)} — ${isJumboAtExample ? 'above the baseline limit, so you may need a jumbo or high-balance loan depending on the county' : 'within the conforming limit in most counties'}. FHA limits also vary by county (2026 floor about ${usd(FHA_2026_FLOOR)}).`
    : location.stateAbbr === 'AK' || location.stateAbbr === 'HI' || location.stateAbbr === 'DC'
      ? `The 2026 conforming loan limit in ${label} is ${usd(location.conformingLoanLimit)} for a one-unit home${location.highCostLoanLimit ? `, with a high-cost ceiling of ${usd(location.highCostLoanLimit)}` : ''}. On a median-priced ${usd(price)} home with ${downPaymentPercent}% down, the loan is ${usd(loanAmount)}, which ${isJumboAtExample ? 'exceeds' : 'is within'} that limit. FHA limits also vary by county (2026 floor about ${usd(FHA_2026_FLOOR)}).`
      : `The 2026 conforming loan limit in ${label} is ${usd(location.conformingLoanLimit)} for a one-unit home — the national baseline. No counties in this state are designated high-cost for 2026. On a median-priced ${usd(price)} home with ${downPaymentPercent}% down, the loan is ${usd(loanAmount)}, so a typical purchase stays conforming. FHA limits also vary by county (2026 floor about ${usd(FHA_2026_FLOOR)}).`;

  const faqs: LocationFaq[] = [
    {
      question: `How much are closing costs in ${label}?`,
      answer: `Buyers in ${label} typically pay 2% to 5% of the purchase price in closing costs — roughly ${usd(closingCostsLow)} to ${usd(closingCostsHigh)} on a median-priced home around ${usd(price)}. Our itemized estimate, including lender fees, title work, government fees, and prepaid taxes and insurance, comes to about ${usd(closingCostsTotal)} (${d.closingCostPercent}% of the price) with ${downPaymentPercent}% down at ${interestRate}%.`,
    },
    {
      question: `What is the property tax rate in ${label}?`,
      answer: `The effective property tax rate in ${label} is approximately ${location.propertyTaxRate}% of home value per year. On a median-priced home of ${usd(price)}, that works out to about ${usd(annualPropertyTax)} per year, or ${usd(annualPropertyTax / 12)} per month. Several months of taxes are usually collected up front at closing to fund your escrow account.`,
    },
    {
      question: `Is there a real estate transfer tax in ${label}?`,
      answer:
        customs.transferTaxRate > 0
          ? `Yes. ${customs.note ?? `The statewide transfer/recordation tax is about ${customs.transferTaxRate}% of the sale price.`} At that rate on a ${usd(price)} home, the tax is roughly ${usd(fullTransferTax)} — ${transferWho}. Everything is negotiable in the purchase contract.`
          : `No statewide real estate transfer tax. ${customs.note ?? `That keeps government fees at closing lower in ${label} than in most states.`}`,
    },
    {
      question: `What is the 2026 conforming loan limit in ${label}?`,
      answer: loanLimitAnswer,
    },
    {
      question: `How much cash do I need to buy a median-priced home in ${label}?`,
      answer: `With ${downPaymentPercent}% down on a ${usd(price)} home, plan for about ${usd(cashToClose)} in total: ${usd(downPayment)} for the down payment plus roughly ${usd(closingCostsTotal)} in closing costs and prepaid items. A smaller down payment reduces the cash needed but adds PMI to your monthly payment.`,
    },
    {
      question: `What would the monthly payment be on a typical ${label} home?`,
      answer: `On a median-priced ${usd(price)} home with ${downPaymentPercent}% down and a ${loanTermYears}-year loan at ${interestRate}%, the total monthly payment is about ${usd(m.totalMonthlyPayment)} — ${usd(m.principalAndInterest)} in principal and interest, ${usd(m.monthlyPropertyTax)} in property taxes, and ${usd(m.monthlyInsurance)} in homeowners insurance.`,
    },
  ];

  const lineItems: LocationLineItem[] = closing.lineItems
    .filter((item) => item.category !== 'outside-closing')
    .map(({ name, category, amount, note }) => ({ name, category, amount, note }));

  return {
    location,
    label,
    year,
    interestRate,
    assumptions: LOCATION_ASSUMPTIONS,
    medianHomePrice: price,
    downPayment,
    loanAmount,
    closingCostsTotal,
    closingCostsPercent: d.closingCostPercent,
    closingCostsLow,
    closingCostsHigh,
    lenderFees: d.lenderFees,
    thirdPartyFees: d.thirdPartyFees,
    governmentFees: d.governmentFees,
    prepaidItems: d.prepaidItems,
    lineItems,
    cashToClose,
    monthlyPayment: Math.round(m.totalMonthlyPayment),
    monthlyPI: Math.round(m.principalAndInterest),
    monthlyTax: Math.round(m.monthlyPropertyTax),
    monthlyInsurance: Math.round(m.monthlyInsurance),
    annualPropertyTax,
    buyerTransferTax,
    attorneyCustomary: customs.attorneyCustomary,
    transferTaxNote: customs.note ?? '',
    isJumboAtExample,
    faqs,
  };
}
