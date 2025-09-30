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

interface PasswordResetEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const PasswordResetEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Heartlines password</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoContainer}>
          <img 
            src="https://relqmhrzyqckoaebscgx.supabase.co/storage/v1/object/public/lovable-uploads/heart-logo.png"
            alt="heartlines logo"
            style={logoImage}
          />
          <Heading style={brandName}>heartlines</Heading>
        </div>
        
        <Heading style={h1}>Reset Your Password</Heading>
        
        <Text style={text}>
          We received a request to reset your password for your Heartlines account.
        </Text>
        
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={button}
        >
          Reset My Password
        </Link>
        
        <Text style={text}>
          Or, copy and paste this temporary reset code:
        </Text>
        <code style={code}>{token}</code>
        
        <Text style={smallText}>
          This password reset link will expire in 24 hours for security reasons.
        </Text>
        
        <Text style={smallText}>
          If you didn't request this password reset, you can safely ignore this email. 
          Your password will remain unchanged.
        </Text>
        
        <Text style={footer}>
          Modern love is messy. Your password doesn't have to be.
          <br />
          <Link
            href="https://heartlines.ai"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Heartlines.ai
          </Link>
          - AI Relationship Coaching
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

const main = {
  backgroundColor: '#0a0a0a',
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
  width: '50px',
  height: '50px',
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
  backgroundColor: '#8B0000',
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
  color: '#DC143C',
  textDecoration: 'underline',
}