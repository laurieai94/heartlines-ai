
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
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        What pronouns do you use? <span className="text-red-500">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <Lightbulb className="w-3 h-3" />
        <span>So we can refer to you correctly</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {pronounOptions.map((pronouns) => (
          <button
            key={pronouns}
            onClick={() => handleOptionSelect(pronouns)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
              selectedPronouns === pronouns || (pronouns === 'Other' && customPronouns)
                ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {pronouns}
          </button>
        ))}
      </div>
      
      {(selectedPronouns === 'Other' || customPronouns) && (
        <div className="mt-3">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Please specify your pronouns:
          </Label>
          <Input
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g., xe/xir, fae/faer, etc."
            className="border-gray-300 focus:border-orange-400 focus:ring-orange-400"
          />
        </div>
      )}
    </div>
  );
};

export default PronounsSelection;
