
import { Label } from "@/components/ui/label";
import { TreeDeciduous } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";

const familyStructureOptions = [
  "Married parents with healthy, loving relationship",
  "Married parents who fought constantly but stayed together",
  "Married parents who were distant/cold but functional",
  "Divorced/separated parents - amicable split",
  "Divorced/separated parents - high conflict/messy",
  "Single parent household",
  "Blended family/stepparents",
  "Raised by grandparents/relatives",
  "High-conflict household with lots of drama and chaos",
  "These don't capture my experience"
];

interface FamilyStructureQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const FamilyStructureQuestion = ({ 
  profileData, 
  handleMultiSelect 
}: FamilyStructureQuestionProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const isComplete = profileData.familyStructure && profileData.familyStructure.length > 0;

  return (
    <QuestionCardSimple 
      questionId="question-family-structure" 
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        what was your family dynamic growing up? <span className="text-red-400">*</span>
        <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <TreeDeciduous className="w-3 h-3 text-green-300" />
        <span>this literally programmed your relationship blueprints</span>
      </div>

      <MultiSelect
        options={familyStructureOptions}
        selectedValues={profileData.familyStructure || []}
        onToggle={(value) => handleMultiSelect("familyStructure", value)}
      />
    </QuestionCardSimple>
  );
};

export default FamilyStructureQuestion;
