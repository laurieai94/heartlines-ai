import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface WaitlistConfirmationProps {
  name?: string;
}

export const WaitlistConfirmationEmail = ({ name }: WaitlistConfirmationProps) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="light only" />
      <meta name="supported-color-schemes" content="light only" />
    </Head>
    <Preview>spot saved ✨ we'll ping you soon</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://relqmhrzyqckoaebscgx.supabase.co/storage/v1/object/public/logo%20logo/Copy%20of%20Heartlines.png"
          width="140"
          height="auto"
          alt="heartlines"
          style={logo}
        />
        
        <Heading style={h1}>spot saved ✨</Heading>
        
        <Text style={text}>
          {name ? `hey ${name.toLowerCase()}! ` : "hey! "}
          you're officially on the list.
        </Text>
        
        <Text style={text}>
          we're letting people in waves so kai (your relationship coach) can stay actually helpful. 
          we'll ping you the second there's space.
        </Text>
        
        <Text style={text}>
          in the meantime, just know we're so glad you're here. 💕
        </Text>
        
        <Text style={footer}>
          with love,
          <br />
          the heartlines team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WaitlistConfirmationEmail;

const main = {
  backgroundColor: "#660010",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  padding: "40px 20px",
};

const container = {
  backgroundColor: "#4a000d",
  borderRadius: "16px",
  padding: "40px",
  maxWidth: "500px",
  margin: "0 auto",
  border: "1px solid rgba(255, 255, 255, 0.15)",
};

const logo = {
  margin: "0 auto 24px",
  display: "block",
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 24px",
  letterSpacing: "-0.5px",
};

const text = {
  color: "rgba(255, 255, 255, 0.85)",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const footer = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
};
