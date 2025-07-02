
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface RelationshipStatusSelectorProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
}

const RelationshipStatusSelector = ({ profileData, updateField }: RelationshipStatusSelectorProps) => {
  const relationshipStatusOptions = [
    'Single, actively dating', 'Single, not dating', 'Casually dating/seeing people', 
    'Exclusive but not official', 'In a relationship', 'Engaged', 
    'Married', 'It\'s complicated'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What is your current relationship status? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>From 'it's complicated' to married - we meet you where you are</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
        {relationshipStatusOptions.map((status) => (
          <button
            key={status}
            onClick={() => updateField('relationshipStatus', status)}
            className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
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
