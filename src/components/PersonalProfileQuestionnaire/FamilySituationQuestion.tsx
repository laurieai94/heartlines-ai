
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    'Parents married - healthy relationship',
    'Parents married - typical ups and downs',
    'Parents married - constant fighting',
    'Parents divorced when I was young',
    'Parents divorced when I was older',
    'Single parent household',
    'Raised by grandparents/other family',
    'Foster care/adopted',
    'Other/complex situation'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-white">
          Family structure growing up: <span className="text-red-400">*</span>
        </Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      
      {selectedValue === 'Other/complex situation' && (
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
