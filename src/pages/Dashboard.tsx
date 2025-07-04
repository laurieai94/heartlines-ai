
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import DashboardModals from "@/components/Dashboard/DashboardModals";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showPersonalCompletionOptions, setShowPersonalCompletionOptions] = useState(false);
  
  const { 
    shouldShowSignUpModal, 
    blockingAction, 
    closeSignUpModal,
    accessLevel,
    profileCompletion
  } = useProgressiveAccess();
  
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

  // Prevent body scroll when questionnaire modal is open
  useEffect(() => {
    if (showQuestionnaireModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuestionnaireModal]);

  // Handle redirect from profile completion
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  const handleGoToProfile = () => {
    console.log('Navigating to profile tab');
    setActiveTab("profile");
  };

  const handleGoToCoach = () => {
    console.log('Navigating to coach tab');
    setActiveTab("insights");
  };

  const handleOpenQuestionnaire = () => {
    console.log('Opening questionnaire modal');
    setShowQuestionnaireModal(true);
  };

  const handleQuestionnaireComplete = (questionnaireData: any) => {
    console.log('Personal questionnaire completed with data:', questionnaireData);
    
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...questionnaireData.completionData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    const newProfiles = {
      ...temporaryProfiles,
      your: [mergedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: mergedData
    };
    
    console.log('Saving complete questionnaire data:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    
    setShowQuestionnaireModal(false);
    setShowPersonalCompletionOptions(true);
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaireModal(false);
  };

  const handlePersonalCompletionClose = () => {
    setShowPersonalCompletionOptions(false);
  };

  const handlePersonalAddPartnerProfile = () => {
    setShowPersonalCompletionOptions(false);
  };

  const handlePersonalStartChatting = () => {
    console.log('Starting chat, navigating to coach');
    setShowPersonalCompletionOptions(false);
    setActiveTab("insights");
  };

  const isAnyModalOpen = shouldShowSignUpModal || showQuestionnaireModal || showPersonalCompletionOptions;

  return (
    <NavigationProvider goToProfile={handleGoToProfile} goToCoach={handleGoToCoach}>
      <div className="min-h-screen">
        <div className={`min-h-screen bg-black ${isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
          <div className="w-full">
            <DashboardHeader 
              accessLevel={accessLevel}
              profileCompletion={profileCompletion}
            />
            
            <DashboardTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <DashboardContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            temporaryProfiles={temporaryProfiles}
            temporaryDemographics={temporaryDemographics}
            onProfileUpdate={handleProfileUpdate}
            onOpenQuestionnaire={handleOpenQuestionnaire}
          />
        </div>

        <DashboardModals
          shouldShowSignUpModal={shouldShowSignUpModal}
          blockingAction={blockingAction}
          onCloseSignUpModal={closeSignUpModal}
          showQuestionnaireModal={showQuestionnaireModal}
          onQuestionnaireComplete={handleQuestionnaireComplete}
          onQuestionnaireClose={handleQuestionnaireClose}
          showPersonalCompletionOptions={showPersonalCompletionOptions}
          onPersonalAddPartnerProfile={handlePersonalAddPartnerProfile}
          onPersonalStartChatting={handlePersonalStartChatting}
          onPersonalCompletionClose={handlePersonalCompletionClose}
          hasPartnerProfile={temporaryProfiles.partner.length > 0}
        />
      </div>
    </NavigationProvider>
  );
};

export default Dashboard;
