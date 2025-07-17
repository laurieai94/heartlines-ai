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
  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 'Genderfluid', 'Questioning', 'Prefer to self-describe'];
  return <QuestionCard questionId="question-gender" showContinue={isComplete} onContinue={() => scrollToNextQuestion('question-gender')}>
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's your gender identity? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <User className="w-3 h-3 text-purple-300" />
        <span>Because we're way past thinking it's just two options</span>
      </div>
      <SingleSelect options={genderOptions} selectedValue={profileData.gender || ''} onSelect={value => updateField('gender', value)} />
    </QuestionCard>;
};
export default GenderSelectionCard;