
interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  columns?: number;
}

const SingleSelect = ({ options, selectedValue, onSelect, columns = 3 }: SingleSelectProps) => {
  const getGridCols = (cols: number) => {
    // Cap columns at 3 maximum
    const cappedCols = Math.min(cols, 3);
    switch (cappedCols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2 sm:grid-cols-2';
      case 3: return 'grid-cols-3';
      default: return 'grid-cols-3';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`questionnaire-chip inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full ${
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

