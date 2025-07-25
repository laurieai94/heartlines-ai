import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_FAMILY_DYNAMIC_OPTIONS } from "../../constants";

const PartnerFamilyDynamicCard = ({ profileData, handleMultiSelect }: PartnerQuestionCardProps) => {
  const selectedFamilyDynamics = profileData.partnerFamilyDynamic || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Home className="w-5 h-5 text-green-400" />
        <Label className="text-base font-medium text-white">
          What was their family dynamic growing up? <span className="text-sm text-white/70">Select all that resonate</span>
        </Label>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {PARTNER_FAMILY_DYNAMIC_OPTIONS.map((dynamic) => (
          <button
            key={dynamic}
            onClick={() => handleMultiSelect('partnerFamilyDynamic', dynamic)}
            className={`p-4 rounded-lg text-sm font-medium transition-all hover:scale-[1.01] text-left ${
              selectedFamilyDynamics.includes(dynamic)
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {dynamic}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">This literally programmed their relationship blueprints</p>
    </div>
  );
};

export default PartnerFamilyDynamicCard;