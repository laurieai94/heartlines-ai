
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
    <>
      {/* Mobile: Horizontal scrollable chips */}
      <div className="sm:hidden overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="flex gap-2 px-1 pb-1 min-w-max">
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
                className={`py-2 px-3 rounded-full transition-all duration-300 active:scale-95 touch-manipulation flex-shrink-0 ${
                  isActive 
                    ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg' 
                    : isCompleted 
                      ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {getSectionIcon(section)}
                  <span className="font-semibold text-xs whitespace-nowrap">{getSectionTitle(section)}</span>
                  {isCompleted && (
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ml-1 ${
                      isActive ? 'bg-white/20' : 'bg-emerald-500'
                    }`}>
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop/Tablet: Original grid layout */}
      <div className="hidden sm:grid grid-cols-4 gap-2">
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
                  {getSectionIcon(section)}
                  <span className="font-semibold text-xs">{getSectionTitle(section)}</span>
                </div>
                {isCompleted && (
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-emerald-500'
                  }`}>
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SectionNavigation;
