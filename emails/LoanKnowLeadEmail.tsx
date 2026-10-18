import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface LoanKnowLeadEmailProps {
  calculatorName: string;
  summary?: string;
  calculatorUrl?: string;
}

export default function LoanKnowLeadEmail({
  calculatorName,
  summary,
  calculatorUrl,
}: LoanKnowLeadEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your numbers are saved — we&apos;ll email you when LoanKnow launches</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Link href="https://dett.io" style={{ textDecoration: 'none' }}>
              <Img
                src="https://dett.io/logo.png"
                alt="dett.io"
                width="140"
                height="36"
                style={{ margin: '0 auto', display: 'block' }}
              />
            </Link>
            <Text style={logoFallback}>dett.io</Text>
          </Section>

          <Section style={badgeSection}>
            <Text style={badgeText}>You&apos;re on the LoanKnow list</Text>
          </Section>

          <Section style={cardSection}>
            <Text style={cardLabel}>WHAT HAPPENS NEXT</Text>
            <Text style={bodyText}>
              We saved the numbers from your <strong>{calculatorName}</strong> calculation.
              When LoanKnow launches, we&apos;ll email you once so you can let lenders compete
              for your business — anonymously and for free — without re-entering anything.
            </Text>
            {summary && (
              <Text style={summaryText}>
                Your saved result: {summary}
              </Text>
            )}
          </Section>

          {calculatorUrl && (
            <Section style={prefilledSection}>
              <Text style={prefilledLabel}>YOUR SAVED NUMBERS</Text>
              <Text style={prefilledDesc}>
                Reopen this exact calculation anytime — all your inputs are prefilled.
              </Text>
              <Button href={calculatorUrl} style={prefilledButton}>
                View Your Saved Calculation
              </Button>
            </Section>
          )}

          <Hr style={footerDivider} />

          <Section style={footer}>
            <Text style={footerDisclaimer}>
              You received this email because you asked to be notified when LoanKnow launches
              and consented to us saving your calculator inputs with your request. We&apos;ll send
              one launch email — no marketing lists. To withdraw consent, reply to this email
              and we&apos;ll delete your information.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://dett.io/privacy" style={footerLink}>Privacy</Link>
              {' · '}
              <Link href="https://dett.io/terms" style={footerLink}>Terms</Link>
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Skramco Holdings LLC d/b/a Dett.io. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles (consistent with CalculatorResultsEmail) ---

const main = {
  backgroundColor: '#f1f5f9',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '560px',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};

const headerSection = {
  backgroundColor: '#ffffff',
  padding: '32px 40px 24px',
  textAlign: 'center' as const,
};

const logoFallback = {
  color: '#2563eb',
  fontSize: '20px',
  fontWeight: '800' as const,
  textAlign: 'center' as const,
  margin: '8px 0 0',
  lineHeight: '1',
};

const badgeSection = {
  padding: '0 40px 24px',
  textAlign: 'center' as const,
};

const badgeText = {
  display: 'inline-block' as const,
  backgroundColor: '#eef2ff',
  color: '#4338ca',
  fontSize: '13px',
  fontWeight: '700' as const,
  padding: '6px 16px',
  borderRadius: '20px',
  margin: '0',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
};

const cardSection = {
  backgroundColor: '#f8fafc',
  margin: '0 24px',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
};

const cardLabel = {
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: '700' as const,
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const bodyText = {
  color: '#0f172a',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const summaryText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '12px 0 0',
};

const prefilledSection = {
  backgroundColor: '#eff6ff',
  margin: '24px 40px 0',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #bfdbfe',
  textAlign: 'center' as const,
};

const prefilledLabel = {
  color: '#2563eb',
  fontSize: '11px',
  fontWeight: '700' as const,
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const prefilledDesc = {
  color: '#475569',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 16px',
};

const prefilledButton = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  padding: '14px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block' as const,
};

const footerDivider = {
  borderColor: '#e2e8f0',
  margin: '24px 0 0',
};

const footer = {
  padding: '24px 40px 32px',
  backgroundColor: '#f8fafc',
};

const footerDisclaimer = {
  color: '#94a3b8',
  fontSize: '11px',
  lineHeight: '17px',
  margin: '0 0 12px',
  textAlign: 'center' as const,
};

const footerLinks = {
  textAlign: 'center' as const,
  fontSize: '13px',
  margin: '0 0 16px',
  color: '#94a3b8',
};

const footerLink = {
  color: '#64748b',
  textDecoration: 'none',
};

const footerCopyright = {
  color: '#cbd5e1',
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
};
