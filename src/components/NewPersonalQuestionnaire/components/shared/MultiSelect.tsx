
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
    <div className={`grid ${getGridCols(columns)} gap-1.5`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
            className={`w-full p-2 md:p-1.5 rounded-lg text-left text-sm md:text-xs font-medium transition-all duration-200 hover:scale-[1.01] min-h-[44px] md:min-h-auto flex items-center ${
              (selectedValues || []).includes(option)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
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
