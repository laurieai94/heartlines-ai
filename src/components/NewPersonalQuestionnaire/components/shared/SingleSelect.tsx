
interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const SingleSelect = ({ options, selectedValue, onSelect }: SingleSelectProps) => {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
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
};

export default SingleSelect;

