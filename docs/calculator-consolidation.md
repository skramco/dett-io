# Calculator consolidation (ENG-345)

## What changed

Six overlapping calculators were merged into two stronger tools:

| Old tool | Old URL | Merged into |
| --- | --- | --- |
| Extra Payment Impact | `/calculators/extra-payment` | **Pay Off Faster** — `/calculators/payoff` |
| Acceleration Planner | `/calculators/acceleration` | **Pay Off Faster** — `/calculators/payoff` |
| Biweekly Payments | `/calculators/biweekly` | **Pay Off Faster** — `/calculators/payoff` |
| Points & Buydown | `/calculators/points-buydown` | **Best Loan for My Timeline** — `/calculators/loan-timeline` |
| Decision Timeline Simulator | `/calculators/timeline-simulator` | **Best Loan for My Timeline** — `/calculators/loan-timeline` |
| ARM vs Fixed | `/calculators/arm-vs-fixed` | **Best Loan for My Timeline** — `/calculators/loan-timeline` |

## Product decision: redirects, not thin pages

**Decision: permanently redirect the old URLs. Do not keep thin pages.**

Rationale:

- **Duplicate math, diluted intent.** The three payoff tools all amortized the same
  loan with extra principal; the three rate/structure tools all compared payment
  streams over a hold horizon. Keeping six thin pages would have kept six diverging
  copies of the same math and split search intent (and link equity) across
  near-duplicate content — the problem this consolidation exists to fix.
- **Redirects preserve ranking equity.** Old URLs issue permanent (308) redirects
  via `next.config.ts`, which Google treats like a 301 and passes equity to the
  merged page. Each merged page's keyword set absorbs the head terms of the pages
  it replaced, and the merged pages are self-canonical.
- **Embeds keep working.** Partner embeds of the old slugs (`/embed/extra-payment`
  etc.) redirect to the corresponding merged embed, so existing iframes don't break.

## Implementation notes

- **Shared math module:** both merged tools (and future calculators) derive their
  numbers from `lib/calculators/mortgageMath.ts` — the same module introduced by
  ENG-332 — instead of re-implementing the amortization formulas locally.
- **Proper ARM adjustment (ENG-324 / ENG-330):** the merged tool models
  adjustments after the fixed period using the shared `armAdjustedRate` helper —
  initial cap on the first reset, periodic cap later, lifetime cap, and a floor
  at the margin. Modern 5/6 SOFR naming and adjustment frequency are first-class
  inputs. The payment is re-amortized over the remaining term at each adjustment,
  plus a worst-case path where every adjustment hits its cap. Named falling /
  expected / rising index paths and a 400-path Monte Carlo P10–P90 band
  (ENG-349) sit alongside that cap-driven upper bound.
- **Points & temporary buydowns (ENG-325):** net cost includes remaining
  balance, and 1-0 / 2-1 / 3-2-1 buydowns are modeled (note rate stays at par;
  unused subsidy is credited if you leave mid-buydown).
- **Honest comparison metric:** "Best Loan for My Timeline" ranks options by
  *net cost* (payments + upfront costs − principal paid down) rather than total
  payments, so high-payment/high-equity options like the 15-year fixed are
  compared fairly.
- **Fair prepay-vs-invest (ENG-323):** "Pay Off Faster" compares both paths with
  identical monthly cash outflow and measures net worth at the original term.
  After early payoff, the prepay path invests the freed-up payment. The
  guaranteed return on prepaying is the loan rate itself — not interest saved
  divided by extra paid. When the investment return equals the loan rate, both
  paths end equal.
- **Shared formatters (ENG-333):** both merged tools use `formatCurrency` for
  summaries, insights, and result surfaces — whole dollars with thousands
  separators, no `$Xk` abbreviations.
- **Shareable URLs (ENG-344):** both pages restore inputs from the query string
  via `useUrlInputs`.
- **Scenario prefill (ENG-346):** both pages call `useScenarioPrefill`. Pay Off
  Faster maps loan amount / rate / term; Best Loan for My Timeline maps
  `parRate` and keeps ARM / 15-year / points sibling rates at the same spread.
- **Biweekly servicer note (ENG-350):** Pay Off Faster warns that many servicers
  reject half-payments or a true biweekly schedule, and points users to the
  DIY extra-principal method instead.
- **Assumptions above the fold (ENG-343):** both merged tools pass an
  `assumptions` list to `CalculatorLayout` so rate/term/timeline caveats (and
  the standing "not an APR" note) sit above the fold.
- **SEO surface updates:** sitemap, internal links (nav, footers, wizard, guides,
  comparisons, definitions), `llms.txt`, and per-page metadata/JSON-LD all point
  at the new slugs only.
