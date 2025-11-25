import { Sparkles } from "lucide-react";
import { ProfileData } from "../types";
import { getCompletedRequiredFieldsCount, getTotalRequiredFieldsCount } from "../utils/requirements";

interface WelcomeBannerProps {
  profileData: ProfileData;
}

const WelcomeBanner = ({ profileData }: WelcomeBannerProps) => {
  // Check if all 5 required questions are answered
  const requiredCompleted = getCompletedRequiredFieldsCount(profileData);
  const requiredTotal = getTotalRequiredFieldsCount();
  
  // Only show banner when required fields are incomplete
  const shouldShow = requiredCompleted < requiredTotal;

  if (!shouldShow) return null;

  return (
    <div className="bg-rose-900/20 border-b border-white/10 px-4 py-3 animate-in fade-in duration-300 shadow-[0_0_25px_rgba(251,207,232,0.25)]">
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-pink-200 flex-shrink-0 animate-pulse" />
        <p className="text-base font-medium bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent">
          just 5 core qs to tune kai into you. the rest can come as you go 💫
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
