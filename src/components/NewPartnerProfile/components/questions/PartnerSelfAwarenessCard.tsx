import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_SELF_AWARENESS_OPTIONS } from "../../constants";

const PartnerSelfAwarenessCard = ({ profileData, updateField }: PartnerQuestionCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Brain className="w-5 h-5 text-indigo-400" />
        <Label className="text-base font-medium text-white">
          How self-aware are they about their relationship patterns?
        </Label>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {PARTNER_SELF_AWARENESS_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => updateField('partnerSelfAwareness', option)}
            className={`p-4 rounded-lg text-sm font-medium transition-all hover:scale-[1.01] text-left ${
              profileData.partnerSelfAwareness === option
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">Be honest — growth isn't always linear.</p>
    </div>
  );
};

export default PartnerSelfAwarenessCard;