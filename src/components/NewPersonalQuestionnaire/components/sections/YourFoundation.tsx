
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { TreeDeciduous, Home, Link } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import MultiSelect from "../shared/MultiSelect";
import SingleSelect from "../shared/SingleSelect";
import SectionContinueButton from "../shared/SectionContinueButton";
import { validateSection } from "../../utils/validation";

interface YourFoundationProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onAutoScroll?: (questionId: string) => void;
  onSectionComplete?: () => void;
}

const YourFoundation = ({ profileData, updateField, handleMultiSelect, isActive, onAutoScroll, onSectionComplete }: YourFoundationProps) => {
  const familyDynamicsOptions = [
    "Open & healthy emotional expression",
    "Happy feelings okay, sad/angry ones shut down",
    "We weren't an emotions family",
    "Emotions were unpredictable/overwhelming",
    "I became the family therapist",
    "Big emotions were dramatic & scary",
    "Emotions were used to manipulate",
    "Everything looked fine but wasn't",
    "Love expressed but other feelings weren't"
  ];

  const attachmentStyleOptions = [
    'Secure (comfortable with intimacy & independence)',
    'Anxious (worry about relationship, need reassurance)',
    'Avoidant (value independence, uncomfortable with closeness)',
    'Fearful-avoidant (want closeness but afraid of hurt)',
    'Disorganized (mix of patterns)',
    'Depends on the relationship',
    'Not sure/still figuring it out'
  ];

  // Section completion check
  const isSectionComplete = validateSection(4, profileData);

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <TreeDeciduous className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Foundation</h3>
      </div>

      {/* Family Emotional Dynamics */}
      <QuestionCard 
        questionId="question-family-dynamics"
        showContinue={!!(profileData.familyDynamics?.length)}
        onContinue={() => {
          onAutoScroll?.('question-attachment-style');
        }}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          How did emotions work in your family? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Home className="w-3 h-3 text-blue-300" />
          <span>This programs how safe you feel being vulnerable</span>
        </div>
        <MultiSelect
          options={familyDynamicsOptions}
          selectedValues={profileData.familyDynamics || []}
          onToggle={(value) => handleMultiSelect('familyDynamics', value)}
        />
      </QuestionCard>

      {/* Attachment Style - Now Required */}
      <QuestionCard 
        questionId="question-attachment-style"
        showContinue={!!profileData.attachmentStyle}
        onContinue={() => {
          // This is the last question in the section, no auto-scroll needed
        }}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your attachment style? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select one</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Link className="w-3 h-3 text-purple-300" />
          <span>The psychological patterns that run your relationships</span>
        </div>
        <SingleSelect
          options={attachmentStyleOptions}
          selectedValue={profileData.attachmentStyle || ''}
          onSelect={(value) => updateField('attachmentStyle', value)}
        />
      </QuestionCard>

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
