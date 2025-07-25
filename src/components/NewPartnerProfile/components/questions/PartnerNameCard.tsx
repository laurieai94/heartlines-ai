import { Input } from "@/components/ui/input";
import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import { PartnerProfileData } from "../../types";

interface PartnerNameCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
}

const PartnerNameCard = ({ profileData, updateField }: PartnerNameCardProps) => {
  return (
    <QuestionCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What should we call them? <span className="text-rose-400">*</span>
        </h3>
        <p className="text-white/70 text-sm mb-4">
          First names, nicknames, whatever fits.
        </p>
        <Input
          value={profileData.partnerName}
          onChange={(e) => updateField('partnerName', e.target.value)}
          placeholder="Enter their name..."
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-rose-400 focus:ring-rose-400/20"
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerNameCard;