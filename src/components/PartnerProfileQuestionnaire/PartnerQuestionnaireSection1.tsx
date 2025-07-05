
import { User, Calendar, Users, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartnerQuestionnaireSection1Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const PartnerQuestionnaireSection1 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerQuestionnaireSection1Props) => {
  if (!isReady) return null;

  const ageOptions = ["Under 18", "18-24", "25-29", "30-34", "35-39", "40-49", "50-60", "65+", "Prefer not to say"];
  const pronounsOptions = ["She/her", "He/him", "They/them", "Ze/zir", "Multiple sets", "Use their name", "Other", "Not sure/haven't asked yet"];
  const orientationOptions = ["Straight/Heterosexual", "Gay", "Lesbian", "Bisexual", "Pansexual", "Queer", "Asexual", "Questioning", "Prefer to self-describe", "Not sure/haven't discussed"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <User className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">The Basics</h3>
        </div>
        <p className="text-sm text-white/70">Getting to know the essentials</p>
      </div>

      {/* Partner Name */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <User className="w-4 h-4 inline mr-2 text-rose-400" />
          What should we call them?
        </Label>
        <p className="text-xs text-white/60 mb-3">Their name or whatever you call them</p>
        <Input
          value={profileData.partnerName || ''}
          onChange={(e) => updateField('partnerName', e.target.value)}
          placeholder="Enter their name..."
          className="bg-white/5 border-white/20 text-white placeholder-white/40"
        />
      </div>

      {/* Partner Age */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Calendar className="w-4 h-4 inline mr-2 text-rose-400" />
          How old are they?
        </Label>
        <p className="text-xs text-white/60 mb-3">Different life stages = different relationship vibes</p>
        <div className="grid grid-cols-3 gap-2">
          {ageOptions.map((age) => (
            <button
              key={age}
              onClick={() => updateField('partnerAge', age)}
              className={`p-2 rounded-lg text-sm transition-all ${
                profileData.partnerAge === age
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Pronouns */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Users className="w-4 h-4 inline mr-2 text-rose-400" />
          What pronouns do they use?
        </Label>
        <p className="text-xs text-white/60 mb-3">So RealTalk doesn't misgender them</p>
        <div className="grid grid-cols-2 gap-2">
          {pronounsOptions.map((pronoun) => (
            <button
              key={pronoun}
              onClick={() => updateField('partnerPronouns', pronoun)}
              className={`p-2 rounded-lg text-sm transition-all ${
                profileData.partnerPronouns === pronoun
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              {pronoun}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Orientation */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Heart className="w-4 h-4 inline mr-2 text-rose-400" />
          What's their sexual orientation? Select all that fit
        </Label>
        <p className="text-xs text-white/60 mb-3">Helps us get the full picture</p>
        <div className="grid grid-cols-2 gap-2">
          {orientationOptions.map((orientation) => {
            const isSelected = profileData.partnerOrientation?.includes(orientation);
            return (
              <button
                key={orientation}
                onClick={() => handleMultiSelect('partnerOrientation', orientation)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {orientation}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSection1;
