import type { CalculatorResult } from './types';

export interface StateClosingCustoms {
  name: string;
  /** True in "attorney closing" states where an attorney customarily (or legally) conducts the closing. */
  attorneyCustomary: boolean;
  /** Typical attorney fee when customary; 0 when buyers usually close without one. */
  attorneyFee: number;
  /** Approximate combined state + typical local transfer/recordation tax, as % of sale price. */
  transferTaxRate: number;
  /** State-specific caveat shown alongside the estimate. */
  note?: string;
}

/**
 * State-level closing customs. Transfer tax rates are approximate statewide
 * figures (state + typical local); actual rates vary by county/city, and who
 * pays (buyer, seller, or split) is a matter of local custom and negotiation.
 */
export const STATE_CLOSING_CUSTOMS: Record<string, StateClosingCustoms> = {
  AL: { name: 'Alabama', attorneyCustomary: true, attorneyFee: 900, transferTaxRate: 0.1 },
  AK: { name: 'Alaska', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  AZ: { name: 'Arizona', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0, note: 'Arizona charges only a flat $2 recording transfer fee.' },
  AR: { name: 'Arkansas', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.33 },
  CA: { name: 'California', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.11, note: 'California closings are handled by escrow companies, not attorneys. Documentary transfer tax is $1.10 per $1,000 at the county level; some cities add more.' },
  CO: { name: 'Colorado', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.02 },
  CT: { name: 'Connecticut', attorneyCustomary: true, attorneyFee: 1100, transferTaxRate: 1.25, note: 'Connecticut conveyance tax is customarily paid by the seller.' },
  DE: { name: 'Delaware', attorneyCustomary: true, attorneyFee: 1000, transferTaxRate: 4, note: 'Delaware\u2019s 4% transfer tax is typically split evenly between buyer and seller.' },
  DC: { name: 'District of Columbia', attorneyCustomary: true, attorneyFee: 1100, transferTaxRate: 1.1, note: 'DC recordation tax rises to 1.45% above $400,000; the seller pays a separate transfer tax.' },
  FL: { name: 'Florida', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.7, note: 'Florida documentary stamp tax is customarily paid by the seller in most counties.' },
  GA: { name: 'Georgia', attorneyCustomary: true, attorneyFee: 950, transferTaxRate: 0.1 },
  HI: { name: 'Hawaii', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.15, note: 'Hawaii conveyance tax is tiered (0.1%\u20131.25%) based on price and owner-occupancy.' },
  ID: { name: 'Idaho', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  IL: { name: 'Illinois', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.15, note: 'Illinois attorneys are customary in the Chicago area; Chicago adds a significant city transfer tax.' },
  IN: { name: 'Indiana', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  IA: { name: 'Iowa', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.16 },
  KS: { name: 'Kansas', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  KY: { name: 'Kentucky', attorneyCustomary: true, attorneyFee: 900, transferTaxRate: 0.1 },
  LA: { name: 'Louisiana', attorneyCustomary: true, attorneyFee: 1000, transferTaxRate: 0, note: 'Louisiana closings are conducted by a notary attorney; there is no state transfer tax (New Orleans charges a flat fee).' },
  ME: { name: 'Maine', attorneyCustomary: true, attorneyFee: 900, transferTaxRate: 0.44, note: 'Maine transfer tax is split evenly between buyer and seller.' },
  MD: { name: 'Maryland', attorneyCustomary: true, attorneyFee: 1000, transferTaxRate: 1, note: 'Maryland state + county transfer and recordation taxes vary widely by county and are often split.' },
  MA: { name: 'Massachusetts', attorneyCustomary: true, attorneyFee: 1200, transferTaxRate: 0.456, note: 'Massachusetts deed excise tax is customarily paid by the seller.' },
  MI: { name: 'Michigan', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.86, note: 'Michigan transfer tax is customarily paid by the seller.' },
  MN: { name: 'Minnesota', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.33 },
  MS: { name: 'Mississippi', attorneyCustomary: true, attorneyFee: 900, transferTaxRate: 0 },
  MO: { name: 'Missouri', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  MT: { name: 'Montana', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  NE: { name: 'Nebraska', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.225 },
  NV: { name: 'Nevada', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.51 },
  NH: { name: 'New Hampshire', attorneyCustomary: true, attorneyFee: 950, transferTaxRate: 1.5, note: 'New Hampshire\u2019s 1.5% transfer tax is split evenly between buyer and seller.' },
  NJ: { name: 'New Jersey', attorneyCustomary: true, attorneyFee: 1200, transferTaxRate: 1, note: 'New Jersey\u2019s realty transfer fee is paid by the seller; buyers pay a 1% \u201cmansion tax\u201d only above $1M.' },
  NM: { name: 'New Mexico', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  NY: { name: 'New York', attorneyCustomary: true, attorneyFee: 1500, transferTaxRate: 0.4, note: 'New York transfer tax is customarily paid by the seller; buyers pay a 1% mansion tax above $1M, and NYC adds its own taxes.' },
  NC: { name: 'North Carolina', attorneyCustomary: true, attorneyFee: 900, transferTaxRate: 0.2, note: 'North Carolina excise tax is customarily paid by the seller.' },
  ND: { name: 'North Dakota', attorneyCustomary: true, attorneyFee: 850, transferTaxRate: 0 },
  OH: { name: 'Ohio', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.3, note: 'Ohio conveyance fee (0.1% state + up to 0.3% county) is customarily paid by the seller.' },
  OK: { name: 'Oklahoma', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.15 },
  OR: { name: 'Oregon', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0, note: 'Oregon has no transfer tax except in Washington County (0.1%).' },
  PA: { name: 'Pennsylvania', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 2, note: 'Pennsylvania transfer tax (1% state + ~1% local) is typically split evenly between buyer and seller.' },
  RI: { name: 'Rhode Island', attorneyCustomary: true, attorneyFee: 950, transferTaxRate: 0.46, note: 'Rhode Island conveyance tax is customarily paid by the seller.' },
  SC: { name: 'South Carolina', attorneyCustomary: true, attorneyFee: 950, transferTaxRate: 0.37, note: 'South Carolina deed recording fee is customarily paid by the seller.' },
  SD: { name: 'South Dakota', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.1 },
  TN: { name: 'Tennessee', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.37, note: 'Tennessee recordation tax is customarily paid by the buyer.' },
  TX: { name: 'Texas', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  UT: { name: 'Utah', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
  VT: { name: 'Vermont', attorneyCustomary: true, attorneyFee: 950, transferTaxRate: 1.25, note: 'Vermont property transfer tax (0.5% on the first $100k for a principal residence, 1.45% above) is paid by the buyer.' },
  VA: { name: 'Virginia', attorneyCustomary: true, attorneyFee: 950, transferTaxRate: 0.35, note: 'Virginia buyers pay recordation taxes; sellers pay the grantor tax.' },
  WA: { name: 'Washington', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 1.28, note: 'Washington\u2019s graduated REET (1.1%\u20133%) is customarily paid by the seller.' },
  WV: { name: 'West Virginia', attorneyCustomary: true, attorneyFee: 900, transferTaxRate: 0.44 },
  WI: { name: 'Wisconsin', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0.3, note: 'Wisconsin transfer fee is customarily paid by the seller.' },
  WY: { name: 'Wyoming', attorneyCustomary: false, attorneyFee: 0, transferTaxRate: 0 },
};

export const STATE_OPTIONS = Object.entries(STATE_CLOSING_CUSTOMS).map(([code, data]) => ({
  value: code,
  label: data.name,
}));

export interface ClosingCostInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  state: string;
  isNewConstruction: boolean;
  /** Origination fee as % of loan amount. Default 1% — an assumption, editable. */
  originationFeePercent?: number;
  /** Annual property tax rate as % of home price. Default 1.1% (rough national average). */
  propertyTaxRate?: number;
  /** Months of property tax collected at closing to fund the escrow account. Default 3. */
  taxEscrowMonths?: number;
  /** Months of homeowners insurance collected at closing to fund escrow. Default 3. */
  insuranceEscrowMonths?: number;
  // Optional overrides
  originationFee?: number;
  appraisalFee?: number;
  inspectionFee?: number;
  titleInsurance?: number;
  titleSearch?: number;
  attorneyFee?: number;
  recordingFee?: number;
  transferTax?: number;
  surveyFee?: number;
  creditReport?: number;
  floodCert?: number;
  prepaidInsurance?: number;
  prepaidInterestDays?: number;
  sellerCreditPercent?: number;
}

export type CostCategory = 'lender' | 'third-party' | 'government' | 'prepaid' | 'outside-closing';

interface CostLineItem {
  name: string;
  category: CostCategory;
  amount: number;
  isEstimate: boolean;
  note?: string;
}

export function calculateClosingCosts(inputs: ClosingCostInputs): CalculatorResult & { lineItems: CostLineItem[] } {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    state,
    isNewConstruction,
    originationFeePercent = 1,
    propertyTaxRate = 1.1,
    taxEscrowMonths = 3,
    insuranceEscrowMonths = 3,
    originationFee,
    appraisalFee = 550,
    inspectionFee = 400,
    titleInsurance,
    titleSearch = 300,
    attorneyFee,
    recordingFee = 125,
    transferTax,
    surveyFee = 400,
    creditReport = 50,
    floodCert = 20,
    prepaidInsurance = 1800,
    prepaidInterestDays = 15,
    sellerCreditPercent = 0,
  } = inputs;

  const stateCustoms = STATE_CLOSING_CUSTOMS[state] ?? STATE_CLOSING_CUSTOMS.CA;

  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const downPayment = homePrice * (downPaymentPercent / 100);

  // Lender / third-party / government estimates
  const calcOriginationFee = originationFee ?? Math.round(loanAmount * (originationFeePercent / 100));
  const calcTitleInsurance = titleInsurance ?? Math.round(loanAmount * 0.005);
  // State-driven: attorney fee (0 in non-attorney states) and transfer tax.
  const calcAttorneyFee = attorneyFee ?? stateCustoms.attorneyFee;
  const calcTransferTax = transferTax ?? Math.round(homePrice * (stateCustoms.transferTaxRate / 100));

  // Prepaid + escrow items. Property tax is collected ONCE at closing — as an
  // escrow prefund — not as both a "prepaid" lump and a separate escrow deposit.
  const dailyInterest = (loanAmount * (interestRate / 100)) / 365;
  const prepaidInterest = Math.round(dailyInterest * prepaidInterestDays);
  const monthlyTax = Math.round((homePrice * (propertyTaxRate / 100)) / 12);
  const escrowTaxes = monthlyTax * taxEscrowMonths;
  const escrowInsurance = Math.round(prepaidInsurance / 12) * insuranceEscrowMonths;

  // PMI at closing (if applicable)
  const needsPMI = downPaymentPercent < 20;
  const pmiAtClosing = needsPMI ? Math.round(loanAmount * 0.005 / 12 * 2) : 0; // 2 months upfront

  const originationLabel = originationFee !== undefined
    ? 'Loan Origination Fee'
    : `Loan Origination Fee (${originationFeePercent}% assumed)`;

  // Build line items
  const lineItems: CostLineItem[] = [
    // Lender fees
    { name: originationLabel, category: 'lender', amount: calcOriginationFee, isEstimate: originationFee === undefined, note: 'Assumption — varies by lender (0%–1% is common) and is often negotiable.' },
    { name: 'Credit Report', category: 'lender', amount: creditReport, isEstimate: false },
    { name: 'Flood Certification', category: 'lender', amount: floodCert, isEstimate: false },
    { name: 'Underwriting Fee', category: 'lender', amount: 750, isEstimate: true },
    { name: 'Processing Fee', category: 'lender', amount: 500, isEstimate: true },

    // Third-party fees
    { name: 'Appraisal', category: 'third-party', amount: appraisalFee, isEstimate: false },
    { name: 'Title Insurance', category: 'third-party', amount: calcTitleInsurance, isEstimate: !titleInsurance },
    { name: 'Title Search', category: 'third-party', amount: titleSearch, isEstimate: false },
    { name: `Attorney Fee (${stateCustoms.name})`, category: 'third-party', amount: calcAttorneyFee, isEstimate: attorneyFee === undefined, note: stateCustoms.attorneyCustomary ? `${stateCustoms.name} is an attorney-closing state.` : undefined },
    { name: 'Survey (if required)', category: 'third-party', amount: surveyFee, isEstimate: true, note: 'Often optional — many lenders and title companies don\u2019t require a new survey.' },

    // Government fees
    { name: 'Recording Fee', category: 'government', amount: recordingFee, isEstimate: false },
    { name: `Transfer Tax (${stateCustoms.name} est.)`, category: 'government', amount: calcTransferTax, isEstimate: transferTax === undefined, note: stateCustoms.note ?? 'Actual rate varies by county/city, and payment is often split with or covered by the seller.' },

    // Prepaid & escrow items — property tax appears ONCE (escrow prefund only)
    { name: `Prepaid Interest (${prepaidInterestDays} days)`, category: 'prepaid', amount: prepaidInterest, isEstimate: true },
    { name: 'Prepaid Homeowners Insurance (1 year)', category: 'prepaid', amount: prepaidInsurance, isEstimate: false },
    { name: `Escrow Prefund \u2014 Property Taxes (${taxEscrowMonths} months)`, category: 'prepaid', amount: escrowTaxes, isEstimate: true, note: 'Collected once at closing to open your escrow account — not charged again as a separate prepaid tax.' },
    { name: `Escrow Prefund \u2014 Insurance (${insuranceEscrowMonths} months)`, category: 'prepaid', amount: escrowInsurance, isEstimate: true },
  ];

  if (needsPMI) {
    lineItems.push({ name: 'PMI (2 months upfront)', category: 'prepaid', amount: pmiAtClosing, isEstimate: true });
  }

  // Items you pay during the purchase process but NOT at the closing table —
  // excluded from closing costs and cash-to-close.
  if (!isNewConstruction && inspectionFee > 0) {
    lineItems.push({
      name: 'Home Inspection',
      category: 'outside-closing',
      amount: inspectionFee,
      isEstimate: false,
      note: 'Typically paid directly to the inspector before closing — not part of cash to close.',
    });
  }

  // Filter out zero amounts
  const activeItems = lineItems.filter(item => item.amount > 0);

  // Category totals (outside-closing items excluded from closing totals)
  const lenderFees = activeItems.filter(i => i.category === 'lender').reduce((sum, i) => sum + i.amount, 0);
  const thirdPartyFees = activeItems.filter(i => i.category === 'third-party').reduce((sum, i) => sum + i.amount, 0);
  const governmentFees = activeItems.filter(i => i.category === 'government').reduce((sum, i) => sum + i.amount, 0);
  const prepaidItems = activeItems.filter(i => i.category === 'prepaid').reduce((sum, i) => sum + i.amount, 0);
  const outsideClosingTotal = activeItems.filter(i => i.category === 'outside-closing').reduce((sum, i) => sum + i.amount, 0);

  const totalClosingCosts = lenderFees + thirdPartyFees + governmentFees + prepaidItems;
  const sellerCredit = Math.round(homePrice * (sellerCreditPercent / 100));
  const netClosingCosts = Math.max(0, totalClosingCosts - sellerCredit);
  const totalCashNeeded = downPayment + netClosingCosts;
  const closingCostPercent = homePrice > 0 ? (totalClosingCosts / homePrice) * 100 : 0;

  // Chart data
  const chartData: Array<Record<string, number | string>> = [
    { name: 'Lender Fees', value: lenderFees },
    { name: 'Third-Party Fees', value: thirdPartyFees },
    { name: 'Government Fees', value: governmentFees },
    { name: 'Prepaid Items', value: prepaidItems },
  ];

  // Insights
  const insights: string[] = [];

  insights.push(
    `Your estimated closing costs are $${totalClosingCosts.toLocaleString()} (${closingCostPercent.toFixed(1)}% of the home price). The national average is 2-5%.`
  );

  if (sellerCredit > 0) {
    insights.push(
      `With a ${sellerCreditPercent}% seller credit ($${sellerCredit.toLocaleString()}), your net closing costs drop to $${netClosingCosts.toLocaleString()}.`
    );
  }

  insights.push(
    `You'll need $${totalCashNeeded.toLocaleString()} total cash at closing: $${downPayment.toLocaleString()} down payment + $${netClosingCosts.toLocaleString()} closing costs.`
  );

  if (stateCustoms.attorneyCustomary) {
    insights.push(
      `${stateCustoms.name} is an attorney-closing state, so we included an estimated $${calcAttorneyFee.toLocaleString()} attorney fee. Rates vary — get quotes from local real estate attorneys.`
    );
  } else if (calcAttorneyFee === 0) {
    insights.push(
      `In ${stateCustoms.name}, closings are typically handled by a title or escrow company — no attorney fee is required, so we excluded it.`
    );
  }

  if (calcTransferTax > 0) {
    insights.push(
      `Transfer tax is estimated at the ${stateCustoms.name} statewide rate (${stateCustoms.transferTaxRate}%). ${stateCustoms.note ?? 'Actual rates vary by county and city, and the seller often pays part or all of it.'}`
    );
  } else if (transferTax === undefined) {
    insights.push(
      `${stateCustoms.name} has no state transfer tax, so no transfer-tax line was added.${stateCustoms.note ? ` ${stateCustoms.note}` : ''}`
    );
  }

  const prepaidPercent = totalClosingCosts > 0 ? (prepaidItems / totalClosingCosts) * 100 : 0;
  insights.push(
    `Prepaid and escrow items make up ${prepaidPercent.toFixed(0)}% of your closing costs. Property tax is collected once — ${taxEscrowMonths} months into escrow — never double-counted as both prepaid and escrow.`
  );

  if (outsideClosingTotal > 0) {
    insights.push(
      `About $${outsideClosingTotal.toLocaleString()} (home inspection) is paid outside closing — budget for it, but it isn't part of your cash to close.`
    );
  }

  if (originationFee === undefined && calcOriginationFee > 0) {
    insights.push(
      `The origination fee ($${calcOriginationFee.toLocaleString()}) assumes ${originationFeePercent}% of the loan — adjust it to match your lender. It's often negotiable, and some lenders waive it for a slightly higher rate.`
    );
  }

  return {
    summary: `Estimated closing costs of $${totalClosingCosts.toLocaleString()} (${closingCostPercent.toFixed(1)}% of home price). Total cash needed: $${totalCashNeeded.toLocaleString()}.`,
    details: {
      homePrice,
      loanAmount: Math.round(loanAmount),
      downPayment: Math.round(downPayment),
      downPaymentPercent,
      lenderFees,
      thirdPartyFees,
      governmentFees,
      prepaidItems,
      outsideClosingTotal,
      totalClosingCosts,
      sellerCredit,
      netClosingCosts,
      totalCashNeeded: Math.round(totalCashNeeded),
      closingCostPercent: Math.round(closingCostPercent * 10) / 10,
      stateName: stateCustoms.name,
    },
    chartData,
    insights,
    lineItems: activeItems,
  };
}
