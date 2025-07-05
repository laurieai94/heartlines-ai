
import { Zap, Users, MessageCircle, Heart } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PartnerQuestionnaireSection2Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const PartnerQuestionnaireSection2 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerQuestionnaireSection2Props) => {
  if (!isReady) return null;

  const stressResponseOptions = ["Go quiet and disappear", "Want to talk it out ASAP", "Need space to think first", "Get emotional and cry", "Get frustrated/snappy", "Try to fix everything immediately", "Avoid the whole situation", "Call their support system", "Still figuring out their patterns"];
  const conflictNeedsOptions = ["Space to cool down first", "To feel heard before anything else", "To understand where I'm coming from", "To solve it right away", "Reassurance that we're still good", "Time to process everything", "Direct, clear communication", "Physical comfort/touch", "Haven't had enough fights to know yet"];
  const loveLanguageOptions = ["Actually listen without trying to fix", "Physical touch and affection", "Quality time without distractions", "Do thoughtful things for me", "Give genuine compliments", "Remember the little things I care about", "Make me laugh when I'm down", "Support my goals and dreams", "Still learning how they show up"];

  return (
    <div className="space-y-1.5">
      {/* Stress Response */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            When they're stressed, what's their usual move?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all you've seen</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Zap className="w-3 h-3 text-orange-300" />
            <span>Stress responses are relationship kryptonite if you don't get them</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stressResponseOptions.map((response) => {
            const isSelected = profileData.partnerStressResponse?.includes(response);
            return (
              <button
                key={response}
                onClick={() => handleMultiSelect('partnerStressResponse', response)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {response}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict Needs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            When you're fighting, what do they actually need?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that work</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <MessageCircle className="w-3 h-3 text-blue-300" />
            <span>The stuff that actually helps them during conflict</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {conflictNeedsOptions.map((need) => {
            const isSelected = profileData.partnerConflictNeeds?.includes(need);
            return (
              <button
                key={need}
                onClick={() => handleMultiSelect('partnerConflictNeeds', need)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {need}
              </button>
            );
          })}
        </div>
      </div>

      {/* Love Language */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            How do they show love?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all you've noticed</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>Their love language IRL</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {loveLanguageOptions.map((language) => {
            const isSelected = profileData.partnerLoveLanguage?.includes(language);
            return (
              <button
                key={language}
                onClick={() => handleMultiSelect('partnerLoveLanguage', language)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {language}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSection2;
