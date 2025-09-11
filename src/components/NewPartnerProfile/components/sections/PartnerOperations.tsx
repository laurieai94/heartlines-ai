
import { PartnerProfileData } from "../../types";
import PartnerLoveLanguageCard from "../questions/PartnerLoveLanguageCard";
import PartnerConflictCard from "../questions/PartnerConflictCard";
import PartnerSelfAwarenessCard from "../questions/PartnerSelfAwarenessCard";
import PartnerCommunicationResponseCard from "../questions/PartnerCommunicationResponseCard";
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
    <div className="space-y-4 transition-opacity duration-300 opacity-100">
      <PartnerLoveLanguageCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        isComplete={!!(profileData.partnerLoveLanguage && profileData.partnerLoveLanguage.length > 0)}
        onSectionComplete={onSectionComplete}
      />

      <OptionalGroup 
        title="Share a few details about their vibe and your dynamic"
      >
        <PartnerCommunicationResponseCard
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
          isComplete={!!(profileData.partnerCommunicationResponse && profileData.partnerCommunicationResponse.length > 0)}
        />

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
