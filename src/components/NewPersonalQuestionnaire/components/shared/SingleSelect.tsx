import { memo } from 'react';

interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const SingleSelect = memo(({ options, selectedValue, onSelect }: SingleSelectProps) => {
  return (
    <div className="flex flex-wrap gap-1.5 w-full">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
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

