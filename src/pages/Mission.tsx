import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { Heart, MessageSquare, Globe, ChevronDown } from "lucide-react";
import SimpleHeader from "@/components/layout/SimpleHeader";
import DuckIcon from "@/components/icons/DuckIcon";
import SiteFooter from "@/components/layout/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PremiumBackground from "@/components/brand/PremiumBackground";


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
      
      <div className="landing-page-scroll min-h-screen bg-burgundy-800 flex flex-col relative overflow-hidden">
      <PremiumBackground />
      
      <SimpleHeader user={user} activeTab="home" onSignInClick={handleSignInClick} hideSignInButton={true} />
        
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 md:space-y-16 overflow-x-hidden">
          {/* 1. Hero Section */}
          <section className="flex flex-col items-center animate-fade-in pt-8 md:pt-12 pb-2 md:pb-3">
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <h1 
                className="font-brand text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent leading-none tracking-wider animate-fade-in"
                style={{
                  animationDelay: '0.2s',
                  textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                }}
              >
                our why
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 self-end pr-0 sm:pr-4 md:pr-8 lg:pr-12">
                <DuckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-orange-200" />
                <span className="font-brand text-base sm:text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider"
                  style={{
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}>
                  powered by laurie ai
                </span>
              </div>
            </div>
          </section>


          {/* 1.5. Our Moment */}
          <section className="animate-slide-up animation-delay-100 -mt-12 md:-mt-16 scroll-fade-in">
            <div className="relative group">
              {/* Outer glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-md md:blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-5 md:p-6 lg:p-8 max-w-[calc(100vw-2rem)] mx-auto
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-400 ease-out">
                
                {/* Header with gradient */}
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-8 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider animate-fade-in flex items-center justify-center gap-3 md:gap-4"
                  style={{
                    animationDelay: '0.2s',
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}
                >
                  <Globe 
                    className="w-7 h-7 md:w-9 md:h-9 text-orange-100/80 flex-shrink-0" 
                  />
                  <span>our moment</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto">
                  <div className="space-y-4">
                <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                  ai is here.
                </p>
              <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                we can't stop it and we can't ignore it.
              </p>
                  </div>
                </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/80 hover:text-white font-light text-sm
                        transition-all duration-300 border border-white/10
                        hover:bg-white/10 hover:border-white/20 hover:translate-y-[-1px] hover:scale-[1.01] rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="space-y-6 mt-6 max-w-2xl mx-auto">
                      {/* Divider */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                      </div>

                      {/* Second stanza - AI's actions */}
                      <div className="space-y-3 text-left">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          it writes our emails.
                          <br />
                          drives our cars.
                          <br />
                          curates our feeds.
                          <br />
                          finishes our thoughts.
                        </p>
                      </div>

                      {/* The conflict section - simplified */}
                      <div className="space-y-3 text-left mt-5">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          we built machines to sound human,
                          <br />
                          and forgot how to be.
                        </p>

                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          technology promised connection.
                          <br />
                          but left us scrolling for it.
                        </p>

                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          the world grew faster,
                          <br />
                          brighter,
                          <br />
                          louder
                          <br />
                          and somehow, lonelier.
                        </p>
                      </div>

                      {/* Call to action - simplified */}
                      <div className="space-y-3 text-left mt-5">
                        <p className="text-base md:text-lg text-white/95 font-semibold leading-relaxed">
                          this is our moment.
                        </p>
                        
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          to build ai that protects what's real.
                          <br />
                          to make privacy sacred again.
                          <br />
                          to put community back at the center of progress.
                        </p>
                      </div>

                      {/* Vision section with border */}
                      <div className="space-y-3 text-left mt-5 pl-3 md:pl-4 border-l-2 border-rose-300/30 transition-all duration-300 hover:border-rose-400/70 hover:translate-x-1">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          to design technology that remembers where it came from:
                          <br />
                          <span className="italic text-white/95 font-medium">classrooms that taught us to think,</span>
                          <br />
                          <span className="italic text-white/95 font-medium">kitchen tables that taught us to listen,</span>
                          <br />
                          <span className="italic text-white/95 font-medium">communities that taught us to care.</span>
                        </p>

                        <p className="text-sm md:text-base text-white/95 font-medium leading-relaxed pt-2">
                          because progress means nothing
                          <br />
                          if it forgets the people it was meant to serve.
                        </p>
                      </div>

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
                rounded-3xl blur-md md:blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-5 md:p-6 lg:p-8 max-w-[calc(100vw-2rem)] mx-auto
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-400 ease-out">
                
                {/* Header with gradient */}
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-8 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider animate-fade-in"
                  style={{
                    animationDelay: '0.2s',
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}
                >
                  💞 what <span className="font-brand">heartlines</span> is
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
        <div className="text-center mb-6 max-w-2xl mx-auto space-y-4">
                <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                  the ai relationship coach for messy, modern love.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed">
                  for the dms, the late-night texts, and the "can we talk?" moments that make love complicated and real.
                </p>
        </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/80 hover:text-white font-light text-sm
                        transition-all duration-300 border border-white/10
                        hover:bg-white/10 hover:border-white/20 hover:translate-y-[-1px] hover:scale-[1.01] rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {/* Single-column content layout */}
              <div className="max-w-2xl mx-auto space-y-5 mt-6 text-left">
                {/* Opening - what heartlines is */}
                <div className="space-y-3 text-left">
                  <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                    <span className="font-brand">heartlines</span> is built for <span className="text-white/95 font-medium">the messy middle</span>:
                    <br />
                    the quiet after a fight,
                    <br />
                    the unread message,
                    <br />
                    the "i miss you but don't know what to say"
                    <br />
                    that hits before logic does.
                  </p>
                </div>

                {/* What it does - Powered by Laurie AI */}
                <div className="space-y-3 text-left">
                  <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                    powered by laurie ai,
                    <br />
                    it helps you slow down.
                    <br />
                    make sense of what you feel.
                    <br />
                    find the words before they get lost.
                    <br />
                    understand what's really going on
                    <br />
                    between you and the people you care about.
                  </p>
                </div>

                {/* Kai section */}
                <div className="border-l-2 border-coral-400/50 pl-4 md:pl-6 space-y-3 text-left transition-all duration-300 hover:border-coral-400/70 hover:translate-x-1">
                  <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                    with kai, your ai relationship coach,
                    <br />
                    you can unpack what happened,
                    <br />
                    see your patterns,
                    <br />
                    and learn how to communicate
                    <br />
                    without losing yourself.
                  </p>
                </div>

            {/* What it's not */}
            <div className="space-y-3 text-left">
              <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                it's not therapy.
                <br />
                it's not another app to scroll through.
                <br />
                it's not a place to perform.
              </p>
              <p className="text-base md:text-lg text-white/95 font-semibold leading-relaxed">
                it's where you figure out love while you're still feeling it.
              </p>
            </div>

                {/* Privacy section */}
                <div className="space-y-3 text-left">
                  <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                    every conversation is private and encrypted.
                    <br />
                    no tracking. no selling your emotions.
                    <br />
                    just real talk built on trust.
                  </p>
                </div>

                {/* Closing statement */}
                <div className="border-l-2 border-peach-400/40 pl-4 md:pl-6 space-y-3 text-left transition-all duration-300 hover:border-peach-400/60 hover:translate-x-1">
                  <p className="text-base md:text-lg text-white/95 font-semibold leading-relaxed">
                    because true intimacy lives in the quiet moments
                    <br />
                    we let ourselves be known.
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
                rounded-3xl blur-md md:blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass container */}
              <div className="relative backdrop-blur-xl rounded-3xl p-5 md:p-6 lg:p-8 max-w-[calc(100vw-2rem)] mx-auto
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20
                hover:-translate-y-2 hover:scale-[1.01]
                transition-all duration-400 ease-out">
                
                {/* Heading with gradient and duck icon */}
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-8 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider animate-fade-in flex items-center justify-center gap-3 md:gap-4"
                  style={{
                    animationDelay: '0.2s',
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}
                >
                  <DuckIcon 
                    className="w-7 h-7 md:w-9 md:h-9 text-orange-200 drop-shadow-[0_0_10px_rgba(251,146,60,0.4)] flex-shrink-0" 
                  />
                  <span>powered by laurie ai</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                laurie ai starts with a simple belief:
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed">
                stronger relationships build stronger communities.
              </p>
                </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/80 hover:text-white font-light text-sm
                        transition-all duration-300 border border-white/10
                        hover:bg-white/10 hover:border-white/20 hover:translate-y-[-1px] hover:scale-[1.01] rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="max-w-2xl mx-auto space-y-5 mt-6">
                      {/* Seattle vision */}
                      <div className="space-y-3 text-left">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          we're working to bring that belief to life here in seattle,
                          <br />
                          partnering with the people who hold communities together:
                          <br />
                          nonprofits, educators, caregivers, organizers.
                        </p>
                      </div>

                      {/* Partnership approach */}
                      <div className="border-l-2 border-pink-400/50 pl-4 md:pl-6 space-y-3 transition-all duration-300 hover:border-pink-400/70 hover:translate-x-1">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          they will bring lived experience.
                          <br />
                          we will bring tech and resources.
                        </p>
                      </div>

                      {/* Core vision */}
                      <div className="space-y-3">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          together, we'll create ai that starts small,
                          <br />
                          stays human, and acts with intention.
                          <br /><br />
                          growth will mean inclusion.
                          <br />
                          purpose will mean connection.
                          <br /><br />
                          when ai helps people connect,
                          <br />
                          it won't erase our differences,
                          <br />
                          it will help us understand them.
                          <br /><br />
                          we're building toward communities
                          <br />
                          that remain compassionate,
                          <br />
                          collaborative, and beautifully complex.
                        </p>
                      </div>

                      {/* Closing vision */}
                      <div className="border-l-2 border-coral-400/40 pl-4 md:pl-6 space-y-3 transition-all duration-300 hover:border-coral-400/60 hover:translate-x-1">
                        <p className="text-sm md:text-base text-white/90 font-light leading-relaxed">
                          a future where tech
                          <br />
                          listens first, learns fast,
                          <br />
                          and lifts entire communities.
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </section>

          {/* CTAs with glass effect - Always visible */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mt-8 mb-8 pb-safe px-4">
            <Button
              size="lg"
              onClick={handleSignInClick}
              className="w-full sm:w-auto sm:min-w-[180px] text-base sm:text-lg text-white rounded-full border-2 border-white/40 backdrop-blur-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'linear-gradient(to right, #FF8A50, #EC4899)'
              }}
            >
              get started
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto sm:min-w-[180px] text-base sm:text-lg backdrop-blur-2xl
                bg-white/10 border border-white/30 text-white
                hover:bg-white/20 hover:scale-105 hover:-translate-y-1
                transition-all duration-300"
            >
              partner with us
            </Button>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Mission;