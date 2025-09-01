
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface RelationshipWorkingWellProps {
  config: {
    label: string;
    subtitle: string;
    options: string[];
  };
  profileData: any;
  handleMultiSelect: (field: string, value: string) => void;
}

const RelationshipWorkingWell = ({ config, profileData, handleMultiSelect }: RelationshipWorkingWellProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-medium text-white">
          {config.label} (Select all that apply)
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>{config.subtitle}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full">
        {config.options.map((item) => (
          <button
            key={item}
            onClick={() => handleMultiSelect('relationshipWorking', item)}
            className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-lg transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
              (profileData.relationshipWorking || profileData.relationshipWorkingWell || []).includes(item)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelationshipWorkingWell;
