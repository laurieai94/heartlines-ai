
import { Label } from "@/components/ui/label";

interface RelationshipLengthProps {
  config: {
    label: string;
    options: string[];
  };
  profileData: any;
  updateField: (field: string, value: any) => void;
}

const RelationshipLength = ({ config, profileData, updateField }: RelationshipLengthProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-medium text-white">
          {config.label}
        </Label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {config.options.map((length) => (
          <button
            key={length}
            onClick={() => updateField('relationshipLengthContext', length)}
            className={`p-1.5 rounded-lg text-center transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
              profileData.relationshipLengthContext === length
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

export default RelationshipLength;
