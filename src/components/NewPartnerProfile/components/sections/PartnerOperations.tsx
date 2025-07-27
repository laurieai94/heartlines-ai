import { Heart } from "lucide-react";
import { PartnerProfileData } from "../../types";
import PartnerLoveLanguageCard from "../questions/PartnerLoveLanguageCard";
import PartnerConflictCard from "../questions/PartnerConflictCard";
import PartnerCommunicationResponseCard from "../questions/PartnerCommunicationResponseCard";
import PartnerSelfAwarenessCard from "../questions/PartnerSelfAwarenessCard";

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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h2 className="text-2xl font-bold text-white">How They Operate</h2>
        </div>
        <p className="text-white/70">Understanding their patterns and preferences</p>
      </div>

      <PartnerLoveLanguageCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        isComplete={!!(profileData.partnerLoveLanguage && profileData.partnerLoveLanguage.length > 0)}
      />

      <PartnerConflictCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        isComplete={!!(profileData.partnerConflictStyle && profileData.partnerConflictStyle.length > 0)}
      />

      <PartnerCommunicationResponseCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        isComplete={!!(profileData.partnerCommunicationResponse && profileData.partnerCommunicationResponse.length > 0)}
      />

      <PartnerSelfAwarenessCard
        profileData={profileData}
        updateField={updateField}
        isComplete={!!profileData.partnerSelfAwareness}
      />
    </div>
  );
};

export default PartnerOperations;