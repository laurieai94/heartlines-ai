
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface PronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PronounsSelection = ({ selectedPronouns, onPronounsSelect }: PronounsSelectionProps) => {
  const [customPronouns, setCustomPronouns] = useState(
    selectedPronouns && !['She/her', 'He/him', 'They/them', 'Ze/zir', 'Multiple sets', 'Use my name'].includes(selectedPronouns) 
      ? selectedPronouns 
      : ''
  );

  const pronounOptions = [
    'She/her',
    'He/him', 
    'They/them',
    'Ze/zir',
    'Multiple sets',
    'Use my name',
    'Other'
  ];

  const handleOptionSelect = (option: string) => {
    if (option === 'Other') {
      // Set the selection to 'Other' to show the input
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-2">
      <Label className="text-base font-semibold text-white">
        What pronouns do you use? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-[13px] text-white/80 mb-2 font-normal">
        <MessageCircle className="w-4 h-4 text-green-300" />
        <span>So we can refer to you correctly</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {pronounOptions.map((pronouns) => (
          <button
            key={pronouns}
            onClick={() => handleOptionSelect(pronouns)}
            className={`p-3 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
              selectedPronouns === pronouns || (pronouns === 'Other' && customPronouns)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronouns}
          </button>
        ))}
      </div>
      
      {(selectedPronouns === 'Other' || customPronouns) && (
        <div className="mt-2">
          <Label className="text-sm font-medium text-white mb-1 block">
            Please specify your pronouns:
          </Label>
          <Input
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g., xe/xir, fae/faer, etc."
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 h-8"
          />
        </div>
      )}
    </div>
  );
};

export default PronounsSelection;
