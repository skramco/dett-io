// Contextual LoanKnow CTA copy per calculator.
// Each entry can read the user's current inputs to personalize the headline
// (e.g. "See if lenders can beat 6.25%" on the Refinance calculator).

export interface LoanKnowCtaContent {
  headline: string;
  body: string;
  buttonLabel: string;
}

type CtaResolver = (inputs: Record<string, unknown>) => LoanKnowCtaContent;

/** Pull a plausible interest rate (in %) out of the inputs, if present. */
function rateFrom(inputs: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = inputs[key];
    const num = typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) : NaN;
    if (Number.isFinite(num) && num > 0 && num < 25) {
      return `${num}%`;
    }
  }
  return null;
}

const DEFAULT_CTA: LoanKnowCtaContent = {
  headline: 'Put your numbers to work',
  body: 'LoanKnow takes the numbers you just ran and lets lenders compete for your business — anonymously and for free. Your inputs carry over so you never re-enter anything.',
  buttonLabel: 'Save my numbers & notify me',
};

const CTA_BY_SLUG: Record<string, CtaResolver> = {
  'mortgage-cost': () => ({
    headline: 'See what lenders would actually offer on this payment',
    body: 'You know your true monthly cost. LoanKnow shows you real lender offers against it — anonymously, with your numbers carried over.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  affordability: () => ({
    headline: 'Turn your budget into real loan offers',
    body: 'You know what you can afford. LoanKnow lets lenders compete to fund it — no cold calls, your inputs carry over.',
    buttonLabel: 'Save my budget & notify me',
  }),
  'down-payment': () => ({
    headline: 'Find lenders who fit your down payment',
    body: 'Different lenders treat low and high down payments very differently. LoanKnow matches your strategy to lenders who compete for it.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  'rent-vs-buy': () => ({
    headline: 'Leaning toward buying? Make lenders compete',
    body: 'If the math says buy, the next step is a great rate. LoanKnow brings lender offers to you — anonymously and for free.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  refinance: (inputs) => {
    const newRate = rateFrom(inputs, 'newRate');
    return {
      headline: newRate
        ? `See if lenders can beat ${newRate}`
        : 'See if lenders can beat the rate you were quoted',
      body: 'Your break-even math only holds if the rate is real. LoanKnow makes lenders compete on your refinance — your numbers carry over.',
      buttonLabel: 'Save my numbers & notify me',
    };
  },
  'cash-out-refi': (inputs) => {
    const rate = rateFrom(inputs, 'newRate');
    return {
      headline: rate
        ? `Compare real cash-out offers against ${rate}`
        : 'Compare real cash-out offers, not estimates',
      body: 'Cash-out pricing varies widely between lenders. LoanKnow brings competing offers to your exact scenario.',
      buttonLabel: 'Save my numbers & notify me',
    };
  },
  'recast-vs-refi': () => ({
    headline: 'Get a real refi quote before you decide',
    body: 'Recast vs refinance comes down to the rate you can actually get. LoanKnow shows you what lenders will really offer.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  'points-buydown': () => ({
    headline: 'See if paying points is worth it with real quotes',
    body: 'Point pricing differs by lender. LoanKnow lets you compare real buydown offers side by side, with your numbers carried over.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  'arm-vs-fixed': () => ({
    headline: 'Compare real ARM and fixed quotes side by side',
    body: 'The ARM vs fixed answer depends on real pricing, not averages. LoanKnow brings both from competing lenders.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  'timeline-simulator': () => ({
    headline: 'Put your payoff plan into action',
    body: 'A better rate accelerates every timeline you just simulated. LoanKnow makes lenders compete for your loan.',
    buttonLabel: 'Save my plan & notify me',
  }),
  'extra-payment': () => ({
    headline: 'Make sure your rate isn\u2019t the real problem',
    body: 'Extra payments help — but a lower rate can save more with zero extra cash. LoanKnow shows what lenders would offer you.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  acceleration: () => ({
    headline: 'Pay it off faster — starting with a better rate',
    body: 'Every acceleration strategy works better on a lower rate. LoanKnow lets lenders compete to give you one.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  biweekly: () => ({
    headline: 'Stack biweekly payments on a better rate',
    body: 'Biweekly payments plus a lower rate is the fastest payoff combo. LoanKnow brings competing rate offers to you.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  va: () => ({
    headline: 'Find VA-savvy lenders who compete for you',
    body: 'Not every lender prices VA loans well. LoanKnow matches your scenario to lenders who actually compete on VA terms.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  fha: () => ({
    headline: 'Compare real FHA offers, not advertised rates',
    body: 'FHA pricing and MIP treatment vary by lender. LoanKnow brings competing FHA offers to your exact numbers.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  pmi: () => ({
    headline: 'See if a better loan gets you out of PMI sooner',
    body: 'The right loan structure can shrink or remove PMI. LoanKnow shows lender offers built around your equity position.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  'closing-costs': () => ({
    headline: 'Get real closing-cost quotes, not estimates',
    body: 'Lender fees are negotiable and vary widely. LoanKnow lets lenders compete on the full cost, not just the rate.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  dti: () => ({
    headline: 'Get your real DTI reviewed',
    body: 'Lenders calculate DTI differently than back-of-napkin math. LoanKnow shows how real lenders would read your ratio — and who would compete for you.',
    buttonLabel: 'Save my DTI & notify me',
  }),
  amortization: () => ({
    headline: 'See how a better rate reshapes this schedule',
    body: 'A lower rate shifts every row of your amortization table toward principal. LoanKnow shows what lenders would actually offer.',
    buttonLabel: 'Save my numbers & notify me',
  }),
  'interest-sensitivity': (inputs) => {
    const rate = rateFrom(inputs, 'interestRate', 'rate', 'baseRate');
    return {
      headline: rate
        ? `You\u2019ve seen what moving off ${rate} is worth — now lock a real rate`
        : 'You\u2019ve seen what every 0.25% is worth — now lock a real rate',
      body: 'Rate sensitivity is theory until a lender commits. LoanKnow makes lenders compete to offer you the lowest real rate.',
      buttonLabel: 'Save my numbers & notify me',
    };
  },
};

export function getLoanKnowCta(
  calculatorSlug: string | undefined,
  inputs: Record<string, unknown> | undefined
): LoanKnowCtaContent {
  if (!calculatorSlug) return DEFAULT_CTA;
  const resolver = CTA_BY_SLUG[calculatorSlug];
  return resolver ? resolver(inputs ?? {}) : DEFAULT_CTA;
}
