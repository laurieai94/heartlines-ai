
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfileFormPage1 from "./ProfileForm/ProfileFormPage1";
import ProfileFormPage2 from "./ProfileForm/ProfileFormPage2";
import ProfileFormPage3 from "./ProfileForm/ProfileFormPage3";

interface ProfileFormProps {
  profileType: 'your' | 'partner';
  onClose: () => void;
  onComplete: (profileData: any) => void;
  onBackToDemographics: () => void;
  initialProfiles: { your: any[], partner: any[] };
  initialDemographics: { your: any, partner: any };
}

const ProfileForm = ({ 
  profileType, 
  onClose, 
  onComplete,
  onBackToDemographics,
  initialProfiles,
  initialDemographics
}: ProfileFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [profileData, setProfileData] = useState<any>({});
  const { toast } = useToast();
  
  const profileName = profileType === 'your' ? 
    (initialDemographics.your?.name || 'Your') : 
    (initialDemographics.partner?.name || 'Partner');

  // Initialize with existing profile data if available
  useEffect(() => {
    const existingProfile = initialProfiles[profileType]?.[0] || {};
    console.log('ProfileForm initializing with existing data:', existingProfile);
    setProfileData(existingProfile);
  }, [profileType, initialProfiles]);

  const handlePageData = (pageData: any) => {
    console.log(`ProfileForm received data for page ${currentPage}:`, pageData);
    const updatedData = { ...profileData, ...pageData };
    setProfileData(updatedData);
    console.log('ProfileForm updated profileData:', updatedData);
  };

  const handleComplete = () => {
    console.log('ProfileForm completing with final data:', profileData);
    
    // Ensure we have some core data before completing
    const hasValidData = Object.keys(profileData).length > 0;
    
    if (!hasValidData) {
      toast({
        title: "Profile Incomplete",
        description: "Please fill out at least some profile information before completing.",
        variant: "destructive"
      });
      return;
    }

    // Structure the data in a way that's easy for Kai to access
    const structuredProfile = {
      // Core identity
      name: initialDemographics[profileType]?.name || '',
      age: initialDemographics[profileType]?.age || '',
      pronouns: initialDemographics[profileType]?.pronouns || '',
      
      // Communication patterns
      communicationStyle: profileData.communicationDirectness || '',
      emotionExpression: profileData.emotionExpression || '',
      importantTalkPreference: profileData.importantTalkPreference || '',
      
      // Love languages
      primaryLoveLanguage: Array.isArray(profileData.loveLanguages) ? profileData.loveLanguages[0] : '',
      allLoveLanguages: profileData.loveLanguages || [],
      
      // Conflict and stress responses
      conflictStyle: profileData.conflictResponse || '',
      stressResponse: profileData.stressSupportNeed || '',
      needsSpaceWhenStressed: profileData.stressSpaceNeed || '',
      
      // Attachment patterns
      attachmentSecurity: {
        comfortableWithCloseness: profileData.comfortableClosenessIndependence || '',
        relationshipWorries: profileData.worryRelationshipSecurity || '',
        fearOfHurt: profileData.wantClosenessButFearHurt || ''
      },
      
      // Relationship context
      relationshipLength: profileData.relationshipLength || '',
      relationshipType: profileData.relationshipType || '',
      
      // Growth areas and strengths
      focusAreas: {
        improvingCommunication: profileData.improvingCommunicationFocus || '',
        personalDevelopment: profileData.workingOnPersonalDevelopment || '',
        familyInfluence: profileData.learnedHealthyFromFamily || ''
      },
      
      // Triggers and patterns
      commonTriggers: [
        profileData.beingRushedMakesWorse === 'Strongly Agree' ? 'Being rushed' : null,
        profileData.socialSituationsAnxious === 'Strongly Agree' ? 'Social situations' : null
      ].filter(Boolean),
      
      // Deep insights (all the granular data for Kai's analysis)
      detailedResponses: {
        ...profileData
      },
      
      // Metadata
      profileType,
      completedAt: new Date().toISOString(),
      dataSource: 'ProfileForm'
    };

    console.log('ProfileForm sending structured profile data to parent:', structuredProfile);
    onComplete(structuredProfile);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profileName} Profile - Page {currentPage} of 3
            </h2>
            <p className="text-gray-600 mt-1">
              Help us understand {profileType === 'your' ? 'you' : 'your partner'} better
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {currentPage === 1 && (
            <ProfileFormPage1
              profileType={profileType}
              onComplete={(data) => {
                handlePageData(data);
                setCurrentPage(2);
              }}
              onBack={onBackToDemographics}
              initialData={profileData}
            />
          )}
          
          {currentPage === 2 && (
            <ProfileFormPage2
              profileType={profileType}
              onComplete={(data) => {
                handlePageData(data);
                setCurrentPage(3);
              }}
              onBack={() => setCurrentPage(1)}
              initialData={profileData}
            />
          )}
          
          {currentPage === 3 && (
            <ProfileFormPage3
              profileType={profileType}
              onComplete={(data) => {
                handlePageData(data);
                handleComplete();
              }}
              onBack={() => setCurrentPage(2)}
              initialData={profileData}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileForm;
