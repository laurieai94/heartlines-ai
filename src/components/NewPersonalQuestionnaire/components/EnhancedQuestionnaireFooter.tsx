
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, Circle, ArrowRight, Sparkles } from "lucide-react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";

interface EnhancedQuestionnaireFooterProps {
  currentSection: number;
  profileData: ProfileData;
  overallProgress: number;
  onComplete: () => void;
}

const EnhancedQuestionnaireFooter = ({
  currentSection,
  profileData,
  overallProgress,
  onComplete
}: EnhancedQuestionnaireFooterProps) => {
  
  // Calculate section-specific progress
  const getSectionProgress = (section: number) => {
    let completed = 0;
    let total = 0;
    
    switch (section) {
      case 1: {
        const fields = ['name', 'age', 'orientation', 'pronouns', 'gender'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof ProfileData];
          if (typeof value === 'string') return value && value.trim() !== '';
          if (Array.isArray(value)) return value && value.length > 0;
          return false;
        }).length;
        break;
      }
      case 2: {
        total = 1; // relationshipStatus is always required
        completed = profileData.relationshipStatus ? 1 : 0;
        
        // Add conditional fields based on relationship status
        if (profileData.relationshipStatus) {
          const isSingle = ['On the apps', 'Single & actively dating', 'Single & taking a break', 'Single & taking a break from dating', 'Casually seeing people'].includes(profileData.relationshipStatus);
          const isTalking = profileData.relationshipStatus === 'Talking stage' || profileData.relationshipStatus === 'Talking to someone';
          const hasRelationship = ['In a relationship', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(profileData.relationshipStatus);
          const isSeparatedDivorced = profileData.relationshipStatus === 'Separated/Divorced';
          const isWidowed = profileData.relationshipStatus === 'Widowed';
          
          if (isSingle) {
            total += 1;
            if ((profileData.datingChallenges || []).length > 0) completed += 1;
          } else if (isTalking) {
            total += 2;
            if ((profileData.talkingDescription || []).length > 0) completed += 1;
            if ((profileData.talkingChallenges || []).length > 0) completed += 1;
          } else if (hasRelationship) {
            total += 3;
            if (profileData.relationshipLength) completed += 1;
            if ((profileData.relationshipChallenges || []).length > 0) completed += 1;
            if ((profileData.relationshipWorking || []).length > 0) completed += 1;
          } else if (isSeparatedDivorced) {
            total += 2;
            if ((profileData.separationSituation || []).length > 0) completed += 1;
            if ((profileData.datingReadiness || []).length > 0) completed += 1;
          } else if (isWidowed) {
            total += 2;
            if (profileData.timeSinceLoss) completed += 1;
            if ((profileData.grievingProcess || []).length > 0) completed += 1;
          }
        }
        break;
      }
      case 3: {
        const fields = ['loveLanguage', 'conflictStyle'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof ProfileData];
          return Array.isArray(value) && value.length > 0;
        }).length;
        break;
      }
      case 4: {
        total = 2;
        if ((profileData.familyStructure || []).length > 0) completed += 1;
        if (profileData.attachmentStyle) completed += 1;
        break;
      }
    }
    
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const currentSectionProgress = getSectionProgress(currentSection);
  const isCurrentSectionComplete = validateSection(currentSection, profileData);
  const canComplete = overallProgress === 100;

  const getMotivationalMessage = () => {
    if (canComplete) {
      return "🎉 Amazing! You're ready to unlock your personalized insights!";
    }
    
    if (overallProgress >= 75) {
      return "🔥 You're so close! Just a few more questions to unlock kai ai coach!";
    }
    
    if (overallProgress >= 50) {
      return "💪 Great progress! You're halfway to unlocking personalized coaching!";
    }
    
    if (overallProgress >= 25) {
      return "✨ Nice work! Keep going to discover your relationship insights!";
    }
    
    return "🚀 Let's build your profile to unlock personalized relationship coaching!";
  };

  const getSectionName = (section: number) => {
    const names = {
      1: "Who You Are",
      2: "Your Situation", 
      3: "How You Operate",
      4: "Your Foundation"
    };
    return names[section as keyof typeof names] || "";
  };

  const getUnlockPreview = () => {
    if (overallProgress >= 75) {
      return "Unlock: Personalized coaching strategies & relationship insights";
    }
    if (overallProgress >= 50) {
      return "Coming up: Attachment style analysis & conflict resolution tips";
    }
    if (overallProgress >= 25) {
      return "Next: Communication style insights & love language guidance";
    }
    return "Build your profile to unlock AI-powered relationship coaching";
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
          Section {currentSection} of 4
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
        <div className="flex justify-center pt-2 pb-4">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-3 px-8 py-3 text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            unlock kai ai coach
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedQuestionnaireFooter;
