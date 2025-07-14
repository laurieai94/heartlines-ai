
import { TreeDeciduous } from "lucide-react";
import { ProfileData } from "../../types";

import { validateSection } from "../../utils/validation";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import SectionContinueButton from "../shared/SectionContinueButton";
import FamilyDynamicsQuestion from "./YourFoundation/FamilyDynamicsQuestion";
import AttachmentStyleQuestion from "./YourFoundation/AttachmentStyleQuestion";

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
  const { scrollToNextSection } = useAutoScroll();
  // Section completion check
  const isSectionComplete = validateSection(2, profileData);

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <TreeDeciduous className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Foundation</h3>
      </div>

      <FamilyDynamicsQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      <AttachmentStyleQuestion
        profileData={profileData}
        updateField={updateField}
      />

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={2}
        onClick={() => scrollToNextSection(2)}
      />
    </div>
  );
};

export default YourFoundation;
