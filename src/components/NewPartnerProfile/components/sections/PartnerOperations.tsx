import { Heart } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import PartnerLoveLanguageCard from "../questions/PartnerLoveLanguageCard";
import PartnerConflictCard from "../questions/PartnerConflictCard";
import PartnerSelfAwarenessCard from "../questions/PartnerSelfAwarenessCard";

interface PartnerOperationsProps extends PartnerQuestionCardProps {
  isReady: boolean;
}

const PartnerOperations = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerOperationsProps) => {
  if (!isReady) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white/15 backdrop-blur-lg rounded-xl border border-white/25 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-5 h-5 text-rose-400" />
          <h3 className="text-xl font-semibold text-white">How They Operate</h3>
        </div>
        
        <div className="space-y-8">
          <PartnerLoveLanguageCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
          
          <PartnerConflictCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
          
          <PartnerSelfAwarenessCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerOperations;