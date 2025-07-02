
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";

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
    'Lots of "I love yous" and physical affection',
    'Love through doing stuff - cooking, helping out',
    'Love through spending quality time together',
    'Love through gifts and buying things',
    'Love felt conditional - had to earn it',
    'Love was hot and cold',
    'Love felt overwhelming or suffocating',
    'Love was assumed but rarely shown',
    'Other (please specify)'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-white">
          How was love typically shown in your family? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <Users className="w-3 h-3 text-blue-300" />
          <span>This is your blueprint for giving and receiving love</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
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
      
      {selectedValues.includes('Other (please specify)') && (
        <div className="mt-1.5">
          <Textarea
            value={otherText}
            onChange={(e) => onOtherTextChange(e.target.value)}
            placeholder="Please specify..."
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2.5 min-h-[50px] resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default FamilyLoveQuestion;
