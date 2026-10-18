import { formatCurrency } from '../format';
import type { RentVsBuyInputs, CalculatorResult } from './types';
import {
  monthlyInterest,
  monthlyPayment,
  monthlyPmiAmount,
  monthsToReachLtv,
} from './mortgageMath';
import { createRng, percentile, shareWhere, truncatedNormal } from './monteCarlo';

// PMI terminates automatically when the loan balance reaches 78% of the
// original purchase price (Homeowners Protection Act auto-termination).
const PMI_AUTO_TERMINATION_LTV = 78;

/**
 * Disclosed scenario-range assumptions. Named paths jointly shift appreciation,
 * rent inflation, and investment return; Monte Carlo samples those three
 * around the user's inputs. Keep in sync with the methodology page.
 */
export const RENT_VS_BUY_SCENARIO_ASSUMPTIONS = {
  samples: 400,
  seed: 34902,
  /** Optimistic (buying-friendly) shifts from the user's entered rates. */
  optimistic: { appreciation: 2, rentInflation: 1, investmentReturn: -1.5 },
  /** Pessimistic (renting-friendly) shifts. */
  pessimistic: { appreciation: -2, rentInflation: -1, investmentReturn: 1.5 },
  vol: {
    appreciation: 2,
    rentInflation: 1.5,
    investmentReturn: 4,
  },
  bounds: {
    appreciation: { min: -5, max: 12 },
    rentInflation: { min: -1, max: 10 },
    investmentReturn: { min: -8, max: 18 },
  },
} as const;

interface YearRow {
  year: number;
  rentNetWorth: number;
  buyNetWorth: number;
  homeValue: number;
  rentPaid: number;
}

interface PathResult {
  appreciation: number;
  rentInflation: number;
  investmentReturn: number;
  crossoverYear: number | null;
  finalRentNetWorth: number;
  finalBuyNetWorth: number;
  netWorthDifference: number;
  finalSellingCost: number;
  yearlyData: YearRow[];
}

function simulatePath(
  inputs: RentVsBuyInputs,
  appreciation: number,
  rentInflation: number,
  investmentReturn: number
): PathResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyRent,
    propertyTaxRate,
    homeInsuranceAnnual,
    maintenanceRate,
    pmiRate,
    closingCosts,
    sellingCosts,
    yearsToAnalyze,
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const numPayments = loanTerm * 12;
  const monthlyPI = monthlyPayment(loanAmount, interestRate, numPayments);

  const pmiApplies =
    homePrice > 0 && loanAmount > 0 && downPayment / homePrice < 0.2 && pmiRate > 0;
  const monthlyPMI = pmiApplies ? monthlyPmiAmount(loanAmount, pmiRate) : 0;
  const pmiCutoffBalance = homePrice * (PMI_AUTO_TERMINATION_LTV / 100);

  const cashToClose = downPayment + closingCosts;
  const monthlyReturn = investmentReturn / 100 / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;

  let renterInvestments = cashToClose;
  let ownerInvestments = 0;
  let currentRent = monthlyRent;
  let homeValue = homePrice;
  let balance = loanAmount;

  const yearlyData: YearRow[] = [];
  let finalSellingCost = 0;

  for (let year = 1; year <= yearsToAnalyze; year++) {
    const monthlyTax = (homeValue * propertyTaxRate) / 100 / 12;
    const monthlyMaintenance = (homeValue * maintenanceRate) / 100 / 12;
    let yearlyRent = 0;

    for (let month = 1; month <= 12; month++) {
      let piThisMonth = 0;
      if (balance > 0) {
        const interest = monthlyInterest(balance, interestRate);
        const principal = Math.min(monthlyPI - interest, balance);
        balance -= principal;
        piThisMonth = interest + principal;
      }

      const pmiThisMonth = pmiApplies && balance > pmiCutoffBalance ? monthlyPMI : 0;
      const buyCost =
        piThisMonth + monthlyTax + monthlyInsurance + monthlyMaintenance + pmiThisMonth;

      renterInvestments =
        renterInvestments * (1 + monthlyReturn) + Math.max(0, buyCost - currentRent);
      ownerInvestments =
        ownerInvestments * (1 + monthlyReturn) + Math.max(0, currentRent - buyCost);
      yearlyRent += currentRent;
    }

    homeValue = homeValue * (1 + appreciation / 100);
    const sellingCostAmount = homeValue * (sellingCosts / 100);
    finalSellingCost = sellingCostAmount;

    const buyNetWorth = homeValue - balance - sellingCostAmount + ownerInvestments;
    const rentNetWorth = renterInvestments;

    yearlyData.push({
      year,
      rentNetWorth: Math.round(rentNetWorth),
      buyNetWorth: Math.round(buyNetWorth),
      homeValue: Math.round(homeValue),
      rentPaid: Math.round(yearlyRent),
    });

    currentRent = currentRent * (1 + rentInflation / 100);
  }

  const crossoverYear = yearlyData.find((d) => d.buyNetWorth > d.rentNetWorth)?.year ?? null;
  const finalRentNetWorth = yearlyData[yearlyData.length - 1].rentNetWorth;
  const finalBuyNetWorth = yearlyData[yearlyData.length - 1].buyNetWorth;

  return {
    appreciation,
    rentInflation,
    investmentReturn,
    crossoverYear,
    finalRentNetWorth,
    finalBuyNetWorth,
    netWorthDifference: finalBuyNetWorth - finalRentNetWorth,
    finalSellingCost,
    yearlyData,
  };
}

function shiftRates(
  inputs: RentVsBuyInputs,
  shift: { appreciation: number; rentInflation: number; investmentReturn: number }
) {
  const { bounds } = RENT_VS_BUY_SCENARIO_ASSUMPTIONS;
  return {
    appreciation: Math.min(
      bounds.appreciation.max,
      Math.max(bounds.appreciation.min, inputs.homeAppreciation + shift.appreciation)
    ),
    rentInflation: Math.min(
      bounds.rentInflation.max,
      Math.max(bounds.rentInflation.min, inputs.rentInflation + shift.rentInflation)
    ),
    investmentReturn: Math.min(
      bounds.investmentReturn.max,
      Math.max(bounds.investmentReturn.min, inputs.investmentReturn + shift.investmentReturn)
    ),
  };
}

function crossoverLabel(year: number | null): string | number {
  return year ?? 'Never';
}

function roundPct(value: number): number {
  return Number(value.toFixed(1));
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): CalculatorResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyRent,
    rentInflation,
    homeAppreciation,
    propertyTaxRate,
    homeInsuranceAnnual,
    maintenanceRate,
    pmiRate,
    closingCosts,
    sellingCosts,
    investmentReturn,
    yearsToAnalyze,
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const numPayments = loanTerm * 12;
  const monthlyPI = monthlyPayment(loanAmount, interestRate, numPayments);

  const pmiApplies =
    homePrice > 0 && loanAmount > 0 && downPayment / homePrice < 0.2 && pmiRate > 0;
  const monthlyPMI = pmiApplies ? monthlyPmiAmount(loanAmount, pmiRate) : 0;
  const pmiEndMonth = pmiApplies
    ? monthsToReachLtv(loanAmount, homePrice, interestRate, numPayments, PMI_AUTO_TERMINATION_LTV)
    : 0;

  const cashToClose = downPayment + closingCosts;
  const monthlyTaxY1 = (homePrice * propertyTaxRate) / 100 / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const monthlyMaintenanceY1 = (homePrice * maintenanceRate) / 100 / 12;
  const monthlyBuyTotalY1 =
    monthlyPI + monthlyTaxY1 + monthlyInsurance + monthlyMaintenanceY1 + monthlyPMI;

  const optimisticRates = shiftRates(inputs, RENT_VS_BUY_SCENARIO_ASSUMPTIONS.optimistic);
  const pessimisticRates = shiftRates(inputs, RENT_VS_BUY_SCENARIO_ASSUMPTIONS.pessimistic);

  const baseCase = simulatePath(inputs, homeAppreciation, rentInflation, investmentReturn);
  const optimistic = simulatePath(
    inputs,
    optimisticRates.appreciation,
    optimisticRates.rentInflation,
    optimisticRates.investmentReturn
  );
  const pessimistic = simulatePath(
    inputs,
    pessimisticRates.appreciation,
    pessimisticRates.rentInflation,
    pessimisticRates.investmentReturn
  );

  const { samples, seed, vol, bounds } = RENT_VS_BUY_SCENARIO_ASSUMPTIONS;
  const rng = createRng(seed);
  const differences = new Float64Array(samples);
  const crossoverOrNever = new Float64Array(samples);
  const buyByYear: Float64Array[] = Array.from(
    { length: yearsToAnalyze },
    () => new Float64Array(samples)
  );
  const rentByYear: Float64Array[] = Array.from(
    { length: yearsToAnalyze },
    () => new Float64Array(samples)
  );
  const diffByYear: Float64Array[] = Array.from(
    { length: yearsToAnalyze },
    () => new Float64Array(samples)
  );

  for (let s = 0; s < samples; s++) {
    const appr = truncatedNormal(
      rng,
      homeAppreciation,
      vol.appreciation,
      bounds.appreciation.min,
      bounds.appreciation.max
    );
    const rentInf = truncatedNormal(
      rng,
      rentInflation,
      vol.rentInflation,
      bounds.rentInflation.min,
      bounds.rentInflation.max
    );
    const invest = truncatedNormal(
      rng,
      investmentReturn,
      vol.investmentReturn,
      bounds.investmentReturn.min,
      bounds.investmentReturn.max
    );
    const path = simulatePath(inputs, appr, rentInf, invest);
    differences[s] = path.netWorthDifference;
    crossoverOrNever[s] = path.crossoverYear ?? yearsToAnalyze + 1;
    for (let y = 0; y < path.yearlyData.length; y++) {
      buyByYear[y][s] = path.yearlyData[y].buyNetWorth;
      rentByYear[y][s] = path.yearlyData[y].rentNetWorth;
      diffByYear[y][s] = path.yearlyData[y].buyNetWorth - path.yearlyData[y].rentNetWorth;
    }
  }

  const p10Difference = percentile(differences, 10);
  const p50Difference = percentile(differences, 50);
  const p90Difference = percentile(differences, 90);
  const pctBuyWins = roundPct(shareWhere(differences, (d) => d > 0));
  const pctNeverCrossover = roundPct(
    shareWhere(crossoverOrNever, (y) => y > yearsToAnalyze)
  );

  const p10CrossRaw = percentile(crossoverOrNever, 10);
  const p50CrossRaw = percentile(crossoverOrNever, 50);
  const p90CrossRaw = percentile(crossoverOrNever, 90);
  const p10Crossover = p10CrossRaw > yearsToAnalyze ? 0 : Math.round(p10CrossRaw);
  const p50Crossover = p50CrossRaw > yearsToAnalyze ? 0 : Math.round(p50CrossRaw);
  const p90Crossover = p90CrossRaw > yearsToAnalyze ? 0 : Math.round(p90CrossRaw);

  const insights: string[] = [];

  if (baseCase.crossoverYear) {
    insights.push(
      `Base path: Buying breaks even in year ${baseCase.crossoverYear}. After ${yearsToAnalyze} years, you're ahead by ${formatCurrency(Math.abs(baseCase.netWorthDifference))}`
    );
  } else if (baseCase.netWorthDifference > 0) {
    insights.push(
      `Base path: Buying wins from day one. After ${yearsToAnalyze} years, you're ahead by ${formatCurrency(baseCase.netWorthDifference)}`
    );
  } else {
    insights.push(
      `Base path: Renting wins. After ${yearsToAnalyze} years, you're ahead by ${formatCurrency(Math.abs(baseCase.netWorthDifference))} by renting`
    );
  }

  insights.push(
    `Scenario range (not a single path): optimistic (${optimistic.appreciation.toFixed(1)}% appreciation, ${optimistic.rentInflation.toFixed(1)}% rent inflation, ${optimistic.investmentReturn.toFixed(1)}% return) vs pessimistic (${pessimistic.appreciation.toFixed(1)}% / ${pessimistic.rentInflation.toFixed(1)}% / ${pessimistic.investmentReturn.toFixed(1)}%). Horizon difference P10–P90: ${formatCurrency(p10Difference)} to ${formatCurrency(p90Difference)} (buy − rent)`
  );

  insights.push(
    `Monte Carlo (${samples} seeded draws of appreciation, rent inflation, and investment return): buying ends ahead in ${pctBuyWins}% of scenarios`
  );

  if (pctNeverCrossover >= 50) {
    insights.push(
      `⚠️ Buying does not break even within ${yearsToAnalyze} years in ${pctNeverCrossover}% of sampled scenarios`
    );
  }

  insights.push(
    `Buy-side net worth is net of ${sellingCosts}% selling costs (≈${formatCurrency(baseCase.finalSellingCost)} at year ${yearsToAnalyze}), and the rent scenario invests your ${formatCurrency(cashToClose)} cash to close at ${investmentReturn}%`
  );

  if (pmiApplies) {
    insights.push(
      `With ${((downPayment / homePrice) * 100).toFixed(1)}% down, PMI adds ${formatCurrency(monthlyPMI)}/mo until your balance hits 78% of the purchase price${pmiEndMonth ? ` (≈year ${Math.ceil(pmiEndMonth / 12)})` : ''}`
    );
  }

  const totalRentPaid = baseCase.yearlyData.reduce((sum, d) => sum + d.rentPaid, 0);
  insights.push(
    `Over ${yearsToAnalyze} years, you'll pay ${formatCurrency(totalRentPaid)} in rent with no equity to show for it`
  );

  insights.push(
    `The math assumes whichever side pays less each month invests the difference. If you don't invest the savings, the cheaper option loses its edge.`
  );

  const summary = `After ${yearsToAnalyze} years, ${baseCase.netWorthDifference > 0 ? 'buying' : 'renting'} wins by ${formatCurrency(Math.abs(baseCase.netWorthDifference))} on the base path. Buying ends ahead in ${pctBuyWins}% of ${samples} sampled scenarios (P10–P90 difference ${formatCurrency(p10Difference)} to ${formatCurrency(p90Difference)}).`;

  return {
    summary,
    details: {
      homePrice,
      downPayment,
      monthlyRent,
      monthlyPI: Math.round(monthlyPI),
      monthlyTax: Math.round(monthlyTaxY1),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyMaintenance: Math.round(monthlyMaintenanceY1),
      monthlyPMI: Math.round(monthlyPMI),
      pmiEndMonth,
      monthlyBuyTotal: Math.round(monthlyBuyTotalY1),
      cashToClose,
      sellingCostAtHorizon: Math.round(baseCase.finalSellingCost),
      breakEvenYear: baseCase.crossoverYear || 0,
      baseCrossover: crossoverLabel(baseCase.crossoverYear),
      baseRentNetWorth: baseCase.finalRentNetWorth,
      baseBuyNetWorth: baseCase.finalBuyNetWorth,
      baseDifference: baseCase.netWorthDifference,
      bestCrossover: crossoverLabel(optimistic.crossoverYear),
      worstCrossover: crossoverLabel(pessimistic.crossoverYear),
      optimisticAppreciation: Number(optimistic.appreciation.toFixed(2)),
      optimisticRentInflation: Number(optimistic.rentInflation.toFixed(2)),
      optimisticInvestmentReturn: Number(optimistic.investmentReturn.toFixed(2)),
      optimisticDifference: optimistic.netWorthDifference,
      optimisticCrossover: crossoverLabel(optimistic.crossoverYear),
      pessimisticAppreciation: Number(pessimistic.appreciation.toFixed(2)),
      pessimisticRentInflation: Number(pessimistic.rentInflation.toFixed(2)),
      pessimisticInvestmentReturn: Number(pessimistic.investmentReturn.toFixed(2)),
      pessimisticDifference: pessimistic.netWorthDifference,
      pessimisticCrossover: crossoverLabel(pessimistic.crossoverYear),
      p10Difference: Math.round(p10Difference),
      p50Difference: Math.round(p50Difference),
      p90Difference: Math.round(p90Difference),
      pctBuyWins,
      pctNeverCrossover,
      p10Crossover,
      p50Crossover,
      p90Crossover,
      mcSamples: samples,
      mcApprVol: vol.appreciation,
      mcRentVol: vol.rentInflation,
      mcInvestVol: vol.investmentReturn,
    },
    chartData: baseCase.yearlyData.map((d, i) => ({
      year: d.year,
      rentNetWorth: d.rentNetWorth,
      buyNetWorth: d.buyNetWorth,
      buyP10: Math.round(percentile(buyByYear[i], 10)),
      buyP50: Math.round(percentile(buyByYear[i], 50)),
      buyP90: Math.round(percentile(buyByYear[i], 90)),
      rentP10: Math.round(percentile(rentByYear[i], 10)),
      rentP50: Math.round(percentile(rentByYear[i], 50)),
      rentP90: Math.round(percentile(rentByYear[i], 90)),
      diffP10: Math.round(percentile(diffByYear[i], 10)),
      diffP50: Math.round(percentile(diffByYear[i], 50)),
      diffP90: Math.round(percentile(diffByYear[i], 90)),
      optimisticBuy: optimistic.yearlyData[i]?.buyNetWorth ?? d.buyNetWorth,
      optimisticRent: optimistic.yearlyData[i]?.rentNetWorth ?? d.rentNetWorth,
      pessimisticBuy: pessimistic.yearlyData[i]?.buyNetWorth ?? d.buyNetWorth,
      pessimisticRent: pessimistic.yearlyData[i]?.rentNetWorth ?? d.rentNetWorth,
    })),
    insights,
  };
}
