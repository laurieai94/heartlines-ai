
import { Heart, MessageCircle } from "lucide-react";
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
    <div className="space-y-1.5">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="text-base font-semibold text-white">Your Foundation</h3>
        </div>
        
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            How did emotions work in your family? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-1">
            <MessageCircle className="w-3 h-3 text-blue-300" />
            <span>This programs how safe you feel being vulnerable</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              "Open & healthy emotional expression",
              "Happy feelings okay, sad/angry ones shut down",
              "We weren't an emotions family",
              "Emotions were unpredictable/overwhelming",
              "I became the family therapist",
              "Big emotions were dramatic & scary",
              "Emotions were used to manipulate",
              "Everything looked fine but wasn't",
              "Love expressed but other feelings weren't"
            ].map((value) => (
              <button
                key={value}
                onClick={() => handleMultiSelect('familyEmotions', value)}
                className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                  profileData.familyEmotions?.includes(value)
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
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
