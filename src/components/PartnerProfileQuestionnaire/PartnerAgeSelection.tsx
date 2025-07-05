
import { Label } from "@/components/ui/label";

interface PartnerAgeSelectionProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const PartnerAgeSelection = ({ selectedAge, onAgeSelect }: PartnerAgeSelectionProps) => {
  const ageOptions = [
    '18-24', '25-34', '35-44', '45-54', '55+', 'Not sure'
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-white">
        How old are they?
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {ageOptions.map((age) => (
          <button
            key={age}
            onClick={() => onAgeSelect(age)}
            className={`p-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] ${
              selectedAge === age
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {age}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/60">Different life stages = different relationship vibes</p>
    </div>
  );
};

export default PartnerAgeSelection;
