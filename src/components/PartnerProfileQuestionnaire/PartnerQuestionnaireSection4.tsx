
import { TreeDeciduous, HelpCircle, Users, Heart, Target } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TreeDeciduous className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">Their Background</h3>
        </div>
        <p className="text-sm text-white/70">The family stuff that shaped them</p>
      </div>

      {/* Understanding Better */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <HelpCircle className="w-4 h-4 inline mr-2 text-rose-400" />
          What about them do you want to understand better? Totally optional
        </Label>
        <p className="text-xs text-white/60 mb-3">Anything that confuses you or that you're curious about</p>
        <Input
          value={profileData.partnerUnderstandBetter || ''}
          onChange={(e) => updateField('partnerUnderstandBetter', e.target.value)}
          placeholder="What patterns puzzle you or what would help you connect better?"
          className="bg-white/5 border-white/20 text-white placeholder-white/40"
        />
      </div>

      {/* Family Background */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Users className="w-4 h-4 inline mr-2 text-rose-400" />
          What's their family origin story?
        </Label>
        <p className="text-xs text-white/60 mb-3">This is their relationship blueprint whether they know it or not</p>
        <div className="grid grid-cols-1 gap-2">
          {familyBackgroundOptions.map((background) => (
            <button
              key={background}
              onClick={() => updateField('partnerFamilyBackground', background)}
              className={`p-2 rounded-lg text-sm transition-all text-left ${
                profileData.partnerFamilyBackground === background
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              {background}
            </button>
          ))}
        </div>
      </div>

      {/* Emotions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Heart className="w-4 h-4 inline mr-2 text-rose-400" />
          How do they handle emotions? Select all you've observed
        </Label>
        <p className="text-xs text-white/60 mb-3">Their emotional comfort zone</p>
        <div className="grid grid-cols-1 gap-2">
          {emotionsOptions.map((emotion) => {
            const isSelected = profileData.partnerEmotions?.includes(emotion);
            return (
              <button
                key={emotion}
                onClick={() => handleMultiSelect('partnerEmotions', emotion)}
                className={`p-2 rounded-lg text-sm transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {emotion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Values */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Target className="w-4 h-4 inline mr-2 text-rose-400" />
          What seems most important to them in life? Select all that resonate
        </Label>
        <p className="text-xs text-white/60 mb-3">Their core values based on actions, not just words</p>
        <div className="grid grid-cols-1 gap-2">
          {valuesOptions.map((value) => {
            const isSelected = profileData.partnerValues?.includes(value);
            return (
              <button
                key={value}
                onClick={() => handleMultiSelect('partnerValues', value)}
                className={`p-2 rounded-lg text-sm transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
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
