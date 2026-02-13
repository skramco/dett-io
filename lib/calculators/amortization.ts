import type { CalculatorResult } from './types';

export interface AmortizationInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  extraMonthlyPayment?: number;
  startDate?: string; // YYYY-MM format
}

export interface AmortizationRow {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  totalPayment: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface AmortizationSchedule {
  schedule: AmortizationRow[];
  yearlySummary: Array<{
    year: number;
    totalPayment: number;
    totalPrincipal: number;
    totalInterest: number;
    endingBalance: number;
  }>;
}

export function calculateAmortization(inputs: AmortizationInputs): CalculatorResult & { amortizationSchedule: AmortizationSchedule } {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    extraMonthlyPayment = 0,
    startDate,
  } = inputs;

  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Calculate base monthly payment
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  // Parse start date
  const start = startDate ? new Date(startDate + '-01') : new Date();
  start.setDate(1);

  // Generate full amortization schedule
  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let actualPayments = 0;

  for (let month = 1; month <= numberOfPayments && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    let extra = extraMonthlyPayment;

    // Handle final payment
    if (principalPayment + extra >= balance) {
      principalPayment = balance;
      extra = 0;
    } else if (principalPayment + extra > balance) {
      extra = balance - principalPayment;
    }

    const totalPayment = principalPayment + interestPayment + extra;
    balance = Math.max(0, balance - principalPayment - extra);
    cumulativeInterest += interestPayment;
    cumulativePrincipal += principalPayment + extra;
    actualPayments++;

    const paymentDate = new Date(start);
    paymentDate.setMonth(paymentDate.getMonth() + month);

    schedule.push({
      month,
      date: paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      extraPayment: Math.round(extra * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
      cumulativePrincipal: Math.round(cumulativePrincipal * 100) / 100,
    });

    if (balance <= 0) break;
  }

  // Generate yearly summary
  const yearlySummary: AmortizationSchedule['yearlySummary'] = [];
  for (let year = 1; year <= Math.ceil(actualPayments / 12); year++) {
    const yearStart = (year - 1) * 12;
    const yearEnd = Math.min(year * 12, schedule.length);
    const yearRows = schedule.slice(yearStart, yearEnd);

    if (yearRows.length === 0) break;

    yearlySummary.push({
      year,
      totalPayment: yearRows.reduce((sum, r) => sum + r.totalPayment, 0),
      totalPrincipal: yearRows.reduce((sum, r) => sum + r.principal + r.extraPayment, 0),
      totalInterest: yearRows.reduce((sum, r) => sum + r.interest, 0),
      endingBalance: yearRows[yearRows.length - 1].balance,
    });
  }

  // Calculate totals
  const totalInterestPaid = cumulativeInterest;
  const totalPaid = cumulativePrincipal + cumulativeInterest;
  const payoffYears = actualPayments / 12;
  const originalPayoffYears = numberOfPayments / 12;
  const yearsSaved = originalPayoffYears - payoffYears;
  const interestWithoutExtra = extraMonthlyPayment > 0
    ? (() => {
        let bal = loanAmount;
        let totalInt = 0;
        for (let m = 0; m < numberOfPayments && bal > 0; m++) {
          const intPmt = bal * monthlyRate;
          const prinPmt = monthlyPayment - intPmt;
          totalInt += intPmt;
          bal -= prinPmt;
        }
        return totalInt;
      })()
    : totalInterestPaid;
  const interestSaved = interestWithoutExtra - totalInterestPaid;

  // Chart data: yearly principal vs interest
  const chartData = yearlySummary.map((y) => ({
    year: `Year ${y.year}`,
    principal: Math.round(y.totalPrincipal),
    interest: Math.round(y.totalInterest),
    balance: Math.round(y.endingBalance),
  }));

  // Insights
  const insights: string[] = [];
  const interestToLoanRatio = (totalInterestPaid / loanAmount) * 100;
  insights.push(
    `Over the life of your loan, you'll pay $${Math.round(totalInterestPaid).toLocaleString()} in interest — that's ${interestToLoanRatio.toFixed(0)}% of your original loan amount.`
  );

  if (extraMonthlyPayment > 0) {
    insights.push(
      `By paying an extra $${extraMonthlyPayment.toLocaleString()}/month, you'll pay off your mortgage ${yearsSaved.toFixed(1)} years early and save $${Math.round(interestSaved).toLocaleString()} in interest.`
    );
  }

  const firstYearInterest = yearlySummary[0]?.totalInterest || 0;
  const firstYearPrincipal = yearlySummary[0]?.totalPrincipal || 0;
  const interestPercent = (firstYearInterest / (firstYearInterest + firstYearPrincipal)) * 100;
  insights.push(
    `In year one, ${interestPercent.toFixed(0)}% of your payment goes to interest. This ratio improves each year as you build equity.`
  );

  const halfwayYear = Math.ceil(actualPayments / 24);
  if (halfwayYear < yearlySummary.length) {
    const halfwayBalance = yearlySummary[halfwayYear - 1]?.endingBalance || 0;
    const percentPaid = ((loanAmount - halfwayBalance) / loanAmount) * 100;
    insights.push(
      `Halfway through your loan (year ${halfwayYear}), you'll have paid off ${percentPaid.toFixed(0)}% of the principal. Most of the equity builds in the second half.`
    );
  }

  return {
    summary: `Monthly payment of $${Math.round(monthlyPayment).toLocaleString()} on a $${loanAmount.toLocaleString()} loan at ${interestRate}% for ${loanTerm} years.`,
    details: {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterestPaid),
      totalPaid: Math.round(totalPaid),
      loanAmount,
      interestRate,
      loanTerm,
      numberOfPayments: actualPayments,
      payoffYears: Math.round(payoffYears * 10) / 10,
      yearsSaved: Math.round(yearsSaved * 10) / 10,
      interestSaved: Math.round(interestSaved),
      extraMonthlyPayment,
    },
    chartData,
    insights,
    amortizationSchedule: { schedule, yearlySummary },
  };
}
