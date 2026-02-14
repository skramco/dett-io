import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface CalculatorResultsEmailProps {
  calculatorName: string;
  summary: string;
  details: Record<string, number | string>;
  insights: string[];
}

export default function CalculatorResultsEmail({
  calculatorName,
  summary,
  details,
  insights,
}: CalculatorResultsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{calculatorName} - Your Results from Dett</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Dett</Heading>
          <Text style={subtitle}>Free Debt Education & Calculators</Text>
          
          <Hr style={hr} />
          
          <Heading style={h2}>{calculatorName}</Heading>
          
          <Section style={summarySection}>
            <Text style={summaryText}>{summary}</Text>
          </Section>
          
          <Hr style={hr} />
          
          <Heading style={h3}>Your Results</Heading>
          
          <Section style={detailsSection}>
            {Object.entries(details).map(([key, value]) => (
              <div key={key} style={detailRow}>
                <Text style={detailLabel}>
                  {formatLabel(key)}:
                </Text>
                <Text style={detailValue}>
                  {formatValue(key, value)}
                </Text>
              </div>
            ))}
          </Section>
          
          {insights && insights.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h3}>Key Insights</Heading>
              <Section style={insightsSection}>
                {insights.map((insight, index) => (
                  <Text key={index} style={insightText}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            </>
          )}
          
          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              Want to explore more calculators or learn about debt?
            </Text>
            <Text style={footerText}>
              Visit <strong>Dett</strong> at dett.io
            </Text>
            <Hr style={hr} />
            <Text style={footerDisclaimer}>
              <strong>Important:</strong> This calculator provides estimates for educational purposes only. Results are not a loan offer, pre-qualification, pre-approval, or commitment to lend. Actual rates, terms, payments, and eligibility are determined by mortgage lenders based on your complete financial profile, credit history, property appraisal, and current market conditions.
            </Text>
            <Text style={footerDisclaimer}>
              Dett.io is not a mortgage lender, broker, financial advisor, or licensed professional of any kind. All calculator results, estimates, and content are for informational and educational purposes only and do not constitute financial, legal, or tax advice. Consult qualified professionals before making financial decisions.
            </Text>
            <Text style={footerDisclaimer}>
              © {new Date().getFullYear()} Skramco Holdings LLC d/b/a Dett.io. All rights reserved. Privacy Policy: dett.io/privacy | Terms of Use: dett.io/terms
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
    if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('rate')) {
      return `${value}%`;
    }
    if (key.toLowerCase().includes('months') || key.toLowerCase().includes('years')) {
      return value.toString();
    }
    return `$${value.toLocaleString()}`;
  }
  return value.toString();
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#0f172a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 0',
  padding: '0 40px',
};

const subtitle = {
  color: '#64748b',
  fontSize: '14px',
  margin: '4px 0 0',
  padding: '0 40px',
};

const h2 = {
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  padding: '0 40px',
};

const h3 = {
  color: '#0f172a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '20px 0 10px',
  padding: '0 40px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const summarySection = {
  padding: '0 40px',
};

const summaryText = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  backgroundColor: '#f1f5f9',
  padding: '16px',
  borderRadius: '8px',
};

const detailsSection = {
  padding: '0 40px',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #f1f5f9',
};

const detailLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
  flex: '1',
};

const detailValue = {
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'right' as const,
};

const insightsSection = {
  padding: '0 40px',
};

const insightText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const footer = {
  padding: '0 40px',
  marginTop: '32px',
};

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footerDisclaimer = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '16px 0 0',
  textAlign: 'center' as const,
};
