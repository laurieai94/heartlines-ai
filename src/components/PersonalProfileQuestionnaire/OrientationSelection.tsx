
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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-3">
      <Label className="text-base font-semibold text-white">
        What's your sexual orientation? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-normal text-xs ml-2">Check all that apply</span>
      </Label>
      <div className="flex items-center gap-2 text-[13px] text-white/80 mb-2 font-normal">
        <Compass className="w-4 h-4 text-pink-300" />
        <span>Because straight dating advice doesn't work for everyone</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`p-3 rounded-xl text-xs font-medium transition-all text-left hover:scale-105 ${
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
