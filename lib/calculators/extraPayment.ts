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

  // Apples-to-apples comparison: both paths spend the same cash each month
  // (regular payment + extras) and are measured at the same horizon — the
  // original payoff date (monthsRegular).
  //
  // Invest path: keep the regular mortgage payment, invest the extras every
  // month until the horizon.
  //
  // Prepay path: send the extras to the mortgage until early payoff, then
  // invest the entire freed-up payment (regular payment + extras) until the
  // horizon.
  //
  // At the horizon both paths own the home outright, so the portfolio values
  // are directly comparable net worth.
  const investmentMonthlyRate = investmentReturn / 100 / 12;

  let investFinalValue = 0;
  let prepayFinalValue = 0;
  for (let month = 1; month <= monthsRegular; month++) {
    const extraThisMonth = extraMonthlyPayment + (month % 12 === 0 ? extraAnnualPayment : 0);

    investFinalValue = investFinalValue * (1 + investmentMonthlyRate) + extraThisMonth;

    prepayFinalValue = prepayFinalValue * (1 + investmentMonthlyRate);
    if (month > monthsWithExtra) {
      prepayFinalValue += regularMonthlyPayment + extraThisMonth;
    }
  }

  const horizonYears = monthsRegular / 12;
  const freedUpPayment = regularMonthlyPayment + extraMonthlyPayment;

  const insights: string[] = [];

  if (interestSaved > 0) {
    insights.push(
      `Making extra payments saves you $${interestSaved.toFixed(0)} in interest and pays off your loan ${yearsSaved.toFixed(1)} years earlier.`
    );
  }

  insights.push(
    `Prepaying earns a guaranteed return equal to your mortgage rate: ${interestRate}%. Every extra dollar avoids ${interestRate}% interest.`
  );

  if (monthsWithExtra < monthsRegular) {
    if (investFinalValue > prepayFinalValue) {
      const difference = investFinalValue - prepayFinalValue;
      insights.push(
        `Both paths cost the same each month. By year ${horizonYears.toFixed(0)}, investing the extras at ${investmentReturn}% grows to $${investFinalValue.toFixed(0)}, vs $${prepayFinalValue.toFixed(0)} if you prepay and then invest the freed-up $${freedUpPayment.toFixed(0)}/month after payoff — investing comes out $${difference.toFixed(0)} ahead, but returns aren't guaranteed.`
      );
    } else {
      const difference = prepayFinalValue - investFinalValue;
      insights.push(
        `Both paths cost the same each month. By year ${horizonYears.toFixed(0)}, prepaying and then investing the freed-up $${freedUpPayment.toFixed(0)}/month after payoff grows to $${prepayFinalValue.toFixed(0)}, vs $${investFinalValue.toFixed(0)} if you invested the extras instead — prepaying comes out $${difference.toFixed(0)} ahead.`
      );
    }
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
      investFinalValue: parseFloat(investFinalValue.toFixed(2)),
      prepayFinalValue: parseFloat(prepayFinalValue.toFixed(2)),
      freedUpPayment: parseFloat(freedUpPayment.toFixed(2)),
      horizonYears: parseFloat(horizonYears.toFixed(1)),
      effectiveReturn: interestRate,
      investmentReturn,
    },
    chartData,
    insights,
  };
}
