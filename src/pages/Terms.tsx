import { Card } from "@/components/ui/card";
import { BRAND } from "@/branding";
import { FileText } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";

const Terms = () => {
  const { user } = useAuth();

  const handleSignInClick = () => {
    // Handle sign in
  };

  return (
    <>
      <Helmet>
        <title>Terms of Service - {BRAND.name}</title>
        <meta name="description" content="Read the terms of service for using heartlines AI-powered relationship coaching platform." />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-900 flex flex-col">
        <SimpleHeader 
          user={user}
          activeTab="terms"
          onSignInClick={handleSignInClick}
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold questionnaire-text mb-4">Terms of Service</h1>
            <p className="text-lg questionnaire-text-muted">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">1. Acceptance of Terms</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                By accessing and using {BRAND.name}, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">2. Description of Service</h2>
              <p className="questionnaire-text-muted leading-relaxed mb-4">
                {BRAND.name} provides AI-powered relationship coaching and insights to help users improve their relationships. 
                Our service includes:
              </p>
              <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                <li>Personalized relationship insights and coaching</li>
                <li>AI-powered conversation practice</li>
                <li>Profile building and partner matching</li>
                <li>Privacy-focused data storage</li>
              </ul>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">3. User Responsibilities</h2>
              <p className="questionnaire-text-muted leading-relaxed mb-4">
                As a user of {BRAND.name}, you agree to:
              </p>
              <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                <li>Provide accurate information during registration</li>
                <li>Keep your account credentials secure</li>
                <li>Use the service in a lawful and respectful manner</li>
                <li>Not share or misuse content from the platform</li>
              </ul>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">4. Privacy and Data</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                Your privacy is important to us. All personal data is encrypted and stored securely. 
                We do not share your personal information with third parties without your consent. 
                Please review our Privacy Policy for detailed information about how we handle your data.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">5. Subscription and Payments</h2>
              <p className="questionnaire-text-muted leading-relaxed mb-4">
                {BRAND.name} offers both free and premium subscription tiers:
              </p>
              <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                <li>Free tier: Basic access to profile building and limited AI coaching</li>
                <li>Premium tier: Full access to all features including unlimited AI coaching</li>
                <li>Subscriptions renew automatically unless canceled</li>
                <li>Refunds are available within 7 days of purchase</li>
              </ul>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">6. Important Safety Information and Disclaimers</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">Professional Limitations</h3>
                  <p className="questionnaire-text-muted leading-relaxed">
                    {BRAND.name} provides AI-powered relationship coaching and insights. Our service is NOT:
                  </p>
                  <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4 mt-2">
                    <li>A substitute for professional therapy, counseling, or medical advice</li>
                    <li>Equipped to handle crisis situations or emergencies</li>
                    <li>Able to diagnose mental health conditions</li>
                    <li>A replacement for emergency services or crisis intervention</li>
                  </ul>
                </div>

                <div className="bg-coral-500/10 border-2 border-coral-400/30 rounded-lg p-5">
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">Crisis Resources - Available 24/7</h3>
                  <p className="questionnaire-text-muted leading-relaxed mb-4 font-semibold">
                    If you are in crisis or experiencing thoughts of self-harm, suicide, or are in immediate danger, please contact these services immediately:
                  </p>
                  <ul className="questionnaire-text-muted space-y-3 ml-2">
                    <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 (Available 24/7)</li>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741 (Available 24/7)</li>
                    <li><strong>National Domestic Violence Hotline:</strong> 1-800-799-7233 (Available 24/7)</li>
                    <li><strong>RAINN Sexual Assault Hotline:</strong> 1-800-656-4673 (Available 24/7)</li>
                    <li><strong>Emergency Services:</strong> Call 911 for immediate physical danger</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">When to Seek Professional Help</h3>
                  <p className="questionnaire-text-muted leading-relaxed mb-3">
                    Please consult with a licensed mental health professional if you experience:
                  </p>
                  <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                    <li>Thoughts of self-harm or suicide</li>
                    <li>Domestic violence, abuse, or situations where you feel unsafe</li>
                    <li>Severe anxiety, depression, or other mental health concerns</li>
                    <li>Relationship issues requiring professional therapeutic intervention</li>
                    <li>Trauma that requires specialized treatment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">What Kai Can and Cannot Do</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="questionnaire-text font-semibold mb-2">Kai CAN provide:</p>
                      <ul className="list-disc list-inside questionnaire-text-muted space-y-1 ml-4">
                        <li>Relationship guidance and communication coaching</li>
                        <li>Emotional support and perspective</li>
                        <li>Evidence-based relationship strategies</li>
                        <li>Help with everyday relationship challenges</li>
                      </ul>
                    </div>
                    <div>
                      <p className="questionnaire-text font-semibold mb-2">Kai CANNOT provide:</p>
                      <ul className="list-disc list-inside questionnaire-text-muted space-y-1 ml-4">
                        <li>Crisis intervention or emergency services</li>
                        <li>Professional therapy or clinical treatment</li>
                        <li>Medical or psychiatric diagnosis</li>
                        <li>Legal advice for domestic situations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">7. Limitation of Liability</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                {BRAND.name} and its affiliates shall not be liable for any direct, indirect, incidental, special, or 
                consequential damages resulting from the use or inability to use our service.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">8. Changes to Terms</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an 
                updated revision date. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">9. Contact Information</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                If you have questions about these Terms of Service, please contact us through our Contact page.
              </p>
            </Card>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
};

export default Terms;
