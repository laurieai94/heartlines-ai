
import { ProfileData, DemographicsData } from '@/types/AIInsights';
import { useTemporaryProfile } from '@/hooks/useTemporaryProfile';
import ProfileViewer from '../profile/ProfileViewer';
import Demographics from '../demographics';
import ProfileForm from '../profile-form';

interface SidebarModalsProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  showProfileViewer: boolean;
  viewingProfileType: 'your' | 'partner';
  showProfileForm: boolean;
  showDemographics: boolean;
  activeProfileType: 'your' | 'partner';
  onEditProfile: () => void;
  onCloseProfileViewer: () => void;
  onCloseDemographics: () => void;
  onCloseProfileForm: () => void;
  onBackToDemographics: () => void;
}

const SidebarModals = ({
  profiles,
  demographicsData,
  showProfileViewer,
  viewingProfileType,
  showProfileForm,
  showDemographics,
  activeProfileType,
  onEditProfile,
  onCloseProfileViewer,
  onCloseDemographics,
  onCloseProfileForm,
  onBackToDemographics
}: SidebarModalsProps) => {
  const { updateTemporaryProfile } = useTemporaryProfile();

  const handleProfileComplete = (profileData: any) => {
    onCloseProfileForm();
  };

  const handleDemographicsComplete = (demographics: any) => {
    const newDemographics = {
      ...demographicsData,
      [activeProfileType]: demographics
    };
    updateTemporaryProfile(profiles, newDemographics);
    
    onCloseDemographics();
    // Note: Profile form opening logic would be handled by parent component
  };

  return (
    <>
      {/* Profile Viewer Modal */}
      {showProfileViewer && (
        <ProfileViewer
          profileType={viewingProfileType}
          profileData={profiles[viewingProfileType]}
          demographicsData={demographicsData[viewingProfileType]}
          onEdit={onEditProfile}
          onClose={onCloseProfileViewer}
        />
      )}

      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={onCloseDemographics}
          onComplete={handleDemographicsComplete}
          initialData={demographicsData[activeProfileType]}
        />
      )}
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={onCloseProfileForm}
          onComplete={handleProfileComplete}
          onBackToDemographics={onBackToDemographics}
          initialProfiles={profiles}
          initialDemographics={demographicsData}
        />
      )}
    </>
  );
};

export default SidebarModals;
