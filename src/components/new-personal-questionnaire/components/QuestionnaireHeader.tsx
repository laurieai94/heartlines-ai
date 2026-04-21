
import { Button } from "@/components/ui/button";
import { X, User, Heart, Lock, RotateCcw } from "lucide-react";
import { ProfileData } from "../types";
import { refreshPersonalProfile } from "@/utils/globalRefresh";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";

interface QuestionnaireHeaderProps {
  overallProgress: number;
  onClose: () => void;
  profileData: ProfileData;
}

const QuestionnaireHeader = ({ overallProgress, onClose, profileData: _propData }: QuestionnaireHeaderProps) => {
  // Get live data directly from the hook for instant updates
  const { profileData } = usePersonalProfileData();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPersonalProfile();
      toast({
        title: "Profile refreshed",
        description: "Your profile data has been updated."
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh profile data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const getProfileTitle = () => {
    const hasName = profileData.name && profileData.name.trim();
    if (hasName) {
      return `${profileData.name.trim()}'s profile`;
    }
    return "your profile";
  };
  
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border-b border-white/[0.06] px-3 py-0.5 sm:px-4 sm:py-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-0.5 sm:mb-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white truncate">{getProfileTitle()}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-2 flex-shrink-0">
          <span className="text-sm sm:text-sm text-white/60 font-medium">{overallProgress}%</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white/60 hover:text-white w-6 h-6 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation disabled:opacity-50"
            aria-label="Refresh profile"
          >
            <RotateCcw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 transition-all duration-200 hover:scale-105 touch-manipulation"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar - larger on desktop/tablet */}
      <div className="w-full h-1 sm:h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
