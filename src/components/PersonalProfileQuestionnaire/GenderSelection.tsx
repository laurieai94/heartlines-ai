
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GenderSelectionProps {
  selectedGenders: string[];
  selfDescribe: string;
  onGenderSelect: (gender: string) => void;
  onSelfDescribeChange: (value: string) => void;
}

const GenderSelection = ({ selectedGenders, selfDescribe, onGenderSelect, onSelfDescribeChange }: GenderSelectionProps) => {
  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Prefer to self-describe'
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        How do you identify your gender? <span className="text-red-500">*</span>
        <span className="text-coral-600 font-medium text-xs ml-2">✨ Check all that apply</span>
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedGenders.includes(gender)
                ? 'bg-gradient-to-r from-coral-400 to-orange-400 text-white border-coral-400 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-coral-300 hover:bg-coral-50'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
      
      {selectedGenders.includes('Prefer to self-describe') && (
        <div className="mt-3">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Please describe your gender identity:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="border-gray-300 focus:border-coral-400 focus:ring-coral-400"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default GenderSelection;
