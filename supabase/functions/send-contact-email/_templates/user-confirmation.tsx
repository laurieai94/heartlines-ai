import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { LOGO_BASE64 } from '../../_shared/logo-base64.ts';

interface UserConfirmationProps {
  name: string;
}

export const UserConfirmationEmail = ({
  name,
}: UserConfirmationProps) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="light only" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Preview>Thanks for reaching out to heartlines</Preview>
    <Body style={{...main, colorScheme: 'light'}}>
      <Container style={container}>
        <div style={logoContainer}>
          <img 
            src={LOGO_BASE64} 
            alt="heartlines logo" 
            style={logoImage}
          />
        </div>
        
        <Heading style={h1}>Hey {name}! 👋</Heading>
        
        <Text style={text}>
          Thanks for reaching out. We got your message and someone from our team will get back to you within 1–2 business days.
        </Text>
        
        <Text style={text}>
          In the meantime, if you haven't already, check out what heartlines can do:
        </Text>
        
        <div style={welcomeBox}>
          <Text style={welcomeText}>
            <span style={stepNumber}>💕</span> <strong>AI Relationship Coaching</strong> – Chat with Kai, your personal AI coach
            <br /><br />
            <span style={stepNumber}>🎯</span> <strong>Personalized Insights</strong> – Get advice tailored to your situation
            <br /><br />
            <span style={stepNumber}>🗣️</span> <strong>Practice Conversations</strong> – Rehearse tough talks before they happen
          </Text>
        </div>
        
        <Link
          href="https://heartlines.ai"
          style={button}
        >
          Explore heartlines
        </Link>
        
        <Text style={smallText}>
          Talk soon,
          <br />
          <strong>Sam & the heartlines team</strong>
        </Text>
        
        <Text style={footer}>
          <Link
            href="https://heartlines.ai"
            target="_blank"
            style={footerLink}
          >
            heartlines.ai
          </Link>
          {' '}- Your AI Relationship Coach
        </Text>
      </Container>
    </Body>
  </Html>
);

export default UserConfirmationEmail;

const main = {
  backgroundColor: '#660010',
  colorScheme: 'light',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const logoImage = {
  width: '120px',
  height: 'auto',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
  lineHeight: '36px',
};

const text = {
  color: '#e2e8f0',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const button = {
  background: 'linear-gradient(135deg, #8B0000, #DC143C)',
  borderRadius: '12px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 32px',
  margin: '24px 0',
};

const welcomeBox = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #8B0000',
  padding: '24px',
  margin: '24px 0',
};

const welcomeText = {
  color: '#e2e8f0',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const stepNumber = {
  fontSize: '18px',
};

const smallText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '40px',
  textAlign: 'center' as const,
  borderTop: '1px solid #333333',
  paddingTop: '20px',
};

const footerLink = {
  color: '#DC143C',
  textDecoration: 'none',
};
