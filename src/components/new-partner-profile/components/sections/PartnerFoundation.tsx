
import { PartnerProfileData } from "../../types";
import PartnerHeartbreakBetrayalCard from "../questions/PartnerHeartbreakBetrayalCard";
import PartnerFamilyDynamicCard from "../questions/PartnerFamilyDynamicCard";
import PartnerAttachmentCard from "../questions/PartnerAttachmentCard";
import OptionalGroup from "@/components/new-personal-questionnaire/components/shared/OptionalGroup";

interface PartnerFoundationProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete: () => void;
}

const PartnerFoundation = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  onSectionComplete
}: PartnerFoundationProps) => {
  
  return (
    <div className="space-y-4 transition-opacity duration-300 opacity-100">
      <PartnerAttachmentCard
        profileData={profileData}
        updateField={updateField}
        isComplete={!!profileData.partnerAttachmentStyle}
        onSectionComplete={onSectionComplete}
      />

      <OptionalGroup 
        id="partner-foundation-optional-group"
        title="Share a few details about their vibe and your dynamic"
      >
        <PartnerHeartbreakBetrayalCard
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
          isComplete={!!(profileData.partnerHeartbreakBetrayal && profileData.partnerHeartbreakBetrayal.length > 0)}
        />

        <PartnerFamilyDynamicCard
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
          isComplete={!!(profileData.partnerFamilyStructure && profileData.partnerFamilyStructure.length > 0)}
        />
      </OptionalGroup>
    </div>
  );
};

export default PartnerFoundation;
