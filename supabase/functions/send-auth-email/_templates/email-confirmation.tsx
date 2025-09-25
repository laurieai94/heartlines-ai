import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.25'
import * as React from 'https://esm.sh/react@18.3.1'

interface EmailConfirmationProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const EmailConfirmationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: EmailConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Confirm your email for Heartlines</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoContainer}>
          <div style={logoCircle}></div>
          <Heading style={brandName}>heartlines</Heading>
        </div>
        
        <Heading style={h1}>Welcome to Heartlines! 💖</Heading>
        
        <Text style={text}>
          Thanks for signing up! We're excited to help you improve your relationships with AI coaching.
        </Text>
        
        <Text style={text}>
          Please confirm your email address to complete your account setup:
        </Text>
        
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={button}
        >
          Confirm Email Address
        </Link>
        
        <Text style={text}>
          Or, copy and paste this confirmation code:
        </Text>
        <code style={code}>{token}</code>
        
        <Text style={smallText}>
          This confirmation link will expire in 24 hours.
        </Text>
        
        <Text style={smallText}>
          If you didn't create a Heartlines account, you can safely ignore this email.
        </Text>
        
        <div style={welcomeBox}>
          <Text style={welcomeText}>
            <strong>What's next?</strong>
            <br />
            Once confirmed, you'll be able to:
            <br />
            • Chat with Kai, your AI relationship coach
            <br />
            • Get personalized relationship insights
            <br />
            • Practice conversations and scenarios
            <br />
            • Track your relationship growth
          </Text>
        </div>
        
        <Text style={footer}>
          Ready to transform your relationships?
          <br />
          <Link
            href="https://heartlines.ai"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Heartlines.ai
          </Link>
          - Your AI Relationship Coach
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailConfirmationEmail

const main = {
  backgroundColor: '#0f0f23',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '40px',
}

const logoCircle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ec4899, #f97316)',
  marginRight: '12px',
}

const brandName = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 20px 0',
  textAlign: 'center' as const,
}

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#ec4899',
  borderRadius: '12px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '16px 32px',
  margin: '24px 0',
  width: '100%',
  boxSizing: 'border-box' as const,
}

const code = {
  display: 'inline-block',
  padding: '16px',
  width: '100%',
  backgroundColor: '#1e293b',
  borderRadius: '8px',
  border: '1px solid #334155',
  color: '#e2e8f0',
  fontSize: '14px',
  fontFamily: 'monospace',
  textAlign: 'center' as const,
  boxSizing: 'border-box' as const,
  margin: '16px 0',
}

const welcomeBox = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  border: '1px solid #334155',
  padding: '20px',
  margin: '24px 0',
}

const welcomeText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const smallText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
}

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '40px',
  textAlign: 'center' as const,
  borderTop: '1px solid #334155',
  paddingTop: '20px',
}

const link = {
  color: '#ec4899',
  textDecoration: 'underline',
}