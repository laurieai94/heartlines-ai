import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND } from "@/branding";
import { Heart, Users, Shield, Target } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Mission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    // Handle sign in
  };


  return (
    <>
      <Helmet>
        <title>Our Mission - {BRAND.name} | AI-Powered Relationship Coaching</title>
        <meta name="description" content="Empowering healthier relationships through AI-powered coaching and personalized insights. Learn about our mission to make relationship guidance accessible to everyone." />
        <meta name="keywords" content="relationship coaching, AI coaching, healthy relationships, couples therapy, communication skills" />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-900 flex flex-col">
        <SimpleHeader 
          user={user}
          activeTab="home"
          onSignInClick={handleSignInClick}
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold questionnaire-text mb-4">Our Mission</h1>
            <p className="text-xl questionnaire-text-muted max-w-2xl mx-auto">
              Empowering healthier relationships through AI-powered coaching and personalized insights
            </p>
          </div>

          {/* Mission Statement */}
          <div className="questionnaire-card mb-8 p-8">
            <div className="text-center">
              <Target className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-lg questionnaire-text leading-relaxed">
                At {BRAND.name}, we believe that strong, healthy relationships are the foundation of human happiness. 
                Our mission is to make relationship coaching accessible to everyone through advanced AI technology 
                that provides personalized insights, practical guidance, and ongoing support for building deeper connections.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="questionnaire-card p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-filter backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold questionnaire-text mb-2">Connection</h3>
                <p className="questionnaire-text-muted text-sm mb-4">Building deeper, more meaningful relationships</p>
                <p className="text-sm questionnaire-text-muted text-center">
                  We help people understand themselves and their partners better, fostering genuine connection 
                  through improved communication and emotional intelligence.
                </p>
              </div>
            </div>

            <div className="questionnaire-card p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-filter backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold questionnaire-text mb-2">Privacy</h3>
                <p className="questionnaire-text-muted text-sm mb-4">Your personal journey stays personal</p>
                <p className="text-sm questionnaire-text-muted text-center">
                  We maintain the highest standards of privacy and security, ensuring your personal information 
                  and relationship insights remain confidential and protected.
                </p>
              </div>
            </div>

            <div className="questionnaire-card p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-filter backdrop-blur-sm">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold questionnaire-text mb-2">Accessibility</h3>
                <p className="questionnaire-text-muted text-sm mb-4">Relationship coaching for everyone</p>
                <p className="text-sm questionnaire-text-muted text-center">
                  We make professional-quality relationship guidance accessible and affordable, 
                  breaking down barriers to better relationships for people from all walks of life.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Statement */}
          <div className="questionnaire-card p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold questionnaire-text mb-2">Our Vision</h2>
              <p className="questionnaire-text-muted mb-6">A world where healthy relationships flourish</p>
              <p className="text-center questionnaire-text leading-relaxed">
                We envision a future where every person has access to the tools and knowledge they need 
                to build and maintain healthy, fulfilling relationships. Through innovative AI technology 
                and compassionate guidance, we're working to reduce relationship conflicts, improve 
                communication skills, and help people create the loving connections they deserve.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
};

export default Mission;