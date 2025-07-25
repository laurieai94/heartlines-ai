import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_ORIENTATION_OPTIONS } from "../../constants";

const PartnerOrientationCard = ({ profileData, updateField, handleMultiSelect }: PartnerQuestionCardProps) => {
  const selectedOrientations = profileData.partnerOrientation || [];
  const showSelfDescribe = selectedOrientations.includes("Other");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Heart className="w-5 h-5 text-pink-400" />
        <Label className="text-base font-medium text-white">What's their sexual orientation?</Label>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PARTNER_ORIENTATION_OPTIONS.map((orientation) => (
          <button
            key={orientation}
            onClick={() => handleMultiSelect('partnerOrientation', orientation)}
            className={`p-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] text-left ${
              selectedOrientations.includes(orientation)
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {orientation}
          </button>
        ))}
      </div>
      
      {showSelfDescribe && (
        <Textarea
          value={profileData.partnerOrientationSelfDescribe || ''}
          onChange={(e) => updateField('partnerOrientationSelfDescribe', e.target.value)}
          placeholder="Please describe..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 resize-none"
          rows={3}
        />
      )}
      
      <p className="text-sm text-white/60">Because who we love shapes how we show up</p>
    </div>
  );
};

export default PartnerOrientationCard;