import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { LOGO_BASE64 } from '../../_shared/logo-base64.ts'

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
    <Head>
      <meta name="color-scheme" content="light only" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Preview>Confirm your email for heartlines</Preview>
    <Body style={{...main, colorScheme: 'light'}}>
      <Container style={container}>
        <div style={logoContainer}>
          <img 
            src={LOGO_BASE64} 
            alt="heartlines logo" 
            style={logoImage}
          />
        </div>
        
        <Heading style={h1}>Tap into heartlines 💕</Heading>
        
        <Text style={text}>
          Thanks for joining! We're excited to help you strengthen your relationships with AI-powered coaching.
        </Text>
        
        <Text style={text}>
          Please confirm your email address to get started:
        </Text>
        
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          style={button}
        >
          Build Yr Profile →
        </Link>
        
        <Text style={importantNote}>
          ⚠️ <strong>Important:</strong> This link can only be used once and expires in 24 hours. Don't open it in multiple tabs or browsers.
        </Text>
        
        <Text style={text}>
          Or, copy and paste this confirmation code:
        </Text>
        <code style={code}>{token}</code>
        
        <Text style={smallText}>
          If you didn't create a heartlines account, you can safely ignore this email.
        </Text>
        
        <div style={welcomeBox}>
          <Text style={welcomeText}>
            <strong>Your 3-Step Journey:</strong>
            <br /><br />
            <span style={stepNumber}>1.</span> <strong>Join Free</strong> – Complete your profile setup
            <br />
            <span style={stepNumber}>2.</span> <strong>Build Profiles</strong> – Tell us about you and your partner
            <br />
            <span style={stepNumber}>3.</span> <strong>Chat W/ Kai</strong> – Get personalized AI coaching
          </Text>
        </div>
        
        <Text style={footer}>
          Ready to transform your relationships?
          <br />
          <Link
            href="https://heartlines.ai"
            style={footerLink}
          >
            heartlines.ai
          </Link>
          {' '}- Your AI Relationship Coach
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailConfirmationEmail

const main = {
  backgroundColor: '#660010',
  colorScheme: 'light',
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

const logoImage = {
  width: '80px',
  height: '80px',
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
  background: 'linear-gradient(135deg, #8B0000, #DC143C)',
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
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #8B0000',
  padding: '24px',
  margin: '24px 0',
}

const welcomeText = {
  color: '#e2e8f0',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
}

const stepNumber = {
  color: '#DC143C',
  fontWeight: 'bold' as const,
  fontSize: '16px',
}

const smallText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
}

const importantNote = {
  backgroundColor: '#2d1f1f',
  border: '1px solid #8B0000',
  borderRadius: '8px',
  padding: '16px',
  color: '#fca5a5',
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
  borderTop: '1px solid #333333',
  paddingTop: '20px',
}

const footerLink = {
  color: '#DC143C',
  textDecoration: 'none',
}

const link = {
  color: '#DC143C',
  textDecoration: 'underline',
}