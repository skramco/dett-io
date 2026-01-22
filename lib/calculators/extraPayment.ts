import type { ExtraPaymentInputs, CalculatorResult } from './types';

export function calculateExtraPayment(inputs: ExtraPaymentInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    extraMonthlyPayment = 0,
    extraAnnualPayment = 0,
    investmentReturn = 7,
  } = inputs;

  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const regularMonthlyPayment =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  let balance = loanAmount;
  let totalInterestRegular = 0;
  let monthsRegular = 0;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = regularMonthlyPayment - interestPayment;
    totalInterestRegular += interestPayment;
    balance -= principalPayment;
    monthsRegular++;
    if (balance <= 0) break;
  }

  balance = loanAmount;
  let totalInterestWithExtra = 0;
  let monthsWithExtra = 0;
  const totalExtraMonthly = extraMonthlyPayment;

  for (let month = 1; month <= numberOfPayments * 2; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = regularMonthlyPayment - interestPayment;
    
    principalPayment += totalExtraMonthly;
    
    if (month % 12 === 0) {
      principalPayment += extraAnnualPayment;
    }

    totalInterestWithExtra += interestPayment;
    balance -= principalPayment;
    monthsWithExtra++;
    
    if (balance <= 0) break;
  }

  const interestSaved = totalInterestRegular - totalInterestWithExtra;
  const monthsSaved = monthsRegular - monthsWithExtra;
  const yearsSaved = monthsSaved / 12;

  const totalExtraPaid = (extraMonthlyPayment * monthsWithExtra) + (extraAnnualPayment * Math.floor(monthsWithExtra / 12));

  const investmentMonthlyRate = investmentReturn / 100 / 12;
  let investmentValue = 0;
  for (let month = 1; month <= monthsRegular; month++) {
    let monthlyInvestment = extraMonthlyPayment;
    if (month % 12 === 0) {
      monthlyInvestment += extraAnnualPayment;
    }
    investmentValue = (investmentValue + monthlyInvestment) * (1 + investmentMonthlyRate);
  }

  const insights: string[] = [];

  if (interestSaved > 0) {
    insights.push(
      `Making extra payments saves you $${interestSaved.toFixed(0)} in interest and pays off your loan ${yearsSaved.toFixed(1)} years earlier.`
    );
  }

  const returnOnExtraPayments = (interestSaved / totalExtraPaid) * 100;
  insights.push(
    `Your effective return on extra payments is ${returnOnExtraPayments.toFixed(1)}% (the interest rate you're avoiding).`
  );

  if (investmentValue > interestSaved) {
    const difference = investmentValue - interestSaved;
    insights.push(
      `If you invested the extra payment at ${investmentReturn}% instead, you'd have $${investmentValue.toFixed(0)} - that's $${difference.toFixed(0)} more than the interest you'd save.`
    );
  } else {
    const difference = interestSaved - investmentValue;
    insights.push(
      `Paying down your mortgage saves you $${difference.toFixed(0)} more than investing at ${investmentReturn}% would earn.`
    );
  }

  if (interestRate < investmentReturn) {
    insights.push(
      `Your mortgage rate (${interestRate}%) is lower than typical investment returns (${investmentReturn}%). Consider investing extra cash instead.`
    );
  } else {
    insights.push(
      `Your mortgage rate (${interestRate}%) is higher than typical investment returns (${investmentReturn}%). Paying down debt is likely the better choice.`
    );
  }

  const chartData = [];
  let regularBalance = loanAmount;
  let extraBalance = loanAmount;
  
  for (let year = 0; year <= loanTerm; year++) {
    for (let month = 1; month <= 12; month++) {
      if (regularBalance > 0) {
        const interest = regularBalance * monthlyRate;
        const principal = regularMonthlyPayment - interest;
        regularBalance -= principal;
      }
      
      if (extraBalance > 0) {
        const interest = extraBalance * monthlyRate;
        let principal = regularMonthlyPayment - interest + extraMonthlyPayment;
        if (month === 12) principal += extraAnnualPayment;
        extraBalance -= principal;
      }
    }
    
    chartData.push({
      year,
      regularLoan: Math.max(0, parseFloat(regularBalance.toFixed(0))),
      withExtraPayments: Math.max(0, parseFloat(extraBalance.toFixed(0))),
    });
    
    if (regularBalance <= 0 && extraBalance <= 0) break;
  }

  return {
    summary: `Extra payments of $${(extraMonthlyPayment + extraAnnualPayment / 12).toFixed(2)}/month save you $${interestSaved.toFixed(0)} in interest and ${yearsSaved.toFixed(1)} years of payments.`,
    details: {
      regularMonthlyPayment: parseFloat(regularMonthlyPayment.toFixed(2)),
      extraMonthlyPayment: parseFloat(extraMonthlyPayment.toFixed(2)),
      extraAnnualPayment: parseFloat(extraAnnualPayment.toFixed(2)),
      totalExtraPaid: parseFloat(totalExtraPaid.toFixed(2)),
      interestSaved: parseFloat(interestSaved.toFixed(2)),
      monthsSaved,
      yearsSaved: parseFloat(yearsSaved.toFixed(2)),
      monthsRegular,
      monthsWithExtra,
      totalInterestRegular: parseFloat(totalInterestRegular.toFixed(2)),
      totalInterestWithExtra: parseFloat(totalInterestWithExtra.toFixed(2)),
      investmentValue: parseFloat(investmentValue.toFixed(2)),
      investmentReturn,
    },
    chartData,
    insights,
  };
}
