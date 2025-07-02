
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";

interface FamilyEmotionsQuestionProps {
  selectedValues: string[];
  otherText: string;
  onToggle: (value: string) => void;
  onOtherTextChange: (value: string) => void;
}

const FamilyEmotionsQuestion = ({ 
  selectedValues, 
  otherText, 
  onToggle, 
  onOtherTextChange 
}: FamilyEmotionsQuestionProps) => {
  const options = [
    'All emotions were totally normal and talked about',
    'Happy feelings great, sad/angry ones shut down',
    'We just weren\'t an emotions family',
    'There were "good" and "bad" emotions',
    'Someone was always having a meltdown',
    'I became the family therapist way too young',
    'Showing feelings meant getting judged',
    'Emotional vibe was completely unpredictable',
    'Other (please specify)'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-white">
          How did your family handle emotions and feelings? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>This shapes whether you feel safe being vulnerable</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
        <div className="mt-2">
          <Textarea
            value={otherText}
            onChange={(e) => onOtherTextChange(e.target.value)}
            placeholder="Please specify..."
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-3 min-h-[60px] resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default FamilyEmotionsQuestion;
