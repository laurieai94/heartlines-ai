
import { TreeDeciduous } from "lucide-react";
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
      {/* Sticky Section Header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TreeDeciduous className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">Your Foundation</h3>
          </div>
          <p className="text-white/70">early scripts, family stuff & emotional wiring</p>
        </div>
      </div>

      {/* Required Field */}
      <AttachmentStyleQuestion
        profileData={profileData}
        updateField={updateField}
        onComplete={onSectionComplete}
      />

      {/* Optional Fields */}
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
  );
};

export default YourFoundation;
