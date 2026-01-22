import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Dett</h3>
            <p className="text-sm text-muted leading-relaxed">
              Free mortgage calculators. No ads, no lead capture, no BS.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Calculators</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/refinance" className="text-muted hover:text-accent">Refinance</Link></li>
              <li><Link href="/calculators/extra-payment" className="text-muted hover:text-accent">Extra Payments</Link></li>
              <li><Link href="/calculators/rent-vs-buy" className="text-muted hover:text-accent">Rent vs Buy</Link></li>
              <li><Link href="/calculators" className="text-muted hover:text-accent">View All →</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/learn" className="text-muted hover:text-accent">About Debt</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted hover:text-accent">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted hover:text-accent">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted text-center">
            © {new Date().getFullYear()} Dett. Built to help, not to sell.
          </p>
        </div>
      </Container>
    </footer>
  );
}
