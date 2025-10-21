import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { Heart, MessageSquare, Globe } from "lucide-react";
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
      
      <div className="landing-page-scroll min-h-screen bg-burgundy-900 flex flex-col">
      <SimpleHeader user={user} activeTab="home" onSignInClick={handleSignInClick} hideSignInButton={true} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          {/* 1. Hero Section */}
          <section className="flex flex-col items-center animate-fade-in pt-8 md:pt-12 pb-4 md:pb-6">
            <h1 
              className="font-brand text-6xl md:text-7xl lg:text-8xl xl:text-9xl bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent leading-none animate-gradient drop-shadow-[0_0_30px_rgba(255,107,157,0.5)]"
            >
              our why
            </h1>
            <div className="flex items-center gap-2 mt-1 ml-[70px] md:ml-[110px] lg:ml-[160px] xl:ml-[230px]">
            <span className="font-glacial text-xl md:text-2xl lg:text-3xl text-white">
              powered laurie ai
            </span>
              <DuckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-coral-400" />
            </div>
          </section>


          {/* 1.5. Our Moment */}
          <section className="animate-slide-up animation-delay-100 -mt-4">
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
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent
                  flex items-center justify-center gap-3">
                  <Globe 
                    size={40} 
                    className="text-coral-400 drop-shadow-[0_0_20px_rgba(255,132,80,0.6)] flex-shrink-0" 
                  />
                  <span>our moment</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Opening section - The Paradox */}
                <div className="text-center mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed mb-4">
                    we're living in a time where ai can finish our sentences,
                  </p>
                  <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                    but not understand what we mean.
                  </p>
                </div>

                {/* Middle section - The Reality */}
                <div className="text-center space-y-4 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    where everything is connected —
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    and everyone feels more disconnected than ever.
                  </p>
                </div>

                {/* Core insight section */}
                <div className="text-center space-y-4 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    this is the paradox of now:
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    the smarter our technology gets,
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    the harder it becomes to feel seen, heard, and understood.
                  </p>
                </div>

                {/* Closing section - The Solution */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    <span className="font-brand">heartlines</span> was built for this moment —
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    to remind us that empathy is still the highest form of intelligence.
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
                    stronger relationships start here.
                  </p>
                  <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                    the ai relationship coach for messy, modern love.
                  </p>
                </div>

                {/* Middle paragraph */}
                <div className="text-center space-y-4 mb-8 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    <span className="font-brand">heartlines</span> is for anyone who still believes love is worth understanding.
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    for the ones who overthink the text, replay the call,
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    and want to connect instead of just move on.
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    it's the space you come to when things get real —
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    when you want to talk without fighting,
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    listen without shutting down,
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    and love without losing yourself.
                  </p>
                </div>

                {/* Closing line */}
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    you bring the feelings.
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    we help you make sense of them —
                  </p>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                    so you can grow together, not apart.
                  </p>
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
                    <span className="font-brand">heartlines</span> is built by laurie ai — an organization using ai to build stronger relationships, so we can build stronger communities.
                  </p>
                </div>

                {/* The Model */}
                <div className="text-center space-y-8 mb-8 max-w-2xl mx-auto">
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                    <span className="font-medium text-white">here's the model:</span>
                  </p>
                  
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                    we make for-profit products like <span className="font-brand">heartlines</span> that help people grow, heal, and connect. then we use part of that profit to create free or low-cost ai tools for the people and communities who are most often left behind —
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

                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed mt-8">
                    <span className="font-medium text-white">it's a cycle:</span> profit funds purpose, and purpose drives innovation.
                  </p>
                  
                  <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                    when you invest in your own growth with <span className="font-brand">heartlines</span>, you help bring ai to people who've been excluded from it.
                  </p>

                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed mt-6">
                    laurie ai exists to prove that when ai helps people connect, communities get stronger.
                  </p>
                  
                  <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                    and that's the future we're here to build.
                  </p>
                </div>

                {/* CTAs with glass effect */}
                <div className="flex flex-wrap gap-4 justify-center items-center mt-10">
                  <Button
                    size="lg"
                    variant="glass"
                    onClick={handleSignInClick}
                    className="glass-cta min-w-[200px] text-lg"
                  >
                    get started
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate('/contact')}
                    className="min-w-[200px] text-lg backdrop-blur-xl
                      bg-white/10 border border-white/30 text-white
                      hover:bg-white/20 hover:scale-105 hover:-translate-y-1
                      transition-all duration-300"
                  >
                    build community ai
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