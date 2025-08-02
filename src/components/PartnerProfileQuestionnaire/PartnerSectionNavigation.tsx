
import { Check, User, Heart, Zap, TreeDeciduous } from "lucide-react";
import { getPartnerTotalCount } from "./PartnerValidationLogic";

interface PartnerSectionNavigationProps {
  currentSection: number;
  sectionReadiness: Record<number, boolean>;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  onSectionClick: (section: number) => void;
  profileData: any;
}

const PartnerSectionNavigation = ({ 
  currentSection, 
  sectionReadiness, 
  validateSection, 
  getRequiredCount, 
  getCompletedCount, 
  onSectionClick
}: PartnerSectionNavigationProps) => {
  const getSectionTitle = (section: number) => {
    switch (section) {
      case 1: return "Basics";
      case 2: return "Situation";
      case 3: return "Style";
      case 4: return "Background";
      default: return "";
    }
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-3 h-3" />;
      case 2: return <Heart className="w-3 h-3" />;
      case 3: return <Zap className="w-3 h-3" />;
      case 4: return <TreeDeciduous className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {[1, 2, 3, 4].map((section) => {
        const isActive = section === currentSection;
        const isCompleted = section < currentSection || validateSection(section);
        const isAccessible = sectionReadiness[section] || isCompleted;
        const completedCount = getCompletedCount(section);
        const totalCount = getPartnerTotalCount(section);

        return (
          <button
            key={section}
            onClick={() => onSectionClick(section)}
            disabled={!isAccessible}
            className={`py-1.5 px-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-left ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg' 
                : isCompleted 
                  ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
                  : isAccessible 
                    ? 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/15' 
                    : 'bg-white/5 border border-white/10 text-white/50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
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
            
            <div className="text-xs opacity-70 mt-0.5">
              {completedCount}/{totalCount}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;
