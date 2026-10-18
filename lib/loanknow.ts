// LoanKnow CTA configuration.
//
// Scope (per Mark / ENG-337): LoanKnow is NOT taking live leads yet.
// No lead capture forms, no contact info collection, no posting to any
// LoanKnow endpoint. The CTA is an external link to LoanKnow's
// coming-soon / waitlist page only.
//
// Kill switch: set NEXT_PUBLIC_LOANKNOW_CTA_ENABLED=false to hide the CTA
// everywhere. Defaults to enabled.
export const LOANKNOW_CTA_ENABLED =
  process.env.NEXT_PUBLIC_LOANKNOW_CTA_ENABLED !== 'false';

// LoanKnow coming-soon / waitlist page. Override via env when the live
// flow is ready (no code change needed).
export const LOANKNOW_WAITLIST_URL =
  process.env.NEXT_PUBLIC_LOANKNOW_WAITLIST_URL || 'https://loanknow.com';

/**
 * Waitlist URL with attribution params (no personal data — just which
 * calculator the click came from).
 */
export function getLoanKnowWaitlistUrl(calculatorSlug?: string): string {
  try {
    const url = new URL(LOANKNOW_WAITLIST_URL);
    url.searchParams.set('utm_source', 'dett.io');
    url.searchParams.set('utm_medium', 'calculator_cta');
    if (calculatorSlug) url.searchParams.set('utm_content', calculatorSlug);
    return url.toString();
  } catch {
    return LOANKNOW_WAITLIST_URL;
  }
}

export interface LoanKnowCtaCopy {
  headline: string;
  body: string;
}

// Shared compliance note: copy must stay educational and must NOT use
// "qualify", "pre-approved", "guaranteed", or promise specific rates/terms.
const DEFAULT_BODY =
  'LoanKnow is a free, anonymous way to have lenders compete for your business — launching soon. Join the waitlist and be first to know when it goes live.';

const DEFAULT_COPY: LoanKnowCtaCopy = {
  headline: 'Ready for the next step?',
  body: DEFAULT_BODY,
};

// One contextual CTA per calculator, keyed by calculatorSlug.
const CTA_COPY_BY_SLUG: Record<string, LoanKnowCtaCopy> = {
  'mortgage-cost': {
    headline: 'You know your true monthly cost — make lenders compete for it',
    body: `Rate quotes rarely show the full picture you just calculated. ${DEFAULT_BODY}`,
  },
  refinance: {
    headline: 'See if lenders can beat your current rate',
    body: `If refinancing looks close, competition is what tips the math in your favor. ${DEFAULT_BODY}`,
  },
  'extra-payment': {
    headline: 'A lower rate accelerates your payoff even more',
    body: `Extra payments plus a better rate compound your savings. ${DEFAULT_BODY}`,
  },
  affordability: {
    headline: 'Shopping soon? Let lenders compete for your price range',
    body: `Knowing your comfortable budget is step one — comparing lenders is step two. ${DEFAULT_BODY}`,
  },
  'down-payment': {
    headline: 'Saving toward a down payment? Line up lender comparisons early',
    body: `When you hit your savings goal, you'll want multiple lenders at the table. ${DEFAULT_BODY}`,
  },
  'rent-vs-buy': {
    headline: 'Leaning toward buying? Compare lenders before you commit',
    body: `The rate you end up with can swing the rent-vs-buy math. ${DEFAULT_BODY}`,
  },
  'points-buydown': {
    headline: 'Points pricing varies by lender — compare before you pay',
    body: `The same buydown can cost very different amounts at different lenders. ${DEFAULT_BODY}`,
  },
  'arm-vs-fixed': {
    headline: 'Compare real ARM and fixed quotes side by side',
    body: `The ARM-vs-fixed answer depends on the actual spread lenders offer you. ${DEFAULT_BODY}`,
  },
  'cash-out-refi': {
    headline: 'Tapping equity? Make lenders compete on the cost',
    body: `Cash-out pricing varies widely — competition keeps it honest. ${DEFAULT_BODY}`,
  },
  'recast-vs-refi': {
    headline: 'If refinancing wins, make lenders earn it',
    body: `A better refinance rate can change this comparison entirely. ${DEFAULT_BODY}`,
  },
  acceleration: {
    headline: 'Pair your payoff plan with a better rate',
    body: `Every fraction of a percent you save goes straight to your payoff timeline. ${DEFAULT_BODY}`,
  },
  biweekly: {
    headline: 'Biweekly payments plus a lower rate — double the impact',
    body: `A better rate shortens your payoff on top of the biweekly effect. ${DEFAULT_BODY}`,
  },
  'interest-sensitivity': {
    headline: 'Rates move fast — be ready to compare when they do',
    body: `You've seen how much a small rate change matters. ${DEFAULT_BODY}`,
  },
  'timeline-simulator': {
    headline: 'Found the structure that fits your timeline? Compare lenders next',
    body: `The right loan structure still needs the right price. ${DEFAULT_BODY}`,
  },
  amortization: {
    headline: 'See how a different rate reshapes this schedule',
    body: `Your amortization curve is set by your rate — and rates are negotiable. ${DEFAULT_BODY}`,
  },
  dti: {
    headline: 'Get your real DTI in front of competing lenders',
    body: `Lenders weigh DTI differently — comparing several shows you the real range. ${DEFAULT_BODY}`,
  },
  'closing-costs': {
    headline: 'Closing costs vary by lender — compare them side by side',
    body: `Many of the fees you just estimated are negotiable or lender-specific. ${DEFAULT_BODY}`,
  },
  pmi: {
    headline: 'The right loan structure can shrink or remove PMI',
    body: `PMI pricing and removal rules differ across lenders. ${DEFAULT_BODY}`,
  },
  fha: {
    headline: 'FHA pricing differs more than you might expect',
    body: `Comparing FHA-experienced lenders can meaningfully change your costs. ${DEFAULT_BODY}`,
  },
  va: {
    headline: 'You earned the VA benefit — make lenders compete for it',
    body: `VA loan pricing varies by lender, so comparison shopping pays off. ${DEFAULT_BODY}`,
  },
};

export function getLoanKnowCtaCopy(calculatorSlug?: string): LoanKnowCtaCopy {
  if (calculatorSlug && CTA_COPY_BY_SLUG[calculatorSlug]) {
    return CTA_COPY_BY_SLUG[calculatorSlug];
  }
  return DEFAULT_COPY;
}
