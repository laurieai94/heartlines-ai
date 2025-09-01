
interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  columns?: number;
}

const MultiSelect = ({ options, selectedValues, onToggle, columns = 2 }: MultiSelectProps) => {
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
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          className={`questionnaire-chip ${
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
