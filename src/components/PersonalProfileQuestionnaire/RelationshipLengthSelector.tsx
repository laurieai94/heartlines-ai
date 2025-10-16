
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface RelationshipLengthSelectorProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
}

const RelationshipLengthSelector = ({ profileData, updateField }: RelationshipLengthSelectorProps) => {
  const relationshipLengthOptions = [
    'Less than 3 months', '3-6 months', '6 months - 1 year', 
    '1-2 years', '2-5 years', '5+ years'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2 space-y-1">
      <div>
        <Label className="text-sm font-semibold text-white">
          How long have you been together? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <Clock className="w-3 h-3 text-green-300" />
          <span>Different relationship stages have different needs and challenges</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {relationshipLengthOptions.map((length) => (
          <button
            key={length}
            onClick={() => updateField('relationshipLength', length)}
            className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-lg transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
              profileData.relationshipLength === length
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {length}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelationshipLengthSelector;
