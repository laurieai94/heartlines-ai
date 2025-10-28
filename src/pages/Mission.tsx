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
import PremiumBackground from "@/components/PremiumBackground";


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
        
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* 1. Hero Section */}
          <section className="flex flex-col items-center animate-fade-in pt-8 md:pt-12 pb-4 md:pb-6">
              <h1 
                className="font-brand text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent leading-none tracking-wider animate-fade-in"
                style={{
                  animationDelay: '0.2s',
                  textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                }}
              >
                our why
              </h1>
            <div className="flex items-center gap-2 mt-2 ml-[85px] md:ml-[135px] lg:ml-[195px] xl:ml-[280px]">
            <span className="font-brand text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider"
              style={{
                textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
              }}>
              powered by laurie ai
            </span>
              <DuckIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-200" />
            </div>
          </section>


          {/* 1.5. Our Moment */}
          <section className="animate-slide-up animation-delay-100 -mt-4 scroll-fade-in">
            <div className="relative group">
              {/* Outer glow layer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-coral-500/30 to-peach-400/30 
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-6 md:p-8
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-400 ease-out">
                
                {/* Header with gradient */}
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-8 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider animate-fade-in flex items-center justify-center gap-4"
                  style={{
                    animationDelay: '0.2s',
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}
                >
                  <Globe 
                    size={36} 
                    className="text-orange-100/80 flex-shrink-0" 
                  />
                  <span>our moment</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto">
                  <div className="space-y-4">
                <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                  ai is here.
                </p>
              <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                we can't stop it — and we can't ignore it.
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
                        transition-all duration-300
                        hover:bg-white/10 hover:translate-y-[-1px] rounded-lg
                        hover:animate-pulse
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

                      {/* Opening stanzas */}
                      <div className="space-y-4 text-left">
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          it's writing our emails.
                        </p>
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          driving our cars.
                        </p>
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          curating our feeds.
                        </p>
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          even finishing our thoughts.
                        </p>
                      </div>

                      <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose text-left">
                        it's changing how we live, work, love, and connect.
                      </p>

                      {/* The conflict */}
                      <div className="space-y-4 text-left">
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          but somewhere between <span className="text-white/95 font-medium">the progress and the code</span>, we lost something.
                        </p>

                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          we built machines to sound human—
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          and forgot how to be.
                        </p>

                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          technology promised connection.
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          instead, it left us scrolling for it.
                        </p>

                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          the world feels louder.
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          but somehow, <span className="text-white/95 font-medium">lonelier</span>.
                        </p>
                      </div>

                      {/* Call to action */}
                      <div className="space-y-4 text-left">
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          so this is our moment—
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to build ai that protects what's real.
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to make privacy sacred again.
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to make community the center of progress.
                        </p>
                      </div>

                      {/* Vision Section */}
                      <div className="border-l-2 border-rose-400/50 pl-6 space-y-4 text-left transition-all duration-300 hover:border-rose-400/70 hover:translate-x-1">
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to build technology that remembers where it came from:
                        </p>
                        <p className="text-base md:text-lg text-white/80 italic leading-loose">
                          classrooms that taught us to think,
                        </p>
                        <p className="text-base md:text-lg text-white/80 italic leading-loose">
                          kitchen tables that taught us to listen,
                        </p>
                        <p className="text-base md:text-lg text-white/80 italic leading-loose">
                          communities that taught us to care.
                        </p>
                        
                        <div className="pt-4">
                          <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                            because progress means nothing
                          </p>
                          <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                            if it forgets the people it was meant to serve.
                          </p>
                        </div>
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
                rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glass card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-6 md:p-8
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-2xl hover:shadow-pink-500/20
                transition-all duration-400 ease-out">
                
                {/* Header with gradient */}
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-8 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider animate-fade-in"
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
                <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                  the ai relationship coach for messy, modern love.
                </p>
                <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
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
                        transition-all duration-300
                        hover:bg-white/10 hover:translate-y-[-1px] rounded-lg
                        hover:animate-pulse
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {/* Single-column content layout */}
              <div className="max-w-2xl mx-auto space-y-6 mt-8 text-left">
                {/* Opening - what heartlines is */}
                <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                  <span className="font-brand">heartlines</span> is built for <span className="text-white/95 font-medium">the messy middle</span>:
                </p>
                <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                  the quiet after a fight, the unread message, the "i miss you but don't know what to say" moments that hit before logic does.
                </p>

                {/* What it does - Powered by Laurie AI */}
                <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                  powered by laurie ai, it helps you slow down, make sense of what you feel, find the words before they get lost, and understand what's really going on between you and the people you care about.
                </p>

                {/* Kai section */}
                <div className="border-l-2 border-coral-400/50 pl-6 space-y-4 transition-all duration-300 hover:border-coral-400/70 hover:translate-x-1">
                  <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                    with kai, your ai relationship coach, you can unpack what happened, see your patterns, and learn how to communicate without losing yourself.
                  </p>
                </div>

                {/* What it's not */}
                <div className="space-y-6">
                  <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                    it's not therapy.
                  </p>
                  <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                    it's not another app to scroll through.
                  </p>
                  <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                    it's not a place to perform.
                  </p>
                  <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                    it's where you figure out love while you're still feeling it.
                  </p>
                </div>

                {/* Privacy section */}
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                    every conversation is private and encrypted.
                  </p>
                  <p className="text-base md:text-lg text-white/80 font-light leading-loose">
                    no tracking. no selling your emotions. just real talk, built on trust.
                  </p>
                </div>

                {/* Closing statement */}
                <div className="border-l-2 border-peach-400/40 pl-6 transition-all duration-300 hover:border-peach-400/60 hover:translate-x-1">
                  <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                    because real intimacy isn't about being perfect, it's about being understood.
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
              <div className="relative backdrop-blur-xl rounded-3xl p-6 md:p-8
                bg-gradient-to-br from-white/25 via-white/20 to-white/15
                border border-pink-400/30
                hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20
                hover:-translate-y-2 hover:scale-[1.01]
                transition-all duration-400 ease-out">
                
                {/* Heading with gradient and duck icon */}
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-8 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider animate-fade-in flex items-center justify-center gap-4"
                  style={{
                    animationDelay: '0.2s',
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}
                >
                  <DuckIcon 
                    size={36} 
                    className="text-orange-200 drop-shadow-[0_0_10px_rgba(251,146,60,0.4)] flex-shrink-0" 
                  />
                  <span>powered by laurie ai</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto space-y-4">
              <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
                laurie ai starts on a simple belief:
              </p>
              <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed">
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
                        transition-all duration-300
                        hover:bg-white/10 hover:translate-y-[-1px] rounded-lg
                        hover:animate-pulse
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="max-w-2xl mx-auto space-y-6 mt-8">
                      {/* Seattle vision */}
                      <div className="space-y-4">
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          we're building toward that vision here in seattle,
                        </p>
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          planning to partner with people who make a difference every day: nonprofits, teachers, caregivers, organizers.
                        </p>
                      </div>

                      {/* Partnership approach */}
                      <div className="border-l-2 border-pink-400/50 pl-6 space-y-4 transition-all duration-300 hover:border-pink-400/70 hover:translate-x-1">
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          they bring lived experience.
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-loose">
                          we bring tech and resources.
                        </p>
                      </div>

                      {/* Building approach */}
                      <div className="space-y-4">
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          together, we're creating ai that <span className="text-white/95 font-medium">starts small, stays human, and moves with intention</span>.
                        </p>
                      </div>

                      {/* Core principles */}
                      <div className="space-y-4">
                        <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                          growth fuels inclusion.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                          purpose drives connection.
                        </p>
                      </div>

                      {/* AI's role */}
                      <div className="space-y-4">
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          when ai helps people connect, it doesn't erase our differences, it helps us understand them.
                        </p>
                      </div>

                      {/* Community vision */}
                      <div className="border-l-2 border-coral-400/40 pl-6 space-y-4 transition-all duration-300 hover:border-coral-400/60 hover:translate-x-1">
                        <p className="text-base md:text-lg text-white/90 font-light leading-loose">
                          it builds communities where we can disagree and still listen, care, and show up for each other.
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-loose">
                          communities that are compassionate, collaborative, and still beautifully complex.
                        </p>
                      </div>

                      {/* Final vision */}
                      <div className="space-y-4">
                        <p className="text-lg md:text-xl text-white/95 font-medium leading-loose">
                          that's the future we're building, where ai doesn't replace what's human, it strengthens it.
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </section>

          {/* CTAs with glass effect - Always visible */}
          <div className="flex flex-wrap gap-4 justify-center items-center mt-8 mb-8">
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
              partner with us
            </Button>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Mission;