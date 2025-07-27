import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, Circle, ArrowRight, Sparkles } from "lucide-react";
import { PartnerProfileData } from "../types";
import { validatePartnerSection, calculatePartnerProgress } from "../utils/partnerValidation";

interface EnhancedPartnerFooterProps {
  currentSection: number;
  profileData: PartnerProfileData;
  overallProgress: number;
  onComplete: () => void;
}

const EnhancedPartnerFooter = ({
  currentSection,
  profileData,
  overallProgress,
  onComplete
}: EnhancedPartnerFooterProps) => {
  
  // Calculate section-specific progress
  const getSectionProgress = (section: number) => {
    let completed = 0;
    let total = 0;
    
    switch (section) {
      case 1: {
        const fields = ['partnerName', 'partnerPronouns', 'partnerAge', 'partnerOrientation', 'partnerGender'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof PartnerProfileData];
          if (typeof value === 'string') return value && value.trim() !== '';
          if (Array.isArray(value)) return value && value.length > 0;
          return false;
        }).length;
        break;
      }
      case 2: {
        const fields = ['partnerLoveLanguage', 'partnerConflictStyle', 'partnerCommunicationResponse', 'partnerSelfAwareness'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof PartnerProfileData];
          if (typeof value === 'string') return value && value.trim() !== '';
          if (Array.isArray(value)) return value && value.length > 0;
          return false;
        }).length;
        break;
      }
      case 3: {
        const fields = ['partnerHeartbreakBetrayal', 'partnerFamilyStructure', 'partnerAttachmentStyle'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof PartnerProfileData];
          if (typeof value === 'string') return value && value.trim() !== '';
          if (Array.isArray(value)) return value && value.length > 0;
          return false;
        }).length;
        break;
      }
    }
    
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const currentSectionProgress = getSectionProgress(currentSection);
  const isCurrentSectionComplete = validatePartnerSection(currentSection, profileData);
  const canComplete = overallProgress === 100;

  const getMotivationalMessage = () => {
    if (canComplete) {
      return "🎉 Amazing! Partner profile complete - ready to unlock personalized insights!";
    }
    
    if (overallProgress >= 75) {
      return "🔥 You're so close! Just a few more details about your partner!";
    }
    
    if (overallProgress >= 50) {
      return "💪 Great progress! Halfway to understanding your partner better!";
    }
    
    if (overallProgress >= 25) {
      return "✨ Nice work! Keep going to build their complete profile!";
    }
    
    return "🚀 Let's build your partner's profile for better relationship insights!";
  };

  const getSectionName = (section: number) => {
    const names = {
      1: "Who They Are",
      2: "How They Operate", 
      3: "Their Foundation"
    };
    return names[section as keyof typeof names] || "";
  };

  const getUnlockPreview = () => {
    if (overallProgress >= 75) {
      return "Unlock: Personalized couple dynamics & communication strategies";
    }
    if (overallProgress >= 50) {
      return "Coming up: Relationship compatibility insights & conflict resolution";
    }
    if (overallProgress >= 25) {
      return "Next: Partner communication style & love language matching";
    }
    return "Build their profile to unlock AI-powered relationship coaching";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-4 flex-shrink-0 space-y-4">
      {/* Section Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isCurrentSectionComplete ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5 text-white/40" />
            )}
            <span className="text-sm font-medium text-white">
              {getSectionName(currentSection)}
            </span>
          </div>
          
          <div className="text-xs text-white/70">
            {currentSectionProgress.completed} of {currentSectionProgress.total} complete
          </div>
        </div>

        <div className="text-xs text-white/70">
          Section {currentSection} of 3
        </div>
      </div>

      {/* Section Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-500 rounded-full"
            style={{ width: `${currentSectionProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80">Overall Progress</span>
          <span className="text-white font-semibold">{overallProgress}%</span>
        </div>
        
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-white">
          {getMotivationalMessage()}
        </p>
        
        <p className="text-xs text-white/70">
          {getUnlockPreview()}
        </p>
      </div>

      {/* Action Button */}
      {canComplete && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-3 px-8 py-3 text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            Unlock Kai AI Coach
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedPartnerFooter;