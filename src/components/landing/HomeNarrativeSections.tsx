import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ScrollReveal from "../layout/ScrollReveal";

/**
 * Six narrative sections that live directly below the hero on the landing page.
 * Same neon maroon / coral / pink glow family, lowercase editorial serif + mono voice.
 * No em dashes anywhere in copy.
 */
const HomeNarrativeSections = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleTalkToKai = () => {
    if (user) navigate("/coach");
    else navigate("/signup");
  };

  // shared typography
  const kicker =
    "font-mono text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-coral-300/80";
  const serif =
    "font-playfair font-light text-white/95 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]";
  const subLine =
    "font-playfair font-light text-white/70 tracking-wide italic";

  return (
    <div className="relative">
      {/* SECTION 1 — the premise */}
      <section className="relative py-20 md:py-28 lg:py-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollReveal>
            <p className={`${kicker} mb-8 md:mb-10 text-center`}>
              what heartlines is for
            </p>
            <div
              className={`${serif} text-center space-y-5 md:space-y-6 text-xl md:text-2xl lg:text-3xl leading-[1.7]`}
            >
              <p>the unread text after a fight.</p>
              <p>the half-written draft in your notes app.</p>
              <p>the shitty phone call home.</p>
              <p>the quiet in the kitchen. the two of you on the couch.</p>
            </div>
            <p
              className={`${serif} text-center mt-10 md:mt-14 text-xl md:text-2xl lg:text-3xl leading-[1.6]`}
            >
              heartlines lives in the beat between your overthinking and your
              actual words.
            </p>
            <p
              className={`${subLine} text-center mt-10 md:mt-12 text-base md:text-lg`}
            >
              an ai relationship coach for messy, modern love. powered by kai.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 2 — meet kai */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollReveal>
            <p className={`${kicker} mb-8 md:mb-10`}>
              context-aware, not a cold start
            </p>
            <div className={`${serif} space-y-6 text-xl md:text-2xl leading-[1.65]`}>
              <p>kai isn't starting from zero every time something happens.</p>
              <p>
                build a profile for yourself. add partner profiles: the
                long-term partner, the situationship, the 2am 'wyd?' texter.
                kai never re-asks what it already knows. it just gets sharper.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div
              className={`${serif} mt-12 md:mt-16 space-y-6 md:space-y-8 text-lg md:text-xl text-white/85 leading-[1.6] border-l border-coral-400/30 pl-6 md:pl-8`}
            >
              <p>
                different scripts for the person you live with, the one you
                flirt with, and the one you left.
              </p>
              <p>advice that's caught up on every season. no recaps needed.</p>
              <p>from 'why am i like this?' to 'here's my next move.'</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3 — built for real people (full-width, moral center) */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Full-width burgundy wash + subtle coral glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent" />
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-coral-500/10 blur-[120px]" />
          <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-5xl text-center">
          <ScrollReveal>
            <p className={`${kicker} mb-10 md:mb-14`}>
              queer and trauma-informed by design, not by campaign
            </p>
            <div
              className={`${serif} space-y-8 md:space-y-10 text-2xl md:text-3xl lg:text-4xl leading-[1.5]`}
            >
              <p>come as you are. no straight-washing, no 'you'll grow out of it' arc.</p>
              <p>
                call homophobia, transphobia, and 'i'm just concerned' exactly
                what they are.
              </p>
              <p>
                for the ones who survived the group chat, the church, the
                house, and still believe in love.
              </p>
            </div>
            <p
              className={`${subLine} mt-12 md:mt-16 text-base md:text-lg text-white/60`}
            >
              founded by an lgbtq+ couple. this isn't a feature. it's the foundation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4 — private by design */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollReveal>
            <p className={`${kicker} mb-8 md:mb-10`}>
              ai that protects what's real, not mines it
            </p>
            <div className={`${serif} space-y-6 md:space-y-7 text-xl md:text-2xl leading-[1.65]`}>
              <p>
                encrypted at rest. we can only ever see your first name and
                email, never the details of your love life.
              </p>
              <p>
                no tracking. no selling emotions. no backdoor into your worst
                night.
              </p>
              <p>
                built on anthropic's claude, chosen because their approach to
                safety actually matches what we believe.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5 — laurie ai */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-3xl">
          <ScrollReveal>
            <p className={`${kicker} mb-8 md:mb-10`}>
              your subscription is part of a longer arc
            </p>
            <div className={`${serif} space-y-6 md:space-y-7 text-xl md:text-2xl leading-[1.65]`}>
              <p>
                heartlines is laurie ai's first flagship. as it grows, revenue
                helps fund small, purpose-built ai tools, co-created with the
                nonprofits, educators, and organizers already holding
                communities together.
              </p>
              <p className="text-white">your 2am texts help fund 2pm support.</p>
            </div>
            <p className={`${subLine} mt-10 md:mt-12 text-sm md:text-base text-white/60`}>
              sam wortman, founder
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6 — closing CTA */}
      <section className="relative pt-28 md:pt-40 pb-28 md:pb-40 overflow-hidden bg-burgundy-800">
        {/* soft gradient bleeding in from top */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(51,0,13,0) 0%, rgba(51,0,13,0.6) 60%, rgba(51,0,13,0.9) 100%)",
          }}
          aria-hidden="true"
        />
        {/* ambient coral glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-coral-500/10 blur-[140px] pointer-events-none" />

        <div className="relative container mx-auto px-6 max-w-2xl text-center">
          <ScrollReveal>
            <p
              className={`${serif} text-xl md:text-2xl lg:text-3xl mb-10 md:mb-14 text-white/90`}
            >
              your next move doesn't have to be a guess.
            </p>

            <div
              onClick={handleTalkToKai}
              className="relative group inline-block cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98]"
            >
              {/* crisp coral to pink glow, same family as nav pill but larger */}
              <div
                className="absolute -inset-1 rounded-full opacity-85 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(to right, #FF8A50, #EC4899)",
                }}
              />
              <Button
                className="relative text-white px-8 md:px-10 py-5 md:py-6 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300 text-base md:text-lg font-medium"
                style={{
                  background: "linear-gradient(to right, #FF8A50, #EC4899)",
                  boxShadow:
                    "0 0 32px rgba(255, 107, 157, 0.45), 0 6px 20px rgba(255, 107, 157, 0.5), 0 3px 8px rgba(255, 138, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                }}
              >
                {/* shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="absolute inset-0 animate-shimmer"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>
                <span className="relative z-10">talk to kai</span>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default HomeNarrativeSections;
