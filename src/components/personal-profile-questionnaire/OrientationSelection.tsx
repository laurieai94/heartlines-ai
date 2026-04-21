
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What's your sexual orientation? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal">
          <Compass className="w-3 h-3 text-pink-300" />
          <span>Because straight dating advice doesn't work for everyone</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.01] ${
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
        <div className="mt-1.5">
          <Label className="text-xs font-medium text-white mb-1 block">
            Please describe your sexual orientation:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 min-h-[50px] resize-none"
            rows={1}
          />
        </div>
      )}
    </div>
  );
};

export default OrientationSelection;
