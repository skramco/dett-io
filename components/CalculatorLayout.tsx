import Link from "next/link";
import { ReactNode } from "react";
import { Calculator } from "lucide-react";

interface CalculatorLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function CalculatorLayout({ children, title, description }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="border-b border-white/50 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
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
              <Link href="/calculators" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                Calculators
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Link href="/calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md">
            ← Back to All Calculators
          </Link>
        </div>
        
        <div className="mb-10 bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl font-medium">
            {description}
          </p>
        </div>

        {children}
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
