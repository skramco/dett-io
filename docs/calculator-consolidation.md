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
- **Proper ARM adjustment:** the old Timeline Simulator amortized the ARM at its
  teaser rate for the entire hold. The merged tool models annual adjustments after
  the fixed period (`min(index + margin, current + periodic cap, initial + lifetime cap)`)
  and re-amortizes the payment over the remaining term at each adjustment, plus a
  worst-case path where every adjustment hits its cap.
- **Honest comparison metric:** "Best Loan for My Timeline" ranks options by
  *net cost* (payments + upfront costs − principal paid down) rather than total
  payments, so high-payment/high-equity options like the 15-year fixed are
  compared fairly.
- **SEO surface updates:** sitemap, internal links (nav, footers, wizard, guides,
  comparisons, definitions), `llms.txt`, and per-page metadata/JSON-LD all point
  at the new slugs only.
