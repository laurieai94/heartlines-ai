import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_AGE_OPTIONS } from "../../constants";

const PartnerAgeCard = ({ profileData, updateField }: PartnerQuestionCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-orange-400" />
        <Label className="text-base font-medium text-white">What's their age?</Label>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {PARTNER_AGE_OPTIONS.map((age) => (
          <button
            key={age}
            onClick={() => updateField('partnerAge', age)}
            className={`p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] ${
              profileData.partnerAge === age
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {age}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">Different stages = different relationship vibes</p>
    </div>
  );
};

export default PartnerAgeCard;