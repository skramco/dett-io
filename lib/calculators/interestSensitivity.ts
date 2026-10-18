import { formatCurrency } from '../format';
import type { InterestSensitivityInputs, CalculatorResult } from './types';
import { monthlyPayment } from './mortgageMath';

export function calculateInterestSensitivity(inputs: InterestSensitivityInputs): CalculatorResult {
  const {
    loanAmount,
    baseRate,
    loanTerm,
    propertyTaxRate,
    homeInsuranceAnnual,
  } = inputs;

  const rateChanges = [-1.0, -0.5, -0.25, 0, 0.25, 0.5, 1.0];
  const numPayments = loanTerm * 12;

  const results = rateChanges.map(change => {
    const rate = baseRate + change;
    
    const monthlyPI = monthlyPayment(loanAmount, rate, numPayments);
    
    const monthlyTax = (loanAmount * 1.25) * propertyTaxRate / 100 / 12; // Estimate home price
    const monthlyInsurance = homeInsuranceAnnual / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;
    
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = totalPaid - loanAmount;
    
    return {
      rateChange: change,
      rate,
      monthlyPI: Math.round(monthlyPI),
      totalMonthly: Math.round(totalMonthly),
      totalInterest: Math.round(totalInterest),
    };
  });

  const baseResult = results.find(r => r.rateChange === 0)!;
  const quarterDown = results.find(r => r.rateChange === -0.25)!;
  const quarterUp = results.find(r => r.rateChange === 0.25)!;
  const halfDown = results.find(r => r.rateChange === -0.5)!;
  const halfUp = results.find(r => r.rateChange === 0.5)!;
  const fullDown = results.find(r => r.rateChange === -1.0)!;
  const fullUp = results.find(r => r.rateChange === 1.0)!;

  const insights: string[] = [];
  
  insights.push(
    `Base rate (${baseRate}%): ${formatCurrency(baseResult.monthlyPI)}/month, ${formatCurrency(baseResult.totalInterest)} total interest`
  );
  
  const quarterUpDiff = quarterUp.monthlyPI - baseResult.monthlyPI;
  const quarterDownDiff = baseResult.monthlyPI - quarterDown.monthlyPI;
  insights.push(
    `±0.25%: Changes payment by ~${formatCurrency((quarterUpDiff + quarterDownDiff) / 2)}/month`
  );

  const halfUpDiff = halfUp.monthlyPI - baseResult.monthlyPI;
  const halfDownDiff = baseResult.monthlyPI - halfDown.monthlyPI;
  insights.push(
    `±0.5%: Changes payment by ~${formatCurrency((halfUpDiff + halfDownDiff) / 2)}/month`
  );

  const fullUpDiff = fullUp.monthlyPI - baseResult.monthlyPI;
  const fullDownDiff = baseResult.monthlyPI - fullDown.monthlyPI;
  insights.push(
    `±1.0%: Changes payment by ~${formatCurrency((fullUpDiff + fullDownDiff) / 2)}/month`
  );

  const interestDiff1Pct = fullUp.totalInterest - fullDown.totalInterest;
  insights.push(
    `💡 A 1% rate difference costs/saves ${formatCurrency(interestDiff1Pct / 2)} in interest over ${loanTerm} years`
  );

  if (quarterUpDiff > 100) {
    insights.push(
      `⚠️ Even 0.25% matters: That's ${formatCurrency(quarterUpDiff)}/month or ${formatCurrency(quarterUpDiff * 12)}/year more`
    );
  }

  insights.push(
    `Use this to decide: Is it worth paying points to buy down? Should you float or lock? How much does timing matter?`
  );

  const summary = `Every 0.25% rate change affects your payment by ~${formatCurrency((quarterUpDiff + quarterDownDiff) / 2)}/month on a ${formatCurrency(loanAmount)} loan.`;

  return {
    summary,
    details: {
      loanAmount,
      baseRate,
      basePayment: baseResult.monthlyPI,
      baseInterest: baseResult.totalInterest,
      quarterPctImpact: Math.round((quarterUpDiff + quarterDownDiff) / 2),
      halfPctImpact: Math.round((halfUpDiff + halfDownDiff) / 2),
      fullPctImpact: Math.round((fullUpDiff + fullDownDiff) / 2),
    },
    chartData: results.map(r => ({
      rate: `${r.rate.toFixed(2)}%`,
      monthlyPayment: r.monthlyPI,
      totalInterest: r.totalInterest,
    })),
    insights,
  };
}
