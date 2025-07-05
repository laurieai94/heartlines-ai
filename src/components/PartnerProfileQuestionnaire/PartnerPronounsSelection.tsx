
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface PartnerPronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PartnerPronounsSelection = ({ selectedPronouns, onPronounsSelect }: PartnerPronounsSelectionProps) => {
  const pronounsOptions = [
    "She/her", "He/him", "They/them", "Ze/zir", "Multiple sets", "Use their name", "Other", "Not sure/haven't asked yet"
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What pronouns do they use?
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <Users className="w-3 h-3 text-rose-400" />
          <span>So RealTalk doesn't misgender them</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {pronounsOptions.map((pronoun) => (
          <button
            key={pronoun}
            onClick={() => onPronounsSelect(pronoun)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.01] ${
              selectedPronouns === pronoun
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronoun}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PartnerPronounsSelection;
