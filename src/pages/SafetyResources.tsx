import { Card } from "@/components/ui/card";
import { BRAND } from "@/branding";
import { Shield, Phone, MessageSquare, AlertCircle, Globe } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";

const SafetyResources = () => {
  const { user } = useAuth();

  const handleSignInClick = () => {
    // Handle sign in
  };

  return (
    <>
      <Helmet>
        <title>Crisis & Safety Resources - {BRAND.name}</title>
        <meta name="description" content="Free, confidential crisis resources available 24/7. If you're experiencing a mental health crisis, abuse, or need immediate support, help is available." />
        <meta name="keywords" content="crisis resources, suicide prevention, domestic violence hotline, mental health support, emergency help" />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-900 flex flex-col">
        <SimpleHeader 
          user={user}
          activeTab="safety"
          onSignInClick={() => {}}
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm border border-blue-500/30">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold questionnaire-text mb-4">Crisis & Safety Resources</h1>
            <p className="text-lg questionnaire-text-muted max-w-2xl mx-auto">
              If you're experiencing a crisis or need immediate support, professional help is available 24/7
            </p>
          </div>

          {/* Immediate Danger */}
          <Card className="questionnaire-card p-6 mb-8 bg-red-900/20 border-red-500/30">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-red-100 mb-3">Immediate Danger</h2>
                <p className="text-red-200/90 mb-4 leading-relaxed">
                  If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room immediately.
                </p>
                <Button
                  onClick={() => window.location.href = 'tel:911'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911 Now
                </Button>
              </div>
            </div>
          </Card>

          {/* US Crisis Resources */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold questionnaire-text mb-6">United States Crisis Hotlines</h2>

            {/* 988 Suicide & Crisis Lifeline */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold questionnaire-text mb-2">988 Suicide & Crisis Lifeline</h3>
                  <p className="questionnaire-text-muted mb-4 leading-relaxed">
                    Free and confidential support for people in distress, prevention and crisis resources for you or your loved ones. Available 24/7 by call or text.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => window.location.href = 'tel:988'}
                      variant="secondary"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call 988
                    </Button>
                    <Button
                      onClick={() => window.location.href = 'sms:988'}
                      variant="secondary"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text 988
                    </Button>
                  </div>
                  <p className="questionnaire-text-muted text-sm mt-3">
                    Website: <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">988lifeline.org</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Crisis Text Line */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold questionnaire-text mb-2">Crisis Text Line</h3>
                  <p className="questionnaire-text-muted mb-4 leading-relaxed">
                    Free, 24/7 support for those in crisis. Text with a trained Crisis Counselor who can provide support and information.
                  </p>
                  <Button
                    onClick={() => window.location.href = 'sms:741741&body=HOME'}
                    variant="secondary"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text HOME to 741741
                  </Button>
                  <p className="questionnaire-text-muted text-sm mt-3">
                    Website: <a href="https://crisistextline.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">crisistextline.org</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* National Domestic Violence Hotline */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-pink-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold questionnaire-text mb-2">National Domestic Violence Hotline</h3>
                  <p className="questionnaire-text-muted mb-4 leading-relaxed">
                    24/7 confidential support for victims and survivors of domestic violence. Advocates available to talk and provide resources.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => window.location.href = 'tel:18007997233'}
                      variant="secondary"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call 1-800-799-7233
                    </Button>
                    <Button
                      onClick={() => window.location.href = 'sms:88788&body=START'}
                      variant="secondary"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text START to 88788
                    </Button>
                  </div>
                  <p className="questionnaire-text-muted text-sm mt-3">
                    Website: <a href="https://thehotline.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">thehotline.org</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* RAINN */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-teal-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold questionnaire-text mb-2">RAINN National Sexual Assault Hotline</h3>
                  <p className="questionnaire-text-muted mb-4 leading-relaxed">
                    24/7 support for survivors of sexual assault and their loved ones. Confidential help and resources available.
                  </p>
                  <Button
                    onClick={() => window.location.href = 'tel:18006564673'}
                    variant="secondary"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 1-800-656-4673
                  </Button>
                  <p className="questionnaire-text-muted text-sm mt-3">
                    Website: <a href="https://rainn.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">rainn.org</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Veterans Crisis Line */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold questionnaire-text mb-2">Veterans Crisis Line</h3>
                  <p className="questionnaire-text-muted mb-4 leading-relaxed">
                    24/7 free, confidential support for Veterans and their loved ones, even if they're not registered with VA.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => window.location.href = 'tel:988'}
                      variant="secondary"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call 988, Press 1
                    </Button>
                    <Button
                      onClick={() => window.location.href = 'sms:838255'}
                      variant="secondary"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text 838255
                    </Button>
                  </div>
                  <p className="questionnaire-text-muted text-sm mt-3">
                    Website: <a href="https://veteranscrisisline.net" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">veteranscrisisline.net</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Trevor Project */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold questionnaire-text mb-2">The Trevor Project</h3>
                  <p className="questionnaire-text-muted mb-4 leading-relaxed">
                    24/7 crisis support for LGBTQ+ young people. Confidential help from trained counselors.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => window.location.href = 'tel:18664887386'}
                      variant="secondary"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call 1-866-488-7386
                    </Button>
                    <Button
                      onClick={() => window.location.href = 'sms:678678&body=START'}
                      variant="secondary"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text START to 678678
                    </Button>
                  </div>
                  <p className="questionnaire-text-muted text-sm mt-3">
                    Website: <a href="https://thetrevorproject.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">thetrevorproject.org</a>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* International Resources */}
          <Card className="questionnaire-card p-6 mb-8">
            <div className="flex items-start gap-4">
              <Globe className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold questionnaire-text mb-3">International Crisis Resources</h2>
                <p className="questionnaire-text-muted mb-4 leading-relaxed">
                  If you're outside the United States, please visit these international directories:
                </p>
                <ul className="questionnaire-text-muted space-y-2">
                  <li>
                    <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                      findahelpline.com
                    </a> - Global directory of crisis helplines
                  </li>
                  <li>
                    <a href="https://www.befrienders.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                      befrienders.org
                    </a> - Worldwide emotional support helplines
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* About Kai */}
          <Card className="questionnaire-card p-6">
            <h2 className="text-2xl font-semibold questionnaire-text mb-4">About {BRAND.name}</h2>
            <p className="questionnaire-text-muted leading-relaxed mb-4">
              {BRAND.name} is an AI-powered relationship coaching platform designed to support healthy relationship development. 
              While Kai can provide guidance on communication, conflict resolution, and relationship growth, it is not equipped 
              to handle crisis situations or replace professional mental health care.
            </p>
            <p className="questionnaire-text-muted leading-relaxed">
              If you're experiencing thoughts of self-harm, abuse, severe mental health concerns, or any crisis situation, 
              please use the resources above to connect with trained professionals who can provide immediate support.
            </p>
          </Card>
        </main>

        <SiteFooter />
      </div>
    </>
  );
};

export default SafetyResources;
