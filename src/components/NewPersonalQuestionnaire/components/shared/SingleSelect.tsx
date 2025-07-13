
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
      case 2: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3';
      case 4: return 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div className={`grid ${getGridCols(columns)} gap-2`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
            selectedValue === option
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

export default SingleSelect;
