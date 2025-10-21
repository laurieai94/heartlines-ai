import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { Heart, MessageSquare, Globe, ChevronDown } from "lucide-react";
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
      
      <div className="landing-page-scroll min-h-screen bg-burgundy-900 flex flex-col relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-96 right-20 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-peach-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <SimpleHeader user={user} activeTab="home" onSignInClick={handleSignInClick} hideSignInButton={true} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          {/* 1. Hero Section */}
          <section className="flex flex-col items-center animate-fade-in pt-6 md:pt-8 pb-2 md:pb-4">
            <h1 
              className="font-brand text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent leading-none animate-gradient drop-shadow-[0_0_30px_rgba(255,107,157,0.5)]"
            >
              our why
            </h1>
            <div className="flex items-center gap-2 mt-1 ml-[70px] md:ml-[110px] lg:ml-[160px] xl:ml-[200px]">
            <span className="font-glacial text-lg md:text-xl lg:text-2xl text-white">
              powered laurie ai
            </span>
              <DuckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-coral-400" />
            </div>
          </section>


          {/* 1.5. Our Moment */}
          <section className="animate-slide-up animation-delay-100 -mt-6 scroll-fade-in">
            <div className="relative group">
              {/* Outer glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-6 md:p-10
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-500 ease-out">
                
                {/* Header with gradient */}
                <h2 className="text-3xl md:text-4xl font-brand text-center mb-6
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent
                  flex items-center justify-center gap-3">
                  <Globe 
                    size={40} 
                    className="text-coral-400 drop-shadow-[0_0_20px_rgba(255,132,80,0.6)] flex-shrink-0" 
                  />
                  <span>our moment</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent mb-6 max-w-2xl mx-auto drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-4 max-w-2xl mx-auto">
                  <p className="text-base md:text-lg text-white/98 font-light leading-normal mb-3">
                    we're living in a time where ai can finish our sentences, but not understand what we mean.
                  </p>
                  <p className="text-base md:text-lg text-white/98 font-light leading-normal">
                    where everything is connected — and everyone feels more disconnected than ever.
                  </p>
                </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/70 hover:text-white font-light text-sm
                        transition-all duration-300
                        hover:bg-white/5 rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">Read More</span>
                      <span className="group-data-[state=closed]/button:hidden">Show Less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {/* Decorative gradient divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent mb-4 max-w-xs mx-auto drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>

                    {/* Core insight section */}
                    <div className="text-center space-y-3 mb-4 max-w-2xl mx-auto">
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        this is the paradox of now:
                      </p>
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        the smarter our technology gets,
                      </p>
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        the harder it becomes to feel seen, heard, and understood.
                      </p>
                    </div>

                    {/* Decorative gradient divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent mb-4 max-w-xs mx-auto drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>

                    {/* Pull quote - Key message */}
                    <div className="relative max-w-xl mx-auto mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 via-coral-500/30 to-peach-400/20 rounded-2xl blur-md"></div>
                      <div className="relative backdrop-blur-sm rounded-2xl p-4 md:p-5
                        bg-white/15 border border-pink-400/40
                        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]
                        transition-all duration-500">
                        <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(255,107,157,0.7)]" />
                        <p className="text-base md:text-lg text-white/98 font-normal leading-normal text-center">
                          empathy is still the highest form of intelligence
                        </p>
                      </div>
                    </div>

                    {/* Closing section - The Solution */}
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        <span className="font-brand">heartlines</span> was built for this moment —
                      </p>
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        to remind us of what truly matters.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </section>

          {/* 2. What heartlines Is - SPLIT LAYOUT */}
          <section className="animate-slide-up animation-delay-200 scroll-fade-in">
            <div className="relative group">
              {/* Outer glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-6 md:p-10
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-500 ease-out">
                
                {/* Header with gradient */}
                <h2 className="text-3xl md:text-4xl font-brand text-center mb-6
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent">
                  💞 what heartlines is
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent mb-6 max-w-2xl mx-auto drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-4 max-w-2xl mx-auto space-y-2">
                  <p className="text-base md:text-lg text-white/98 font-light leading-normal">
                    stronger relationships start here.
                  </p>
                  <p className="text-base md:text-lg text-white/98 font-light leading-normal">
                    the ai relationship coach for messy, modern love.
                  </p>
                </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/70 hover:text-white font-light text-sm
                        transition-all duration-300
                        hover:bg-white/5 rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">Read More</span>
                      <span className="group-data-[state=closed]/button:hidden">Show Less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {/* Single-column content layout */}
                    <div className="max-w-2xl mx-auto space-y-4 mt-6">
                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/40 to-transparent drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>

                      {/* Context - The Chaos */}
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          built for the chaos of real connection —
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          the overthinking, the late-night silence, the "we need to talk" moments.
                        </p>
                      </div>

                      {/* Philosophy */}
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          it's not about perfect communication.
                        </p>
                        <p className="text-base md:text-lg text-white/98 font-medium leading-normal">
                          it's about honest conversation.
                        </p>
                      </div>

                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/40 to-transparent drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>

                      {/* Audience */}
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          for anyone who still believes love is worth understanding —
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          who wants to connect instead of drift,
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          to grow instead of give up.
                        </p>
                      </div>

                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/40 to-transparent drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>

                      {/* Closing */}
                      <div className="border-l-2 border-peach-400/30 pl-6 space-y-2">
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          you bring the feelings.
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          we help you make sense of them —
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          so you can grow together, not apart.
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </section>

          {/* Powered by Laurie AI */}
          <section className="animate-slide-up animation-delay-300 scroll-fade-in">
            <div className="relative group">
              {/* Glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass container */}
              <div className="relative backdrop-blur-xl rounded-3xl p-6 md:p-10
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]
                hover:-translate-y-2 hover:scale-[1.01]
                transition-all duration-500 ease-out">
                
                {/* Heading with gradient and duck icon */}
                <h2 className="text-3xl md:text-4xl font-brand text-center mb-6
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent
                  flex items-center justify-center gap-3">
                  <DuckIcon 
                    size={48} 
                    className="text-coral-400 drop-shadow-[0_0_20px_rgba(255,132,80,0.6)] flex-shrink-0" 
                  />
                  <span>powered by laurie ai</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent mb-6 max-w-2xl mx-auto drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-4 max-w-2xl mx-auto space-y-2">
            <p className="text-base md:text-lg text-white/98 font-light leading-normal">
              <span className="font-brand">heartlines</span> is built by laurie ai
            </p>
            <p className="text-base md:text-lg text-white/98 font-light leading-normal">
              ai for stronger relationships and stronger communities.
            </p>
                </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/70 hover:text-white font-light text-sm
                        transition-all duration-300
                        hover:bg-white/5 rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">Read More</span>
                      <span className="group-data-[state=closed]/button:hidden">Show Less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {/* Decorative gradient divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent mb-4 max-w-xs mx-auto mt-6 drop-shadow-[0_0_8px_rgba(255,132,80,0.3)]"></div>

                    {/* What We Do */}
                    <div className="max-w-2xl mx-auto mb-4">
                      <div className="ml-8 border-l-2 border-pink-400/30 pl-6 space-y-2">
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          we create tools that help people grow, heal, and connect —
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          then reinvest part of our profit to build purpose-built tools
                        </p>
                        <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                          for the people and communities too often left behind.
                        </p>
                      </div>
                    </div>

                    {/* Pull quote - The Cycle */}
                    <div className="relative max-w-xl mx-auto mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 via-coral-500/30 to-peach-400/20 rounded-2xl blur-md"></div>
                      <div className="relative backdrop-blur-sm rounded-2xl p-4 md:p-5
                        bg-white/15 border border-pink-400/40
                        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]
                        transition-all duration-500">
                        <Globe className="w-6 h-6 md:w-8 md:h-8 text-peach-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(255,183,123,0.7)]" />
                        <p className="text-base md:text-lg text-white/98 font-normal leading-normal text-center">
                          profit fuels purpose. purpose drives connection.
                        </p>
                      </div>
                    </div>

                    {/* Closing */}
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        when ai helps people connect,
                      </p>
                      <p className="text-base md:text-lg text-white/95 font-light leading-normal">
                        communities get stronger.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* CTAs with glass effect - Always visible */}
                <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
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
                      bg-white/15 border border-white/40 text-white
                      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]
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