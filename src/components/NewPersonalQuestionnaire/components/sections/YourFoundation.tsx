

import { ProfileData } from "../../types";
import OptionalGroup from "../shared/OptionalGroup";
import AttachmentStyleQuestion from "./YourFoundation/AttachmentStyleQuestion";
import FamilyStructureQuestion from "./YourFoundation/FamilyStructureQuestion";
import HeartbreakBetrayalQuestion from "./YourFoundation/HeartbreakBetrayalQuestion";

interface YourFoundationProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  
  onSectionComplete?: () => void;
}

const YourFoundation = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isActive, 
   
  onSectionComplete 
}: YourFoundationProps) => {

  return (
    <div className="space-y-4 transition-opacity duration-300 opacity-100">
      {/* Required Field */}
      <AttachmentStyleQuestion
        profileData={profileData}
        updateField={updateField}
        onComplete={onSectionComplete}
        onSectionComplete={onSectionComplete}
      />

      {/* Optional Fields */}
      <div id="foundation-optional-group">
        <OptionalGroup>
          <HeartbreakBetrayalQuestion
            profileData={profileData}
            handleMultiSelect={handleMultiSelect}
          />

          <FamilyStructureQuestion
            profileData={profileData}
            handleMultiSelect={handleMultiSelect}
          />
        </OptionalGroup>
      </div>
    </div>
  );
};

export default YourFoundation;
