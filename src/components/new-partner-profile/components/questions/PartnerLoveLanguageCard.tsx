import QuestionCard from "@/components/new-personal-questionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/new-personal-questionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_LOVE_LANGUAGE_OPTIONS } from "../../constants";
import { usePartnerFlow } from "../../context/FlowContext";
interface PartnerLoveLanguageCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
  onSectionComplete?: () => void;
}
const PartnerLoveLanguageCard = ({
  profileData,
  handleMultiSelect,
  isComplete = false,
  onSectionComplete
}: PartnerLoveLanguageCardProps) => {
  const { goToNext } = usePartnerFlow();
  const questionId = "partner-love-language-question";
  return <QuestionCard questionId={questionId}>
      <Label className="text-sm font-semibold text-white mb-2 block">
        how do they seem to feel most loved? <span className="text-red-400">*</span> <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Heart className="w-3 h-3 text-pink-300" />
        
      </div>
      <MultiSelect options={PARTNER_LOVE_LANGUAGE_OPTIONS} selectedValues={profileData.partnerLoveLanguage || []} onToggle={value => handleMultiSelect('partnerLoveLanguage', value)} />
    </QuestionCard>;
};
export default PartnerLoveLanguageCard;