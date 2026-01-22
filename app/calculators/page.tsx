import Link from "next/link";
import { Calculator, TrendingDown, DollarSign, Home, RefreshCw, PiggyBank, TrendingUp, Zap, Wallet, Target, Clock, BarChart, Calendar } from "lucide-react";

const calculatorCategories = [
  {
    category: "Buying a Home",
    description: "Starting your homeownership journey",
    calculators: [
      {
        id: "affordability",
        name: "How Much House Can I Afford?",
        description: "Calculate your max home price based on income, debts, and down payment. See conservative, moderate, and aggressive affordability ranges.",
        icon: Home,
        whoFor: "First-time and repeat homebuyers",
        answers: "What's my safe price range?",
        href: "/calculators/affordability",
      },
      {
        id: "down-payment",
        name: "Down Payment Strategy",
        description: "Compare 3%, 5%, 10%, 15%, and 20% down payments. See PMI costs, cash requirements, and break-even analysis.",
        icon: DollarSign,
        whoFor: "Buyers deciding how much to put down",
        answers: "How much should I put down?",
        href: "/calculators/down-payment",
      },
      {
        id: "rent-vs-buy",
        name: "Rent vs Buy Truth Model",
        description: "Full comparison including rent inflation, home appreciation, opportunity cost, and transaction costs. See net worth crossover year.",
        icon: TrendingUp,
        whoFor: "Renters considering buying",
        answers: "Should I rent or buy?",
        href: "/calculators/rent-vs-buy",
      },
    ],
  },
  {
    category: "Current Homeowners",
    description: "Already own? Optimize your mortgage",
    calculators: [
      {
        id: "mortgage-cost",
        name: "True Monthly Mortgage Cost",
        description: "See your real monthly payment including PITI, HOA, and PMI - not just the principal and interest most calculators show.",
        icon: Calculator,
        whoFor: "Homebuyers and homeowners",
        answers: "What will I actually pay each month?",
        href: "/calculators/mortgage-cost",
      },
      {
        id: "refinance",
        name: "Refinance Break-Even",
        description: "Compare your current loan vs refinancing. See when you break even on closing costs and total savings over time.",
        icon: RefreshCw,
        whoFor: "Homeowners considering refinancing",
        answers: "Is refinancing worth it for me?",
        href: "/calculators/refinance",
      },
      {
        id: "cash-out-refi",
        name: "Cash-Out Refinance Analyzer",
        description: "Understand the true cost of pulling cash from your home. Compare vs HELOC and other alternatives.",
        icon: Wallet,
        whoFor: "Homeowners needing cash",
        answers: "Should I do a cash-out refi?",
        href: "/calculators/cash-out-refi",
      },
      {
        id: "recast-vs-refi",
        name: "Recast vs Refinance",
        description: "Compare lump-sum recast, refinance, and simple prepayment. See which saves the most interest and gives best flexibility.",
        icon: Target,
        whoFor: "Homeowners with lump sum cash",
        answers: "Recast, refi, or just prepay?",
        href: "/calculators/recast-vs-refi",
      },
    ],
  },
  {
    category: "Rate & Structure Decisions",
    description: "Choosing the right loan structure",
    calculators: [
      {
        id: "points-buydown",
        name: "Points & Buydown Optimizer",
        description: "Compare par rate, buying points, lender credits, and temporary buydowns. See best option for your timeline.",
        icon: Zap,
        whoFor: "Buyers choosing rate options",
        answers: "Should I buy points or take credits?",
        href: "/calculators/points-buydown",
      },
      {
        id: "arm-vs-fixed",
        name: "ARM vs Fixed Reality Check",
        description: "Model rate caps, adjustment timelines, and worst-case scenarios. See probability-weighted cost comparison.",
        icon: TrendingDown,
        whoFor: "Buyers considering ARMs",
        answers: "ARM or fixed rate?",
        href: "/calculators/arm-vs-fixed",
      },
      {
        id: "timeline-simulator",
        name: "Mortgage Decision Timeline",
        description: "Find the best mortgage structure based on when you plan to move or refinance. Accounts for refi likelihood.",
        icon: Clock,
        whoFor: "Buyers with specific timelines",
        answers: "What loan fits my timeline?",
        href: "/calculators/timeline-simulator",
      },
    ],
  },
  {
    category: "Payoff & Wealth Strategy",
    description: "Pay off faster or build wealth?",
    calculators: [
      {
        id: "extra-payment",
        name: "Extra Payment Impact",
        description: "See how extra payments save interest and shorten your loan. Compare paying down debt vs investing the money.",
        icon: PiggyBank,
        whoFor: "Anyone with a mortgage",
        answers: "Should I pay extra or invest?",
        href: "/calculators/extra-payment",
      },
      {
        id: "acceleration",
        name: "Mortgage Acceleration Planner",
        description: "Compare prepayment, recast, refinance later, and investing. See fastest payoff vs highest net worth strategies.",
        icon: TrendingUp,
        whoFor: "Homeowners with extra cash flow",
        answers: "What's my best acceleration strategy?",
        href: "/calculators/acceleration",
      },
      {
        id: "biweekly",
        name: "Biweekly vs Monthly Payments",
        description: "See the truth about biweekly payments. Compare true biweekly, fake biweekly, and DIY alternatives.",
        icon: Calendar,
        whoFor: "Homeowners considering biweekly",
        answers: "Is biweekly worth it?",
        href: "/calculators/biweekly",
      },
    ],
  },
  {
    category: "Advanced Analysis",
    description: "Power user tools",
    calculators: [
      {
        id: "interest-sensitivity",
        name: "Interest Rate Sensitivity",
        description: "See how ±0.25%, ±0.5%, ±1% rate changes affect your payment and total cost. Useful for lock decisions.",
        icon: BarChart,
        whoFor: "Buyers timing rate locks",
        answers: "How much does rate timing matter?",
        href: "/calculators/interest-sensitivity",
      },
    ],
  },
];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="border-b border-white/50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dett.io
                </span>
                <p className="text-xs text-slate-600 font-medium">100% Free Forever</p>
              </div>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/learn" className="text-slate-700 hover:text-purple-600 font-semibold transition-colors">
                Learn
              </Link>
              <Link href="/calculators" className="text-blue-600 font-semibold">
                Calculators
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm mb-6 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            100% Free • No Signup Required
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mortgage Calculators
            </span>
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto font-medium">
            Crystal-clear calculators that show you the real numbers. Pick one and start calculating.
          </p>
        </div>

        {calculatorCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{category.category}</h2>
              <p className="text-lg text-slate-600">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.calculators.map((calc, index) => {
                const Icon = calc.icon;
                const colors = [
                  { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'from-blue-600 to-blue-700', hover: 'hover:border-blue-500 hover:shadow-blue-200/50' },
                  { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'from-purple-600 to-purple-700', hover: 'hover:border-purple-500 hover:shadow-purple-200/50' },
                  { bg: 'from-green-50 to-green-100', border: 'border-green-200', icon: 'from-green-600 to-green-700', hover: 'hover:border-green-500 hover:shadow-green-200/50' },
                ];
                const color = colors[index % colors.length];
                return (
                  <Link
                    key={calc.id}
                    href={calc.href}
                    className={`group bg-gradient-to-br ${color.bg} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-200 border-2 ${color.border} ${color.hover}`}
                  >
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color.icon} mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {calc.name}
                    </h3>
                    <p className="text-slate-700 mb-6 leading-relaxed">
                      {calc.description}
                    </p>
                    <div className="space-y-3 pt-6 border-t-2 border-white/50">
                      <div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Who it's for:</span>
                        <span className="text-sm text-slate-800 font-medium">{calc.whoFor}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Answers:</span>
                        <span className="text-sm text-slate-800 font-medium">{calc.answers}</span>
                      </div>
                    </div>
                    <div className="mt-6 text-base font-bold text-slate-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                      Start Calculating
                      <span className="text-xl">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 sm:p-16 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Learn the fundamentals of debt, interest, and how lenders think about your money.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center rounded-xl bg-white text-blue-600 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Learn About Debt
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dett.io
              </span>
            </div>
            <p className="text-slate-600 font-medium mb-2">
              The #1 place for mortgage calculators and decisions
            </p>
            <p className="text-sm text-slate-500">
              100% Free • No Signup Required • Privacy First
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
