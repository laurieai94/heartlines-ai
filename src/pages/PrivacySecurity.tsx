import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shield, Lock, Database, Server, MessageSquare, Phone, Settings, Download, Eye, EyeOff, Key, CheckCircle, Menu, User } from 'lucide-react';
import { BRAND } from '@/branding';

const PrivacySecurity = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Privacy & Security - RealTalk | Your data, your control';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how RealTalk protects your privacy with client-side encryption, data retention controls, and secure backend infrastructure. Your conversations stay private.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn how RealTalk protects your privacy with client-side encryption, data retention controls, and secure backend infrastructure. Your conversations stay private.';
      document.head.appendChild(meta);
    }
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Mission', path: '/mission' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Privacy Settings', path: '/privacy' },
  ];

  const features = [
    {
      icon: <Lock className="w-8 h-8 text-coral-400" />,
      title: "Client-Side Encryption",
      description: "Your data is encrypted on your device using AES-256-GCM before it ever reaches our servers. Your encryption key never leaves your browser.",
      highlight: "End-to-end protection"
    },
    {
      icon: <Database className="w-8 h-8 text-coral-400" />,
      title: "Data Retention You Control",
      description: "Choose how long to keep your conversation history: 30 days, 90 days, 1 year, or forever. Change this anytime in your privacy settings.",
      highlight: "30/90/365/Forever options"
    },
    {
      icon: <Shield className="w-8 h-8 text-coral-400" />,
      title: "Row-Level Security",
      description: "Our Supabase backend enforces Row-Level Security on all user data tables. Only you can access your profiles and conversations.",
      highlight: "Database-level protection"
    },
    {
      icon: <Eye className="w-8 h-8 text-coral-400" />,
      title: "Anonymous Analytics",
      description: "Completely optional usage analytics help us improve the app without collecting personal content. Toggle this in privacy settings.",
      highlight: "Fully opt-in"
    }
  ];

  return (
    <div className="min-h-screen bg-burgundy-900">
      {/* Background effects */}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-burgundy-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger Menu */}
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start" 
                className="w-56 bg-burgundy-800/95 backdrop-blur-md border-white/20 text-white"
              >
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-4 py-2 text-sm hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Right: Sign In & Get Started */}
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="hidden sm:flex text-white hover:bg-white/10 gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </Button>
              </Link>
              <Link to="/get-started">
                <Button
                  className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white font-medium px-6 sm:px-8"
                >
                  Get Started
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
        <section className="px-6 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-coral-500/10 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-coral-300/30">
              <Shield className="w-5 h-5 text-coral-400" />
              <span className="text-sm font-light text-white/90 tracking-wide">Privacy & Security</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-thin text-white mb-8 leading-tight">
              Your privacy.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
                Your control.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              We believe your relationship data belongs to you. That's why we've built privacy and security into every layer of RealTalk, from client-side encryption to database-level protection.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
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
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-16 bg-gradient-to-r from-coral-900/20 via-pink-900/15 to-coral-900/20 backdrop-blur-sm border-y border-coral-400/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-thin text-white mb-6">How Your Data Flows</h2>
              <p className="text-lg text-gray-300 font-light">A transparent look at how we protect your information at every step</p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Encryption on Your Device</h3>
                  <p className="text-gray-300">When encryption is enabled, your messages are encrypted using AES-256-GCM in your browser before being sent to our servers. Your encryption key is generated locally and never transmitted.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Secure Storage</h3>
                  <p className="text-gray-300">Encrypted data is stored in our Supabase database with Row-Level Security enforced. Only your authenticated user ID can access your data—not even our team can read encrypted conversations.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">AI Processing</h3>
                  <p className="text-gray-300">When you chat with our AI coach, messages are sent to Anthropic's API via our secure Edge Functions. These functions run server-side with API keys never exposed to your browser.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Security */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-thin text-white mb-12 text-center">Security Details</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Client-Side Security */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-6 h-6 text-coral-400" />
                    <CardTitle>Client-Side Encryption</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">AES-256-GCM Encryption</p>
                      <p className="text-sm text-gray-300">Industry-standard encryption with authenticated encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Local Key Management</p>
                      <p className="text-sm text-gray-300">Keys generated and stored only in your browser</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Encrypted Storage Model</p>
                      <p className="text-sm text-gray-300">Server stores only encrypted payloads, not readable text</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Backend Security */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Server className="w-6 h-6 text-coral-400" />
                    <CardTitle>Backend Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Row-Level Security (RLS)</p>
                      <p className="text-sm text-gray-300">Database enforces user-specific access controls</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Secure Edge Functions</p>
                      <p className="text-sm text-gray-300">API keys stored server-side, sanitized error messages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Encrypted Transit</p>
                      <p className="text-sm text-gray-300">All communications use HTTPS/TLS encryption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Controls */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-6 h-6 text-coral-400" />
                    <CardTitle>Data Retention & Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Flexible Retention</p>
                      <p className="text-sm text-gray-300">30 days, 90 days, 1 year, or forever—your choice</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Local Backups</p>
                      <p className="text-sm text-gray-300">Download encrypted backups anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Delete Conversations</p>
                      <p className="text-sm text-gray-300">Remove individual conversations or all data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 bg-gradient-to-r from-coral-900/20 via-pink-900/15 to-coral-900/20 backdrop-blur-sm border-y border-coral-400/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-thin text-white mb-12 text-center">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="encryption" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  What happens if I lose my device or clear my browser data?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  If encryption is enabled and you lose your encryption key (stored locally), your encrypted conversations cannot be recovered—this is by design for maximum security. We recommend creating local backups before enabling encryption. You can download backups anytime from your privacy settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="disable" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  Can I disable encryption after enabling it?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, you can disable encryption in your privacy settings. When disabled, future conversations will be stored in plain text (still protected by RLS), but previously encrypted conversations will remain encrypted unless you choose to decrypt them during the transition.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="anthropic" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  What data does Anthropic receive when I chat with the AI?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  When you chat with our AI coach, your message content is sent to Anthropic's API to generate responses. Anthropic processes this data according to their privacy policy. We send only the necessary conversation context—no personal identifying information like your name, email, or profile data.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delete" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  How do I delete my conversations or account?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You can delete individual conversations anytime from the chat sidebar. To delete all your data or your entire account, visit your privacy settings. Account deletion removes all your data permanently and cannot be undone.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compliance" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  Is RealTalk HIPAA compliant?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  RealTalk is not HIPAA compliant and should not be used to store or discuss protected health information (PHI). While we implement strong privacy and security measures, the platform is designed for relationship coaching and personal growth, not medical or therapeutic purposes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact" className="border-white/20">
                <AccordionTrigger className="text-white hover:text-coral-300">
                  How can I report a security vulnerability?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  If you discover a security vulnerability, please contact us immediately through our privacy settings page. We take security reports seriously and will respond promptly to investigate and address any issues.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-thin text-white mb-6">Ready to take control of your privacy?</h2>
            <p className="text-lg text-gray-300 mb-8 font-light">
              Start using RealTalk with confidence, knowing your data is protected by industry-leading security measures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/privacy">
                <Button variant="outline" className="border-coral-400/50 text-coral-400 hover:bg-coral-400/10 rounded-full text-lg px-8 py-6">
                  <Settings className="w-5 h-5 mr-2" />
                  Manage Privacy Settings
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white rounded-full text-lg px-8 py-6">
                  Get Started Free
                  <Key className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacySecurity;