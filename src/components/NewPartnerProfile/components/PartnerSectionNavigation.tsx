import { User, Heart, TreeDeciduous } from "lucide-react";
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
    case 2: return <Heart className="w-3.5 h-3.5" />;
    case 3: return <TreeDeciduous className="w-3.5 h-3.5" />;
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
            className={`group relative py-2 px-3 rounded-xl transition-all duration-200 border text-center ${
              isActive 
                ? 'bg-gradient-to-br from-primary/80 to-primary text-white border-primary/30 shadow-lg shadow-primary/20' 
                : isCompleted 
                  ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30' 
                  : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white/90 hover:border-white/25'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5 relative">
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                {sectionIcon}
              </div>
              <span className="font-semibold text-xs tracking-wide leading-tight">{sectionTitle}</span>
            </div>
            {isCompleted && (
              <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive ? 'bg-white/25' : 'bg-emerald-500/90'
              } absolute -top-1 -right-1`}>
                <span className="text-white text-[10px] leading-none">✓</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PartnerSectionNavigation;