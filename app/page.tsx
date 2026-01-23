import Link from "next/link";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section - Engaging but professional */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-light/30 to-transparent" />
          <Container>
            <div className="max-w-4xl mx-auto text-center relative">
              <div className="inline-flex items-center gap-2 bg-success text-white px-4 py-2 rounded-full text-sm mb-8 font-medium shadow-sm">
                <span className="w-2 h-2 bg-white rounded-full" />
                100% Free • No Signup • No Spam
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                Make Smarter<br />
                <span className="text-accent">Mortgage Decisions</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted mb-12 leading-relaxed max-w-2xl mx-auto">
                Crystal-clear calculators. No hidden fees. No email required. Just honest math to help you decide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculators">
                  <Button size="lg" className="shadow-lg hover:shadow-xl">
                    Start Calculating →
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button variant="secondary" size="lg">
                    Learn the Basics
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Dett Section - Enhanced cards with visual interest */}
        <section className="py-24 bg-surface">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Why Dett?
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                Your first stop for mortgage decisions. No pressure, just clarity.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <CardTitle className="text-xl">Real Numbers</CardTitle>
                  <CardDescription className="text-base">
                    See the full picture: principal, interest, taxes, insurance, HOA, PMI. Not just the pretty parts lenders show you.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardHeader>
                  <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <CardTitle className="text-xl">Zero BS</CardTitle>
                  <CardDescription className="text-base">
                    100% free. No email required. No lead forms. No sales calls. No tricks. Just tools that actually help you.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <CardTitle className="text-xl">Learn First</CardTitle>
                  <CardDescription className="text-base">
                    Understand how debt works before you commit. Knowledge is power, especially with your biggest purchase.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </Container>
        </section>

        {/* Featured Calculators - Enhanced with visual interest */}
        <section className="py-24">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Popular Calculators
              </h2>
              <p className="text-xl text-muted">
                Pick a question, get an answer. It's that simple.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Link href="/calculators/mortgage-cost" className="group">
                <Card hover className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                      <span className="text-2xl group-hover:scale-110 transition-transform">💰</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">True Monthly Cost</CardTitle>
                    <CardDescription className="text-base">
                      See your real payment including all fees
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/calculators/refinance" className="group">
                <Card hover className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                      <span className="text-2xl group-hover:scale-110 transition-transform">🔄</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">Refinance Worth It?</CardTitle>
                    <CardDescription className="text-base">
                      Calculate break-even point and savings
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/calculators/extra-payment" className="group">
                <Card hover className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                      <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">Extra Payments</CardTitle>
                    <CardDescription className="text-base">
                      Pay off faster or invest? See the math
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            <div className="text-center">
              <Link href="/calculators">
                <Button size="lg" className="shadow-md hover:shadow-lg">
                  View All Calculators →
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Final CTA - Engaging but professional */}
        <section className="py-24 bg-accent text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-hover opacity-90" />
          <Container size="md">
            <div className="text-center relative">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Make Smarter Decisions?
              </h2>
              <p className="text-xl mb-10 text-accent-light">
                Start with any calculator. No signup, no spam, no strings attached.
              </p>
              <Link href="/calculators">
                <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl">
                  Get Started Free →
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
