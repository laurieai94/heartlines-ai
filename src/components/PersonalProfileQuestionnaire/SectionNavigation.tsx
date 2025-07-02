
import { Check, User, Heart, Zap, Award } from "lucide-react";

interface SectionNavigationProps {
  currentSection: number;
  sectionReadiness: Record<number, boolean>;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  onSectionClick: (section: number) => void;
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
      case 1: return <User className="w-4 h-4" />;
      case 2: return <Heart className="w-4 h-4" />;
      case 3: return <Zap className="w-4 h-4" />;
      case 4: return <Award className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-white font-semibold text-base mb-1">Complete These 4 Steps</h3>
        <p className="text-white/70 text-xs">Each step helps RealTalk understand you better</p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
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
              className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-left relative ${
                isActive 
                  ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg ring-2 ring-white/30' 
                  : isCompleted 
                    ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
                    : isAccessible 
                      ? 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/15' 
                      : 'bg-white/5 border border-white/10 text-white/50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-white/20' : isCompleted ? 'bg-emerald-500' : 'bg-white/10'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3 text-white" /> : section}
                  </div>
                  {getSectionIcon(section)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm">{getSectionTitle(section)}</div>
                <div className="text-xs opacity-80">
                  Step {section}: {completedCount}/{requiredCount} complete
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SectionNavigation;
