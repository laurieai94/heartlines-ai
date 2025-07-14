import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";

interface OrientationSelectionCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onContinue: () => void;
}

const OrientationSelectionCard = ({ profileData, updateField, isComplete, onContinue }: OrientationSelectionCardProps) => {
  const orientationOptions = [
    'Straight/Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Queer', 'Asexual', 'Questioning', 'Prefer to self-describe'
  ];

  return (
    <QuestionCard 
      questionId="question-orientation"
      showContinue={isComplete}
      onContinue={onContinue}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's your sexual orientation? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Compass className="w-3 h-3 text-pink-300" />
        <span>Because straight dating advice doesn't work for everyone</span>
      </div>
      <SingleSelect
        options={orientationOptions}
        selectedValue={profileData.orientation || ''}
        onSelect={(value) => updateField('orientation', value)}
      />
    </QuestionCard>
  );
};

export default OrientationSelectionCard;