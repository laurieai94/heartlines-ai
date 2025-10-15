import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { Heart, MessageSquare, Users, RefreshCw, Sparkles, Target, ChevronDown } from "lucide-react";
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

          {/* 3. What heartlines Stands For */}
          <section className="animate-slide-up animation-delay-400">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white text-center mb-8">
              💞 what heartlines stands for
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">communicate without fear</h3>
                  <p className="text-sm text-white/70">
                    learn how to express yourself clearly and calmly.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <Heart className="w-10 h-10 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">feel seen and supported</h3>
                  <p className="text-sm text-white/70">
                    find guidance that meets you where you are.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <RefreshCw className="w-10 h-10 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">break patterns, not people</h3>
                  <p className="text-sm text-white/70">
                    notice what repeats — and choose better next time.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <Sparkles className="w-10 h-10 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">grow in love, including self-love</h3>
                  <p className="text-sm text-white/70">
                    build relationships that last because they're honest.
                  </p>
                </div>
              </div>
            </div>

          </section>

          {/* 4. Our Vision (Accordion) */}
          <section className="animate-slide-up animation-delay-600">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="vision" className="border-white/15 bg-white/10 backdrop-blur-xl rounded-[20px] px-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <AccordionTrigger className="text-2xl font-playfair text-white hover:text-white/90 py-6">
                  our vision
                </AccordionTrigger>
                <AccordionContent className="text-white/80 text-lg leading-relaxed pb-6">
                  when we build stronger relationships — with ourselves and each other — we build stronger communities.
                  heartlines helps rebuild trust where it's been lost, communicate through difference, and rediscover what it means to care.
                  the work of healing the world begins with the work of healing how we love — starting within.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* 5. Why Now */}
          <section className="animate-slide-up animation-delay-800">
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-[20px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_40px_rgba(233,141,138,0.15)] hover:bg-white/15 transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white text-center mb-6">
                why now
              </h2>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto">
                ai is here — and it's not going anywhere.
                heartlines is proof that technology can care.
                powered by laurie ai, we're using artificial intelligence not to replace humanity, but to help people rediscover it — one reflection, one conversation, one act of love at a time.
              </p>
            </div>
          </section>

          {/* 6. The Manifesto (Accordion) */}
          <section className="animate-slide-up animation-delay-1000">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="manifesto" className="border-white/15 bg-white/10 backdrop-blur-xl rounded-[20px] px-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <AccordionTrigger className="text-2xl font-playfair text-white hover:text-white/90 py-6">
                  the manifesto
                </AccordionTrigger>
                <AccordionContent className="text-white/90 text-xl md:text-2xl leading-relaxed pb-6 space-y-2 font-light">
                  <p>we're not building ai for engagement.</p>
                  <p>we're building ai for empathy.</p>
                  <p>because the future doesn't need smarter machines —</p>
                  <p className="font-medium">it needs more connected humans.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* 7. Join the Movement */}
          <section className="animate-slide-up animation-delay-1200">
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-[20px] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(233,141,138,0.2)] transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white text-center mb-6">
                join the movement
              </h2>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto mb-8">
                when you invest in your growth with heartlines,
                you're helping create a future where ai supports love, healing, and belonging — starting with you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button onClick={() => navigate('/signup')} className="glass-cta text-white font-medium hover:scale-105 transition-all duration-200" size="lg">
                  start free
                </Button>
                <Button onClick={() => navigate('/coach')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm" size="lg">
                  <MessageSquare className="w-4 h-4" />
                  meet kai
                </Button>
              </div>

              <p className="text-center text-white/70 text-sm font-light">
                part of the <span className="font-medium">laurie ai</span> family — building ai that cares.
              </p>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Mission;