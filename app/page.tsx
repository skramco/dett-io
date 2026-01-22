import Link from "next/link";
import { Calculator, TrendingDown, BookOpen, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="border-b border-white/50 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
            <div className="flex gap-8">
              <Link href="/calculators" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                Calculators
              </Link>
              <Link href="/learn" className="text-slate-700 hover:text-purple-600 font-semibold transition-colors">
                Learn
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm mb-6 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              100% Free • No Signup • No Spam • No BS
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                The #1 Place
              </span>
              <br />
              <span className="text-slate-900">
                For Mortgage Math
              </span>
            </h1>
            
            <p className="text-2xl text-slate-700 mb-4 max-w-3xl mx-auto font-medium">
              Make smarter mortgage decisions with crystal-clear calculators
            </p>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              No hidden fees. No email required. No sales pitch. Just honest math to help you decide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/calculators"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Start Calculating
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/learn"
                className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg border-2 border-slate-300 hover:border-purple-600 hover:shadow-xl transition-all duration-200"
              >
                Learn the Basics
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-semibold">Always Free</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="font-semibold">No Registration</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="font-semibold">Privacy First</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Dett Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Why Dett.io?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Your first stop for mortgage decisions. No pressure, just clarity.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-blue-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Real Numbers
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  See the <strong>full picture</strong>: principal, interest, taxes, insurance, HOA, PMI. 
                  Not just the pretty parts lenders show you.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-green-200">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Zero BS
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  <strong>100% free.</strong> No email required. No lead forms. No sales calls. 
                  No tricks. Just tools that actually help you.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Learn First
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Understand <strong>how debt works</strong> before you commit. 
                  Knowledge is power, especially with your biggest purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Calculators Preview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Popular Calculators
              </h2>
              <p className="text-xl text-slate-600">
                Pick a question, get an answer. It's that simple.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Link href="/calculators/mortgage-cost" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-blue-500">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Calculator className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">True Monthly Cost</h3>
                <p className="text-sm text-slate-600">See your real payment including all fees</p>
              </Link>

              <Link href="/calculators/refinance" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-purple-500">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <TrendingDown className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Refinance Worth It?</h3>
                <p className="text-sm text-slate-600">Calculate break-even point and savings</p>
              </Link>

              <Link href="/calculators/extra-payment" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-green-500">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <ArrowRight className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Extra Payments</h3>
                <p className="text-sm text-slate-600">Pay off faster or invest? See the math</p>
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                View All Calculators
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Make Smarter Decisions?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start with any calculator. No signup, no spam, no strings attached.
            </p>
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
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
          
          <div className="border-t border-slate-200 pt-8 text-center">
            <p className="text-sm text-slate-500">
              Not financial advice. For educational purposes only. Always consult with a qualified financial advisor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
