
import { Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import OptionalFamilyContext from "./OptionalFamilyContext";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: QuestionnaireSection4Props) => {
  if (!isReady) return null;

  return (
    <div className="space-y-3">
      <div className="bg-white/15 backdrop-blur-lg rounded-xl border border-white/25 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="text-base font-semibold text-white">Your Foundation</h3>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            What's most important to you in a relationship? <span className="text-red-400">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Trust",
              "Honesty",
              "Communication",
              "Shared values",
              "Physical intimacy",
              "Quality time together",
              "Mutual respect",
              "Emotional support",
              "Independence & space",
              "Shared goals",
              "Fun & adventure",
              "Financial security",
              "Family & children"
            ].map((value) => (
              <button
                key={value}
                onClick={() => handleMultiSelect('relationshipValues', value)}
                className={`questionnaire-button text-left ${
                  profileData.relationshipValues?.includes(value)
                    ? 'bg-rose-500/40 border-rose-400/60 text-white'
                    : ''
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <OptionalFamilyContext
        profileData={profileData}
        updateField={updateField}
        handleMultiSelect={handleMultiSelect}
      />
    </div>
  );
};

export default QuestionnaireSection4;
