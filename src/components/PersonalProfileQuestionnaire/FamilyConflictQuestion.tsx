
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FamilyConflictQuestionProps {
  selectedValues: string[];
  otherText: string;
  onToggle: (value: string) => void;
  onOtherTextChange: (value: string) => void;
}

const FamilyConflictQuestion = ({ 
  selectedValues, 
  otherText, 
  onToggle, 
  onOtherTextChange 
}: FamilyConflictQuestionProps) => {
  const options = [
    'Actually talked through problems',
    'Someone always gave in to avoid drama',
    'Conflict was avoided at all costs',
    'Screaming matches were normal',
    'Silent treatment & passive-aggressive',
    'I was constantly the peacekeeper',
    'Arguments felt scary & unpredictable',
    'One parent always won',
    'Fight then pretend nothing happened'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2 space-y-1">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-white">
          How did your family handle conflict? <span className="text-red-400">*</span>
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

export default FamilyConflictQuestion;
