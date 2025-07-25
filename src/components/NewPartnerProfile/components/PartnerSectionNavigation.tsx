import { User, Heart, Users } from "lucide-react";
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
    case 1: return <User className="w-4 h-4" />;
    case 2: return <Heart className="w-4 h-4" />;
    case 3: return <Users className="w-4 h-4" />;
    default: return null;
  }
};

const PartnerSectionNavigation = ({ 
  currentSection, 
  profileData, 
  onSectionClick 
}: PartnerSectionNavigationProps) => {
  
  const sections = [1, 2, 3];

  return (
    <div className="grid grid-cols-3 gap-1">
      {sections.map((section) => {
        const isActive = currentSection === section;
        const isCompleted = validatePartnerSection(section, profileData);
        const sectionTitle = getSectionTitle(section);
        const sectionIcon = getSectionIcon(section);

        return (
          <button
            key={section}
            onClick={() => onSectionClick(section)}
            className={`py-1.5 px-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-left ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg' 
                : isCompleted 
                  ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
                  : 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/15'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {sectionIcon}
                <span className="font-semibold text-xs">{sectionTitle}</span>
              </div>
              {isCompleted && (
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-white/20' : 'bg-emerald-500'
                }`}>
                  <span className="text-white text-xs">✓</span>
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