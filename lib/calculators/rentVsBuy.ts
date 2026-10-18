import type { RentVsBuyInputs, CalculatorResult } from './types';

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
    closingCosts,
    sellingCosts,
    investmentReturn,
    yearsToAnalyze,
    pmiRate = 0.5,
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  // Calculate monthly mortgage payment
  const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);

  // PMI applies when down payment < 20%, until the balance reaches 78% of the purchase price
  const needsPMI = homePrice > 0 && downPayment / homePrice < 0.2;
  const monthlyPMI = needsPMI ? (loanAmount * pmiRate) / 100 / 12 : 0;
  const pmiRemovalBalance = homePrice * 0.78;

  const cashToClose = downPayment + closingCosts;

  const scenarios = ['best', 'base', 'worst'] as const;
  const appreciationRates = {
    best: homeAppreciation + 2,
    base: homeAppreciation,
    worst: Math.max(0, homeAppreciation - 3),
  };

  const results = scenarios.map(scenario => {
    const appreciation = appreciationRates[scenario];
    
    // Renter invests the cash to close (down payment + closing costs) —
    // the opportunity cost of the cash the buyer hands over upfront.
    let rentNetWorth = cashToClose;
    let buyNetWorth = 0;
    // When renting is more expensive than owning, the owner invests the difference.
    let ownerInvestments = 0;
    let currentRent = monthlyRent;
    let homeValue = homePrice;
    let balance = loanAmount;
    
    const yearlyData = [];
    
    for (let year = 1; year <= yearsToAnalyze; year++) {
      const yearlyRent = currentRent * 12;
      const monthlyTax = homeValue * propertyTaxRate / 100 / 12;
      const monthlyInsurance = homeInsuranceAnnual / 12;
      const monthlyMaintenance = homeValue * maintenanceRate / 100 / 12;
      
      // Amortize the year month by month; PMI drops once the balance hits 78% LTV
      let yearlyPMI = 0;
      for (let month = 1; month <= 12; month++) {
        if (needsPMI && balance > pmiRemovalBalance) {
          yearlyPMI += monthlyPMI;
        }
        const interest = balance * monthlyRate;
        const principal = monthlyPI - interest;
        balance -= principal;
      }
      
      // Full annual cost of owning: P&I + tax + insurance + PMI + maintenance
      const totalBuyingCost = (monthlyPI + monthlyTax + monthlyInsurance + monthlyMaintenance) * 12 + yearlyPMI;
      
      // Whoever pays less invests the difference
      const ownerCostMinusRent = totalBuyingCost - yearlyRent;
      rentNetWorth = rentNetWorth * (1 + investmentReturn / 100) + Math.max(0, ownerCostMinusRent);
      ownerInvestments = ownerInvestments * (1 + investmentReturn / 100) + Math.max(0, -ownerCostMinusRent);
      
      homeValue = homeValue * (1 + appreciation / 100);
      const equity = homeValue - balance;
      // If sold at this point, agent commissions + transfer costs come out of the proceeds
      const sellingCostAmount = homeValue * sellingCosts / 100;
      buyNetWorth = equity - sellingCostAmount + ownerInvestments;
      
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
  
  const totalRentPaid = baseCase.yearlyData.reduce((sum, d) => sum + d.rentPaid, 0);
  insights.push(
    `Over ${yearsToAnalyze} years, you'll pay $${totalRentPaid.toLocaleString()} in rent with no equity to show for it`
  );
  
  const finalHomeValue = baseCase.yearlyData[baseCase.yearlyData.length - 1].homeValue;
  const finalSellingCost = Math.round(finalHomeValue * sellingCosts / 100);
  insights.push(
    `Buy-side net worth assumes a sale at year ${yearsToAnalyze}: selling costs of ${sellingCosts}% (~$${finalSellingCost.toLocaleString()}) are deducted, and the renter invests your $${Math.round(cashToClose).toLocaleString()} cash to close instead.`
  );
  
  insights.push(
    `The math assumes you invest the difference when renting. If you don't invest, buying wins by default.`
  );

  const summary = `After ${yearsToAnalyze} years, ${baseCase.netWorthDifference > 0 ? 'buying' : 'renting'} wins by $${Math.abs(baseCase.netWorthDifference).toLocaleString()} (base case).`;

  // Year-1 monthly buy-side breakdown (full cost of ownership, not just P&I)
  const monthlyTaxY1 = homePrice * propertyTaxRate / 100 / 12;
  const monthlyInsuranceY1 = homeInsuranceAnnual / 12;
  const monthlyMaintenanceY1 = homePrice * maintenanceRate / 100 / 12;
  const totalMonthlyCost = monthlyPI + monthlyTaxY1 + monthlyInsuranceY1 + monthlyMaintenanceY1 + monthlyPMI;

  return {
    summary,
    details: {
      homePrice,
      downPayment,
      monthlyRent,
      monthlyPI: Math.round(monthlyPI),
      monthlyTax: Math.round(monthlyTaxY1),
      monthlyInsurance: Math.round(monthlyInsuranceY1),
      monthlyMaintenance: Math.round(monthlyMaintenanceY1),
      monthlyPMI: Math.round(monthlyPMI),
      totalMonthlyCost: Math.round(totalMonthlyCost),
      cashToClose: Math.round(cashToClose),
      closingCosts: Math.round(closingCosts),
      sellingCostsPercent: sellingCosts,
      finalSellingCost,
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
