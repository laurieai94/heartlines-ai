
import { Users, Heart, Target } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PartnerQuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const PartnerQuestionnaireSection4 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerQuestionnaireSection4Props) => {
  if (!isReady) return null;

  const familyBackgroundOptions = ["Parents together with a healthy, solid relationship", "Parents together with normal ups and downs", "Parents together but fought constantly", "Parents divorced and stayed that way", "Parents divorced, one or both remarried", "Parents divorced but got back together", "Single parent household", "Raised by grandparents or other family", "They don't really talk about family stuff", "Haven't gotten into family history yet"];
  const emotionsOptions = ["Pretty open about all their feelings", "Good with positive emotions, struggle with negative ones", "Not super emotional in general", "Some feelings are easier than others", "Can get overwhelmed by big emotions", "Very even-keeled and stable", "Emotions seem scary or uncomfortable for them", "Still learning their emotional patterns"];
  const valuesOptions = ["Family relationships and connections", "Career success and achievement", "Personal growth and self-improvement", "Financial security and stability", "Adventure and new experiences", "Helping others and making a difference", "Independence and autonomy", "Loyalty and commitment", "Honesty and authenticity", "Fun and enjoyment", "Still figuring out what drives them"];

  return (
    <div className="space-y-1.5">
      {/* Family Background */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What's their family origin story?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that apply</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Users className="w-3 h-3 text-green-300" />
            <span>This is their relationship blueprint whether they know it or not</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {familyBackgroundOptions.map((background) => {
            const isSelected = profileData.partnerFamilyBackground?.includes(background);
            return (
              <button
                key={background}
                onClick={() => handleMultiSelect('partnerFamilyBackground', background)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {background}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emotions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            How do they handle emotions?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all you've observed</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>Their emotional comfort zone</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {emotionsOptions.map((emotion) => {
            const isSelected = profileData.partnerEmotions?.includes(emotion);
            return (
              <button
                key={emotion}
                onClick={() => handleMultiSelect('partnerEmotions', emotion)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {emotion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Values */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What seems most important to them in life?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Target className="w-3 h-3 text-purple-300" />
            <span>Their core values based on actions, not just words</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {valuesOptions.map((value) => {
            const isSelected = profileData.partnerValues?.includes(value);
            return (
              <button
                key={value}
                onClick={() => handleMultiSelect('partnerValues', value)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSection4;
