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

interface ApiErrorAlertEmailProps {
  errorType: string;
  errorCode?: number;
  errorMessage: string;
  failureCount: number;
  affectedUsers: number;
  urgency: 'critical' | 'warning' | 'info';
  dashboardUrl: string;
  anthropicBillingUrl: string;
  userId?: string;
  detectionPhrase?: string;
}

export const ApiErrorAlertEmail = ({
  errorType,
  errorCode,
  errorMessage,
  failureCount,
  affectedUsers,
  urgency,
  dashboardUrl,
  anthropicBillingUrl,
  userId,
  detectionPhrase,
}: ApiErrorAlertEmailProps) => {
  const isCrisis = errorType === 'crisis_handoff'
  const isCredit = errorType === 'credit_exhausted'
  
  return (
    <Html>
      <Head />
      <Preview>
        {isCrisis 
          ? '🆘 Mental health crisis handoff triggered'
          : isCredit 
            ? '🚨 Anthropic credit balance exhausted'
            : `⚠️ API Error: ${errorType}`
        }
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isCrisis ? '🆘 Crisis Handoff Alert' : '⚠️ API Error Alert'}
          </Heading>
          
          <Section style={urgency === 'critical' ? criticalBox : warningBox}>
            {isCrisis ? (
              <>
                <Text style={alertText}>
                  <strong>Mental Health Crisis Handoff Triggered</strong>
                </Text>
                <Text style={metricText}>
                  User ID: <span style={valueText}>{userId || 'Unknown'}</span>
                </Text>
                {detectionPhrase && (
                  <Text style={metricText}>
                    Detection Phrase: <span style={valueText}>"{detectionPhrase}"</span>
                  </Text>
                )}
                <Text style={metricText}>
                  Time: <span style={valueText}>{new Date().toISOString()}</span>
                </Text>
                <Text style={noteText}>
                  Kai has provided crisis resources and stepped back. User received hotline numbers.
                </Text>
              </>
            ) : (
              <>
                <Text style={alertText}>
                  <strong>
                    {isCredit 
                      ? 'Anthropic Credit Balance Exhausted'
                      : `Error Type: ${errorType.replace('_', ' ').toUpperCase()}`
                    }
                  </strong>
                </Text>
                {errorCode && (
                  <Text style={metricText}>
                    Error Code: <span style={urgency === 'critical' ? criticalValue : warningValue}>{errorCode}</span>
                  </Text>
                )}
                <Text style={metricText}>
                  Message: <span style={valueText}>{errorMessage}</span>
                </Text>
                <Text style={metricText}>
                  Failures (Last Hour): <span style={valueText}>{failureCount}</span>
                </Text>
                <Text style={metricText}>
                  Affected Users: <span style={valueText}>{affectedUsers}</span>
                </Text>
              </>
            )}
          </Section>

          {!isCrisis && (
            <Section style={troubleshootingSection}>
              <Heading style={h2}>🔍 Immediate Actions</Heading>
              {isCredit ? (
                <>
                  <Text style={checklistItem}>
                    1. Add credits to Anthropic account immediately
                  </Text>
                  <Text style={checklistItem}>
                    2. Kai is DOWN until credits are added
                  </Text>
                  <Text style={checklistItem}>
                    3. Users are seeing "temporarily unavailable" message
                  </Text>
                </>
              ) : errorType === 'rate_limit' ? (
                <>
                  <Text style={checklistItem}>
                    ✓ Rate limits usually resolve within 1-5 minutes
                  </Text>
                  <Text style={checklistItem}>
                    ✓ Check Anthropic status page for outages
                  </Text>
                  <Text style={checklistItem}>
                    ✓ Consider reducing request frequency if persistent
                  </Text>
                </>
              ) : (
                <>
                  <Text style={checklistItem}>
                    ✓ Check Anthropic API status page
                  </Text>
                  <Text style={checklistItem}>
                    ✓ Review edge function logs for details
                  </Text>
                  <Text style={checklistItem}>
                    ✓ Verify API key is still valid
                  </Text>
                </>
              )}
            </Section>
          )}

          <Section style={ctaSection}>
            <Link href={dashboardUrl} target="_blank" style={ctaButton}>
              View Admin Dashboard →
            </Link>
            {isCredit && (
              <>
                <Text style={spacer}> </Text>
                <Link href={anthropicBillingUrl} target="_blank" style={ctaButtonSecondary}>
                  Add Anthropic Credits →
                </Link>
              </>
            )}
          </Section>

          <Text style={footer}>
            This is an automated alert from Heartlines monitoring system.
            <br />
            Timestamp: {new Date().toISOString()}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ApiErrorAlertEmail

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

const criticalBox = {
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '32px',
  border: '2px solid rgba(239, 68, 68, 0.6)',
}

const warningBox = {
  backgroundColor: 'rgba(251, 191, 36, 0.2)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '32px',
  border: '2px solid rgba(251, 191, 36, 0.6)',
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

const valueText = {
  color: '#ffffff',
  fontWeight: 'bold',
}

const criticalValue = {
  color: '#ef4444',
  fontWeight: 'bold',
  fontSize: '18px',
}

const warningValue = {
  color: '#fbbf24',
  fontWeight: 'bold',
  fontSize: '18px',
}

const noteText = {
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '16px 0 0',
  fontStyle: 'italic',
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

const ctaButtonSecondary = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  marginTop: '12px',
}

const spacer = {
  margin: '8px 0',
}

const footer = {
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '32px',
  textAlign: 'center' as const,
}
