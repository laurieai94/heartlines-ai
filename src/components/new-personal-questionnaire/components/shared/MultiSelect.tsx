import { memo } from 'react';
import { useInputStateTracking } from '@/hooks/useInputStateTracking';

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

const MultiSelect = memo(({ options, selectedValues, onToggle }: MultiSelectProps) => {
  const { trackSelection } = useInputStateTracking();

  const handleToggle = (value: string) => {
    trackSelection(); // Prevent navigation conflicts during user input
    onToggle(value);
  };
  return (
    <div className="flex flex-wrap gap-1.5 w-full">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`questionnaire-chip flex items-center justify-center text-center break-words whitespace-normal ${
            (selectedValues || []).includes(option)
              ? 'questionnaire-chip-selected'
              : ''
          }`}
          aria-pressed={(selectedValues || []).includes(option)}
          role="button"
          tabIndex={0}
        >
          {option}
        </button>
      ))}
    </div>
  );
});

export default MultiSelect;
