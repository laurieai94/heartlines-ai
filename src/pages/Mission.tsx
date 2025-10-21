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
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-96 right-20 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-peach-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <SimpleHeader user={user} activeTab="home" onSignInClick={handleSignInClick} hideSignInButton={true} />
        
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* 1. Hero Section */}
          <section className="flex flex-col items-center animate-fade-in pt-8 md:pt-12 pb-4 md:pb-6">
            <h1 
              className="font-brand text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent leading-none animate-gradient-glow tracking-wide"
            >
              our why
            </h1>
            <div className="flex items-center gap-2 mt-1 ml-[70px] md:ml-[110px] lg:ml-[160px] xl:ml-[230px]">
            <span className="font-glacial text-lg md:text-xl lg:text-2xl text-white">
              powered by laurie ai
            </span>
              <DuckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-coral-400" />
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
                <h2 className="text-3xl md:text-3xl lg:text-4xl font-brand text-center mb-8
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent
                  flex items-center justify-center gap-3">
                  <Globe 
                    size={44} 
                    className="text-coral-400 drop-shadow-[0_0_20px_rgba(255,132,80,0.6)] flex-shrink-0 animate-pulse" 
                  />
                  <span>our moment</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto">
                  <div className="space-y-4">
                <p className="text-xl md:text-xl text-white/95 font-light leading-relaxed">
                  ai is here.
                </p>
                <p className="text-xl md:text-xl text-white/95 font-semibold leading-relaxed">
                  we can't stop it, and we can't ignore it.
                </p>
                  </div>
                </div>

                {/* Collapsible full content */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 py-4 mt-2 mb-2
                        text-white/70 hover:text-white font-light text-sm
                        transition-all duration-300
                        hover:bg-white/10 hover:translate-y-[-1px] rounded-lg
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

                      <p className="text-base md:text-lg text-white/90 font-light leading-relaxed text-left">
                        it's writing our emails, driving our cars, curating our feeds, even finishing our thoughts — shaping how we live, work, love, and connect.
                      </p>

                      {/* Conflict Section */}
                      <div className="space-y-4 text-left">
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          but somewhere between the progress and the code,<br />
                          <span className="text-white font-semibold">we lost something.</span>
                        </p>

                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          we built machines to talk like us,<br />
                          while forgetting to listen to each other.
                        </p>

                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          technology promised connection.<br />
                          instead, it left us scrolling for it —
                        </p>

                        <p className="text-base md:text-lg text-white/80 leading-loose italic">
                          while the world around us grows more divided, more isolated, more disconnected.
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="space-y-3 text-left">
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          so <span className="text-white font-semibold">this is our moment</span> —
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to build ai that <span className="text-white font-semibold">protects what's real.</span>
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to make <span className="text-white font-semibold">privacy sacred again.</span>
                        </p>
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to make <span className="text-white font-semibold">community the center</span> of progress.
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                      </div>

                      {/* Vision Section */}
                      <div className="border-l-2 border-rose-400/40 pl-6 space-y-3 text-left">
                        <p className="text-base md:text-lg text-white/90 leading-loose">
                          to build technology that remembers where it came from:
                        </p>
                        <p className="text-base md:text-lg text-white/80 italic leading-loose">
                          from classrooms that taught us how to think for ourselves,
                        </p>
                        <p className="text-base md:text-lg text-white/80 italic leading-loose">
                          from kitchen tables where we learned to listen even when we disagreed,
                        </p>
                        <p className="text-base md:text-lg text-white/80 italic leading-loose">
                          from communities where kindness still matters more than clicks.
                        </p>
                        <div className="pt-4">
                          <p className="text-base md:text-lg text-white/90 leading-loose">
                            because progress means nothing
                          </p>
                          <p className="text-base md:text-lg text-white/90 leading-loose">
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
                <h2 className="text-3xl md:text-3xl lg:text-4xl font-brand text-center mb-8
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent">
                  💞 what <span className="font-brand">heartlines</span> is
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto space-y-3">
                  <p className="text-xl md:text-xl text-white/95 font-light leading-relaxed">
                    stronger relationships start here.
                  </p>
                  <p className="text-xl md:text-xl text-white/95 font-light leading-relaxed">
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
                        hover:bg-white/10 hover:translate-y-[-1px] rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {/* Single-column content layout */}
                    <div className="max-w-2xl mx-auto space-y-6 mt-8">
                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/30 to-transparent"></div>

                      {/* Opening statement */}
                      <div className="space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          <span className="font-brand">heartlines</span> is built for how we love now —
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          through late-night texts, voice notes, across time zones, and "hey, can we talk?" moments that don't wait for therapy appointments.
                        </p>
                      </div>

                      {/* Powered by Laurie AI */}
                      <div>
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          powered by <span className="font-semibold text-white">laurie ai</span>, it's a space to slow down, talk it out, and understand yourself before things spiral.
                        </p>
                      </div>

                      {/* Kai section */}
                      <div className="border-l-2 border-coral-400/40 pl-6 space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          with <span className="font-semibold text-white">kai</span>, your ai relationship coach,
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          you can unpack what happened after a fight,
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          see your patterns, and learn how to communicate without losing yourself.
                        </p>
                      </div>

                      {/* Purpose statement */}
                      <div>
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          it's about helping you show up the way you mean to.
                        </p>
                      </div>

                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/30 to-transparent"></div>

                      {/* For everyone */}
                      <div>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          whether you're on the apps, in a situationship, on the apps, or finding your way back to yourself, <span className="font-brand">heartlines</span> meets you where you are — in real time, in your own words.
                        </p>
                      </div>

                      {/* Privacy */}
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          your conversations stay private and encrypted.
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          no tracking, no algorithms selling your emotions.
                        </p>
                      </div>

                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/30 to-transparent"></div>

                      {/* Closing statement */}
                      <div className="border-l-2 border-peach-400/30 pl-6 space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          <span className="font-brand">heartlines</span> is the <span className="font-semibold text-white">space between dating apps and therapy</span> —
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          a place to figure things out while you're still feeling them,
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          so love feels a little less confusing,
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          and a lot more real.
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
                <h2 className="text-3xl md:text-3xl lg:text-4xl font-brand text-center mb-8
                  bg-gradient-to-r from-pink-400 via-coral-400 to-peach-400 bg-clip-text text-transparent
                  flex items-center justify-center gap-3">
                  <DuckIcon 
                    size={48} 
                    className="text-coral-400 drop-shadow-[0_0_20px_rgba(255,132,80,0.6)] flex-shrink-0" 
                  />
                  <span>powered by laurie ai</span>
                </h2>
                
                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8 max-w-2xl mx-auto"></div>
                
                {/* Preview content - always visible */}
                <div className="text-center mb-6 max-w-2xl mx-auto space-y-4">
            <p className="text-xl md:text-xl text-white/95 font-light leading-relaxed">
              <span className="font-brand">heartlines</span> is built by laurie ai
            </p>
            <p className="text-xl md:text-xl text-white/95 font-light leading-relaxed">
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
                        hover:bg-white/10 hover:translate-y-[-1px] rounded-lg
                        group/button"
                    >
                      <span className="group-data-[state=open]/button:hidden">read more</span>
                      <span className="group-data-[state=closed]/button:hidden">show less</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="max-w-2xl mx-auto space-y-6 mt-8">
                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/30 to-transparent"></div>

                      {/* Opening statement */}
                      <div className="space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          laurie ai runs on a <span className="font-semibold text-white">simple idea</span>:
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          if ai can help people connect, it should also help communities thrive.
                        </p>
                      </div>

                      {/* Business model explanation */}
                      <div className="space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          we're building that vision here in <span className="font-semibold text-white">seattle</span>, starting in the neighborhoods where we live and work — partnering with local nonprofits, educators, and community orgs to create purpose-built ai for the people who need it most.
                        </p>
                      </div>

                      {/* Hybrid model */}
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          it's a <span className="font-semibold text-white">hybrid model — part business, part mission</span> —
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          proving that tech can drive growth and give back.
                        </p>
                      </div>

                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/30 to-transparent"></div>

                      {/* How we work */}
                      <div className="space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          we work directly with people who live the problems we're solving:
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          teachers, social workers, caregivers, and organizers
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          who know what their communities actually need.
                        </p>
                      </div>

                      {/* Partnership approach */}
                      <div className="border-l-2 border-pink-400/40 pl-6 space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          we bring the technology and resources.
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          they bring the insight and lived experience.
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          together, we build ai that starts small — <span className="font-semibold text-white">human, local, intentional.</span>
                        </p>
                      </div>

                      {/* Decorative gradient divider */}
                      <div className="h-px bg-gradient-to-r from-coral-400/30 to-transparent"></div>

                      {/* Closing statement */}
                      <div className="border-l-2 border-coral-400/30 pl-6 space-y-3">
                        <p className="text-base md:text-lg text-white/90 font-light leading-relaxed">
                          <span className="font-semibold text-white">profit fuels purpose. purpose drives connection.</span>
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          when ai helps people connect,
                        </p>
                        <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                          communities get stronger.
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
              build community ai
            </Button>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Mission;