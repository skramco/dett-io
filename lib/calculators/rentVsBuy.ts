import type { RentVsBuyInputs, CalculatorResult } from './types';
import {
  monthlyInterest,
  monthlyPayment,
  monthlyPmiAmount,
  monthsToReachLtv,
} from './mortgageMath';

// PMI terminates automatically when the loan balance reaches 78% of the
// original purchase price (Homeowners Protection Act auto-termination).
const PMI_AUTO_TERMINATION_LTV = 78;

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

  // PMI applies when the down payment is under 20% of the purchase price
  const pmiApplies = homePrice > 0 && loanAmount > 0 && downPayment / homePrice < 0.2 && pmiRate > 0;
  const monthlyPMI = pmiApplies ? monthlyPmiAmount(loanAmount, pmiRate) : 0;
  const pmiCutoffBalance = homePrice * (PMI_AUTO_TERMINATION_LTV / 100);
  const pmiEndMonth = pmiApplies
    ? monthsToReachLtv(loanAmount, homePrice, interestRate, numPayments, PMI_AUTO_TERMINATION_LTV)
    : 0;

  // Cash to close: the money a renter keeps invested instead (opportunity cost)
  const cashToClose = downPayment + closingCosts;

  // Year-1 buy-side monthly costs (tax and maintenance scale with home value later)
  const monthlyTaxY1 = homePrice * propertyTaxRate / 100 / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const monthlyMaintenanceY1 = homePrice * maintenanceRate / 100 / 12;
  const monthlyBuyTotalY1 = monthlyPI + monthlyTaxY1 + monthlyInsurance + monthlyMaintenanceY1 + monthlyPMI;

  const scenarios = ['best', 'base', 'worst'] as const;
  const appreciationRates = {
    best: homeAppreciation + 2,
    base: homeAppreciation,
    worst: Math.max(0, homeAppreciation - 3),
  };

  const monthlyReturn = investmentReturn / 100 / 12;

  const results = scenarios.map(scenario => {
    const appreciation = appreciationRates[scenario];

    // Renter invests the cash to close plus any monthly savings vs owning;
    // owner invests any monthly savings vs renting. Symmetric treatment.
    let renterInvestments = cashToClose;
    let ownerInvestments = 0;
    let currentRent = monthlyRent;
    let homeValue = homePrice;
    let balance = loanAmount;

    const yearlyData = [];
    let finalSellingCost = 0;

    for (let year = 1; year <= yearsToAnalyze; year++) {
      // Tax and maintenance are based on the home's value at the start of the year
      const monthlyTax = homeValue * propertyTaxRate / 100 / 12;
      const monthlyMaintenance = homeValue * maintenanceRate / 100 / 12;
      let yearlyRent = 0;

      for (let month = 1; month <= 12; month++) {
        // Amortize (loan may be paid off before the end of the analysis window)
        let piThisMonth = 0;
        if (balance > 0) {
          const interest = monthlyInterest(balance, interestRate);
          const principal = Math.min(monthlyPI - interest, balance);
          balance -= principal;
          piThisMonth = interest + principal;
        }

        const pmiThisMonth = pmiApplies && balance > pmiCutoffBalance ? monthlyPMI : 0;
        const buyCost = piThisMonth + monthlyTax + monthlyInsurance + monthlyMaintenance + pmiThisMonth;

        // Grow investments, then whichever side pays less invests the difference
        renterInvestments = renterInvestments * (1 + monthlyReturn) + Math.max(0, buyCost - currentRent);
        ownerInvestments = ownerInvestments * (1 + monthlyReturn) + Math.max(0, currentRent - buyCost);
        yearlyRent += currentRent;
      }

      homeValue = homeValue * (1 + appreciation / 100);
      const sellingCostAmount = homeValue * sellingCosts / 100;
      finalSellingCost = sellingCostAmount;

      // Buy net worth = sale proceeds (equity net of selling costs) + side investments
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

    const crossoverYear = yearlyData.find(d => d.buyNetWorth > d.rentNetWorth)?.year || null;
    const finalRentNetWorth = yearlyData[yearlyData.length - 1].rentNetWorth;
    const finalBuyNetWorth = yearlyData[yearlyData.length - 1].buyNetWorth;
    const netWorthDifference = finalBuyNetWorth - finalRentNetWorth;

    return {
      scenario,
      appreciation,
      crossoverYear,
      finalRentNetWorth,
      finalBuyNetWorth,
      netWorthDifference,
      finalSellingCost,
      yearlyData,
    };
  });

  const baseCase = results.find(r => r.scenario === 'base')!;
  const bestCase = results.find(r => r.scenario === 'best')!;
  const worstCase = results.find(r => r.scenario === 'worst')!;

  const insights: string[] = [];

  if (baseCase.crossoverYear) {
    insights.push(
      `Base case: Buying breaks even in year ${baseCase.crossoverYear}. After ${yearsToAnalyze} years, you're ahead by $${Math.abs(baseCase.netWorthDifference).toLocaleString()}`
    );
  } else if (baseCase.netWorthDifference > 0) {
    insights.push(
      `Base case: Buying wins from day one. After ${yearsToAnalyze} years, you're ahead by $${baseCase.netWorthDifference.toLocaleString()}`
    );
  } else {
    insights.push(
      `Base case: Renting wins. After ${yearsToAnalyze} years, you're ahead by $${Math.abs(baseCase.netWorthDifference).toLocaleString()} by renting`
    );
  }

  if (bestCase.crossoverYear && worstCase.crossoverYear) {
    insights.push(
      `Crossover range: Year ${worstCase.crossoverYear} (worst) to Year ${bestCase.crossoverYear} (best)`
    );
  } else if (!worstCase.crossoverYear) {
    insights.push(
      `⚠️ In worst case (${worstCase.appreciation}% appreciation), renting may be better long-term`
    );
  }

  insights.push(
    `Buy-side net worth is net of ${sellingCosts}% selling costs (≈$${Math.round(baseCase.finalSellingCost).toLocaleString()} at year ${yearsToAnalyze}), and the rent scenario invests your $${cashToClose.toLocaleString()} cash to close at ${investmentReturn}%`
  );

  if (pmiApplies) {
    insights.push(
      `With ${((downPayment / homePrice) * 100).toFixed(1)}% down, PMI adds $${Math.round(monthlyPMI).toLocaleString()}/mo until your balance hits 78% of the purchase price${pmiEndMonth ? ` (≈year ${Math.ceil(pmiEndMonth / 12)})` : ''}`
    );
  }

  const totalRentPaid = baseCase.yearlyData.reduce((sum, d) => sum + d.rentPaid, 0);
  insights.push(
    `Over ${yearsToAnalyze} years, you'll pay $${totalRentPaid.toLocaleString()} in rent with no equity to show for it`
  );

  insights.push(
    `The math assumes whichever side pays less each month invests the difference. If you don't invest the savings, the cheaper option loses its edge.`
  );

  const summary = `After ${yearsToAnalyze} years, ${baseCase.netWorthDifference > 0 ? 'buying' : 'renting'} wins by $${Math.abs(baseCase.netWorthDifference).toLocaleString()} (base case).`;

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
      baseCrossover: baseCase.crossoverYear || 'Never',
      baseRentNetWorth: baseCase.finalRentNetWorth,
      baseBuyNetWorth: baseCase.finalBuyNetWorth,
      baseDifference: baseCase.netWorthDifference,
      bestCrossover: bestCase.crossoverYear || 'Never',
      worstCrossover: worstCase.crossoverYear || 'Never',
    },
    chartData: baseCase.yearlyData.map(d => ({
      year: d.year,
      rentNetWorth: d.rentNetWorth,
      buyNetWorth: d.buyNetWorth,
    })),
    insights,
  };
}
