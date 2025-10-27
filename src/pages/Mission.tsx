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
        
        <main className="flex-1 w-full py-0">
          {/* 1. Hero Section */}
          <section className="w-full bg-burgundy-800 flex flex-col items-center animate-fade-in pt-16 md:pt-24 pb-12 md:pb-16">
              <h1 
                className="font-brand text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent leading-none tracking-wider animate-fade-in"
                style={{
                  animationDelay: '0.2s',
                  textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                }}
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


          {/* 2. Our Moment - Light Background */}
          <div className="w-full bg-gradient-to-br from-warmWhite to-peach-50/30 py-20 md:py-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <section className="animate-slide-up animation-delay-100 scroll-fade-in">
                <div className="relative group">
                  {/* Outer glow layer - simplified */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/15 via-coral-400/15 to-peach-300/15 
                    rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                  
                  {/* Glass card - simplified */}
                  <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12
                    bg-gradient-to-br from-white/20 via-white/15 to-white/10
                    border border-white/20
                    hover:bg-gradient-to-br hover:from-white/25 hover:via-white/20 hover:to-white/15
                    hover:-translate-y-1
                    hover:shadow-xl hover:shadow-pink-400/10
                    transition-all duration-300 ease-out">
                    
                    {/* Header with gradient */}
                    <h2 
                      className="text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-12 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wide flex items-center justify-center gap-3"
                    >
                      <Globe 
                        size={36} 
                        className="text-orange-200/90 flex-shrink-0" 
                      />
                      <span>our moment</span>
                    </h2>
                    
                    {/* All content visible - no collapsible */}
                    <div className="space-y-8 max-w-2xl mx-auto">
                      <div className="text-center space-y-4">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          ai is here.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          we can't stop it—and we can't ignore it.
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                      </div>

                      {/* Opening stanzas */}
                      <div className="space-y-3 text-left">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          it's writing our emails.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          driving our cars.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          curating our feeds.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          even finishing our thoughts.
                        </p>
                      </div>

                      <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose text-left">
                        it's changing how we live, work, love, and connect.
                      </p>

                      {/* The conflict */}
                      <div className="space-y-4 text-left">
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          but somewhere between the progress and the code, we lost something.
                        </p>

                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          we built machines to sound human—
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          and forgot how to be.
                        </p>

                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          technology promised connection.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          instead, it left us scrolling for it.
                        </p>

                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          the world feels louder.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          but somehow, lonelier.
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                      </div>

                      {/* Call to action */}
                      <div className="space-y-3 text-left">
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          so this is our moment—
                        </p>
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          to build ai that protects what's real.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          to make privacy sacred again.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          to make community the center of progress.
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                      </div>

                      {/* Vision Section */}
                      <div className="border-l-2 border-rose-400/40 pl-6 space-y-3 text-left">
                        <p className="text-lg md:text-xl text-white/95 leading-loose">
                          to build technology that remembers where it came from:
                        </p>
                        <p className="text-lg md:text-xl text-white/90 italic leading-loose">
                          classrooms that taught us to think,
                        </p>
                        <p className="text-lg md:text-xl text-white/90 italic leading-loose">
                          kitchen tables that taught us to listen,
                        </p>
                        <p className="text-lg md:text-xl text-white/90 italic leading-loose">
                          communities that taught us to care.
                        </p>
                        
                        <div className="pt-4">
                          <p className="text-lg md:text-xl text-white/95 leading-loose">
                            because progress means nothing
                          </p>
                          <p className="text-lg md:text-xl text-white/95 leading-loose">
                            if it forgets the people it was meant to serve.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* 3. What heartlines Is - Burgundy Background */}
          <div className="w-full bg-burgundy-800 py-20 md:py-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <section className="animate-slide-up animation-delay-200 scroll-fade-in">
                <div className="relative group">
                  {/* Outer glow layer - simplified */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/15 via-coral-400/15 to-peach-300/15 
                    rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                  
                  {/* Glass card - simplified */}
                  <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12
                    bg-gradient-to-br from-white/20 via-white/15 to-white/10
                    border border-white/20
                    hover:bg-gradient-to-br hover:from-white/25 hover:via-white/20 hover:to-white/15
                    hover:-translate-y-1
                    hover:shadow-xl hover:shadow-pink-400/10
                    transition-all duration-300 ease-out">
                    
                    {/* Header with gradient */}
                    <h2 
                      className="text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-12 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wide"
                    >
                      💞 what <span className="font-brand">heartlines</span> is
                    </h2>
                    
                    {/* All content visible - no collapsible */}
                    <div className="space-y-8 max-w-2xl mx-auto">
                      <div className="text-center space-y-4">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          the ai relationship coach for modern, messy love.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          built for the late-night texts, the "can we talk?" moments, and everything that makes love complicated and worth it.
                        </p>
                      </div>

                      {/* Opening statement */}
                      <div className="space-y-4">
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          it's built for the messy middle:
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          the late-night "are we okay?" talks, the post-fight spirals, the "i miss you but don't know what to say" moments that can't wait for therapy hours.
                        </p>
                      </div>

                      {/* Powered by Laurie AI */}
                      <div>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          powered by laurie ai, <span className="font-brand">heartlines</span> helps you slow down, reflect, and understand yourself, before the distance, defensiveness, or silence sets in.
                        </p>
                      </div>

                      {/* Kai section */}
                      <div className="border-l-2 border-coral-400/40 pl-6 space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          with kai, your ai relationship coach,
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          you can unpack what happened,
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          see your patterns,
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          and learn how to communicate without losing yourself.
                        </p>
                      </div>

                      {/* What it's not */}
                      <div className="space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          it's not therapy.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          it's not another dating app.
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-semibold leading-loose">
                          it's the space in between —
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          where you make sense of love while you're still feeling it.
                        </p>
                      </div>

                      {/* Privacy */}
                      <div className="space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          every conversation is private and encrypted.
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          no tracking. no selling your emotions. just space to be honest.
                        </p>
                      </div>

                      {/* Closing statement */}
                      <div className="border-l-2 border-peach-400/30 pl-6 space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          because real intimacy starts with understanding — and love feels a lot better when you know yourself in it.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* 4. Powered by Laurie AI - Light Background */}
          <div className="w-full bg-gradient-to-br from-warmWhite to-coral-50/20 py-20 md:py-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <section className="animate-slide-up animation-delay-300 scroll-fade-in">
                <div className="relative group">
                  {/* Glow layer - simplified */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/15 via-coral-400/15 to-peach-300/15 
                    rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                  
                  {/* Glass container - simplified */}
                  <div className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12
                    bg-gradient-to-br from-white/20 via-white/15 to-white/10
                    border border-white/20
                    hover:bg-gradient-to-br hover:from-white/25 hover:via-white/20 hover:to-white/15
                    hover:-translate-y-1
                    hover:shadow-xl hover:shadow-pink-400/10
                    transition-all duration-300 ease-out">
                    
                    {/* Heading with gradient and duck icon */}
                    <h2 
                      className="text-4xl md:text-5xl lg:text-6xl font-brand text-center mb-12 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wide flex items-center justify-center gap-3"
                    >
                      <DuckIcon 
                        size={36} 
                        className="text-orange-200/90 flex-shrink-0" 
                      />
                      <span>powered by laurie ai</span>
                    </h2>
                    
                    {/* All content visible - no collapsible */}
                    <div className="space-y-8 max-w-2xl mx-auto">
                      <div className="text-center space-y-4">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          because if ai can help people connect,
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          it should also help communities thrive.
                        </p>
                      </div>

                      {/* Opening belief */}
                      <div className="space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          laurie ai is built on a simple belief:
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          tech should make us more human, not less.
                        </p>
                      </div>

                      {/* Vision statement */}
                      <div className="space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          our long-term vision starts here in seattle, partnering with local nonprofits, educators, and community leaders to create purpose-built ai that serves real people and real needs.
                        </p>
                      </div>

                      {/* Hybrid model */}
                      <div className="space-y-2">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          it's a hybrid model — a new way of building tech that's part business, part mission— where growth funds inclusion and innovation serves everyone.
                        </p>
                      </div>

                      {/* Working with communities */}
                      <div className="space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          as we grow, we'll work side-by-side with the people living the challenges we're trying to solve — teachers, social workers, caregivers, organizers — the ones who know what their communities really need.
                        </p>
                      </div>

                      {/* Partnership approach */}
                      <div className="border-l-2 border-pink-400/40 pl-6 space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          we'll bring the ai and resources.
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          they'll bring the insight and lived experience.
                        </p>
                      </div>

                      {/* Building approach */}
                      <div className="space-y-2">
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          together, we'll build ai that starts small, stays human, and moves with intention.
                        </p>
                      </div>

                      {/* Closing statement */}
                      <div className="border-l-2 border-coral-400/30 pl-6 space-y-3">
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          <span className="font-semibold text-white">profit fuels purpose.</span>
                        </p>
                        <p className="text-lg md:text-xl text-white/95 font-light leading-loose">
                          <span className="font-semibold text-white">purpose drives connection.</span>
                        </p>
                      </div>

                      {/* Final statement */}
                      <div className="space-y-2">
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          because when ai helps people connect,
                        </p>
                        <p className="text-lg md:text-xl text-white/90 font-light leading-loose">
                          communities get stronger.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* 5. CTAs - Burgundy Background */}
          <div className="w-full bg-burgundy-800 py-16 md:py-20">
            <div className="flex flex-wrap gap-4 justify-center items-center">
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
          </div>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Mission;
