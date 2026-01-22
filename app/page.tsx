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
        {/* Hero Section - Calm and clear */}
        <section className="py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-success-light text-foreground px-4 py-2 rounded-lg text-sm mb-8 border border-success/20">
                100% Free • No Signup • No Spam
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
                Make Smarter Mortgage Decisions
              </h1>
              
              <p className="text-xl text-muted mb-10 leading-relaxed">
                Crystal-clear calculators. No hidden fees. No email required. No sales pitch. Just honest math to help you decide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculators">
                  <Button size="lg">
                    Start Calculating
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

        {/* Why Dett Section - Minimal cards */}
        <section className="py-20 bg-surface">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Why Dett?
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Your first stop for mortgage decisions. No pressure, just clarity.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Real Numbers</CardTitle>
                  <CardDescription>
                    See the full picture: principal, interest, taxes, insurance, HOA, PMI. Not just the pretty parts lenders show you.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zero BS</CardTitle>
                  <CardDescription>
                    100% free. No email required. No lead forms. No sales calls. No tricks. Just tools that actually help you.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learn First</CardTitle>
                  <CardDescription>
                    Understand how debt works before you commit. Knowledge is power, especially with your biggest purchase.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </Container>
        </section>

        {/* Featured Calculators - Clean and simple */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Popular Calculators
              </h2>
              <p className="text-lg text-muted">
                Pick a question, get an answer.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Link href="/calculators/mortgage-cost">
                <Card hover>
                  <CardHeader>
                    <CardTitle>True Monthly Cost</CardTitle>
                    <CardDescription>
                      See your real payment including all fees
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/calculators/refinance">
                <Card hover>
                  <CardHeader>
                    <CardTitle>Refinance Worth It?</CardTitle>
                    <CardDescription>
                      Calculate break-even point and savings
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/calculators/extra-payment">
                <Card hover>
                  <CardHeader>
                    <CardTitle>Extra Payments</CardTitle>
                    <CardDescription>
                      Pay off faster or invest? See the math
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            <div className="text-center">
              <Link href="/calculators">
                <Button size="lg">
                  View All Calculators
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Final CTA - Subtle, not loud */}
        <section className="py-20 bg-accent-light">
          <Container size="md">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Make Smarter Decisions?
              </h2>
              <p className="text-lg text-muted mb-8">
                Start with any calculator. No signup, no spam, no strings attached.
              </p>
              <Link href="/calculators">
                <Button size="lg">
                  Get Started Free
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
