
import { Zap } from "lucide-react";
import { ProfileData } from "../../types";
import OptionalGroup from "../shared/OptionalGroup";
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
    <div className="space-y-3 transition-opacity duration-300 opacity-100">
      {/* Section Header */}
      <div className="py-2 bg-transparent">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">How You Operate</h3>
          </div>
          <p className="text-white/70">how you love, fight, and show up</p>
        </div>
      </div>

      {/* Required Field */}
      <LoveLanguageQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      {/* Optional Fields */}
      <OptionalGroup>
        <ConflictStyleQuestion
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
        />
      </OptionalGroup>
    </div>
  );
};

export default HowYouOperate;
