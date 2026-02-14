import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
  Row,
  Column,
} from '@react-email/components';

interface CalculatorResultsEmailProps {
  calculatorName: string;
  summary: string;
  details: Record<string, number | string>;
  insights: string[];
  calculatorUrl?: string;
}

export default function CalculatorResultsEmail({
  calculatorName,
  summary,
  details,
  insights,
  calculatorUrl,
}: CalculatorResultsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{calculatorName} — Your personalized results from dett.io</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Branded Header */}
          <Section style={headerSection}>
            <Link href="https://dett.io" style={{ textDecoration: 'none' }}>
              <Img
                src="https://dett.io/logo.png"
                alt="dett.io"
                height="36"
                style={{ margin: '0 auto', display: 'block' }}
              />
            </Link>
          </Section>

          {/* Calculator Name Badge */}
          <Section style={badgeSection}>
            <Text style={badgeText}>{calculatorName}</Text>
          </Section>

          {/* Summary Card */}
          <Section style={cardSection}>
            <Text style={cardLabel}>YOUR RESULT</Text>
            <Text style={summaryText}>{summary}</Text>
          </Section>

          {/* Details Table */}
          <Section style={detailsSection}>
            <Text style={sectionTitle}>Detailed Breakdown</Text>
            {Object.entries(details).map(([key, value]) => (
              <Row key={key} style={detailRow}>
                <Column style={detailLabelCol}>
                  <Text style={detailLabel}>{formatLabel(key)}</Text>
                </Column>
                <Column style={detailValueCol}>
                  <Text style={detailValue}>{formatValue(key, value)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Insights */}
          {insights && insights.length > 0 && (
            <Section style={insightsSection}>
              <Text style={sectionTitle}>Key Insights</Text>
              {insights.map((insight, index) => (
                <Row key={index} style={insightRow}>
                  <Column style={insightBulletCol}>
                    <Text style={insightBullet}>→</Text>
                  </Column>
                  <Column>
                    <Text style={insightText}>{insight}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          {/* Prefilled Link */}
          {calculatorUrl && (
            <Section style={prefilledSection}>
              <Text style={prefilledLabel}>YOUR SAVED CALCULATION</Text>
              <Text style={prefilledDesc}>Click below to reopen this exact calculation with all your inputs prefilled.</Text>
              <Button href={calculatorUrl} style={prefilledButton}>
                View Your Results on dett.io
              </Button>
            </Section>
          )}

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>Want to explore different scenarios?</Text>
            <Button href="https://dett.io/calculators" style={ctaButtonSecondary}>
              Try More Calculators
            </Button>
          </Section>

          {/* Divider */}
          <Hr style={footerDivider} />

          {/* Footer */}
          <Section style={footer}>
            <Link href="https://dett.io" style={{ textDecoration: 'none' }}>
              <Img
                src="https://dett.io/logo.png"
                alt="dett.io"
                height="24"
                style={{ margin: '0 auto 12px', display: 'block', opacity: 0.6 }}
              />
            </Link>
            <Text style={footerLinks}>
              <Link href="https://dett.io/calculators" style={footerLink}>Calculators</Link>
              {' · '}
              <Link href="https://dett.io/guides" style={footerLink}>Guides</Link>
              {' · '}
              <Link href="https://dett.io/privacy" style={footerLink}>Privacy</Link>
              {' · '}
              <Link href="https://dett.io/terms" style={footerLink}>Terms</Link>
            </Text>
            <Text style={footerDisclaimer}>
              This calculator provides estimates for educational purposes only. Results are not a loan offer, pre-qualification, or commitment to lend. Dett.io is not a mortgage lender, broker, or financial advisor. Consult qualified professionals before making financial decisions.
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

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatValue(key: string, value: number | string): string {
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('rate') || key.toLowerCase().includes('dti')) {
      return `${value}%`;
    }
    if (key.toLowerCase().includes('months') || key.toLowerCase().includes('years') || key.toLowerCase().includes('month')) {
      return value.toString();
    }
    return `$${value.toLocaleString()}`;
  }
  return value.toString();
}

// --- Styles ---

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

const badgeSection = {
  padding: '0 40px 24px',
  textAlign: 'center' as const,
};

const badgeText = {
  display: 'inline-block' as const,
  backgroundColor: '#eff6ff',
  color: '#2563eb',
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

const summaryText = {
  color: '#0f172a',
  fontSize: '18px',
  lineHeight: '28px',
  fontWeight: '600' as const,
  margin: '0',
};

const detailsSection = {
  padding: '28px 40px 8px',
};

const sectionTitle = {
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: '700' as const,
  margin: '0 0 16px',
};

const detailRow = {
  borderBottom: '1px solid #f1f5f9',
  padding: '0',
};

const detailLabelCol = {
  width: '60%',
  paddingRight: '8px',
};

const detailLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '10px 0',
};

const detailValueCol = {
  width: '40%',
  textAlign: 'right' as const,
};

const detailValue = {
  color: '#0f172a',
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '10px 0',
  textAlign: 'right' as const,
};

const insightsSection = {
  padding: '20px 40px 8px',
};

const insightRow = {
  padding: '0',
};

const insightBulletCol = {
  width: '24px',
  verticalAlign: 'top' as const,
};

const insightBullet = {
  color: '#2563eb',
  fontSize: '14px',
  fontWeight: '700' as const,
  margin: '6px 0',
};

const insightText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '6px 0',
};

const prefilledSection = {
  backgroundColor: '#eff6ff',
  margin: '24px 24px 0',
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

const ctaSection = {
  padding: '24px 40px 32px',
  textAlign: 'center' as const,
};

const ctaText = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 12px',
};

const ctaButtonSecondary = {
  backgroundColor: '#ffffff',
  color: '#2563eb',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '10px 24px',
  borderRadius: '8px',
  border: '1px solid #2563eb',
  textDecoration: 'none',
  display: 'inline-block' as const,
};

const footerDivider = {
  borderColor: '#e2e8f0',
  margin: '0',
};

const footer = {
  padding: '24px 40px 32px',
  backgroundColor: '#f8fafc',
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

const footerDisclaimer = {
  color: '#94a3b8',
  fontSize: '11px',
  lineHeight: '17px',
  margin: '0 0 12px',
  textAlign: 'center' as const,
};

const footerCopyright = {
  color: '#cbd5e1',
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
};
