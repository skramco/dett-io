import Link from 'next/link';
import Container from './Container';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Dett</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              href="/calculators" 
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Calculators
            </Link>
            <Link 
              href="/learn" 
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Learn
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
