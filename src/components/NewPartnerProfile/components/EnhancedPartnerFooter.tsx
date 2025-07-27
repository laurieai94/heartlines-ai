import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, Circle, ArrowRight, Sparkles, User, Zap, TreeDeciduous } from "lucide-react";
import { PartnerProfileData } from "../types";

interface EnhancedPartnerFooterProps {
  profileData: PartnerProfileData;
  onComplete: () => void;
  autoCompleteEnabled?: boolean;
}

const EnhancedPartnerFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false
}: EnhancedPartnerFooterProps) => {
  
  // Calculate section-specific progress
  const getSectionProgress = (section: number) => {
    let completed = 0;
    let total = 0;
    
    switch (section) {
      case 1: { // The Basics
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
      case 2: { // How They Operate
        const fields = ['partnerLoveLanguage', 'partnerConflictStyle', 'partnerSelfAwareness'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof PartnerProfileData];
          if (Array.isArray(value)) return value && value.length > 0;
          if (typeof value === 'string') return value && value.trim() !== '';
          return false;
        }).length;
        break;
      }
      case 3: { // Their Foundation
        const fields = ['partnerFamilyStructure', 'partnerAttachmentStyle'];
        total = fields.length;
        completed = fields.filter(field => {
          const value = profileData[field as keyof PartnerProfileData];
          if (Array.isArray(value)) return value && value.length > 0;
          if (typeof value === 'string') return value && value.trim() !== '';
          return false;
        }).length;
        break;
      }
    }
    
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const allSections = [1, 2, 3];
    let totalFields = 0;
    let completedFields = 0;
    
    allSections.forEach(section => {
      const sectionProgress = getSectionProgress(section);
      totalFields += sectionProgress.total;
      completedFields += sectionProgress.completed;
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();
  const canComplete = overallProgress > 0; // Any progress allows completion

  const getSectionName = (section: number) => {
    const names = {
      1: "The Basics",
      2: "How They Operate", 
      3: "Their Foundation"
    };
    return names[section as keyof typeof names] || "";
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-4 h-4" />;
      case 2: return <Zap className="w-4 h-4" />;
      case 3: return <TreeDeciduous className="w-4 h-4" />;
      default: return null;
    }
  };

  const getMotivationalMessage = () => {
    if (overallProgress >= 75) {
      return "🎉 Amazing partner profile! Kai is ready to provide relationship insights!";
    }
    
    if (overallProgress >= 50) {
      return "🔥 Great progress! More details will enhance your coaching experience!";
    }
    
    if (overallProgress >= 25) {
      return "✨ Nice start! AI coach Kai is learning about your partner!";
    }
    
    return "🚀 Tell Kai about your partner to unlock personalized relationship coaching!";
  };

  const getUnlockPreview = () => {
    if (overallProgress >= 50) {
      return "Unlock: Partner-specific communication strategies & conflict resolution";
    }
    if (overallProgress >= 25) {
      return "Available: Basic partner insights & relationship coaching";
    }
    return "Build your partner's profile for personalized relationship guidance";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-4 flex-shrink-0">
      {/* Section Dots Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((section) => {
            const sectionProgress = getSectionProgress(section);
            const isComplete = sectionProgress.percentage === 100;
            
            return (
              <div key={section} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isComplete 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg' 
                    : sectionProgress.percentage > 0
                      ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md'
                      : 'bg-white/20 text-white/60'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    getSectionIcon(section)
                  )}
                </div>
                
                <div className="text-xs">
                  <div className={`font-medium ${isComplete ? 'text-emerald-400' : sectionProgress.percentage > 0 ? 'text-white' : 'text-white/60'}`}>
                    {getSectionName(section)}
                  </div>
                  <div className="text-white/50">
                    {sectionProgress.completed}/{sectionProgress.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-white/70">
          {overallProgress}% complete
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Bottom Section with Message and Button */}
      <div className="flex items-center justify-between">
        {/* Left side - Status message */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">
                {overallProgress > 0 ? "AI coach Kai is ready" : "AI coach Kai is waiting"}
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-white/70">
              {getUnlockPreview()}
            </p>
          </div>
        </div>

        {/* Right side - Unlock button */}
        <div className="flex items-center gap-3 ml-6">
          {!autoCompleteEnabled ? (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              Unlock Coaching
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-400 text-sm font-medium animate-pulse">
              <Heart className="w-4 h-4" />
              <span>Unlocking coaching...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPartnerFooter;