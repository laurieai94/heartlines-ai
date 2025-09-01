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
    <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-x-visible">
      {[1, 2, 3].map((section) => {
        const isActive = section === currentSection;
        const isCompleted = validatePartnerSection(section, profileData);
        return (
          <button
            key={section}
            onClick={() => {
              onSectionClick(section);
            }}
            className={`group py-1.5 px-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 text-left relative overflow-hidden flex-shrink-0 min-w-[140px] sm:min-w-0 ${
              isActive 
                ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/25' 
                : isCompleted 
                  ? 'bg-white/12 backdrop-blur-md border border-white/20 text-white hover:bg-white/18 hover:shadow-md hover:shadow-white/10' 
                  : 'bg-white/8 backdrop-blur-md border border-white/12 text-white/85 hover:bg-white/14 hover:text-white hover:border-white/20'
            }`}
          >
            {/* Subtle shimmer effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full ${isActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'}`}></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {getSectionIcon(section)}
                </div>
                <span className="font-semibold text-xs tracking-wide leading-tight">{getSectionTitle(section)}</span>
              </div>
              {isCompleted && (
                <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-white/25 scale-110' : 'bg-emerald-500 group-hover:scale-110 shadow-md shadow-emerald-500/30'
                }`}>
                  <Check className="w-1.5 h-1.5 text-white" />
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