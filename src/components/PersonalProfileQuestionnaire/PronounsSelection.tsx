
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
      <p className="text-xs text-gray-600 mb-3">
        RealTalk wants to refer to you correctly throughout the app
      </p>
      <div className="grid grid-cols-2 gap-2">
        {pronounOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedPronouns === option ||
              (option === 'Other' && customPronouns && !pronounOptions.slice(0, -1).includes(selectedPronouns))
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Custom pronouns input */}
      {(selectedPronouns === 'Other' || (customPronouns && !pronounOptions.slice(0, -1).includes(selectedPronouns))) && (
        <div className="mt-3">
          <Input
            type="text"
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="Please specify your pronouns"
            className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
      )}
    </div>
  );
};

export default PronounsSelection;
