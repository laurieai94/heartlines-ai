import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { Heart, MessageSquare } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import DuckIcon from "@/components/icons/DuckIcon";
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
              className="font-brand text-6xl md:text-7xl lg:text-8xl xl:text-9xl bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent leading-none animate-gradient drop-shadow-[0_0_30px_rgba(255,107,157,0.5)]"
            >
              our why
            </h1>
          </section>

          {/* 1.5. Our Moment */}
          <section className="animate-slide-up animation-delay-100">
            <div className="relative group">
              {/* Outer glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12
                bg-gradient-to-br from-white/20 via-white/15 to-white/10
                border border-pink-400/20
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-500 ease-out">
                
                {/* Header with gradient */}
                <h2 className="text-3xl md:text-4xl font-brand text-center mb-8
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent">
                  🌍 our moment
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Opening line */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                    ai isn't going anywhere. and neither are your feelings.
                  </p>
                </div>

                {/* Middle paragraph */}
                <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    we're surrounded by tech that makes it easy to scroll, ghost, and pretend we're fine.
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    heartlines exists to do the opposite — to help you slow down, check in, and actually connect.
                  </p>
                </div>

                {/* Closing statement */}
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    we're not fixing you. we're helping you figure yourself out — and show up better for the people who matter.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. What heartlines Is */}
          <section className="animate-slide-up animation-delay-200">
            <div className="relative group">
              {/* Outer glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12
                bg-gradient-to-br from-white/20 via-white/15 to-white/10
                border border-pink-400/20
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-500 ease-out">
                
                {/* Header with gradient */}
                <h2 className="text-3xl md:text-4xl font-brand text-center mb-8
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent">
                  💞 what heartlines is
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Opening line */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                    heartlines is an ai coach built for the chaos of real relationships.
                  </p>
                </div>

                {/* Middle paragraph */}
                <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    it's not therapy. it's not a dating app. it's the space in between —
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    where you talk through the stuff you usually avoid, and start growing instead of spiraling.
                  </p>
                </div>

                {/* Closing line */}
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    you'll learn to communicate, reflect, and build something healthy — with others and with yourself.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2.5. Love Belongs Here - Ultra Fruity & Gay 🏳️‍🌈 */}
          <section className="animate-slide-up animation-delay-250">
            <div className="relative group">
              {/* Rainbow animated glow - pride flag inspired */}
              <div className="absolute -inset-2 bg-gradient-to-r 
                from-pink-500/40 via-purple-500/40 to-cyan-500/40
                rounded-3xl blur-2xl opacity-75 
                group-hover:opacity-100 
                animate-gradient
                transition-all duration-500"></div>
              
              {/* Glass card with rainbow border accent */}
              <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-10
                bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-cyan-500/30
                border-2 border-white/30
                hover:scale-[1.03] hover:-translate-y-1
                hover:shadow-[0_20px_60px_rgba(236,72,153,0.4),0_0_100px_rgba(168,85,247,0.3)]
                transition-all duration-500 ease-out">
                
                {/* Emoji hearts decoration */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2 text-3xl animate-bounce-gentle">
                  💖 🏳️‍🌈 ✨
                </div>
                
                {/* Main text with stronger gradient */}
                <p className="text-xl md:text-2xl text-white font-medium text-center leading-relaxed
                  drop-shadow-[0_2px_10px_rgba(236,72,153,0.5)]">
                  love belongs here: queer, straight, trans, poly, monogamous, single, healing — 
                  <span className="font-brand bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 
                    bg-clip-text text-transparent"> whoever you are, you fit.</span>
                </p>
                
                {/* Bottom emoji decoration */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2 text-2xl">
                  🌈 💜 🌟
                </div>
              </div>
            </div>
          </section>

          {/* Powered by Laurie AI */}
          <section className="animate-slide-up animation-delay-300">
            <div className="relative group">
              {/* Glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass container */}
              <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12
                bg-gradient-to-br from-white/20 via-white/15 to-white/10
                border border-pink-400/20
                hover:-translate-y-2 hover:scale-[1.01]
                transition-all duration-500 ease-out">
                
                {/* Heading with gradient and duck icon */}
                <h2 className="text-3xl md:text-4xl font-brand text-center mb-8
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent
                  flex items-center justify-center gap-3">
                  <DuckIcon 
                    size={40} 
                    className="text-coral-400 drop-shadow-[0_0_20px_rgba(255,132,80,0.6)] flex-shrink-0" 
                  />
                  <span>powered by laurie ai</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Introduction */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                    heartlines is built by laurie ai — an organization using ai to build stronger relationships, so we can build stronger communities.
                  </p>
                </div>

                {/* The Model */}
                <div className="text-center space-y-6 mb-8 max-w-2xl mx-auto">
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                    <span className="font-medium text-white">here's the model:</span><br />
                    we make for-profit products like heartlines that help people grow, heal, and connect. then we use part of that profit to create free or low-cost ai tools for the people and communities who are most often left behind —
                  </p>

                  {/* Who We Serve - Nested glass card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 
                    hover:bg-white/15 transition-all duration-300">
                    <ul className="space-y-3 text-white/90 font-light text-base md:text-lg text-left">
                      <li className="flex items-start gap-3 group/item">
                        <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1 
                          group-hover/item:scale-110 transition-transform duration-300" />
                        <span>lgbtq+ organizations</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <Heart className="w-5 h-5 text-coral-400 flex-shrink-0 mt-1 
                          group-hover/item:scale-110 transition-transform duration-300" />
                        <span>mental-health and trauma-informed groups</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <Heart className="w-5 h-5 text-peach-400 flex-shrink-0 mt-1 
                          group-hover/item:scale-110 transition-transform duration-300" />
                        <span>inclusion-driven nonprofits</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <Heart className="w-5 h-5 text-orange-300 flex-shrink-0 mt-1 
                          group-hover/item:scale-110 transition-transform duration-300" />
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

                {/* CTAs with glass effect */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                  <Button
                    size="lg"
                    variant="glass"
                    onClick={handleSignInClick}
                    className="glass-cta min-w-[200px] text-lg"
                  >
                    start free
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate('/coach')}
                    className="min-w-[200px] text-lg backdrop-blur-xl
                      bg-white/10 border border-white/30 text-white
                      hover:bg-white/20 hover:scale-105 hover:-translate-y-1
                      transition-all duration-300"
                  >
                    meet kai
                  </Button>
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