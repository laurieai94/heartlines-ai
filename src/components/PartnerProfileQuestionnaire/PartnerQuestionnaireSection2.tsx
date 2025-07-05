
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

  const genderOptions = ["Woman", "Man", "Non-binary", "Trans woman", "Trans man", "Genderfluid", "Questioning", "Prefer to self-describe", "Not sure/haven't talked about it"];
  const stressResponseOptions = ["Go quiet and disappear", "Want to talk it out ASAP", "Need space to think first", "Get emotional and cry", "Get frustrated/snappy", "Try to fix everything immediately", "Avoid the whole situation", "Call their support system", "Still figuring out their patterns"];
  const conflictNeedsOptions = ["Space to cool down first", "To feel heard before anything else", "To understand where I'm coming from", "To solve it right away", "Reassurance that we're still good", "Time to process everything", "Direct, clear communication", "Physical comfort/touch", "Haven't had enough fights to know yet"];
  const loveLanguageOptions = ["Actually listen without trying to fix", "Physical touch and affection", "Quality time without distractions", "Do thoughtful things for me", "Give genuine compliments", "Remember the little things I care about", "Make me laugh when I'm down", "Support my goals and dreams", "Still learning how they show up"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">How They Operate</h3>
        </div>
        <p className="text-sm text-white/70">Their default settings</p>
      </div>

      {/* Gender Identity */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Users className="w-4 h-4 inline mr-2 text-rose-400" />
          What's their gender identity? Select all that fit
        </Label>
        <p className="text-xs text-white/60 mb-3">Because gender is a whole spectrum</p>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((gender) => {
            const isSelected = profileData.partnerGender?.includes(gender);
            return (
              <button
                key={gender}
                onClick={() => handleMultiSelect('partnerGender', gender)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stress Response */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Zap className="w-4 h-4 inline mr-2 text-rose-400" />
          When they're stressed, what's their usual move? Select all you've seen
        </Label>
        <p className="text-xs text-white/60 mb-3">Stress responses are relationship kryptonite if you don't get them</p>
        <div className="grid grid-cols-1 gap-2">
          {stressResponseOptions.map((response) => {
            const isSelected = profileData.partnerStressResponse?.includes(response);
            return (
              <button
                key={response}
                onClick={() => handleMultiSelect('partnerStressResponse', response)}
                className={`p-2 rounded-lg text-sm transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {response}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict Needs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <MessageCircle className="w-4 h-4 inline mr-2 text-rose-400" />
          When you're fighting, what do they actually need? Select all that work
        </Label>
        <p className="text-xs text-white/60 mb-3">The stuff that actually helps them during conflict</p>
        <div className="grid grid-cols-1 gap-2">
          {conflictNeedsOptions.map((need) => {
            const isSelected = profileData.partnerConflictNeeds?.includes(need);
            return (
              <button
                key={need}
                onClick={() => handleMultiSelect('partnerConflictNeeds', need)}
                className={`p-2 rounded-lg text-sm transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {need}
              </button>
            );
          })}
        </div>
      </div>

      {/* Love Language */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Heart className="w-4 h-4 inline mr-2 text-rose-400" />
          How do they show love? Select all you've noticed
        </Label>
        <p className="text-xs text-white/60 mb-3">Their love language IRL</p>
        <div className="grid grid-cols-1 gap-2">
          {loveLanguageOptions.map((language) => {
            const isSelected = profileData.partnerLoveLanguage?.includes(language);
            return (
              <button
                key={language}
                onClick={() => handleMultiSelect('partnerLoveLanguage', language)}
                className={`p-2 rounded-lg text-sm transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
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
