import type { CalculatorResult } from './types';
import { getStateClosingProfile } from './stateClosingData';

export interface ClosingCostInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  state: string;
  isNewConstruction: boolean;
  // Optional overrides
  originationPercent?: number;
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
  taxEscrowMonths?: number;
  prepaidInterestDays?: number;
  sellerCreditPercent?: number;
}

interface CostLineItem {
  name: string;
  category: 'lender' | 'third-party' | 'government' | 'prepaid' | 'outside-closing';
  amount: number;
  isEstimate: boolean;
}

export function calculateClosingCosts(inputs: ClosingCostInputs): CalculatorResult & { lineItems: CostLineItem[] } {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    state,
    isNewConstruction,
    originationPercent = 1,
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
    taxEscrowMonths = 3,
    prepaidInterestDays = 15,
    sellerCreditPercent = 0,
  } = inputs;

  const stateProfile = getStateClosingProfile(state);

  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const downPayment = homePrice * (downPaymentPercent / 100);

  // Calculate estimated costs
  const calcOriginationFee = originationFee ?? Math.round(loanAmount * (originationPercent / 100));
  const calcTitleInsurance = titleInsurance ?? Math.round(loanAmount * 0.005);
  // State-driven customs: attorney fee only in states where a closing attorney
  // is customary; transfer tax uses the typical buyer-side rate for the state.
  const calcAttorneyFee = attorneyFee ?? stateProfile.attorneyFee;
  const calcTransferTax = transferTax ?? Math.round(homePrice * stateProfile.transferTaxRate);

  // Prepaid items
  const dailyInterest = (loanAmount * (interestRate / 100)) / 365;
  const prepaidInterest = Math.round(dailyInterest * prepaidInterestDays);
  const monthlyTax = Math.round((homePrice * stateProfile.propertyTaxRate) / 12);
  // Property taxes are collected once at closing as an escrow deposit. Any tax
  // actually due before closing is handled via proration credits, not an extra
  // prepaid line — charging both would double-count.
  const escrowTaxes = monthlyTax * taxEscrowMonths;
  const escrowInsurance = Math.round(prepaidInsurance / 12) * 3; // 3 months escrow cushion

  // PMI at closing (if applicable)
  const needsPMI = downPaymentPercent < 20;
  const pmiAtClosing = needsPMI ? Math.round(loanAmount * 0.005 / 12 * 2) : 0; // 2 months upfront

  const originationLabel = originationFee !== undefined
    ? 'Loan Origination Fee'
    : `Loan Origination Fee (${originationPercent}% assumed)`;

  // Build line items
  const lineItems: CostLineItem[] = [
    // Lender fees
    { name: originationLabel, category: 'lender', amount: calcOriginationFee, isEstimate: originationFee === undefined },
    { name: 'Credit Report', category: 'lender', amount: creditReport, isEstimate: false },
    { name: 'Flood Certification', category: 'lender', amount: floodCert, isEstimate: false },
    { name: 'Underwriting Fee', category: 'lender', amount: 750, isEstimate: true },
    { name: 'Processing Fee', category: 'lender', amount: 500, isEstimate: true },

    // Third-party fees
    { name: 'Appraisal', category: 'third-party', amount: appraisalFee, isEstimate: false },
    { name: 'Title Insurance', category: 'third-party', amount: calcTitleInsurance, isEstimate: !titleInsurance },
    { name: 'Title Search', category: 'third-party', amount: titleSearch, isEstimate: false },
    { name: `Attorney Fee (${state} custom)`, category: 'third-party', amount: calcAttorneyFee, isEstimate: attorneyFee === undefined },
    { name: 'Survey', category: 'third-party', amount: surveyFee, isEstimate: true },

    // Government fees
    { name: 'Recording Fee', category: 'government', amount: recordingFee, isEstimate: false },
    { name: `Transfer Tax (${state} est.)`, category: 'government', amount: calcTransferTax, isEstimate: transferTax === undefined },

    // Prepaid items
    { name: `Prepaid Interest (${prepaidInterestDays} days)`, category: 'prepaid', amount: prepaidInterest, isEstimate: true },
    { name: 'Prepaid Homeowners Insurance (1 year)', category: 'prepaid', amount: prepaidInsurance, isEstimate: false },
    { name: 'Escrow - Insurance (3 months)', category: 'prepaid', amount: escrowInsurance, isEstimate: true },
    { name: `Escrow - Property Taxes (${taxEscrowMonths} months)`, category: 'prepaid', amount: escrowTaxes, isEstimate: true },

    // Paid outside closing — typically paid directly to the provider at the time
    // of service, so excluded from cash due at the closing table.
    { name: 'Home Inspection', category: 'outside-closing', amount: isNewConstruction ? 0 : inspectionFee, isEstimate: true },
  ];

  if (needsPMI) {
    lineItems.push({ name: 'PMI (2 months upfront)', category: 'prepaid', amount: pmiAtClosing, isEstimate: true });
  }

  // Filter out zero amounts
  const activeItems = lineItems.filter(item => item.amount > 0);

  // Category totals
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

  // Chart data (cash due at closing only — outside-closing items excluded)
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

  if (stateProfile.attorneyCustomary) {
    insights.push(
      `${stateProfile.name} closings customarily involve a closing attorney, so an estimated attorney fee of $${calcAttorneyFee.toLocaleString()} is included. Transfer tax is estimated at typical ${state} rates — actual rates vary by county and city.`
    );
  } else {
    insights.push(
      `In ${stateProfile.name}, closings are typically handled by an escrow or title company, so no attorney fee is included. Transfer tax is estimated at typical ${state} rates — actual rates vary by county and city, and in some areas the seller customarily pays it.`
    );
  }

  if (outsideClosingTotal > 0) {
    insights.push(
      `Costs paid outside closing (like the $${outsideClosingTotal.toLocaleString()} home inspection) are paid directly to the provider before closing day, so they're not included in your cash-to-close total.`
    );
  }

  const prepaidPercent = totalClosingCosts > 0 ? (prepaidItems / totalClosingCosts) * 100 : 0;
  insights.push(
    `Prepaid items (taxes, insurance, interest) make up ${prepaidPercent.toFixed(0)}% of your closing costs. These aren't fees — they're advance payments you'd owe anyway.`
  );

  if (calcOriginationFee > 0) {
    insights.push(
      `The origination fee ($${calcOriginationFee.toLocaleString()}${originationFee === undefined ? `, assumed at ${originationPercent}% of the loan` : ''}) is often negotiable. Some lenders offer no-origination-fee loans in exchange for a slightly higher rate.`
    );
  }

  return {
    summary: `Estimated closing costs of $${totalClosingCosts.toLocaleString()} (${closingCostPercent.toFixed(1)}% of home price). Total cash needed: $${totalCashNeeded.toLocaleString()}.`,
    details: {
      homePrice,
      loanAmount: Math.round(loanAmount),
      downPayment: Math.round(downPayment),
      downPaymentPercent,
      state,
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
    },
    chartData,
    insights,
    lineItems: activeItems,
  };
}
