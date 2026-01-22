import Link from "next/link";
import { ReactNode } from "react";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import Container from "./ui/Container";

interface CalculatorLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function CalculatorLayout({ children, title, description }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        <Container>
          {/* Back link - subtle and unobtrusive */}
          <div className="mb-8">
            <Link 
              href="/calculators" 
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              ← All Calculators
            </Link>
          </div>
          
          {/* Page header - clear hierarchy, no decoration */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {title}
            </h1>
            <p className="text-lg text-muted max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Calculator content */}
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
