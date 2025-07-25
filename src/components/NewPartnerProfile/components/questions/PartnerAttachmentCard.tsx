import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_ATTACHMENT_STYLE_OPTIONS } from "../../constants";

const PartnerAttachmentCard = ({ profileData, updateField }: PartnerQuestionCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link className="w-5 h-5 text-blue-400" />
        <Label className="text-base font-medium text-white">
          What's their attachment style (from what you can tell)?
        </Label>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {PARTNER_ATTACHMENT_STYLE_OPTIONS.map((style) => (
          <button
            key={style}
            onClick={() => updateField('partnerAttachmentStyle', style)}
            className={`p-4 rounded-lg text-sm font-medium transition-all hover:scale-[1.01] text-left ${
              profileData.partnerAttachmentStyle === style
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">The psychological patterns that run their relationships</p>
    </div>
  );
};

export default PartnerAttachmentCard;