import { User, Zap, TreeDeciduous, Check } from "lucide-react";
import { PartnerProfileData } from "../types";
import { validatePartnerSection } from "../utils/partnerValidation";

interface PartnerSectionNavigationProps {
  currentSection: number;
  profileData: PartnerProfileData;
  onSectionClick: (section: number) => void;
}

const getSectionTitle = (section: number): string => {
  switch (section) {
    case 1: return "The Basics";
    case 2: return "How They Operate";
    case 3: return "Their Foundation";
    default: return "";
  }
};

const getSectionIcon = (section: number): JSX.Element | null => {
  switch (section) {
    case 1: return <User className="w-3.5 h-3.5" />;
    case 2: return <Zap className="w-3.5 h-3.5" />;
    case 3: return <TreeDeciduous className="w-3.5 h-3.5" />;
    default: return null;
  }
};

const PartnerSectionNavigation = ({ 
  currentSection, 
  profileData, 
  onSectionClick 
}: PartnerSectionNavigationProps) => {
  
  return (
    <div className="flex gap-0.5 overflow-x-auto scrollbar-hide px-0.5">
      {[1, 2, 3].map((section) => {
        const isActive = section === currentSection;
        const isCompleted = validatePartnerSection(section, profileData);
        return (
          <button
            key={section}
            onClick={() => {
              onSectionClick(section);
            }}
            className={`group py-1 px-1.5 rounded-md transition-all duration-200 flex-shrink-0 min-w-[80px] ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-sm' 
                : isCompleted 
                  ? 'bg-white/8 border border-white/10 text-white hover:bg-white/12' 
                  : 'bg-white/4 border border-white/6 text-white/75 hover:bg-white/8'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 min-w-0">
                <div className="flex-shrink-0">
                  {getSectionIcon(section)}
                </div>
                <span className="font-medium text-xs leading-tight truncate">{getSectionTitle(section)}</span>
              </div>
              {isCompleted && (
                <div className={`w-2 h-2 rounded-full flex items-center justify-center flex-shrink-0 ml-1 ${
                  isActive ? 'bg-white/25' : 'bg-emerald-500'
                }`}>
                  <Check className="w-1 h-1 text-white" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;