import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_PRONOUNS_OPTIONS } from "../../constants";

const PartnerPronounsCard = ({ profileData, updateField }: PartnerQuestionCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserCheck className="w-5 h-5 text-blue-400" />
        <Label className="text-base font-semibold text-white">
          What pronouns do they use? <span className="text-red-400">*</span>
        </Label>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PARTNER_PRONOUNS_OPTIONS.map((pronoun) => (
          <button
            key={pronoun}
            onClick={() => updateField('partnerPronouns', pronoun)}
            className={`p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] text-left ${
              profileData.partnerPronouns === pronoun
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {pronoun}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">So we refer to them right.</p>
    </div>
  );
};

export default PartnerPronounsCard;