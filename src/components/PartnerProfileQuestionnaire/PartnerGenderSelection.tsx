
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
    'woman', 'man', 'non-binary', 'trans woman', 'trans man', 
    'genderfluid', 'questioning', 'not sure', 'self-describe'
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
      <div className="flex flex-wrap gap-2">
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-md text-xs font-medium transition-all hover:scale-[1.01] ${
              selectedGenders.includes(gender)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
      
      {selectedGenders.includes('self-describe') && (
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
