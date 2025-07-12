
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCheck } from "lucide-react";
import { useState } from "react";

interface PartnerPronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PartnerPronounsSelection = ({ selectedPronouns, onPronounsSelect }: PartnerPronounsSelectionProps) => {
  const [customPronouns, setCustomPronouns] = useState(
    selectedPronouns && !['She/her', 'He/him', 'They/them', 'Ze/zir', 'Multiple sets', 'Use their name'].includes(selectedPronouns) 
      ? selectedPronouns 
      : ''
  );

  const pronounsOptions = [
    "She/her", "He/him", "They/them", "Ze/zir", "Multiple sets", "Use their name", "Other"
  ];

  const handleOptionSelect = (option: string) => {
    if (option === 'Other') {
      onPronounsSelect('Other');
      return;
    }
    onPronounsSelect(option);
  };

  const handleCustomChange = (value: string) => {
    setCustomPronouns(value);
    if (value.trim()) {
      onPronounsSelect(value.trim());
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-2.5 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        <Label className="text-sm font-medium text-white">
          What pronouns do they use?
        </Label>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {pronounsOptions.map((pronoun) => (
          <button
            key={pronoun}
            onClick={() => handleOptionSelect(pronoun)}
            className={`p-1.5 rounded-md text-xs font-medium transition-all hover:scale-[1.01] ${
              selectedPronouns === pronoun || (pronoun === 'Other' && customPronouns)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronoun}
          </button>
        ))}
      </div>
      
      {(selectedPronouns === 'Other' || customPronouns) && (
        <div className="mt-1.5">
          <Label className="text-xs font-medium text-white mb-1 block">
            Please specify their pronouns:
          </Label>
          <Input
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g., xe/xir, fae/faer, etc."
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 h-7"
          />
        </div>
      )}
      
      <p className="text-xs text-white/60">So RealTalk doesn't misgender them</p>
    </div>
  );
};

export default PartnerPronounsSelection;
