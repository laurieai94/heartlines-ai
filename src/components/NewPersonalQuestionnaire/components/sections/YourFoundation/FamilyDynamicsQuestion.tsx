
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { familyDynamicsOptions } from "./constants";

interface FamilyDynamicsQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const FamilyDynamicsQuestion = ({ 
  profileData, 
  handleMultiSelect 
}: FamilyDynamicsQuestionProps) => {
  return (
    <QuestionCard 
      questionId="question-family-dynamics"
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
  );
};

export default FamilyDynamicsQuestion;
