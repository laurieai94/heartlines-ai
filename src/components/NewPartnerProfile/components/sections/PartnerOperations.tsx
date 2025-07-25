import { PartnerProfileData } from "../../types";
import PartnerLoveLanguageCard from "../questions/PartnerLoveLanguageCard";
import PartnerConflictCard from "../questions/PartnerConflictCard";
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
        <h2 className="text-2xl font-bold text-white mb-2">How They Operate</h2>
        <p className="text-white/70">Understanding their patterns and preferences</p>
      </div>

      <PartnerLoveLanguageCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      <PartnerConflictCard
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      <PartnerSelfAwarenessCard
        profileData={profileData}
        updateField={updateField}
      />
    </div>
  );
};

export default PartnerOperations;