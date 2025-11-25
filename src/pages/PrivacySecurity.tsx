import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Settings, User, Home, CreditCard } from 'lucide-react';
import FlipPhoneIcon from '@/components/icons/FlipPhoneIcon';
import SiteFooter from '@/components/SiteFooter';
import { SecurityDeepDive } from '@/components/privacy/SecurityDeepDive';
import { DataFlowCards } from '@/components/privacy/DataFlowCards';
import PremiumBackground from '@/components/PremiumBackground';
const PrivacySecurity = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    document.title = 'privacy & security - realtalk | your data, your control';

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'learn how realtalk protects your privacy with row-level security, data retention controls, and secure backend infrastructure. your conversations stay private.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'learn how realtalk protects your privacy with row-level security, data retention controls, and secure backend infrastructure. your conversations stay private.';
      document.head.appendChild(meta);
    }
  }, []);
  const navItems = [{
    to: '/',
    label: 'home',
    icon: Home
  }, {
    to: '/profile',
    label: 'profile',
    icon: User
  }, {
    to: '/coach',
    label: 'coach',
    icon: MessageSquare
  }, {
    to: '/account',
    label: 'my account',
    icon: Settings
  }, {
    to: '/plans',
    label: 'plans',
    icon: CreditCard
  }];
  return <div className="min-h-screen bg-burgundy-800 landing-page-scroll">
      {/* Background effects */}
      <PremiumBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-burgundy-800 via-burgundy-800 to-burgundy-800 border-b border-coral-400/20 backdrop-blur-xl shadow-lg">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
          <div className="flex items-center justify-between pt-4 pb-4 md:pt-5 md:pb-4 lg:pt-6 lg:pb-5">
            {/* Left: Hamburger Menu */}
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-white/50 hover:text-white/80 bg-transparent hover:bg-transparent border-0 p-0 transition-all duration-200" aria-label="open menu">
                  <FlipPhoneIcon className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-16 xl:w-16" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-16 p-2 bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl z-50" onInteractOutside={() => setIsMenuOpen(false)} onEscapeKeyDown={() => setIsMenuOpen(false)}>
                <div className="flex flex-col">
                  {navItems.map(item => <Link key={item.to} to={item.to} title={item.label} className="text-white/70 hover:text-coral-200 hover:bg-burgundy-400/10 transition-all duration-200 p-2.5 font-light rounded-lg backdrop-blur-sm border border-transparent hover:border-coral-400/30 flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                      <item.icon className="w-5 h-5" />
                    </Link>)}
                </div>
              </PopoverContent>
            </Popover>

            {/* Right: Sign In & Get Started */}
            <div className="flex items-center gap-3">
              <Link to="/signin">
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-burgundy-400/10 transition-all duration-200">
                  <User className="h-5 w-5" style={{
                  color: '#ffc0cb'
                }} />
                </Button>
              </Link>
              <Link to="/signup" className="relative group inline-block">
                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'linear-gradient(to right, #FF8A50, #EC4899)'
                }} />
                
                <Button className="relative text-white px-4 py-2.5 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300" style={{
                  background: 'linear-gradient(to right, #FF8A50, #EC4899)',
                  boxShadow: '0 0 40px rgba(255, 107, 157, 0.45), 0 6px 24px rgba(255, 107, 157, 0.55), 0 3px 12px rgba(255, 138, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                }}>
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 animate-shimmer" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                      backgroundSize: '200% 100%'
                    }} />
                  </div>
                  
                  <span className="relative z-10 text-sm font-medium">get started</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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