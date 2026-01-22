import type { DownPaymentInputs, CalculatorResult } from './types';

export function calculateDownPayment(inputs: DownPaymentInputs): CalculatorResult {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsuranceAnnual,
    pmiRate,
  } = inputs;

  const downPaymentOptions = [3, 5, 10, 15, 20];
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  const results = downPaymentOptions.map(percent => {
    const downPaymentAmount = homePrice * (percent / 100);
    const loanAmount = homePrice - downPaymentAmount;
    const needsPMI = percent < 20;
    
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
    
    // Cash to close (down payment + typical closing costs)
    const closingCosts = homePrice * 0.03; // Estimate 3%
    const cashToClose = downPaymentAmount + closingCosts;
    
    return {
      percent,
      downPaymentAmount,
      loanAmount,
      monthlyPI: Math.round(monthlyPI),
      monthlyPMI: Math.round(monthlyPMI),
      monthlyTax: Math.round(monthlyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      totalMonthly: Math.round(totalMonthly),
      pmiMonths,
      pmiTotalCost: Math.round(pmiTotalCost),
      totalInterest: Math.round(totalInterest),
      cashToClose: Math.round(cashToClose),
      needsPMI,
    };
  });

  const insights: string[] = [];
  
  const option3 = results.find(r => r.percent === 3)!;
  const option20 = results.find(r => r.percent === 20)!;
  
  insights.push(
    `3% down: Lowest upfront cost ($${option3.cashToClose.toLocaleString()}), but you'll pay $${option3.pmiTotalCost.toLocaleString()} in PMI over ${Math.round(option3.pmiMonths / 12)} years`
  );
  
  insights.push(
    `20% down: No PMI, saves $${(option3.totalMonthly - option20.totalMonthly).toLocaleString()}/month, but requires $${option20.cashToClose.toLocaleString()} upfront`
  );
  
  const pmiSavings = option3.pmiTotalCost;
  const extraDownPayment = option20.downPaymentAmount - option3.downPaymentAmount;
  const breakEvenYears = (extraDownPayment / pmiSavings) * (option3.pmiMonths / 12);
  
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

  const summary = `Comparing down payments from 3% to 20% on a $${homePrice.toLocaleString()} home. PMI adds $${option3.pmiTotalCost.toLocaleString()} total with 3% down.`;

  return {
    summary,
    details: {
      homePrice,
      option3Down: option3.downPaymentAmount,
      option3Payment: option3.totalMonthly,
      option3PMI: option3.pmiTotalCost,
      option20Down: option20.downPaymentAmount,
      option20Payment: option20.totalMonthly,
      pmiSavings,
    },
    chartData: results.map(r => ({
      downPayment: `${r.percent}%`,
      cashToClose: r.cashToClose,
      monthlyPayment: r.totalMonthly,
      pmiCost: r.pmiTotalCost,
    })),
    insights,
  };
}
