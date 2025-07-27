import { TreeDeciduous } from "lucide-react";
import { PartnerProfileData } from "../../types";
import PartnerFamilyDynamicCard from "../questions/PartnerFamilyDynamicCard";
import PartnerAttachmentCard from "../questions/PartnerAttachmentCard";

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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TreeDeciduous className="w-5 h-5 text-rose-400" />
          <h2 className="text-2xl font-bold text-white">Their Foundation</h2>
        </div>
        <p className="text-white/70">The experiences that shaped them</p>
      </div>

      <PartnerFamilyDynamicCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        isComplete={!!(profileData.partnerFamilyStructure && profileData.partnerFamilyStructure.length > 0)}
      />

      <PartnerAttachmentCard
        profileData={profileData}
        updateField={updateField}
        isComplete={!!profileData.partnerAttachmentStyle}
      />
    </div>
  );
};

export default PartnerFoundation;