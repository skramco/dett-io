import { formatCurrency } from '@/lib/format';
import { calculateClosingCosts } from '../calculators/closingCosts';
import type { AffordabilityInputs, MortgageCostInputs, RentVsBuyInputs } from '../calculators/types';
import type { ClosingCostInputs } from '../calculators/closingCosts';
import { hasSpecificLocation, resolveLocationDefaults, type LocationValue, type ResolvedLocationDefaults } from './resolveLocation';

function locationOf(state?: string, zip?: string): LocationValue {
  return { state: state ?? '', zip: zip ?? '' };
}

export function applyLocationToMortgageCost(
  prev: MortgageCostInputs,
  resolved: ResolvedLocationDefaults,
): MortgageCostInputs {
  return {
    ...prev,
    state: resolved.state,
    zip: resolved.zip,
    propertyTax: resolved.annualPropertyTax,
    homeInsurance: resolved.annualInsurance,
  };
}

export function rescaleMortgageCostOnPrice(
  prev: MortgageCostInputs,
  nextPrice: number,
): MortgageCostInputs {
  const location = locationOf(prev.state, prev.zip);
  if (!hasSpecificLocation(location)) {
    return { ...prev, homePrice: nextPrice };
  }
  const prevD = resolveLocationDefaults(location, prev.homePrice);
  const nextD = resolveLocationDefaults(location, nextPrice);
  return {
    ...prev,
    homePrice: nextPrice,
    propertyTax: prev.propertyTax === prevD.annualPropertyTax ? nextD.annualPropertyTax : prev.propertyTax,
    homeInsurance: prev.homeInsurance === prevD.annualInsurance ? nextD.annualInsurance : prev.homeInsurance,
  };
}

export function applyLocationToAffordability(
  prev: AffordabilityInputs,
  resolved: ResolvedLocationDefaults,
): AffordabilityInputs {
  return {
    ...prev,
    state: resolved.state,
    zip: resolved.zip,
    propertyTaxRate: resolved.propertyTaxRate,
    homeInsuranceAnnual: resolved.annualInsurance,
  };
}

export function estimateClosingCostsFromLocation(
  resolved: ResolvedLocationDefaults,
  args: {
    homePrice: number;
    downPaymentPercent: number;
    interestRate: number;
    loanTerm: number;
  },
): number {
  if (!resolved.state) {
    return Math.round(args.homePrice * 0.03);
  }
  const result = calculateClosingCosts({
    homePrice: args.homePrice,
    downPaymentPercent: args.downPaymentPercent,
    interestRate: args.interestRate,
    loanTerm: args.loanTerm,
    state: resolved.state,
    isNewConstruction: false,
    propertyTaxRate: resolved.propertyTaxRate,
    prepaidInsurance: resolved.annualInsurance,
    transferTax: resolved.transferTaxOverride,
  });
  return result.details.netClosingCosts as number;
}

export function applyLocationToRentVsBuy(
  prev: RentVsBuyInputs,
  resolved: ResolvedLocationDefaults,
): RentVsBuyInputs {
  const downPaymentPercent = prev.homePrice > 0 ? (prev.downPayment / prev.homePrice) * 100 : 20;
  return {
    ...prev,
    state: resolved.state,
    zip: resolved.zip,
    propertyTaxRate: resolved.propertyTaxRate,
    homeInsuranceAnnual: resolved.annualInsurance,
    closingCosts: estimateClosingCostsFromLocation(resolved, {
      homePrice: prev.homePrice,
      downPaymentPercent,
      interestRate: prev.interestRate,
      loanTerm: prev.loanTerm,
    }),
  };
}

export function rescaleRentVsBuyOnPrice(
  prev: RentVsBuyInputs,
  nextPrice: number,
): RentVsBuyInputs {
  const location = locationOf(prev.state, prev.zip);
  const next = { ...prev, homePrice: nextPrice };
  if (!hasSpecificLocation(location)) return next;

  const prevD = resolveLocationDefaults(location, prev.homePrice);
  const nextD = resolveLocationDefaults(location, nextPrice);
  const downPaymentPercent = nextPrice > 0 ? (prev.downPayment / nextPrice) * 100 : 20;
  const prevClosing = estimateClosingCostsFromLocation(prevD, {
    homePrice: prev.homePrice,
    downPaymentPercent: prev.homePrice > 0 ? (prev.downPayment / prev.homePrice) * 100 : 20,
    interestRate: prev.interestRate,
    loanTerm: prev.loanTerm,
  });

  return {
    ...next,
    propertyTaxRate: prev.propertyTaxRate === prevD.propertyTaxRate ? nextD.propertyTaxRate : prev.propertyTaxRate,
    homeInsuranceAnnual:
      prev.homeInsuranceAnnual === prevD.annualInsurance ? nextD.annualInsurance : prev.homeInsuranceAnnual,
    closingCosts:
      prev.closingCosts === prevClosing
        ? estimateClosingCostsFromLocation(nextD, {
            homePrice: nextPrice,
            downPaymentPercent,
            interestRate: prev.interestRate,
            loanTerm: prev.loanTerm,
          })
        : prev.closingCosts,
  };
}

export function applyLocationToClosingCosts(
  prev: ClosingCostInputs,
  resolved: ResolvedLocationDefaults,
): ClosingCostInputs {
  return {
    ...prev,
    state: resolved.state,
    zip: resolved.zip,
    propertyTaxRate: resolved.propertyTaxRate,
    prepaidInsurance: resolved.annualInsurance,
    transferTax: resolved.transferTaxOverride,
    attorneyFee: resolved.state ? undefined : prev.attorneyFee,
  };
}

export function rescaleClosingCostsOnPrice(
  prev: ClosingCostInputs,
  nextPrice: number,
): ClosingCostInputs {
  const location = locationOf(prev.state, prev.zip);
  const next = { ...prev, homePrice: nextPrice };
  if (!hasSpecificLocation(location)) return next;

  const prevD = resolveLocationDefaults(location, prev.homePrice);
  const nextD = resolveLocationDefaults(location, nextPrice);
  return {
    ...next,
    prepaidInsurance:
      prev.prepaidInsurance === prevD.annualInsurance ? nextD.annualInsurance : prev.prepaidInsurance,
    transferTax:
      prev.transferTax !== undefined && prev.transferTax === prevD.transferTaxOverride
        ? nextD.transferTaxOverride
        : prev.transferTax,
  };
}

export function locationHelperText(resolved: ResolvedLocationDefaults): string {
  const bits = [
    `${resolved.propertyTaxRate.toFixed(2)}% property tax`,
    `${resolved.insuranceRate.toFixed(2)}% homeowners insurance`,
  ];
  if (resolved.attorneyCustomary) {
    bits.push(`attorney closing (~${formatCurrency(resolved.attorneyFee)})`);
  } else if (resolved.state) {
    bits.push('title/escrow closing (no attorney required)');
  }
  if (resolved.transferTaxRate > 0) {
    bits.push(`${resolved.transferTaxRate}% transfer tax`);
  } else if (resolved.state) {
    bits.push('no state transfer tax');
  }
  return `${resolved.sourceLabel}: ${bits.join(' · ')}. You can override any field.`;
}
