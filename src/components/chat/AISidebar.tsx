
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useSidebarModals } from "@/hooks/useSidebarModals";
import SidebarContent from '../sidebar/SidebarContent';
import SidebarModals from '../sidebar/SidebarModals';

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
  onOpenProfileForm?: (profileType: 'your' | 'partner') => void;
  onStartConversation?: (starter: string) => void;
}

const AISidebar = ({ 
  profiles, 
  demographicsData, 
  chatHistory, 
  isConfigured, 
  onSupabaseConfigured
}: AISidebarProps) => {
  const {
    showProfileViewer,
    viewingProfileType,
    showProfileForm,
    showDemographics,
    activeProfileType,
    closeProfileViewer,
    closeProfileForm,
    closeDemographics,
    editProfile,
    backToDemographics
  } = useSidebarModals();

  return (
    <>
      <SidebarContent
        isConfigured={isConfigured}
        onSupabaseConfigured={onSupabaseConfigured}
      />

      <SidebarModals
        profiles={profiles}
        demographicsData={demographicsData}
        showProfileViewer={showProfileViewer}
        viewingProfileType={viewingProfileType}
        showProfileForm={showProfileForm}
        showDemographics={showDemographics}
        activeProfileType={activeProfileType}
        onEditProfile={editProfile}
        onCloseProfileViewer={closeProfileViewer}
        onCloseDemographics={closeDemographics}
        onCloseProfileForm={closeProfileForm}
        onBackToDemographics={backToDemographics}
      />
    </>
  );
};

export default AISidebar;
