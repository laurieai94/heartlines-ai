
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
    <div className="flex gap-1 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:gap-1.5">
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
            className={`group py-1 px-2 rounded-md transition-all duration-200 text-left relative overflow-hidden flex-shrink-0 min-w-[100px] sm:min-w-0 ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-md shadow-rose-500/20' 
                : isCompleted 
                  ? 'bg-white/8 backdrop-blur-md border border-white/15 text-white hover:bg-white/12' 
                  : 'bg-white/5 backdrop-blur-md border border-white/8 text-white/75 hover:bg-white/8 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <div className={`transition-all duration-200 ${isActive ? 'scale-105' : ''}`}>
                  {getSectionIcon(section)}
                </div>
                <span className="font-medium text-xs leading-tight">{getSectionTitle(section)}</span>
              </div>
              {isCompleted && (
                <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'bg-white/20' : 'bg-emerald-500'
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
