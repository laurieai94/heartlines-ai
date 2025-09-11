
import { Check } from "lucide-react";
import { ProfileData } from "../types";
import { validateSection } from "../utils/validation";

interface SectionNavigationProps {
  currentSection: number;
  profileData: ProfileData;
  onSectionClick: (section: number) => void;
}

const SectionNavigation = ({ currentSection, profileData, onSectionClick }: SectionNavigationProps) => {
  const getSectionTitle = (section: number) => {
    switch (section) {
      case 1: return "The Basics";
      case 2: return "Your Situationship";
      case 3: return "How You Operate";
      case 4: return "Your Foundation";
      default: return "";
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {[1, 2, 3, 4].map((section) => {
        const isActive = section === currentSection;
        const isCompleted = validateSection(section, profileData);
        
        return (
          <button
            key={section}
            onClick={() => {
              console.log('🔵 SectionNavigation: Section button clicked:', section);
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

export default SectionNavigation;
