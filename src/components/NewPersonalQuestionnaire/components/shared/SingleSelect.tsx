
interface SingleSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  columns?: number;
}

const SingleSelect = ({ options, selectedValue, onSelect, columns = 3 }: SingleSelectProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-2`}>
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
