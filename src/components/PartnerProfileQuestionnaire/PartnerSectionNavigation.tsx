
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
            className={`py-2.5 px-3 rounded-xl transition-all duration-300 transform hover:scale-[1.03] text-left relative overflow-hidden group ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/25 ring-2 ring-white/20' 
                : isCompleted 
                  ? 'bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 hover:shadow-md hover:shadow-white/10' 
                  : isAccessible 
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white hover:border-white/30' 
                    : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed opacity-50'
            }`}
          >
            {/* Animated background for active state */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-500/20 to-rose-600/20 animate-pulse rounded-xl" />
            )}
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {getSectionIcon(section)}
                </div>
                <span className="font-semibold text-sm tracking-wide">{getSectionTitle(section)}</span>
              </div>
              {isCompleted && (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-white/25 shadow-sm' : 'bg-emerald-500 shadow-emerald-500/30'
                }`}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-xs opacity-80 mt-1 font-medium relative z-10">
              {completedCount}/{totalCount} completed
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;
