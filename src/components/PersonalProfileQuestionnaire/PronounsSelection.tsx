
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PronounsSelectionProps {
  selectedPronouns: string;
  customPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
  onCustomPronounsChange: (value: string) => void;
}

const PronounsSelection = ({ 
  selectedPronouns, 
  customPronouns, 
  onPronounsSelect, 
  onCustomPronounsChange 
}: PronounsSelectionProps) => {
  const pronounsOptions = [
    'She/her',
    'He/him',
    'They/them',
    'Ze/zir',
    'Multiple sets',
    'Use my name',
    'Other'
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        What pronouns do you use? <span className="text-red-500">*</span>
      </Label>
      <p className="text-xs text-gray-600 mb-3">
        RealTalk wants to refer to you correctly throughout the app
      </p>
      <div className="grid grid-cols-2 gap-2">
        {pronounsOptions.map((pronouns) => (
          <button
            key={pronouns}
            onClick={() => onPronounsSelect(pronouns)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedPronouns === pronouns
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {pronouns}
          </button>
        ))}
      </div>
      
      {selectedPronouns === 'Other' && (
        <div className="mt-4">
          <Label htmlFor="customPronouns" className="text-sm font-medium text-gray-700">
            Please specify your pronouns
          </Label>
          <Input
            id="customPronouns"
            type="text"
            value={customPronouns}
            onChange={(e) => onCustomPronounsChange(e.target.value)}
            placeholder="e.g., xe/xir, fae/faer"
            className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default PronounsSelection;
