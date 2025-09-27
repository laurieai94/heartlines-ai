import { Heart, MessageCircle, Target } from "lucide-react";

// Lightweight step card component
const StepCard = ({
  step,
  title,
  description,
  icon,
  iconName,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconName: string;
}) => (
  <article className="relative group cursor-pointer w-full max-w-md mx-auto md:max-w-none mb-3 md:mb-0 h-full">
    <div className="relative overflow-hidden h-full flex flex-col rounded-2xl glass-burgundy shadow-xl p-4 md:p-6 min-h-[200px] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-coral-400/20">
      {/* Inner Highlight Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 via-white/3 to-transparent opacity-60"></div>
      
      {/* Edge Light - Inner Border */}
      <div className="absolute inset-px rounded-2xl border border-white/8"></div>

      {/* Ghosted Background Number - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute -top-4 -right-6 text-[180px] md:text-[200px] font-black text-white/5 leading-none select-none">
          {step}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center pt-3 md:pt-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Icon */}
          <div className="mb-2 md:mb-4 flex justify-center">
            <div className="relative w-8 h-8 md:w-12 md:h-12 glass-burgundy border-2 border-burgundy-400/40 rounded-full flex items-center justify-center text-coral-300 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:text-pink-300 group-hover:bg-burgundy-300/35 group-hover:border-coral-400/60" aria-label={`${iconName} icon`}>
              <div className="scale-75 md:scale-100">
                {icon}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-base md:text-lg font-semibold text-white/95 mb-1 md:mb-2 leading-tight md:leading-7">
            {title}
          </h3>
        </div>
        
        <p className="text-sm md:text-base text-white/75 leading-relaxed mt-1.5">
          {description}
        </p>
      </div>

      {/* Subtle Sheen Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-transparent via-white/5 to-transparent transition-opacity duration-500 pointer-events-none"></div>
    </div>
  </article>
);

// How it works section component
export const OptimizedLandingPageSteps = () => {
  const steps = [
    {
      step: "1",
      title: "Share Your Story",
      description: "Tell us about your relationship dynamics, challenges, and goals in a quick questionnaire.",
      icon: <Heart className="w-6 h-6" />,
      iconName: "Heart"
    },
    {
      step: "2", 
      title: "Get Personalized Guidance",
      description: "Receive tailored insights and conversation strategies based on your unique situation.",
      icon: <MessageCircle className="w-6 h-6" />,
      iconName: "Message Circle"
    },
    {
      step: "3",
      title: "Practice & Improve",
      description: "Role-play conversations with AI and build confidence for real-world interactions.",
      icon: <Target className="w-6 h-6" />,
      iconName: "Target"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 xl:px-8">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-normal text-white mb-4">
            How <span className="font-brand">heartlines</span> Works
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Get personalized relationship guidance in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};