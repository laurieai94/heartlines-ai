import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartnerQuestionCardProps } from "../../types";

const PartnerNameCard = ({ profileData, updateField }: PartnerQuestionCardProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-white">
        What should we call them? <span className="text-red-400">*</span>
      </Label>
      <Input
        value={profileData.partnerName || ''}
        onChange={(e) => updateField('partnerName', e.target.value)}
        placeholder="Their name or nickname..."
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 text-base p-3 h-12 font-medium focus:border-white/40"
      />
      <p className="text-sm text-white/60">First names, nicknames, whatever fits.</p>
    </div>
  );
};

export default PartnerNameCard;