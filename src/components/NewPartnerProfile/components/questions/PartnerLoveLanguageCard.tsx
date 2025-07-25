import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import { PARTNER_LOVE_LANGUAGES_OPTIONS } from "../../constants";

const PartnerLoveLanguageCard = ({ profileData, handleMultiSelect }: PartnerQuestionCardProps) => {
  const selectedLoveLanguages = profileData.partnerLoveLanguages || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Heart className="w-5 h-5 text-rose-400" />
        <Label className="text-base font-medium text-white">
          How do they seem to feel most loved? <span className="text-sm text-white/70">Select all that resonate</span>
        </Label>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PARTNER_LOVE_LANGUAGES_OPTIONS.map((language) => (
          <button
            key={language}
            onClick={() => handleMultiSelect('partnerLoveLanguages', language)}
            className={`p-4 rounded-lg text-sm font-medium transition-all hover:scale-[1.01] text-left ${
              selectedLoveLanguages.includes(language)
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {language}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/60">Knowing this helps us actually know what they need</p>
    </div>
  );
};

export default PartnerLoveLanguageCard;