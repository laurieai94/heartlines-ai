
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface RelationshipStatusSelectorProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
}

const RelationshipStatusSelector = ({ profileData, updateField }: RelationshipStatusSelectorProps) => {
  const relationshipStatusOptions = [
    'On the apps',
    'Single & taking a break from dating',
    'Single & living my best life',
    'Recently single',
    'Casually seeing people',
    'Talking stage',
    'Soft launching someone new',
    'In a relationship (official)',
    'Engaged',
    'Married',
    'Domestic partnership',
    'Separated/Divorced',
    'Widowed',
    'Situationship',
    'Honestly, I don\'t even know.'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What is your current relationship status? <span className="text-red-400">*</span> <span className="text-orange-300 font-medium text-xs ml-2">(Select the answer that resonates most)</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>From situationship to married - we meet you where you are</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full">
        {relationshipStatusOptions.map((status) => (
          <button
            key={status}
            onClick={() => updateField('relationshipStatus', status)}
            className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-lg transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
              profileData.relationshipStatus === status
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelationshipStatusSelector;
