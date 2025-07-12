import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";

interface GenderSelectionCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
}

const GenderSelectionCard = ({ profileData, updateField }: GenderSelectionCardProps) => {
  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Prefer to self-describe'
  ];

  return (
    <QuestionCard questionId="question-gender">
      <Label className="text-sm font-semibold text-white mb-2 block">
        Gender identity? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <User className="w-3 h-3 text-purple-300" />
        <span>We get that gender is complex and personal</span>
      </div>
      <SingleSelect
        options={genderOptions}
        selectedValue={profileData.gender || ''}
        onSelect={(value) => updateField('gender', value)}
      />
    </QuestionCard>
  );
};

export default GenderSelectionCard;