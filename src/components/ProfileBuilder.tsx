
import { toast } from "sonner";
import ProfileBuilderHeader from "@/components/ProfileBuilder/ProfileBuilderHeader";
import ProfileBuilderContent from "@/components/ProfileBuilder/ProfileBuilderContent";
import ProfileBuilderModals from "@/components/ProfileBuilder/ProfileBuilderModals";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

interface ProfileBuilderProps {
  onProfileUpdate?: (newProfiles: any, newDemographics: any) => void;
  initialProfiles?: {your: any[], partner: any[]};
  initialDemographics?: {your: any, partner: any};
  onOpenQuestionnaire?: () => void;
  onOpenPartnerQuestionnaire?: () => void;
}

const ProfileBuilder = ({ 
  onProfileUpdate, 
  initialProfiles = { your: [], partner: [] }, 
  initialDemographics = { your: null, partner: null },
  onOpenQuestionnaire,
  onOpenPartnerQuestionnaire
}: ProfileBuilderProps) => {
  // Use centralized progress tracking and temporary profile data
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile, isLoaded } = useTemporaryProfile();
  const { calculateYourCompletion, calculatePartnerCompletion } = useProfileCompletion();

  const yourProfileCompletion = calculateYourCompletion();
  const partnerProfileCompletion = calculatePartnerCompletion();

  const handleStartPersonalProfile = () => {
    console.log('handleStartPersonalProfile called, onOpenQuestionnaire exists:', !!onOpenQuestionnaire);
    // Call the callback to open the questionnaire modal in Dashboard
    if (onOpenQuestionnaire) {
      onOpenQuestionnaire();
    } else {
      console.error('onOpenQuestionnaire callback not provided');
    }
  };

  const handleStartPartnerProfile = () => {
    console.log('handleStartPartnerProfile called, onOpenPartnerQuestionnaire exists:', !!onOpenPartnerQuestionnaire);
    // Call the callback to open the partner questionnaire modal in Dashboard
    if (onOpenPartnerQuestionnaire) {
      onOpenPartnerQuestionnaire();
    } else {
      console.error('onOpenPartnerQuestionnaire callback not provided');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Main Header - Compact */}
      <ProfileBuilderHeader />

      {/* Main Content Area - Scrollable */}
      <ProfileBuilderContent
        yourProfileCompletion={yourProfileCompletion}
        partnerProfileCompletion={partnerProfileCompletion}
        onStartPersonalProfile={handleStartPersonalProfile}
        onStartPartnerProfile={handleStartPartnerProfile}
      />

      {/* Modals */}
      <ProfileBuilderModals
        temporaryProfiles={temporaryProfiles}
        temporaryDemographics={temporaryDemographics}
        onProfileUpdate={onProfileUpdate}
        updateTemporaryProfile={updateTemporaryProfile}
      />
    </div>
  );
};

export default ProfileBuilder;
