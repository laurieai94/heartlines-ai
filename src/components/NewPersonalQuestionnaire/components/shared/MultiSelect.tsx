
interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

const MultiSelect = ({ options, selectedValues, onToggle }: MultiSelectProps) => {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
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
};

export default MultiSelect;
