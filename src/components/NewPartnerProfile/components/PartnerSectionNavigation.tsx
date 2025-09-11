import { Check } from "lucide-react";
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

const PartnerSectionNavigation = ({ 
  currentSection, 
  profileData, 
  onSectionClick 
}: PartnerSectionNavigationProps) => {
  
  return (
    <div className="flex items-center justify-center gap-3">
      {[1, 2, 3].map((section) => {
        const isActive = section === currentSection;
        const isCompleted = validatePartnerSection(section, profileData);
        
        return (
          <button
            key={section}
            onClick={() => {
              onSectionClick(section);
            }}
            aria-label={getSectionTitle(section)}
            className={`rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
              isActive 
                ? 'w-4 h-4 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 shadow-lg shadow-rose-500/30' 
                : isCompleted 
                  ? 'w-3 h-3 bg-emerald-500 hover:bg-emerald-400' 
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/40 border border-white/20'
            }`}
          >
            {isCompleted && !isActive && (
              <Check className="w-2 h-2 text-white" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;