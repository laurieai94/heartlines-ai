import { TreeDeciduous } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import PartnerFamilyDynamicCard from "../questions/PartnerFamilyDynamicCard";
import PartnerAttachmentCard from "../questions/PartnerAttachmentCard";

interface PartnerFoundationProps extends PartnerQuestionCardProps {
  isReady: boolean;
}

const PartnerFoundation = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerFoundationProps) => {
  if (!isReady) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white/15 backdrop-blur-lg rounded-xl border border-white/25 p-6">
        <div className="flex items-center gap-3 mb-6">
          <TreeDeciduous className="w-5 h-5 text-rose-400" />
          <h3 className="text-xl font-semibold text-white">Their Foundation</h3>
        </div>
        
        <div className="space-y-8">
          <PartnerFamilyDynamicCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
          
          <PartnerAttachmentCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerFoundation;