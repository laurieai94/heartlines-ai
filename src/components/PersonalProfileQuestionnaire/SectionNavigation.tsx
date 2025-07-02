
import { Check, User, Heart, Zap, Award } from "lucide-react";

interface SectionNavigationProps {
  currentSection: number;
  sectionReadiness: Record<number, boolean>;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  onSectionClick: (section: number) => void;
  profileData: any;
}

const SectionNavigation = ({ 
  currentSection, 
  sectionReadiness, 
  validateSection, 
  getRequiredCount, 
  getCompletedCount, 
  onSectionClick
}: SectionNavigationProps) => {
  const getSectionTitle = (section: number) => {
    switch (section) {
      case 1: return "The Real You";
      case 2: return "Your Situation";
      case 3: return "Your Vibe";
      case 4: return "Your Foundation";
      default: return "";
    }
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-3 h-3" />;
      case 2: return <Heart className="w-3 h-3" />;
      case 3: return <Zap className="w-3 h-3" />;
      case 4: return <Award className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {[1, 2, 3, 4].map((section) => {
        const isActive = section === currentSection;
        const isCompleted = section < currentSection || validateSection(section);
        const isAccessible = sectionReadiness[section] || isCompleted;
        const requiredCount = getRequiredCount(section);
        const completedCount = getCompletedCount(section);

        return (
          <button
            key={section}
            onClick={() => onSectionClick(section)}
            disabled={!isAccessible}
            className={`py-1 px-1.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-left ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg' 
                : isCompleted 
                  ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
                  : isAccessible 
                    ? 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/15' 
                    : 'bg-white/5 border border-white/10 text-white/50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1">
                {getSectionIcon(section)}
                <span className="font-semibold text-xs">{getSectionTitle(section)}</span>
              </div>
              {isCompleted && (
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-white/20' : 'bg-emerald-500'
                }`}>
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-70 font-medium">Step {section}</span>
              <span className="opacity-80">{completedCount}/{requiredCount}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SectionNavigation;
