
import { Zap } from "lucide-react";
import { ProfileData } from "../../types";
import LoveLanguageQuestion from "./HowYouOperate/LoveLanguageQuestion";
import ConflictStyleQuestion from "./HowYouOperate/ConflictStyleQuestion";

interface HowYouOperateProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  
  onSectionComplete?: () => void;
}

const HowYouOperate = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  
  onSectionComplete
}: HowYouOperateProps) => {

  return (
    <div className="space-y-4 transition-opacity duration-300 opacity-100">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">How You Operate</h3>
      </div>

      <LoveLanguageQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      <ConflictStyleQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />
    </div>
  );
};

export default HowYouOperate;
