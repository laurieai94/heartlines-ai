

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
      {/* Required Field */}
      <LoveLanguageQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        onSectionComplete={onSectionComplete}
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
