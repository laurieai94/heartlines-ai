
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PartnerOrientationSelectionProps {
  selectedOrientations: string[];
  selfDescribe: string;
  onOrientationSelect: (orientation: string) => void;
  onSelfDescribeChange: (value: string) => void;
}

const PartnerOrientationSelection = ({ selectedOrientations, selfDescribe, onOrientationSelect, onSelfDescribeChange }: PartnerOrientationSelectionProps) => {
  const orientationOptions = [
    'Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Queer', 'Asexual', 'Questioning', 'Not sure', 'Self-describe'
  ];

  return (
    <div className="bg-white/5 rounded-lg p-3 space-y-2">
      <Label className="text-sm font-medium text-white">
        What's their sexual orientation?
        <span className="text-orange-300 font-normal text-xs ml-2">Select all that apply</span>
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`p-1.5 rounded-md text-xs font-medium transition-all text-left hover:scale-[1.01] ${
              selectedOrientations.includes(orientation)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {orientation}
          </button>
        ))}
      </div>
      
      {selectedOrientations.includes('Self-describe') && (
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
      <p className="text-xs text-white/60">Because straight dating advice doesn't work for everyone</p>
    </div>
  );
};

export default PartnerOrientationSelection;
