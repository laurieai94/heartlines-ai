
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {orientationOptions.map((orientation) => (
          <button
            key={orientation}
            onClick={() => onOrientationSelect(orientation)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedOrientations.includes(orientation)
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
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
            className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default OrientationSelection;
