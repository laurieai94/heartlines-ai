
interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  columns?: number;
}

const MultiSelect = ({ options, selectedValues, onToggle, columns = 2 }: MultiSelectProps) => {
  const getGridCols = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2 sm:grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4';
      default: return 'grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridCols(columns)} gap-2`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
            (selectedValues || []).includes(option)
              ? 'questionnaire-button-selected'
              : 'questionnaire-button-secondary'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultiSelect;
