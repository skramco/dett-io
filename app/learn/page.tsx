import Link from "next/link";
import { BookOpen, TrendingUp, Scale, Brain } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-slate-900">
                Dett
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/learn" className="text-sm font-medium text-slate-900">
                Learn
              </Link>
              <Link href="/calculators" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Calculators
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Learn About Debt
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Understanding debt is the first step to making better financial decisions.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                <BookOpen className="w-5 h-5 text-slate-900" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">What is Debt?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                Debt is money you borrow and promise to pay back, usually with interest. It's a tool that lets you buy things now and pay for them over time.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                When you take on debt, you're making a bet: that having the money now is worth more than the extra cost (interest) you'll pay later.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 my-6">
                <p className="text-base text-slate-700 font-medium mb-2">Key Concept:</p>
                <p className="text-base text-slate-600">
                  Every dollar of debt has two costs: the principal (what you borrowed) and the interest (what you pay for borrowing it). Most people only think about the monthly payment, but the total interest can be massive.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                <Scale className="w-5 h-5 text-slate-900" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Good Debt vs Bad Debt</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Not all debt is created equal. The difference comes down to what you're buying and at what cost.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">Good Debt</h3>
                  <ul className="space-y-2 text-base text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Low interest rates</strong> (typically under 6%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Buys appreciating assets</strong> (home, education)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Tax benefits</strong> (mortgage interest deduction)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Builds wealth</strong> over time</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-900 mb-3">Bad Debt</h3>
                  <ul className="space-y-2 text-base text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span><strong>High interest rates</strong> (credit cards, payday loans)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span><strong>Buys depreciating assets</strong> (cars, electronics)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span><strong>No tax benefits</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span><strong>Erodes wealth</strong> through interest</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-base text-slate-700 font-medium mb-2">Reality Check:</p>
                <p className="text-base text-slate-600">
                  Even "good debt" can become bad if you borrow more than you can afford or at a rate that's too high. A mortgage at 8% interest might not be as good as it seems.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                <TrendingUp className="w-5 h-5 text-slate-900" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Why Interest + Time Matter More Than You Think</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                Most people focus on the monthly payment. But the real cost of debt is determined by two things: the interest rate and how long you carry it.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <p className="text-base text-amber-900 font-semibold mb-3">Example: $300,000 Mortgage</p>
                <div className="space-y-2 text-base text-amber-800">
                  <p><strong>At 4% for 30 years:</strong> You pay $215,609 in interest</p>
                  <p><strong>At 7% for 30 years:</strong> You pay $418,527 in interest</p>
                  <p className="pt-2 border-t border-amber-300 mt-3"><strong>Difference:</strong> $202,918 — just from 3% higher interest</p>
                </div>
              </div>

              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                Time is just as important. The longer you carry debt, the more interest compounds against you.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <p className="text-base text-amber-900 font-semibold mb-3">Same $300,000 at 6%:</p>
                <div className="space-y-2 text-base text-amber-800">
                  <p><strong>30-year loan:</strong> $347,515 in interest</p>
                  <p><strong>15-year loan:</strong> $151,894 in interest</p>
                  <p className="pt-2 border-t border-amber-300 mt-3"><strong>Difference:</strong> $195,621 saved by paying it off faster</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-base text-slate-700 font-medium mb-2">The Takeaway:</p>
                <p className="text-base text-slate-600">
                  Small differences in interest rates and loan terms create massive differences in what you actually pay. This is why our calculators show you the total cost, not just the monthly payment.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                <Brain className="w-5 h-5 text-slate-900" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">How Lenders Think About Debt</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                Lenders make money when you borrow. Understanding how they think helps you make better decisions.
              </p>

              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">They want you to focus on monthly payments</h3>
                  <p className="text-base text-slate-600">
                    "Can you afford $1,800/month?" sounds better than "Can you afford to pay $348,000 in interest?"
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">They profit from longer terms</h3>
                  <p className="text-base text-slate-600">
                    A 30-year loan generates way more interest than a 15-year loan, even at the same rate.
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">They hide the true cost</h3>
                  <p className="text-base text-slate-600">
                    Most mortgage calculators only show principal and interest. They leave out property tax, insurance, HOA fees, and PMI — which can add 30-50% to your monthly cost.
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">They make refinancing confusing</h3>
                  <p className="text-base text-slate-600">
                    "Save $200/month!" sounds great until you realize the closing costs take 3 years to break even, and you're extending your loan by 5 years.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-base text-slate-700 font-medium mb-2">Your Advantage:</p>
                <p className="text-base text-slate-600">
                  Use our calculators to see what lenders don't want you to see: the full picture. Compare scenarios. Understand tradeoffs. Make decisions based on total cost, not just monthly payments.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 bg-slate-900 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to see your numbers?
          </h2>
          <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
            Use our calculators to understand exactly what your debt costs and what your best options are.
          </p>
          <Link
            href="/calculators"
            className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-100 transition-colors"
          >
            Explore Calculators
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-slate-600">
            <p className="mb-2">
              <strong className="font-semibold text-slate-900">Dett</strong> — Free debt education and calculators
            </p>
            <p>
              Sister site to{" "}
              <a href="https://loanknow.com" className="text-slate-900 hover:underline">
                LoanKnow
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
