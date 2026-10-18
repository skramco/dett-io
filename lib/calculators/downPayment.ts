import type { DownPaymentInputs, CalculatorResult } from './types';
import { getPMIRate } from './pmiRates';
import { calculateClosingCosts } from './closingCosts';

export function calculateDownPayment(inputs: DownPaymentInputs): CalculatorResult {
  const {
    homePrice,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsuranceAnnual,
    creditScore,
  } = inputs;

  const downPaymentOptions = [3, 5, 10, 15, 20];
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  const results = downPaymentOptions.map(percent => {
    const downPaymentAmount = homePrice * (percent / 100);
    const loanAmount = homePrice - downPaymentAmount;
    const ltv = (loanAmount / homePrice) * 100;
    const needsPMI = percent < 20;

    // PMI rate from the shared LTV / credit-score grid (same as the PMI calculator)
    const pmiRate = needsPMI ? getPMIRate(ltv, creditScore) : 0;

    // Calculate monthly PI
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Calculate monthly PMI
    const monthlyPMI = needsPMI ? (loanAmount * pmiRate / 100 / 12) : 0;
    
    // Calculate monthly tax and insurance
    const monthlyTax = homePrice * propertyTaxRate / 100 / 12;
    const monthlyInsurance = homeInsuranceAnnual / 12;
    
    // Total monthly payment
    const totalMonthly = monthlyPI + monthlyPMI + monthlyTax + monthlyInsurance;
    
    // Calculate when PMI drops off (at 78% LTV)
    let pmiMonths = 0;
    let pmiTotalCost = 0;
    if (needsPMI) {
      let balance = loanAmount;
      for (let month = 1; month <= numPayments; month++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPI - interest;
        balance -= principal;
        
        const currentLTV = (balance / homePrice) * 100;
        if (currentLTV <= 78) {
          pmiMonths = month;
          break;
        }
      }
      pmiTotalCost = monthlyPMI * pmiMonths;
    }
    
    // Calculate total interest paid
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = totalPaid - loanAmount;
    
    // Cash to close: down payment + itemized closing-cost estimate,
    // using the same assumptions as the Closing Costs calculator.
    const closingCostsResult = calculateClosingCosts({
      homePrice,
      downPaymentPercent: percent,
      interestRate,
      loanTerm,
      state: '',
      isNewConstruction: false,
      prepaidInsurance: homeInsuranceAnnual,
    });
    const closingCosts = closingCostsResult.details.totalClosingCosts as number;
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
    `3% down: Lowest upfront cost ($${option3.cashToClose.toLocaleString()}), but you'll pay $${option3.pmiTotalCost.toLocaleString()} in PMI over about ${option3PmiYears.toFixed(1)} years (${option3.pmiMonths} months)`
  );

  insights.push(
    `PMI gets cheaper as your down payment grows: at a ${creditScore} credit score the annual rate is ${option3.pmiRate.toFixed(2)}% with 3% down vs ${option15.pmiRate.toFixed(2)}% with 15% down`
  );
  
  insights.push(
    `20% down: No PMI, saves $${(option3.totalMonthly - option20.totalMonthly).toLocaleString()}/month, but requires $${option20.cashToClose.toLocaleString()} upfront`
  );
  
  const pmiSavings = option3.pmiTotalCost;
  const extraDownPayment = option20.downPaymentAmount - option3.downPaymentAmount;
  const breakEvenYears = pmiSavings > 0 ? (extraDownPayment / pmiSavings) * option3PmiYears : Infinity;
  
  if (breakEvenYears < 10) {
    insights.push(
      `💡 If you can afford 20% down, you'll break even on the extra cash in ${breakEvenYears.toFixed(1)} years through PMI savings`
    );
  } else {
    insights.push(
      `💡 PMI adds up, but putting down less lets you keep cash for emergencies or investments`
    );
  }
  
  insights.push(
    `The "right" amount depends on your cash reserves, emergency fund, and other investment opportunities`
  );

  const summary = `Comparing down payments from 3% to 20% on a $${homePrice.toLocaleString()} home. PMI adds $${option3.pmiTotalCost.toLocaleString()} total over about ${option3PmiYears.toFixed(1)} years with 3% down.`;

  return {
    summary,
    details: {
      homePrice,
      option3Down: option3.downPaymentAmount,
      option3Payment: option3.totalMonthly,
      option3PMI: option3.pmiTotalCost,
      option3PmiRate: option3.pmiRate,
      option3PmiMonths: option3.pmiMonths,
      option3PmiYears: Math.round(option3PmiYears * 10) / 10,
      option20Down: option20.downPaymentAmount,
      option20Payment: option20.totalMonthly,
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
