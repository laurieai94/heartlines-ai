
import { TreeDeciduous } from "lucide-react";
import { PartnerProfileData } from "../../types";
import PartnerHeartbreakBetrayalCard from "../questions/PartnerHeartbreakBetrayalCard";
import PartnerFamilyDynamicCard from "../questions/PartnerFamilyDynamicCard";
import PartnerAttachmentCard from "../questions/PartnerAttachmentCard";
import OptionalGroup from "@/components/NewPersonalQuestionnaire/components/shared/OptionalGroup";

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
    <div className="space-y-5">
      {/* Section Header */}
      <div className="py-1 bg-transparent">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TreeDeciduous className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold text-white">Their Foundation</h2>
          </div>
          <p className="text-white/70 hidden sm:block">early scripts, family stuff & emotional wiring</p>
        </div>
      </div>

      <PartnerAttachmentCard
        profileData={profileData}
        updateField={updateField}
        isComplete={!!profileData.partnerAttachmentStyle}
      />

      <OptionalGroup 
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
