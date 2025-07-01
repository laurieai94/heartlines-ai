
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";
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
      // Don't set the selection yet, wait for custom input
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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-8 space-y-4">
      <Label className="text-lg font-semibold text-white">
        What pronouns do you use? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
        <Lightbulb className="w-4 h-4" />
        <span>So we can refer to you correctly</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {pronounOptions.map((pronouns) => (
          <button
            key={pronouns}
            onClick={() => handleOptionSelect(pronouns)}
            className={`p-4 rounded-2xl text-sm font-medium transition-all hover:scale-105 ${
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
        <div className="mt-4">
          <Label className="text-lg font-medium text-white mb-3 block">
            Please specify your pronouns:
          </Label>
          <Input
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g., xe/xir, fae/faer, etc."
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-lg p-4"
          />
        </div>
      )}
    </div>
  );
};

export default PronounsSelection;
