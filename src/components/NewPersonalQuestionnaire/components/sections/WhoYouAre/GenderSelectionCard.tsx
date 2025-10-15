import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
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
  const { scrollToNextQuestion } = useAutoScroll();
  
  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 'Genderfluid', 'Genderqueer', 'Questioning', 'Prefer to self-describe'];
  
  // Helper function to safely get gender value - handle both string and array formats
  const getGenderValue = () => {
    if (!profileData.gender) return '';
    // If it's an array, take the first value or empty string
    if (Array.isArray(profileData.gender)) {
      return profileData.gender.length > 0 ? profileData.gender[0] : '';
    }
    // If it's a string, return as is
    return profileData.gender;
  };

  return (
    <QuestionCardSimple 
      questionId="question-gender" 
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        what's your gender identity? <span className="text-red-400">*</span>
        <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <User className="w-3 h-3 text-purple-300" />
        <span>we're way past thinking it's just two options</span>
      </div>
      <SingleSelect 
        options={genderOptions} 
        selectedValue={getGenderValue()} 
        onSelect={value => updateField('gender', value)} 
      />
    </QuestionCardSimple>
  );
};
export default GenderSelectionCard;