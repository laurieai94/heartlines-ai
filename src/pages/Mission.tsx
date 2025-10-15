import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { Heart, MessageSquare } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Mission = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate('/signup');
  };
  return <>
      <Helmet>
        <title>our mission - heartlines | ai-powered relationship coaching</title>
        <meta name="description" content="empowering healthier relationships through ai-powered coaching and personalized insights. learn about our mission to make relationship guidance accessible to everyone." />
        <meta name="keywords" content="relationship coaching, ai coaching, healthy relationships, couples therapy, communication skills" />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-900 flex flex-col">
      <SimpleHeader user={user} activeTab="home" onSignInClick={handleSignInClick} hideSignInButton={true} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* 1. Hero Section */}
          <section className="text-center animate-fade-in py-8 md:py-12">
            <h1 
              className="font-['Shrikhand'] text-6xl md:text-7xl lg:text-8xl xl:text-9xl bg-gradient-to-r from-[#ff8a50] via-[#ff7a70] to-[#ff6b9d] bg-clip-text text-transparent leading-none"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' }}
            >
              our why
            </h1>
          </section>

          {/* 1.5. Our Moment - 90s Nostalgia with Heartlines Brand */}
          <section className="animate-slide-up animation-delay-100">
            <div className="relative">
              {/* 90s-style chunky border with heartlines gradient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b9d] via-coral-500 to-peach-400 rounded-[4px] opacity-75 blur-sm"></div>
              
              <div className="relative bg-burgundy-800 border-4 border-white/30 rounded-[4px] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(255,107,157,0.15)]">
                {/* Header with heartlines brand text effect */}
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 tracking-tight" 
                    style={{
                      textShadow: '3px 3px 0px rgba(255, 107, 157, 0.5), -1px -1px 0px rgba(255, 138, 80, 0.5)'
                    }}>
                  🌍 our moment
                </h2>
                
                {/* Dotted divider - 90s style with brand color */}
                <div className="border-t-4 border-dotted border-coral-400/40 mb-8 max-w-2xl mx-auto"></div>
                
                {/* Opening line */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    ai isn't going anywhere. and neither are your feelings.
                  </p>
                </div>

                {/* Middle paragraph */}
                <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    we're surrounded by tech that makes it easy to scroll, ghost, and pretend we're fine.
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    heartlines exists to do the opposite — to help you slow down, check in, and actually connect.
                  </p>
                </div>

                {/* Closing statement */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    we're not fixing you. we're helping you figure yourself out — and show up better for the people who matter.
                  </p>
                </div>
                
                {/* Bottom decorative element - heartlines brand colors */}
                <div className="mt-8 flex justify-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b9d' }}></div>
                  <div className="w-3 h-3 bg-coral-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-peach-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. What heartlines Is */}
          <section className="animate-slide-up animation-delay-200">
            <div className="relative">
              {/* 90s-style chunky border with heartlines gradient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b9d] via-coral-500 to-peach-400 rounded-[4px] opacity-75 blur-sm"></div>
              
              <div className="relative bg-burgundy-800 border-4 border-white/30 rounded-[4px] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(255,107,157,0.15)]">
                {/* Header with heartlines brand text effect */}
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 tracking-tight" 
                    style={{
                      textShadow: '3px 3px 0px rgba(255, 107, 157, 0.5), -1px -1px 0px rgba(255, 138, 80, 0.5)'
                    }}>
                  💞 what heartlines is
                </h2>
                
                {/* Dotted divider - 90s style with brand color */}
                <div className="border-t-4 border-dotted border-coral-400/40 mb-8 max-w-2xl mx-auto"></div>
                
                {/* Opening line */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    heartlines is an ai coach built for the chaos of real relationships.
                  </p>
                </div>

                {/* Middle paragraph */}
                <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    it's not therapy. it's not a dating app. it's the space in between —
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    where you talk through the stuff you usually avoid, and start growing instead of spiraling.
                  </p>
                </div>

                {/* Closing line */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    you'll learn to communicate, reflect, and build something healthy — with others and with yourself.
                  </p>
                </div>
                
                {/* Bottom decorative element - heartlines brand colors */}
                <div className="mt-8 flex justify-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b9d' }}></div>
                  <div className="w-3 h-3 bg-coral-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-peach-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </section>

          {/* 2.5. Love Belongs Here - Bright Highlight */}
          <section className="animate-slide-up animation-delay-250">
            <div className="bg-gradient-to-r from-[#ff6b9d] via-coral-500 to-peach-400 rounded-2xl p-6 md:p-8 shadow-[0_8px_24px_rgba(255,107,157,0.4)] hover:shadow-[0_12px_32px_rgba(255,107,157,0.5)] transition-all duration-300">
              <p className="text-lg md:text-xl text-white font-medium text-center leading-relaxed">
                love belongs here: queer, straight, trans, poly, monogamous, single, healing — whoever you are, you fit.
              </p>
            </div>
          </section>

          {/* Powered by Laurie AI */}
          <section className="animate-slide-up animation-delay-1200">
            <div className="relative">
              {/* 90s-style chunky border with heartlines gradient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b9d] via-coral-500 to-peach-400 rounded-[4px] opacity-75 blur-sm"></div>
              
              <div className="relative bg-burgundy-800 border-4 border-white/30 rounded-[4px] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(255,107,157,0.15)]">
                {/* Laurie AI Logo */}
                <div className="flex justify-center mb-8">
                  <img 
                    src={new URL('../assets/laurie-ai-logo.png', import.meta.url).href}
                    alt="Laurie AI - glowing rubber duck logo" 
                    className="w-32 h-32 object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Header with heartlines brand text effect */}
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 tracking-tight" 
                    style={{
                      textShadow: '3px 3px 0px rgba(255, 107, 157, 0.5), -1px -1px 0px rgba(255, 138, 80, 0.5)'
                    }}>
                  🌟 powered by laurie ai
                </h2>
                
                {/* Dotted divider - 90s style with brand color */}
                <div className="border-t-4 border-dotted border-coral-400/40 mb-8 max-w-2xl mx-auto"></div>
                
                {/* Introduction */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    heartlines is built by laurie ai — an organization using ai to build stronger relationships, so we can build stronger communities.
                  </p>
                </div>

                {/* The Model */}
                <div className="text-center space-y-6 mb-8 max-w-2xl mx-auto">
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                    <span className="font-medium text-white">here's the model:</span><br />
                    we make for-profit products like heartlines that help people grow, heal, and connect. then we use part of that profit to create free or low-cost ai tools for the people and communities who are most often left behind —
                  </p>

                  {/* Who We Serve - Highlighted Box */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <ul className="space-y-3 text-white/90 font-light text-base md:text-lg text-left">
                      <li className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-[#ff6b9d] flex-shrink-0 mt-1" />
                        <span>lgbtq+ organizations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                        <span>mental-health and trauma-informed groups</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-peach-400 flex-shrink-0 mt-1" />
                        <span>inclusion-driven nonprofits</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-[#ffa07a] flex-shrink-0 mt-1" />
                        <span>anyone who deserves access to care but rarely gets it</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                    <span className="font-medium text-white">it's a cycle:</span> profit funds purpose, and purpose drives innovation.<br />
                    when you invest in your own growth with heartlines, you help bring ai to people who've been excluded from it.
                  </p>

                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    laurie ai exists to prove that when ai helps people connect, communities get stronger.<br />
                    <span className="font-medium text-white">and that's the future we're here to build.</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                  <Button
                    size="lg"
                    variant="glass"
                    onClick={handleSignInClick}
                    className="min-w-[200px] text-lg"
                  >
                    start free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/coach')}
                    className="min-w-[200px] text-lg border-white/30 text-white hover:bg-white/10"
                  >
                    meet kai
                  </Button>
                </div>

                {/* Bottom decorative element - heartlines brand colors */}
                <div className="mt-12 flex justify-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b9d' }}></div>
                  <div className="w-3 h-3 bg-coral-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-peach-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Mission;