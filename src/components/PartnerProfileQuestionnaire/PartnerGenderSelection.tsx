
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

interface PartnerGenderSelectionProps {
  selectedGenders: string[];
  selfDescribe: string;
  onGenderSelect: (gender: string) => void;
  onSelfDescribeChange: (value: string) => void;
}

const PartnerGenderSelection = ({ selectedGenders, selfDescribe, onGenderSelect, onSelfDescribeChange }: PartnerGenderSelectionProps) => {
  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Not sure', 'Self-describe'
  ];

  return (
    <div className="bg-white/10 rounded-lg p-2.5 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-3.5 h-3.5 text-pink-400" />
        <Label className="text-sm font-medium text-white">
          What's their gender identity?
          <span className="text-orange-300 font-normal text-xs ml-2">Select all that apply</span>
        </Label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className={`p-1.5 rounded-md text-xs font-medium transition-all text-left hover:scale-[1.01] ${
              selectedGenders.includes(gender)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
      
      {selectedGenders.includes('Self-describe') && (
        <div className="mt-2">
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do they identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 min-h-[40px] resize-none"
            rows={1}
          />
        </div>
      )}
      <p className="text-xs text-white/60">Because gender is complex and personal</p>
    </div>
  );
};

export default PartnerGenderSelection;
