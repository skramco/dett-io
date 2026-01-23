import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Dett
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              href="/calculators" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Calculators
            </Link>
            <Link 
              href="/learn" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Learn
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
