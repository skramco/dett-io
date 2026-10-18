import { formatCurrency } from '../format';
import type { DownPaymentInputs, CalculatorResult } from './types';
import { calculateClosingCosts } from './closingCosts';
import {
  conventionalPmiRatePercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
  monthsToReachLtv,
} from './mortgageMath';

/** Same default state as the Closing Costs calculator, so cash-to-close matches. */
const CLOSING_COST_DEFAULT_STATE = 'CA';

export function calculateDownPayment(inputs: DownPaymentInputs): CalculatorResult {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsuranceAnnual,
    creditScore,
  } = inputs;

  const downPaymentOptions = [3, 5, 10, 15, 20];
  const numPayments = loanTerm * 12;

  const results = downPaymentOptions.map(percent => {
    const downPaymentAmount = homePrice * (percent / 100);
    const loanAmount = homePrice - downPaymentAmount;
    const ltv = ltvPercent(loanAmount, homePrice);
    const needsPMI = percent < 20;

    // PMI rate varies by LTV band and credit score (shared grid with the PMI calculator)
    const pmiRate = needsPMI ? conventionalPmiRatePercent(ltv, creditScore) : 0;

    const monthlyPI = monthlyPayment(loanAmount, interestRate, numPayments);
    const monthlyPMI = needsPMI ? monthlyPmiAmount(loanAmount, pmiRate) : 0;
    const monthlyTax = homePrice * propertyTaxRate / 100 / 12;
    const monthlyInsurance = homeInsuranceAnnual / 12;
    const totalMonthly = monthlyPI + monthlyPMI + monthlyTax + monthlyInsurance;

    let pmiMonths = 0;
    let pmiTotalCost = 0;
    if (needsPMI) {
      pmiMonths = monthsToReachLtv(loanAmount, homePrice, interestRate, numPayments, 78);
      pmiTotalCost = monthlyPMI * pmiMonths;
    }

    const totalPaid = monthlyPI * numPayments;
    const totalInterest = totalPaid - loanAmount;

    // Cash to close: down payment + the same line-item engine as the Closing Costs page.
    const closingCostResult = calculateClosingCosts({
      homePrice,
      downPaymentPercent: percent,
      interestRate,
      loanTerm,
      state: CLOSING_COST_DEFAULT_STATE,
      isNewConstruction: false,
      propertyTaxRate,
      prepaidInsurance: homeInsuranceAnnual,
    });
    const closingCosts = closingCostResult.details.totalClosingCosts as number;
    const cashToClose = downPaymentAmount + closingCosts;

    return {
      percent,
      downPaymentAmount,
      loanAmount,
      pmiRate,
      monthlyPI: Math.round(monthlyPI),
      monthlyPMI: Math.round(monthlyPMI),
      monthlyTax: Math.round(monthlyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      totalMonthly: Math.round(totalMonthly),
      pmiMonths,
      pmiTotalCost: Math.round(pmiTotalCost),
      totalInterest: Math.round(totalInterest),
      closingCosts: Math.round(closingCosts),
      cashToClose: Math.round(cashToClose),
      needsPMI,
    };
  });

  const insights: string[] = [];

  const option3 = results.find(r => r.percent === 3)!;
  const option15 = results.find(r => r.percent === 15)!;
  const option20 = results.find(r => r.percent === 20)!;

  const option3PmiYears = option3.pmiMonths / 12;

  insights.push(
    `3% down: Lowest upfront cost (${formatCurrency(option3.cashToClose)}), but you'll pay ${formatCurrency(option3.pmiTotalCost)} in PMI over about ${option3PmiYears.toFixed(1)} years (${option3.pmiMonths} months) until your balance reaches 78% of the home value`
  );

  insights.push(
    `20% down: No PMI, saves ${formatCurrency((option3.totalMonthly - option20.totalMonthly))}/month, but requires ${formatCurrency(option20.cashToClose)} upfront`
  );

  if (option3.pmiRate > option15.pmiRate) {
    insights.push(
      `PMI gets cheaper as you put more down: at a ${creditScore} credit score, the annual rate is ${option3.pmiRate.toFixed(2)}% with 3% down vs ${option15.pmiRate.toFixed(2)}% with 15% down (${formatCurrency(option3.monthlyPMI)}/mo vs ${formatCurrency(option15.monthlyPMI)}/mo)`
    );
  }

  const pmiSavings = option3.pmiTotalCost;
  const extraDownPayment = option20.downPaymentAmount - option3.downPaymentAmount;
  const breakEvenYears = pmiSavings > 0 ? (extraDownPayment / pmiSavings) * option3PmiYears : Infinity;

  if (breakEvenYears < option3PmiYears) {
    insights.push(
      `💡 If you can afford 20% down, you'll break even on the extra cash in ${breakEvenYears.toFixed(1)} years through PMI savings`
    );
  } else {
    insights.push(
      `💡 PMI adds up, but putting down less lets you keep cash for emergencies or investments`
    );
  }

  const closingCostPercents = results.map(r => (r.closingCosts / homePrice) * 100);
  insights.push(
    `Cash to close includes itemized closing costs and prepaids (${Math.min(...closingCostPercents).toFixed(1)}-${Math.max(...closingCostPercents).toFixed(1)}% of the home price), estimated with the same engine and California defaults as our Closing Costs calculator`
  );

  const summary = `Comparing down payments from 3% to 20% on a ${formatCurrency(homePrice)} home. PMI adds ${formatCurrency(option3.pmiTotalCost)} total with 3% down.`;

  // Details for the user's selected down payment (used by "Show Me the Math")
  const selectedDownPayment = homePrice * (downPaymentPercent / 100);
  const selectedLoanAmount = homePrice - selectedDownPayment;
  const selectedMonthlyPI = monthlyPayment(selectedLoanAmount, interestRate, numPayments);

  return {
    summary,
    details: {
      homePrice,
      downPaymentPercent,
      downPaymentAmount: Math.round(selectedDownPayment),
      loanAmount: Math.round(selectedLoanAmount),
      monthlyPayment: Math.round(selectedMonthlyPI),
      option3Down: option3.downPaymentAmount,
      option3Payment: option3.totalMonthly,
      option3PMI: option3.pmiTotalCost,
      option3PmiRate: option3.pmiRate,
      option3PmiMonths: option3.pmiMonths,
      option15PmiRate: option15.pmiRate,
      option20Down: option20.downPaymentAmount,
      option20Payment: option20.totalMonthly,
      option20CashToClose: option20.cashToClose,
      option20ClosingCosts: option20.closingCosts,
      pmiSavings,
      creditScore,
    },
    chartData: results.map(r => ({
      downPayment: `${r.percent}%`,
      cashToClose: r.cashToClose,
      closingCosts: r.closingCosts,
      monthlyPayment: r.totalMonthly,
      pmiCost: r.pmiTotalCost,
      pmiRate: r.pmiRate,
      pmiMonths: r.pmiMonths,
    })),
    insights,
  };
}
