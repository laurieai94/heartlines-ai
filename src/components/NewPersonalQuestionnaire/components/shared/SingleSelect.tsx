import { memo, useEffect } from 'react';
import { useInputStateTracking } from '@/hooks/useInputStateTracking';

interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  allowDeselect?: boolean; // Control whether clicking selected value clears it
}

const SingleSelect = memo(({ options, selectedValue, onSelect, allowDeselect = true }: SingleSelectProps) => {
  const { trackSelection } = useInputStateTracking();

  // Debug: Log when selected value changes
  useEffect(() => {
    console.log('[SingleSelect] Selected value:', selectedValue);
  }, [selectedValue]);

  const handleSelect = (value: string) => {
    trackSelection(); // Prevent navigation conflicts during user input
    
    // Only allow deselection if explicitly enabled
    if (selectedValue === value && allowDeselect) {
      onSelect(''); // Clear the selection
    } else if (selectedValue !== value) {
      onSelect(value); // Change selection
    }
    // If selectedValue === value and !allowDeselect, do nothing (keep selected)
  };
  return (
    <div className="flex flex-wrap gap-1.5 w-full">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); } }}
          className={`questionnaire-chip flex items-center justify-center text-center break-words whitespace-normal ${
            selectedValue === option
              ? 'questionnaire-chip-selected'
              : ''
          }`}
          aria-pressed={selectedValue === option}
          role="button"
          tabIndex={0}
        >
          {option}
        </button>
      ))}
    </div>
  );
});

export default SingleSelect;

