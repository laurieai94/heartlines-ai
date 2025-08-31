import { Heart } from "lucide-react";
import { PartnerProfileData } from "../../types";
import PartnerLoveLanguageCard from "../questions/PartnerLoveLanguageCard";
import PartnerConflictCard from "../questions/PartnerConflictCard";
import PartnerSelfAwarenessCard from "../questions/PartnerSelfAwarenessCard";
import OptionalGroup from "@/components/NewPersonalQuestionnaire/components/shared/OptionalGroup";

interface PartnerOperationsProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete: () => void;
}

const PartnerOperations = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  onSectionComplete
}: PartnerOperationsProps) => {
  
  return (
    <div className="space-y-5">
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">How They Operate</h2>
        </div>
        <p className="text-white/80">how they love, fight, and show up</p>
      </div>

      <PartnerLoveLanguageCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        isComplete={!!(profileData.partnerLoveLanguage && profileData.partnerLoveLanguage.length > 0)}
      />

      <OptionalGroup title="More about how they operate (optional)">
        <PartnerConflictCard
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
          isComplete={!!(profileData.partnerConflictStyle && profileData.partnerConflictStyle.length > 0)}
        />

        <PartnerSelfAwarenessCard
          profileData={profileData}
          updateField={updateField}
          isComplete={!!profileData.partnerSelfAwareness}
        />
      </OptionalGroup>
    </div>
  );
};

export default PartnerOperations;