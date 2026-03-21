import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SiteFooter from '@/components/SiteFooter';
import { SecurityDeepDive } from '@/components/privacy/SecurityDeepDive';
import { DataFlowCards } from '@/components/privacy/DataFlowCards';
import PremiumBackground from '@/components/PremiumBackground';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/contexts/AuthContext';
const PrivacySecurity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  const handleSignInClick = () => {
    navigate('/signin');
  };
  return <div className="min-h-screen bg-burgundy-800 landing-page-scroll">
      <Helmet>
        <title>privacy & security - heartlines | your data, your control</title>
        <meta name="description" content="learn how heartlines protects your privacy with row-level security, data retention controls, and secure backend infrastructure. your conversations stay private." />
        <meta property="og:title" content="privacy & security - heartlines" />
        <meta property="og:description" content="your conversations are private. learn how heartlines keeps your data safe." />
      </Helmet>
      {/* Background effects */}
      <PremiumBackground />

      {/* Navigation */}
      <SimpleHeader 
        user={user}
        activeTab=""
        onSignInClick={handleSignInClick}
        hideSignInButton={false}
      />

      {/* Spacer for fixed nav */}
      <div className="h-16"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-6 pb-3 lg:pt-8 lg:pb-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-brand text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl mb-6 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider" style={{
              textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
            }}>
              your privacy
            </h1>
            <p className="text-xl lg:text-2xl text-coral-100/80 mb-4">we're obsessed with protecting your conversations and data.</p>
            <p className="text-xl lg:text-2xl text-coral-100/80 mb-2">here's exactly how we do it.</p>
          </div>
        </section>

        {/* Security Deep Dive */}
        <SecurityDeepDive />

        {/* How Your Data Flows */}
        <DataFlowCards />

        <SiteFooter />
      </div>
    </div>;
};
export default PrivacySecurity;