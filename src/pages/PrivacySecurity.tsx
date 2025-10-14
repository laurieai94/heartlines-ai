import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shield, Lock, Database, Server, MessageSquare, Phone, Settings, Download, Eye, EyeOff, Key, CheckCircle, User, Home, CreditCard } from 'lucide-react';
import FlipPhoneIcon from '@/components/icons/FlipPhoneIcon';
import { BRAND } from '@/branding';
import SiteFooter from '@/components/SiteFooter';
import HeartlinesWordmark from '@/components/Brand/HeartlinesWordmark';
const PrivacySecurity = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    document.title = 'privacy & security - realtalk | your data, your control';

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'learn how realtalk protects your privacy with client-side encryption, data retention controls, and secure backend infrastructure. your conversations stay private.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'learn how realtalk protects your privacy with client-side encryption, data retention controls, and secure backend infrastructure. your conversations stay private.';
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
  const features = [{
    icon: <Lock className="w-8 h-8 text-coral-400" />,
    title: "client-side encryption",
    description: "your data is encrypted on your device using aes-256-gcm before it ever reaches our servers. your encryption key never leaves your browser.",
    highlight: "client-side protection"
  }, {
    icon: <Database className="w-8 h-8 text-coral-400" />,
    title: "data retention you control",
    description: "choose how long to keep your conversation history: 30 days, 90 days, 1 year, or forever. change this anytime in your privacy settings.",
    highlight: "30/90/365/forever options"
  }, {
    icon: <Shield className="w-8 h-8 text-coral-400" />,
    title: "row-level security",
    description: "our supabase backend enforces row-level security on all user data tables. only you can access your profiles and conversations.",
    highlight: "database-level protection"
  }, {
    icon: <Eye className="w-8 h-8 text-coral-400" />,
    title: "anonymous analytics",
    description: "completely optional usage analytics help us improve the app without collecting personal content. toggle this in privacy settings.",
    highlight: "fully opt-in"
  }];
  return <div className="min-h-screen bg-burgundy-900">
      {/* Background effects */}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 border-b border-coral-400/20 backdrop-blur-xl shadow-lg">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger Menu */}
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-white/50 hover:text-white/80 bg-transparent hover:bg-transparent border-0 p-0 transition-all duration-200" aria-label="open menu">
                  <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
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
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  get started
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
        <section className="px-6 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-coral-500/10 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-coral-300/30">
              <Shield className="w-5 h-5 text-coral-400" />
              <span className="text-sm font-light text-white/90 tracking-wide">privacy & security</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-brand text-white mb-8 leading-tight">
              your privacy.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
                your control.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-6 leading-relaxed font-light max-w-3xl mx-auto">
              we believe your relationship data belongs to you. that's why we've built privacy and security into every layer of <HeartlinesWordmark size="sm" className="inline-block align-baseline text-white" />, from client-side encryption to database-level protection.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="px-6 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    <div className="inline-block bg-coral-400/20 rounded-full px-3 py-1 text-xs text-coral-300 font-medium">
                      {feature.highlight}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-16 bg-gradient-to-r from-coral-900/20 via-pink-900/15 to-coral-900/20 backdrop-blur-sm border-y border-coral-400/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-thin text-white mb-6">how your data flows</h2>
              <p className="text-lg text-gray-300 font-light">a transparent look at how we protect your information at every step</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="step1" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">1</div>
                    <span className="text-xl font-semibold text-left">encryption on your device</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pl-[4.5rem]">
                  when encryption is enabled, your messages are encrypted using aes-256-gcm in your browser before being sent to our servers. your encryption key is generated locally and never transmitted.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step2" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">2</div>
                    <span className="text-xl font-semibold text-left">secure storage</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pl-[4.5rem]">
                  encrypted data is stored in our supabase database with row-level security enforced. only your authenticated user id can access your data—not even our team can read encrypted conversations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step3" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">3</div>
                    <span className="text-xl font-semibold text-left">ai processing</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pl-[4.5rem]">
                  when you chat with our ai coach, messages are sent to anthropic's api via our secure edge functions. these functions run server-side with api keys never exposed to your browser.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 bg-gradient-to-r from-coral-900/20 via-pink-900/15 to-coral-900/20 backdrop-blur-sm border-y border-coral-400/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-brand text-white mb-12 text-center">faqs</h2>
            
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="encryption" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  what happens if i lose my device or clear my browser data?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  if encryption is enabled and you lose your encryption key (stored locally), your encrypted conversations cannot be recovered—this is by design for maximum security. we recommend creating local backups before enabling encryption. you can download backups anytime from your privacy settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="disable" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  can i disable encryption after enabling it?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  yes, you can disable encryption in your privacy settings. when disabled, future conversations will be stored in plain text (still protected by rls), but previously encrypted conversations will remain encrypted unless you choose to decrypt them during the transition.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="encryption-type" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  what type of encryption do you use?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  we use client-side aes-256-gcm encryption, meaning your data is encrypted in your browser before being stored. this is different from end-to-end encryption (e2ee), which typically involves a recipient with their own decryption key. our encryption protects your data from server breaches and unauthorized database access, but like all web applications, it requires trusting that our javascript code hasn't been compromised.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="anthropic" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  what data does anthropic receive when i chat with the ai?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  when you chat with our ai coach, your message content is sent to anthropic's api to generate responses. anthropic processes this data according to their privacy policy. we send only the necessary conversation context—no personal identifying information like your name, email, or profile data.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delete" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  how do i delete my conversations or account?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  you can delete individual conversations anytime from the chat sidebar. to delete all your data or your entire account, visit your privacy settings. account deletion removes all your data permanently and cannot be undone.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compliance" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  is heartlines hipaa compliant?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  heartlines is not hipaa compliant and should not be used to store or discuss protected health information (phi). while we implement strong privacy and security measures, the platform is designed for relationship coaching and personal growth, not medical or therapeutic purposes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact" className="questionnaire-card border-none">
                <AccordionTrigger className="text-white hover:text-coral-300 text-sm font-medium px-4 py-3 hover:no-underline">
                  how can i report a security vulnerability?
                </AccordionTrigger>
                <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                  if you discover a security vulnerability, please contact us immediately through our privacy settings page. we take security reports seriously and will respond promptly to investigate and address any issues.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-thin text-white mb-6">ready to take control of your privacy?</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/account?tab=security">
                <Button className="bg-burgundy-600 text-white rounded-full text-lg px-8 py-6 hover:bg-burgundy-600">
                  <Settings className="w-5 h-5 mr-2" />
                  manage privacy settings
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white rounded-full text-lg px-8 py-6">
                  get started free
                  <Key className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>;
};
export default PrivacySecurity;