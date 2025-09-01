
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import UnderageModal from "../../../../PersonalProfileQuestionnaire/UnderageModal";

interface AgeSelectionCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
}

const AgeSelectionCard = ({ profileData, updateField, isComplete }: AgeSelectionCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const [showUnderageModal, setShowUnderageModal] = useState(false);
  
  const ageOptions = [
    'Under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50-60', '65+'
  ];

  const handleAgeSelect = (age: string) => {
    if (age === 'Under 18') {
      setShowUnderageModal(true);
      return;
    }
    updateField('age', age);
  };

  return (
    <>
      <QuestionCard 
        questionId="question-age"
        showContinue={isComplete}
        onContinue={() => scrollToNextQuestion('question-age')}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your age?
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Calendar className="w-3 h-3 text-orange-300" />
          <span>Different life stages = different relationship challenges</span>
        </div>
        <SingleSelect
          options={ageOptions}
          selectedValue={profileData.age || ''}
          onSelect={handleAgeSelect}
          columns={2}
        />
      </QuestionCard>

      <UnderageModal 
        isOpen={showUnderageModal} 
        onClose={() => setShowUnderageModal(false)} 
      />
    </>
  );
};

export default AgeSelectionCard;
