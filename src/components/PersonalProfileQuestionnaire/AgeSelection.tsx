
import { Label } from "@/components/ui/label";

interface AgeSelectionProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const AgeSelection = ({ selectedAge, onAgeSelect }: AgeSelectionProps) => {
  const ageOptions = [
    'Under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50+'
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        What's your age? <span className="text-red-500">*</span>
      </Label>
      <div className="grid grid-cols-4 gap-2">
        {ageOptions.map((age) => (
          <button
            key={age}
            onClick={() => onAgeSelect(age)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
              selectedAge === age
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgeSelection;
