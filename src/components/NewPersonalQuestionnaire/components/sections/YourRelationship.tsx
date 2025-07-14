import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import SingleSelect from "../shared/SingleSelect";
import SectionContinueButton from "../shared/SectionContinueButton";
import SimpleContinueButton from "../shared/SimpleContinueButton";
import { validateSection } from "../../utils/validation";
import { relationshipStatusOptions } from "./YourRelationship/constants";

interface YourRelationshipProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const YourRelationship = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isActive, 
  onSectionComplete 
}: YourRelationshipProps) => {
  const isSectionComplete = validateSection(2, profileData);

  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-section="3"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onSectionComplete?.();
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`} data-section="2">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Situationship</h3>
      </div>

      <QuestionCard questionId="question-relationship-status">
        <Label className="text-sm font-semibold text-white mb-2 block">
          What is your current relationship status? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>From 'it's complicated' to married - we meet you where you are</span>
        </div>
        <SingleSelect
          options={relationshipStatusOptions}
          selectedValue={profileData.relationshipStatus || ''}
          onSelect={(value) => updateField('relationshipStatus', value)}
          columns={3}
        />
      </QuestionCard>

      {isSectionComplete && (
        <SectionContinueButton 
          onClick={scrollToNextSection}
          text="Continue to How You Operate" 
        />
      )}
    </div>
  );
};

export default YourRelationship;