// Contextual LoanKnow CTA copy per calculator.
// Each entry can optionally derive its headline from the user's live inputs
// (e.g. quoting the rate they just typed into the Refinance calculator).

export interface LoanKnowCtaCopy {
  headline: string;
  body: string;
  buttonLabel: string;
}

type Inputs = Record<string, unknown>;

function asNumber(value: unknown): number | null {
  const n = typeof value === 'string' ? parseFloat(value) : typeof value === 'number' ? value : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

const DEFAULT_COPY: LoanKnowCtaCopy = {
  headline: 'Put your numbers to work',
  body: 'LoanKnow helps lenders compete for your business — anonymously and for free. Save your numbers now and your calculated data transfers when it launches, so you never re-enter information.',
  buttonLabel: 'Save my numbers',
};

const STATIC_COPY: Record<string, LoanKnowCtaCopy> = {
  refinance: {
    headline: 'See if lenders can beat your new rate',
    body: 'You just ran the break-even math. When LoanKnow launches, lenders will compete to beat the rate you entered — we\u2019ll carry these exact numbers over.',
    buttonLabel: 'See if lenders can beat my rate',
  },
  dti: {
    headline: 'Get your real DTI reviewed',
    body: 'A ratio alone doesn\u2019t decide approval. Save your DTI numbers and get them in front of lenders who look at the full picture when LoanKnow launches.',
    buttonLabel: 'Get my DTI reviewed',
  },
  affordability: {
    headline: 'Turn your budget into a real pre-approval',
    body: 'You know what you can afford on paper. Save these numbers and be first in line for lenders who can confirm it when LoanKnow launches.',
    buttonLabel: 'Save my budget numbers',
  },
  'mortgage-cost': {
    headline: 'See what lenders would actually quote on this loan',
    body: 'Your true monthly cost is the starting point. Save it and compare it against real lender quotes when LoanKnow launches.',
    buttonLabel: 'Compare against real quotes',
  },
  va: {
    headline: 'Have VA-savvy lenders compete for your loan',
    body: 'Not every lender prices VA loans well. Save your comparison and get matched with lenders who do when LoanKnow launches.',
    buttonLabel: 'Match me with VA lenders',
  },
  fha: {
    headline: 'Put your FHA numbers in front of competing lenders',
    body: 'MIP math matters, but so does the rate. Save your FHA scenario and see which lenders price it best when LoanKnow launches.',
    buttonLabel: 'Save my FHA scenario',
  },
  pmi: {
    headline: 'Find lenders who can get you out of PMI sooner',
    body: 'Save your PMI timeline and see options — from lender-paid PMI to faster removal — when LoanKnow launches.',
    buttonLabel: 'Help me drop PMI sooner',
  },
  'down-payment': {
    headline: 'Match your down payment plan with the right loan',
    body: 'Your down payment strategy changes which loans make sense. Save it and get matched when LoanKnow launches.',
    buttonLabel: 'Save my down payment plan',
  },
  'rent-vs-buy': {
    headline: 'Leaning toward buying? See what lenders offer',
    body: 'If the math says buy, the next question is your rate. Save this analysis and see competing offers at your price point when LoanKnow launches.',
    buttonLabel: 'See offers at my price point',
  },
  'cash-out-refi': {
    headline: 'See real cash-out quotes on your equity',
    body: 'You\u2019ve sized the cash-out. Save your numbers and let lenders compete on the rate and fees when LoanKnow launches.',
    buttonLabel: 'Get cash-out quotes',
  },
  'recast-vs-refi': {
    headline: 'Get refi quotes to weigh against recasting',
    body: 'The recast-vs-refi answer depends on the refi rate you can actually get. Save your scenario and find out when LoanKnow launches.',
    buttonLabel: 'Get real refi quotes',
  },
  'points-buydown': {
    headline: 'See if paying points beats today\u2019s best par rates',
    body: 'Points only win if the base rate is already competitive. Save your buydown math and test it against live pricing when LoanKnow launches.',
    buttonLabel: 'Test my buydown math',
  },
  'arm-vs-fixed': {
    headline: 'Compare live ARM and fixed quotes side by side',
    body: 'Your ARM-vs-fixed answer is only as good as the spread. Save this comparison and see real quotes for both when LoanKnow launches.',
    buttonLabel: 'Compare live quotes',
  },
  'interest-sensitivity': {
    headline: 'Lock a rate before it moves against you',
    body: 'You just saw what a quarter point costs. Save your sensitivity analysis and get rate alerts from competing lenders when LoanKnow launches.',
    buttonLabel: 'Watch rates for me',
  },
  'timeline-simulator': {
    headline: 'Get quotes for the timeline you just mapped',
    body: 'Whether you buy in 3 months or 2 years, save your plan and we\u2019ll line up competing lenders for your window when LoanKnow launches.',
    buttonLabel: 'Save my timeline',
  },
  'closing-costs': {
    headline: 'Find lenders with lower fees on your loan size',
    body: 'Closing costs vary wildly by lender. Save your estimate and compare real fee sheets when LoanKnow launches.',
    buttonLabel: 'Compare lender fees',
  },
  amortization: {
    headline: 'See if a better rate changes this schedule',
    body: 'A small rate drop reshapes your whole amortization curve. Save your schedule and see what competing lenders can do when LoanKnow launches.',
    buttonLabel: 'Save my schedule',
  },
  'extra-payment': {
    headline: 'Pair extra payments with a lower rate',
    body: 'Extra payments plus a better rate compound each other. Save your payoff plan and see both levers when LoanKnow launches.',
    buttonLabel: 'Save my payoff plan',
  },
  biweekly: {
    headline: 'See if a lower rate beats biweekly payments alone',
    body: 'Biweekly payments help — a lower rate helps more. Save your numbers and compare both when LoanKnow launches.',
    buttonLabel: 'Save my numbers',
  },
  acceleration: {
    headline: 'Accelerate your payoff with a better rate too',
    body: 'You\u2019ve mapped the fast-payoff path. Save it and see if a lower rate gets you there even sooner when LoanKnow launches.',
    buttonLabel: 'Save my payoff path',
  },
};

/**
 * Returns contextual CTA copy for a calculator, optionally personalized
 * from the user's current inputs (e.g. "See if lenders can beat 6.25%").
 */
export function getLoanKnowCtaCopy(calculatorSlug?: string, inputs?: Inputs): LoanKnowCtaCopy {
  const base = (calculatorSlug && STATIC_COPY[calculatorSlug]) || DEFAULT_COPY;

  if (calculatorSlug === 'refinance' && inputs) {
    const newRate = asNumber(inputs.newRate);
    if (newRate !== null && newRate < 25) {
      return {
        ...base,
        headline: `See if lenders can beat ${newRate}%`,
        buttonLabel: `See if lenders can beat ${newRate}%`,
      };
    }
  }

  if (calculatorSlug === 'arm-vs-fixed' && inputs) {
    const fixedRate = asNumber(inputs.fixedRate);
    if (fixedRate !== null && fixedRate < 25) {
      return { ...base, headline: `See if lenders can beat ${fixedRate}% fixed` };
    }
  }

  if (calculatorSlug === 'points-buydown' && inputs) {
    const parRate = asNumber(inputs.parRate);
    if (parRate !== null && parRate < 25) {
      return { ...base, headline: `See if lenders can beat ${parRate}% without points` };
    }
  }

  return base;
}
