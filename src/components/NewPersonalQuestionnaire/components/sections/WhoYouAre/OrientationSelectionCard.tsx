
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import SingleSelect from "../../shared/SingleSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";

interface OrientationSelectionCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
}

const OrientationSelectionCard = ({
  profileData,
  updateField,
  isComplete
}: OrientationSelectionCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  
  const orientationOptions = [
    'Straight/Heterosexual', 
    'Gay', 
    'Lesbian', 
    'Bisexual', 
    'Pansexual', 
    'Queer', 
    'Asexual', 
    'Questioning', 
    'Prefer to self-describe'
  ];

  // Helper function to safely get orientation value - handle both string and array formats
  const getOrientationValue = () => {
    if (!profileData.orientation) return '';
    // If it's an array (from legacy data), take the first value or empty string
    if (Array.isArray(profileData.orientation)) {
      return profileData.orientation.length > 0 ? profileData.orientation[0] : '';
    }
    // If it's a string, return as is
    return profileData.orientation;
  };

  return (
    <QuestionCardSimple 
      questionId="question-orientation" 
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        what's your sexual orientation? <span className="text-red-400">*</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Compass className="w-3 h-3 text-pink-300" />
        <span>because heteronormative dating advice can stay in 2010</span>
      </div>
      <SingleSelect 
        options={orientationOptions} 
        selectedValue={getOrientationValue()} 
        onSelect={value => updateField('orientation', value)} 
      />
    </QuestionCardSimple>
  );
};

export default OrientationSelectionCard;
