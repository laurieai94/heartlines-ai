import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface CriticalAlertEmailProps {
  currentRate: number;
  threshold: number;
  requestCount: number;
  model: string;
  costImpact: number;
  dashboardUrl: string;
}

export const CriticalAlertEmail = ({
  currentRate,
  threshold,
  requestCount,
  model,
  costImpact,
  dashboardUrl,
}: CriticalAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>🚨 Critical: Cache hit rate below 50%</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>⚠️ Critical Cache Alert</Heading>
        
        <Section style={alertBox}>
          <Text style={alertText}>
            <strong>Cache hit rate has dropped below critical threshold</strong>
          </Text>
          <Text style={metricText}>
            Current Rate: <span style={criticalValue}>{currentRate.toFixed(1)}%</span>
          </Text>
          <Text style={metricText}>
            Expected: ≥ {threshold}%
          </Text>
          <Text style={metricText}>
            Requests Analyzed: {requestCount}
          </Text>
          <Text style={metricText}>
            Model: {model}
          </Text>
          <Text style={metricText}>
            Estimated Cost Impact: ${costImpact.toFixed(2)}/day
          </Text>
        </Section>

        <Section style={troubleshootingSection}>
          <Heading style={h2}>🔍 Troubleshooting Steps</Heading>
          <Text style={checklistItem}>
            ✓ Check if static prompt has changed (cache hash mismatch)
          </Text>
          <Text style={checklistItem}>
            ✓ Verify cache_control headers are being sent in API calls
          </Text>
          <Text style={checklistItem}>
            ✓ Ensure minimum 1024 tokens in cached section
          </Text>
          <Text style={checklistItem}>
            ✓ Check Anthropic API status page for issues
          </Text>
          <Text style={checklistItem}>
            ✓ Review recent prompt or system modifications
          </Text>
        </Section>

        <Section style={ctaSection}>
          <Link
            href={dashboardUrl}
            target="_blank"
            style={ctaButton}
          >
            View Admin Dashboard →
          </Link>
        </Section>

        <Text style={footer}>
          This is an automated alert from Heartlines cache monitoring system.
          <br />
          Alerts are sent when cache hit rate drops below 50% for at least 10 requests.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default CriticalAlertEmail

const main = {
  backgroundColor: '#660010',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 30px',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
}

const alertBox = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '32px',
  border: '2px solid rgba(239, 68, 68, 0.5)',
}

const alertText = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const metricText = {
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const criticalValue = {
  color: '#ef4444',
  fontWeight: 'bold',
  fontSize: '18px',
}

const troubleshootingSection = {
  marginBottom: '32px',
}

const checklistItem = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
  paddingLeft: '8px',
}

const ctaSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const ctaButton = {
  backgroundColor: '#f97316',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  display: 'inline-block',
}

const footer = {
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '32px',
  textAlign: 'center' as const,
}
