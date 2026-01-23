import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 font-semibold text-slate-900">Dett</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Free mortgage calculators. No ads, no lead capture, no BS.
            </p>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-medium text-slate-900">Calculators</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/refinance" className="text-slate-600 hover:text-blue-600">Refinance</Link></li>
              <li><Link href="/calculators/extra-payment" className="text-slate-600 hover:text-blue-600">Extra Payments</Link></li>
              <li><Link href="/calculators/rent-vs-buy" className="text-slate-600 hover:text-blue-600">Rent vs Buy</Link></li>
              <li><Link href="/calculators" className="text-slate-600 hover:text-blue-600">View All →</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-medium text-slate-900">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/learn" className="text-slate-600 hover:text-blue-600">About Debt</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-medium text-slate-900">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-slate-600 hover:text-blue-600">Privacy</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-blue-600">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-600">
            © {new Date().getFullYear()} Dett. Built to help, not to sell.
          </p>
        </div>
      </Container>
    </footer>
  );
}
