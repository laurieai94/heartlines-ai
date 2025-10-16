
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FamilyLoveQuestionProps {
  selectedValues: string[];
  otherText: string;
  onToggle: (value: string) => void;
  onOtherTextChange: (value: string) => void;
}

const FamilyLoveQuestion = ({ 
  selectedValues, 
  otherText, 
  onToggle, 
  onOtherTextChange 
}: FamilyLoveQuestionProps) => {
  const options = [
    'Lots of "I love yous" & physical affection',
    'Love through doing things/helping out',
    'Love through quality time together',
    'Love through gifts & buying things',
    'Love felt conditional - had to earn it',
    'Love was assumed but rarely shown',
    'Love felt overwhelming or suffocating',
    'Love through achievements & making proud',
    'Love was inconsistent (hot and cold)'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2 space-y-1">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-white">
          How was love typically shown? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
              selectedValues.includes(option)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FamilyLoveQuestion;
