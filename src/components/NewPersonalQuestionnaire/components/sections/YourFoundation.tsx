import { TreeDeciduous } from "lucide-react";
import { ProfileData } from "../../types";
import SectionContinueButton from "../shared/SectionContinueButton";
import SimpleContinueButton from "../shared/SimpleContinueButton";
import { validateSection } from "../../utils/validation";
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
  const isSectionComplete = validateSection(4, profileData);

  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`} data-section="4">
      <div className="flex items-center gap-2 mb-4">
        <TreeDeciduous className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Foundation</h3>
      </div>

      <FamilyDynamicsQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />
      {profileData.familyDynamics?.length > 0 && (
        <SimpleContinueButton onClick={() => scrollToQuestion('question-attachment-style')} />
      )}

      <AttachmentStyleQuestion
        profileData={profileData}
        updateField={updateField}
      />

      {isSectionComplete && (
        <SectionContinueButton 
          onClick={() => onSectionComplete?.()}
          text="Complete Your Profile" 
        />
      )}
    </div>
  );
};

export default YourFoundation;