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
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  // Calculate monthly mortgage payment
  const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);

  const scenarios = ['best', 'base', 'worst'] as const;
  const appreciationRates = {
    best: homeAppreciation + 2,
    base: homeAppreciation,
    worst: Math.max(0, homeAppreciation - 3),
  };

  const results = scenarios.map(scenario => {
    const appreciation = appreciationRates[scenario];
    
    let rentNetWorth = downPayment + closingCosts; // Start with cash saved
    let buyNetWorth = 0;
    let currentRent = monthlyRent;
    let homeValue = homePrice;
    let balance = loanAmount;
    
    const yearlyData = [];
    
    for (let year = 1; year <= yearsToAnalyze; year++) {
      // Rent scenario: invest the difference
      const yearlyRent = currentRent * 12;
      const monthlyTax = homeValue * propertyTaxRate / 100 / 12;
      const monthlyInsurance = homeInsuranceAnnual / 12;
      const monthlyMaintenance = homeValue * maintenanceRate / 100 / 12;
      const totalBuyingCost = (monthlyPI + monthlyTax + monthlyInsurance + monthlyMaintenance) * 12;
      
      const monthlySavings = (totalBuyingCost / 12) - currentRent;
      const yearlySavings = monthlySavings * 12;
      
      // Rent: grow investments
      rentNetWorth = rentNetWorth * (1 + investmentReturn / 100) + Math.max(0, -yearlySavings);
      
      // Buy: calculate equity
      let yearlyPrincipal = 0;
      for (let month = 1; month <= 12; month++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPI - interest;
        balance -= principal;
        yearlyPrincipal += principal;
      }
      
      homeValue = homeValue * (1 + appreciation / 100);
      const equity = homeValue - balance;
      const sellingCostAmount = homeValue * sellingCosts / 100;
      buyNetWorth = equity - sellingCostAmount;
      
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
  
  insights.push(
    `The math assumes you invest the difference when renting. If you don't invest, buying wins by default.`
  );

  const summary = `After ${yearsToAnalyze} years, ${baseCase.netWorthDifference > 0 ? 'buying' : 'renting'} wins by $${Math.abs(baseCase.netWorthDifference).toLocaleString()} (base case).`;

  return {
    summary,
    details: {
      homePrice,
      downPayment,
      monthlyRent,
      monthlyPI: Math.round(monthlyPI),
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
