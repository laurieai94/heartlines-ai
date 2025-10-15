
import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";
import { BRAND } from "@/branding";

interface PartnerPronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PartnerPronounsSelection = ({ selectedPronouns, onPronounsSelect }: PartnerPronounsSelectionProps) => {
  const pronounsOptions = [
    "she/her", "he/him", "they/them", "she/they", "he/they", "other"
  ];

  return (
    <div className="bg-white/10 rounded-lg p-2.5 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        <Label className="text-sm font-medium text-white">
          what pronouns do they use? <span className="text-red-400">*</span>
        </Label>
      </div>
      <div className="flex flex-wrap gap-2">
        {pronounsOptions.map((pronoun) => (
          <button
            key={pronoun}
            onClick={() => onPronounsSelect(pronoun)}
            className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-md text-xs font-medium transition-all hover:scale-[1.01] ${
              selectedPronouns === pronoun
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronoun}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/60">So {BRAND.name} doesn't misgender them</p>
    </div>
  );
};

export default PartnerPronounsSelection;
