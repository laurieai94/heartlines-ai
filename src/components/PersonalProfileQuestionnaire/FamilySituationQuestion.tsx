
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home } from "lucide-react";

interface FamilySituationQuestionProps {
  selectedValue: string;
  otherText: string;
  onSelect: (value: string) => void;
  onOtherTextChange: (value: string) => void;
}

const FamilySituationQuestion = ({ 
  selectedValue, 
  otherText, 
  onSelect, 
  onOtherTextChange 
}: FamilySituationQuestionProps) => {
  const options = [
    'Parents married/together - solid, healthy relationship',
    'Parents married/together - typical ups and downs',
    'Parents married/together - constant fighting but stayed',
    'Parents divorced and stayed divorced',
    'Parents divorced, one/both remarried someone else',
    'Parents divorced but got back together (wild, I know)',
    'Single parent household',
    'Raised by grandparents/other family',
    'Other (please specify)'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-white">
          What was your family situation like growing up? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <Home className="w-3 h-3 text-green-300" />
          <span>This programmed your relationship patterns</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
              selectedValue === option
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {selectedValue === 'Other (please specify)' && (
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

export default FamilySituationQuestion;
