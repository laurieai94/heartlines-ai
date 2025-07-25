import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_GENDER_OPTIONS } from "../../constants";

const PartnerGenderCard = ({ profileData, updateField, handleMultiSelect }: PartnerQuestionCardProps) => {
  const selectedGenders = profileData.partnerGender || [];
  const showSelfDescribe = selectedGenders.includes("Other");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-purple-400" />
        <Label className="text-base font-medium text-white">What's their gender identity?</Label>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PARTNER_GENDER_OPTIONS.map((gender) => (
          <button
            key={gender}
            onClick={() => handleMultiSelect('partnerGender', gender)}
            className={`p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] text-left ${
              selectedGenders.includes(gender)
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
      
      {showSelfDescribe && (
        <Textarea
          value={profileData.partnerGenderSelfDescribe || ''}
          onChange={(e) => updateField('partnerGenderSelfDescribe', e.target.value)}
          placeholder="Please describe..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 resize-none"
          rows={3}
        />
      )}
      
      <p className="text-sm text-white/60">We know gender isn't just a checkbox</p>
    </div>
  );
};

export default PartnerGenderCard;