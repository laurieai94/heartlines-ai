import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
interface GenderSelectionCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
}
const GenderSelectionCard = ({
  profileData,
  updateField,
  isComplete
}: GenderSelectionCardProps) => {
  const {
    scrollToNextQuestion
  } = useAutoScroll();
  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 'Genderfluid', 'Genderqueer', 'Questioning', 'Prefer to self-describe'];
  return <QuestionCard questionId="question-gender" showContinue={isComplete} onContinue={() => scrollToNextQuestion('question-gender')}>
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's your gender identity? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <User className="w-3 h-3 text-purple-300" />
        <span>We're way past thinking it's just two options</span>
      </div>
      <SingleSelect options={genderOptions} selectedValue={profileData.gender || ''} onSelect={value => updateField('gender', value)} />
    </QuestionCard>;
};
export default GenderSelectionCard;