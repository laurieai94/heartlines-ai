
import Demographics from "@/components/Demographics";
import ProfileForm from "@/components/ProfileForm";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";

interface ProfileBuilderModalsProps {
  showDemographics: boolean;
  showForm: boolean;
  showPartnerCompletionOptions: boolean;
  activeProfileType: 'your' | 'partner';
  temporaryProfiles: any;
  temporaryDemographics: any;
  onDemographicsComplete: (demographics: any) => void;
  onDemographicsClose: () => void;
  onProfileComplete: (profile: any) => void;
  onFormClose: () => void;
  onPartnerCompletionClose: () => void;
  onPartnerCompletionStartChat: () => void;
}

const ProfileBuilderModals = ({
  showDemographics,
  showForm,
  showPartnerCompletionOptions,
  activeProfileType,
  temporaryProfiles,
  temporaryDemographics,
  onDemographicsComplete,
  onDemographicsClose,
  onProfileComplete,
  onFormClose,
  onPartnerCompletionClose,
  onPartnerCompletionStartChat
}: ProfileBuilderModalsProps) => {
  return (
    <>
      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onComplete={onDemographicsComplete}
          onClose={onDemographicsClose}
          initialData={temporaryDemographics[activeProfileType]}
        />
      )}

      {/* Profile Form Modal */}
      {showForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={onFormClose}
          onComplete={onProfileComplete}
          initialProfiles={temporaryProfiles}
          initialDemographics={temporaryDemographics}
        />
      )}

      {/* Partner Profile Completion Options */}
      {showPartnerCompletionOptions && (
        <ProfileCompletionOptions
          completionType="partner"
          onAddPartnerProfile={() => {}} // Not used for partner completion
          onStartChatting={onPartnerCompletionStartChat}
          onClose={onPartnerCompletionClose}
          hasPartnerProfile={true}
        />
      )}
    </>
  );
};

export default ProfileBuilderModals;
