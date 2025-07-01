
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";

interface OrientationSelectionProps {
  selectedOrientations: string[];
  selfDescribe: string;
  onOrientationSelect: (orientation: string) => void;
  onSelfDescribeChange: (value: string) => void;
}

const OrientationSelection = ({ selectedOrientations, selfDescribe, onOrientationSelect, onSelfDescribeChange }: OrientationSelectionProps) => {
  const orientationOptions = [
    'Straight/Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Queer', 'Asexual', 'Questioning', 'Prefer to self-describe'
  ];

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold questionnaire-text">
        What's your sexual orientation? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-sm ml-2">✨ Check all that apply</span>
      </Label>
      <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-4">
        <Lightbulb className="w-4 h-4" />
        <span>Because straight dating advice doesn't work for everyone</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`p-4 rounded-2xl text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedOrientations.includes(orientation)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {orientation}
          </button>
        ))}
      </div>
      
      {selectedOrientations.includes('Prefer to self-describe') && (
        <div className="mt-4">
          <Label className="text-lg font-medium questionnaire-text mb-3 block">
            Please describe your sexual orientation:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-lg p-4"
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default OrientationSelection;
