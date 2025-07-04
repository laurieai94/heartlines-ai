
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Compass } from "lucide-react";

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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
      <Label className="text-sm font-semibold text-white mb-1 block">
        What's your sexual orientation? <span className="text-red-400">*</span>
        <span className="text-electric-blue font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
        <Compass className="w-3 h-3 text-neon-cyan" />
        <span>Because straight dating advice doesn't work for everyone</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`p-2 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
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
        <div className="mt-2">
          <Label className="text-xs font-medium text-white mb-1 block">
            Please describe your sexual orientation:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 min-h-[60px] resize-none"
            rows={1}
          />
        </div>
      )}
    </div>
  );
};

export default OrientationSelection;
