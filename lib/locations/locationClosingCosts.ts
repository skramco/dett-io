import { calculateClosingCosts } from '@/lib/calculators/closingCosts';
import type { Location } from './locationData';

/** Representative 30-year fixed rate used for all location estimates */
export const ASSUMED_RATE = 6.5;
export const ASSUMED_TERM = 30;

export interface LocationLineItem {
  name: string;
  category: 'lender' | 'third-party' | 'government' | 'prepaid';
  amount: number;
}

export interface PricePointEstimate {
  homePrice: number;
  totalClosingCosts: number;
  closingCostPercent: number;
  cashToCloseAt20Down: number;
}

export interface LocationFaq {
  question: string;
  answer: string;
}

export interface LocationClosingCostData {
  /** Headline scenario: median-priced home, 20% down */
  medianHomePrice: number;
  loanAmount: number;
  downPayment: number;
  totalClosingCosts: number;
  closingCostPercent: number;
  cashToClose: number;
  /** Same home with 10% down (PMI applies) */
  cashToCloseAt10Down: number;
  totalClosingCostsAt10Down: number;
  lenderFees: number;
  thirdPartyFees: number;
  governmentFees: number;
  prepaidItems: number;
  transferTaxAmount: number;
  monthlyPropertyTax: number;
  lineItems: LocationLineItem[];
  pricePoints: PricePointEstimate[];
  faqs: LocationFaq[];
}

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

function roundPrice(n: number): number {
  return Math.round(n / 5000) * 5000;
}

function buildInputs(location: Location, homePrice: number, downPaymentPercent: number) {
  return {
    homePrice,
    downPaymentPercent,
    interestRate: ASSUMED_RATE,
    loanTerm: ASSUMED_TERM,
    state: location.stateCode,
    isNewConstruction: false,
    transferTax: Math.round(homePrice * (location.transferTaxRate / 100)),
    prepaidInsurance: location.avgAnnualInsurance,
    propertyTaxRate: location.propertyTaxRate,
  };
}

export function getLocationClosingCostData(location: Location): LocationClosingCostData {
  const median = location.medianHomePrice;

  const base = calculateClosingCosts(buildInputs(location, median, 20));
  const lowDown = calculateClosingCosts(buildInputs(location, median, 10));

  const pricePoints: PricePointEstimate[] = [0.75, 1, 1.25].map((mult) => {
    const price = roundPrice(median * mult);
    const result = calculateClosingCosts(buildInputs(location, price, 20));
    return {
      homePrice: price,
      totalClosingCosts: result.details.totalClosingCosts as number,
      closingCostPercent: result.details.closingCostPercent as number,
      cashToCloseAt20Down: result.details.totalCashNeeded as number,
    };
  });

  const totalClosingCosts = base.details.totalClosingCosts as number;
  const closingCostPercent = base.details.closingCostPercent as number;
  const cashToClose = base.details.totalCashNeeded as number;
  const transferTaxAmount = Math.round(median * (location.transferTaxRate / 100));
  const monthlyPropertyTax = Math.round((median * (location.propertyTaxRate / 100)) / 12);

  const data: LocationClosingCostData = {
    medianHomePrice: median,
    loanAmount: base.details.loanAmount as number,
    downPayment: base.details.downPayment as number,
    totalClosingCosts,
    closingCostPercent,
    cashToClose,
    cashToCloseAt10Down: lowDown.details.totalCashNeeded as number,
    totalClosingCostsAt10Down: lowDown.details.totalClosingCosts as number,
    lenderFees: base.details.lenderFees as number,
    thirdPartyFees: base.details.thirdPartyFees as number,
    governmentFees: base.details.governmentFees as number,
    prepaidItems: base.details.prepaidItems as number,
    transferTaxAmount,
    monthlyPropertyTax,
    lineItems: base.lineItems.map(({ name, category, amount }) => ({ name, category, amount })),
    pricePoints,
    faqs: [],
  };

  data.faqs = buildLocationFaqs(location, data);
  return data;
}

function buildLocationFaqs(location: Location, data: LocationClosingCostData): LocationFaq[] {
  const inPlace = location.type === 'state' ? location.name : location.fullName;
  const faqs: LocationFaq[] = [];

  faqs.push({
    question: `How much are closing costs in ${location.name}?`,
    answer: `On a median-priced home in ${inPlace} (about ${fmt(data.medianHomePrice)}), buyer closing costs run roughly ${fmt(
      data.totalClosingCosts
    )} — about ${data.closingCostPercent.toFixed(1)}% of the purchase price. That includes lender fees (${fmt(
      data.lenderFees
    )}), third-party fees like title and appraisal (${fmt(data.thirdPartyFees)}), government fees (${fmt(
      data.governmentFees
    )}), and prepaid taxes, insurance, and interest (${fmt(data.prepaidItems)}).`,
  });

  faqs.push({
    question: `How much cash do I need to close on a home in ${location.name}?`,
    answer: `With 20% down on a ${fmt(data.medianHomePrice)} home in ${inPlace}, plan for about ${fmt(
      data.cashToClose
    )} total: ${fmt(data.downPayment)} down payment plus ${fmt(
      data.totalClosingCosts
    )} in closing costs. With 10% down, total cash at closing drops to roughly ${fmt(
      data.cashToCloseAt10Down
    )}, but you\u2019ll pay PMI until you reach 20% equity.`,
  });

  if (location.transferTaxRate > 0) {
    faqs.push({
      question: `What is the real estate transfer tax in ${location.name}?`,
      answer: `${inPlace} has a transfer tax of about ${location.transferTaxRate}% of the sale price — roughly ${fmt(
        data.transferTaxAmount
      )} on a median-priced home. Who pays it (buyer, seller, or split) varies by local custom and is negotiable in the purchase contract.`,
    });
  } else {
    faqs.push({
      question: `Does ${location.name} have a real estate transfer tax?`,
      answer: `No. ${inPlace} does not charge a real estate transfer tax, which removes a cost that runs 0.1%\u20132% of the sale price in many other markets. Recording fees still apply, but they are typically only $100\u2013$250.`,
    });
  }

  faqs.push({
    question: `How do property taxes affect closing costs in ${location.name}?`,
    answer: `The effective property tax rate in ${inPlace} is about ${location.propertyTaxRate}% per year — roughly ${fmt(
      data.monthlyPropertyTax
    )}/month on a median-priced home. At closing, lenders typically collect several months of taxes up front (prepaids plus escrow deposits), so ${
      location.propertyTaxRate >= 1.2
        ? 'the above-average tax rate here noticeably increases your cash due at closing'
        : 'the below-average tax rate here keeps prepaid deposits relatively modest'
    }.`,
  });

  faqs.push({
    question: `Who handles the closing in ${location.name}?`,
    answer: location.attorneyState
      ? `${location.stateName} closings are customarily (or legally required to be) handled by a real estate attorney. Attorney fees typically run $500\u2013$1,500 and replace the escrow fees common in title-company states.`
      : `In ${location.stateName}, closings are typically handled by a title or escrow company rather than an attorney. You can hire an attorney to review documents if you want, but it isn\u2019t required.`,
  });

  return faqs;
}
