
interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  columns?: number;
}

const MultiSelect = ({ options, selectedValues, onToggle, columns = 3 }: MultiSelectProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-2`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
            selectedValues.includes(option)
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
