
import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";

interface PartnerPronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PartnerPronounsSelection = ({ selectedPronouns, onPronounsSelect }: PartnerPronounsSelectionProps) => {
  const pronounsOptions = [
    "She/her", "He/him", "They/them", "Use their name", "Not sure", "Other"
  ];

  return (
    <div className="bg-white/10 rounded-lg p-2.5 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        <Label className="text-sm font-medium text-white">
          What pronouns do they use? <span className="text-red-400">*</span>
        </Label>
      </div>
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
