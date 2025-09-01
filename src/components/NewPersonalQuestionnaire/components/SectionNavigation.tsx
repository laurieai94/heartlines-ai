
import { Check, User, Heart, Zap, TreeDeciduous } from "lucide-react";
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

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-3.5 h-3.5" />;
      case 2: return <Heart className="w-3.5 h-3.5" />;
      case 3: return <Zap className="w-3.5 h-3.5" />;
      case 4: return <TreeDeciduous className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="flex gap-0.5 overflow-x-auto scrollbar-hide px-0.5">
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

export default SectionNavigation;
