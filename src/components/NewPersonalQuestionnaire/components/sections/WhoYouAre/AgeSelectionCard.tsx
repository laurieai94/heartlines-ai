import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";

interface AgeSelectionCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onContinue: () => void;
}

const AgeSelectionCard = ({ profileData, updateField, isComplete, onContinue }: AgeSelectionCardProps) => {
  const ageOptions = [
    'Under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50-60', '65+'
  ];

  return (
    <QuestionCard questionId="question-age">
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's your age? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Calendar className="w-3 h-3 text-orange-300" />
        <span>Different life stages = different relationship challenges</span>
      </div>
      <SingleSelect
        options={ageOptions}
        selectedValue={profileData.age || ''}
        onSelect={(value) => updateField('age', value)}
        columns={4}
      />
    </QuestionCard>
  );
};

export default AgeSelectionCard;