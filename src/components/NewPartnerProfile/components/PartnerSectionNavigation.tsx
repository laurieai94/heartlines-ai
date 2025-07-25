import { Check, User, Heart, TreeDeciduous } from "lucide-react";
import { getPartnerTotalCount } from "../utils/partnerValidation";
import { PartnerProfileData } from "../types";

interface PartnerSectionNavigationProps {
  currentSection: number;
  sectionReadiness: Record<number, boolean>;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  onSectionClick: (section: number) => void;
  profileData: PartnerProfileData;
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
      case 1: return "The Basics";
      case 2: return "How They Operate";
      case 3: return "Their Foundation";
      default: return "";
    }
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-4 h-4" />;
      case 2: return <Heart className="w-4 h-4" />;
      case 3: return <TreeDeciduous className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((section) => {
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
            className={`py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-left ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20' 
                : isCompleted 
                  ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
                  : isAccessible 
                    ? 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/15' 
                    : 'bg-white/5 border border-white/10 text-white/50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {getSectionIcon(section)}
                <span className="font-semibold text-sm">{getSectionTitle(section)}</span>
              </div>
              {isCompleted && (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-white/20' : 'bg-emerald-500'
                }`}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-xs opacity-70">
              {completedCount}/{totalCount} complete
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;