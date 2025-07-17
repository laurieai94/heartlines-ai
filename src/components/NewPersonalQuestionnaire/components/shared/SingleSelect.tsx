

import { useState } from 'react';
import { Input } from "@/components/ui/input";

interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  columns?: number;
  showOther?: boolean;
}

const SingleSelect = ({ options, selectedValue, onSelect, columns = 3, showOther = true }: SingleSelectProps) => {
  const [otherText, setOtherText] = useState('');
  const isOtherSelected = selectedValue.startsWith('Other: ');
  
  const getGridCols = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2 sm:grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4';
      default: return 'grid-cols-3';
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    if (text.trim()) {
      onSelect(`Other: ${text}`);
    }
  };

  // Check if 'Other' already exists in options to avoid duplicates
  const hasOtherOption = options.includes('Other');
  const allOptions = (showOther && !hasOtherOption) ? [...options, 'Other'] : options;

  return (
    <div className="space-y-3">
      <div className={`grid ${getGridCols(columns)} gap-2`}>
        {allOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              if (option === 'Other') {
                // Don't call onSelect immediately for Other, wait for text input
                setOtherText('');
              } else {
                onSelect(option);
              }
            }}
            className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
              (selectedValue === option || (option === 'Other' && isOtherSelected))
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {(selectedValue === 'Other' || isOtherSelected) && (showOther || hasOtherOption) && (
        <div className="mt-3">
          <Input
            placeholder="Please specify..."
            value={isOtherSelected ? selectedValue.replace('Other: ', '') : otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            className="w-full text-xs bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-orange-300"
          />
        </div>
      )}
    </div>
  );
};

export default SingleSelect;

