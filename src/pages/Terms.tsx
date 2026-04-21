import { Card } from "@/components/ui/card";
import { BRAND } from "@/branding";
import SimpleHeader from "@/components/layout/SimpleHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import PremiumBackground from "@/components/brand/PremiumBackground";

const Terms = () => {
  const { user } = useAuth();

  const handleSignInClick = () => {
    // Handle sign in
  };

  return (
    <>
      <Helmet>
        <title>terms of service - {BRAND.name}</title>
        <meta name="description" content="read the terms of service for using heartlines ai-powered relationship coaching platform." />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-800 flex flex-col landing-page-scroll relative">
        <PremiumBackground />
        <SimpleHeader
          user={user}
          activeTab="home"
          onSignInClick={handleSignInClick}
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-brand mb-4 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider"
            style={{
              textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
            }}
          >
            terms of service
          </h1>
            <p className="text-lg questionnaire-text-muted">
              last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">1. acceptance of terms</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                by accessing and using {BRAND.name}, you accept and agree to be bound by the terms and provision of this agreement. 
                if you do not agree to these terms, please do not use our service.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">2. description of service</h2>
              <p className="questionnaire-text-muted leading-relaxed mb-4">
                {BRAND.name} provides ai-powered relationship coaching and insights to help users improve their relationships. 
                our service includes:
              </p>
              <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                <li>personalized relationship insights and coaching</li>
                <li>ai-powered conversation practice</li>
                <li>profile building and partner matching</li>
                <li>privacy-focused data storage</li>
              </ul>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">3. user responsibilities</h2>
              <p className="questionnaire-text-muted leading-relaxed mb-4">
                as a user of {BRAND.name}, you agree to:
              </p>
              <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                <li>provide accurate information during registration</li>
                <li>keep your account credentials secure</li>
                <li>use the service in a lawful and respectful manner</li>
                <li>not share or misuse content from the platform</li>
              </ul>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">4. privacy and data</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                your privacy is important to us. all personal data is encrypted and stored securely. 
                we do not share your personal information with third parties without your consent. 
                please review our privacy policy for detailed information about how we handle your data.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">5. subscription and payments</h2>
              <p className="questionnaire-text-muted leading-relaxed mb-4">
                {BRAND.name} offers both free and premium subscription tiers:
              </p>
              <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                <li>free tier: basic access to profile building and limited ai coaching</li>
                <li>premium tier: full access to all features including unlimited ai coaching</li>
                <li>subscriptions renew automatically unless canceled</li>
                <li>refunds are available within 7 days of purchase</li>
              </ul>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">6. important safety information and disclaimers</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">professional limitations</h3>
                  <p className="questionnaire-text-muted leading-relaxed">
                    {BRAND.name} provides ai-powered relationship coaching and insights. our service is not:
                  </p>
                  <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4 mt-2">
                    <li>a substitute for professional therapy, counseling, or medical advice</li>
                    <li>equipped to handle crisis situations or emergencies</li>
                    <li>able to diagnose mental health conditions</li>
                    <li>a replacement for emergency services or crisis intervention</li>
                  </ul>
                </div>

                <div className="bg-coral-500/10 border-2 border-coral-400/30 rounded-lg p-5">
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">crisis resources - available 24/7</h3>
                  <p className="questionnaire-text-muted leading-relaxed mb-4 font-semibold">
                    if you are in crisis or experiencing thoughts of self-harm, suicide, or are in immediate danger, please contact these services immediately:
                  </p>
                  <ul className="questionnaire-text-muted space-y-3 ml-2">
                    <li><strong>988 suicide & crisis lifeline:</strong> call or text 988 (available 24/7)</li>
                    <li><strong>crisis text line:</strong> text home to 741741 (available 24/7)</li>
                    <li><strong>national domestic violence hotline:</strong> 1-800-799-7233 (available 24/7)</li>
                    <li><strong>rainn sexual assault hotline:</strong> 1-800-656-4673 (available 24/7)</li>
                    <li><strong>emergency services:</strong> call 911 for immediate physical danger</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">when to seek professional help</h3>
                  <p className="questionnaire-text-muted leading-relaxed mb-3">
                    please consult with a licensed mental health professional if you experience:
                  </p>
                  <ul className="list-disc list-inside questionnaire-text-muted space-y-2 ml-4">
                    <li>thoughts of self-harm or suicide</li>
                    <li>domestic violence, abuse, or situations where you feel unsafe</li>
                    <li>severe anxiety, depression, or other mental health concerns</li>
                    <li>relationship issues requiring professional therapeutic intervention</li>
                    <li>trauma that requires specialized treatment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold questionnaire-text mb-3">what kai can and cannot do</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="questionnaire-text font-semibold mb-2">kai can provide:</p>
                      <ul className="list-disc list-inside questionnaire-text-muted space-y-1 ml-4">
                        <li>relationship guidance and communication coaching</li>
                        <li>emotional support and perspective</li>
                        <li>evidence-based relationship strategies</li>
                        <li>help with everyday relationship challenges</li>
                      </ul>
                    </div>
                    <div>
                      <p className="questionnaire-text font-semibold mb-2">kai cannot provide:</p>
                      <ul className="list-disc list-inside questionnaire-text-muted space-y-1 ml-4">
                        <li>crisis intervention or emergency services</li>
                        <li>professional therapy or clinical treatment</li>
                        <li>medical or psychiatric diagnosis</li>
                        <li>legal advice for domestic situations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">7. limitation of liability</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                {BRAND.name} and its affiliates shall not be liable for any direct, indirect, incidental, special, or 
                consequential damages resulting from the use or inability to use our service.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">8. changes to terms</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                we reserve the right to modify these terms at any time. changes will be posted on this page with an 
                updated revision date. continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </Card>

            <Card className="questionnaire-card p-6">
              <h2 className="text-2xl font-semibold questionnaire-text mb-4">9. contact information</h2>
              <p className="questionnaire-text-muted leading-relaxed">
                if you have questions about these terms of service, please contact us through our contact page.
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