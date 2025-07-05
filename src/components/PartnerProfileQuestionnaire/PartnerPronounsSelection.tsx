
import { Label } from "@/components/ui/label";

interface PartnerPronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PartnerPronounsSelection = ({ selectedPronouns, onPronounsSelect }: PartnerPronounsSelectionProps) => {
  const pronounsOptions = [
    "She/her", "He/him", "They/them", "Use their name", "Not sure", "Other"
  ];

  return (
    <div className="bg-white/5 rounded-lg p-3 space-y-2">
      <Label className="text-sm font-medium text-white">
        What pronouns do they use?
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {pronounsOptions.map((pronoun) => (
          <button
            key={pronoun}
            onClick={() => onPronounsSelect(pronoun)}
            className={`p-1.5 rounded-md text-xs font-medium transition-all hover:scale-[1.01] ${
              selectedPronouns === pronoun
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronoun}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/60">So RealTalk doesn't misgender them</p>
    </div>
  );
};

export default PartnerPronounsSelection;
