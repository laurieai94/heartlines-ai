
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
    selectedPronouns && !['she/her', 'he/him', 'they/them', 'ze/zir', 'multiple sets', 'use my name'].includes(selectedPronouns) 
      ? selectedPronouns 
      : ''
  );

  const pronounOptions = [
    'she/her',
    'he/him', 
    'they/them',
    'ze/zir',
    'multiple sets',
    'use my name',
    'other'
  ];

  const handleOptionSelect = (option: string) => {
    if (option === 'other') {
      // Set the selection to 'other' to show the input
      onPronounsSelect('other');
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What pronouns do you use? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <MessageCircle className="w-3 h-3 text-green-300" />
          <span>So we can refer to you correctly</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {pronounOptions.map((pronouns) => (
          <button
            key={pronouns}
            onClick={() => handleOptionSelect(pronouns)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
              selectedPronouns === pronouns || (pronouns === 'other' && customPronouns)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronouns}
          </button>
        ))}
      </div>
      
      {(selectedPronouns === 'other' || customPronouns) && (
        <div className="mt-1.5">
          <Label className="text-xs font-medium text-white mb-1 block">
            Please specify your pronouns:
          </Label>
          <Input
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g., xe/xir, fae/faer, etc."
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 h-7"
          />
        </div>
      )}
    </div>
  );
};

export default PronounsSelection;
