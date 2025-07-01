
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
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        What's your sexual orientation? <span className="text-red-500">*</span>
        <span className="text-orange-600 font-medium text-xs ml-2">✨ Check all that apply</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <Lightbulb className="w-3 h-3" />
        <span>Because straight dating advice doesn't work for everyone</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedOrientations.includes(orientation)
                ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {orientation}
          </button>
        ))}
      </div>
      
      {selectedOrientations.includes('Prefer to self-describe') && (
        <div className="mt-3">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Please describe your sexual orientation:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="border-gray-300 focus:border-orange-400 focus:ring-orange-400"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default OrientationSelection;
