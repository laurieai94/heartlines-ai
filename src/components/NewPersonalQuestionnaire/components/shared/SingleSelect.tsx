
interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  columns?: number;
}

const SingleSelect = ({ options, selectedValue, onSelect, columns = 3 }: SingleSelectProps) => {
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
    <div className="space-y-3">
      <div className={`grid ${getGridCols(columns)} gap-1.5`}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`w-full min-h-11 p-2 md:p-1.5 rounded-lg text-left text-sm md:text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
              selectedValue === option
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SingleSelect;

