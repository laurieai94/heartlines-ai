import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_CONFLICT_STYLE_OPTIONS } from "../../constants";

const PartnerConflictCard = ({ profileData, handleMultiSelect }: PartnerQuestionCardProps) => {
  const selectedConflictStyles = profileData.partnerConflictStyle || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-yellow-400" />
        <Label className="text-base font-medium text-white">
          How do they usually handle conflict? <span className="text-sm text-white/70">Select all that resonate</span>
        </Label>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PARTNER_CONFLICT_STYLE_OPTIONS.map((style) => (
          <button
            key={style}
            onClick={() => handleMultiSelect('partnerConflictStyle', style)}
            className={`p-4 rounded-lg text-sm font-medium transition-all hover:scale-[1.01] text-left ${
              selectedConflictStyles.includes(style)
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">How they fight determines if your relationship will make it</p>
    </div>
  );
};

export default PartnerConflictCard;