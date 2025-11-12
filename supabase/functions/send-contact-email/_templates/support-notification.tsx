import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { LOGO_BASE64 } from '../../_shared/logo-base64.ts';

interface SupportNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const SupportNotificationEmail = ({
  name,
  email,
  subject,
  message,
}: SupportNotificationProps) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="light only" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Preview>New contact form submission from {name}</Preview>
    <Body style={{...main, colorScheme: 'light'}}>
      <Container style={container}>
        <div style={logoContainer}>
          <img 
            src={LOGO_BASE64} 
            alt="heartlines logo" 
            style={logoImage}
          />
        </div>
        
        <Heading style={h1}>New Contact Form Submission</Heading>
        
        <div style={infoBox}>
          <Text style={label}>From:</Text>
          <Text style={value}>{name}</Text>
          
          <Text style={label}>Email:</Text>
          <Text style={value}>{email}</Text>
          
          <Text style={label}>Subject:</Text>
          <Text style={value}>{subject}</Text>
        </div>
        
        <Hr style={hr} />
        
        <Text style={label}>Message:</Text>
        <div style={messageBox}>
          <Text style={messageText}>{message}</Text>
        </div>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Sent from heartlines.ai contact form
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SupportNotificationEmail;

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
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 30px',
  padding: '0',
  lineHeight: '32px',
};

const infoBox = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #8B0000',
  padding: '24px',
  marginBottom: '24px',
};

const label = {
  color: '#DC143C',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px 0',
};

const value = {
  color: '#e2e8f0',
  fontSize: '16px',
  margin: '0 0 8px 0',
};

const hr = {
  borderColor: '#333333',
  margin: '26px 0',
};

const messageBox = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #333333',
  padding: '20px',
  marginTop: '12px',
};

const messageText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
