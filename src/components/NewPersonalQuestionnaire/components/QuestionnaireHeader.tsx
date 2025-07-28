
import { Button } from "@/components/ui/button";
import { X, User, Heart } from "lucide-react";
import { ProfileData } from "../types";

interface QuestionnaireHeaderProps {
  overallProgress: number;
  onClose: () => void;
  profileData: ProfileData;
}

const QuestionnaireHeader = ({ overallProgress, onClose, profileData }: QuestionnaireHeaderProps) => {
  const getInitial = () => {
    if (profileData.name && profileData.name.trim()) {
      return profileData.name.trim()[0].toUpperCase();
    }
    return null;
  };

  const hasName = profileData.name && profileData.name.trim();
  
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border-b border-white/[0.08] p-1.5 flex-shrink-0 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent"></div>
      
      <div className="flex items-center justify-between mb-1.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="group w-14 h-14 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all duration-300 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            {hasName ? (
              <span className="text-white font-bold text-xl relative z-10">{getInitial()}</span>
            ) : (
              <Heart className="w-7 h-7 text-white relative z-10" />
            )}
          </div>
          
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Your Profile</h2>
            <p className="text-sm text-white/75 font-medium">
              {overallProgress === 100 ? "Complete! Ready to start" : "Personalized for your messy reality"}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="text-white/70 hover:text-white hover:bg-white/12 p-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70 font-medium tracking-wide">Progress</span>
          <span className="text-white font-semibold bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
            {overallProgress}%
          </span>
        </div>
        <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-full"></div>
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 transition-all duration-700 rounded-full relative overflow-hidden shadow-md shadow-emerald-500/20"
            style={{ width: `${overallProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-gradient-shift rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
