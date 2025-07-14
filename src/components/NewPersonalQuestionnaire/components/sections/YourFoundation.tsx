
import { TreeDeciduous } from "lucide-react";
import { ProfileData } from "../../types";
import SectionContinueButton from "../shared/SectionContinueButton";
import { validateSection } from "../../utils/validation";
import FamilyDynamicsQuestion from "./YourFoundation/FamilyDynamicsQuestion";
import AttachmentStyleQuestion from "./YourFoundation/AttachmentStyleQuestion";

interface YourFoundationProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onAutoScroll?: (questionId: string) => void;
  onSectionComplete?: () => void;
}

const YourFoundation = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isActive, 
  onAutoScroll, 
  onSectionComplete 
}: YourFoundationProps) => {
  // Section completion check
  const isSectionComplete = validateSection(4, profileData);

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <TreeDeciduous className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Foundation</h3>
      </div>

      <FamilyDynamicsQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        onContinue={() => {
          onAutoScroll?.('question-attachment-style');
        }}
      />

      <AttachmentStyleQuestion
        profileData={profileData}
        updateField={updateField}
        onContinue={() => {
          // This is the last question in the section, trigger section completion
          if (isSectionComplete) {
            onSectionComplete?.();
          }
        }}
      />

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={4}
        onClick={() => {
          // Complete the questionnaire (no next section)
          onSectionComplete?.();
        }}
      />
    </div>
  );
};

export default YourFoundation;
