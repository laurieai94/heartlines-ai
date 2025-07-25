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
    <div className="grid grid-cols-3 gap-2">
      {sections.map((section) => {
        const isActive = currentSection === section;
        const isCompleted = validatePartnerSection(section, profileData);
        const sectionTitle = getSectionTitle(section);
        const sectionIcon = getSectionIcon(section);

        return (
          <button
            key={section}
            onClick={() => onSectionClick(section)}
            className={`p-3 rounded-lg text-center transition-all duration-200 hover:scale-[1.02] border ${
              isActive
                ? 'bg-gradient-to-r from-rose-500/20 to-pink-600/20 border-rose-400/40 text-white shadow-lg'
                : isCompleted
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border-emerald-400/40 text-emerald-100 hover:from-emerald-500/30 hover:to-teal-600/30'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              {isCompleted && !isActive && (
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {sectionIcon}
            </div>
            <div className="text-xs font-medium">{sectionTitle}</div>
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;