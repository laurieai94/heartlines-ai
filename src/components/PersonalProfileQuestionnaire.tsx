
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import QuestionnaireSection1 from "./PersonalProfileQuestionnaire/QuestionnaireSection1";
import QuestionnaireSection2 from "./PersonalProfileQuestionnaire/QuestionnaireSection2";
import QuestionnaireSection3 from "./PersonalProfileQuestionnaire/QuestionnaireSection3";
import QuestionnaireSection4 from "./PersonalProfileQuestionnaire/QuestionnaireSection4";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
}

interface ProfileData {
  name?: string;
  age?: string;
  gender?: string[];
  orientation?: string[];
  profilePhoto?: string;
  relationshipStatus?: string;
  relationshipLength?: string;
  whyRealTalk?: string[];
  biggestChallenge?: string[];
  workingWell?: string[];
  feelsDifficult?: string[];
  stressResponse?: string[];
  conflictNeeds?: string[];
  feelLovedWhen?: string[];
  attachmentStyle?: string;
  familyDynamics?: string[];
  parentConflictStyle?: string[];
  loveMessages?: string[];
  loveInfluences?: string[];
  mentalHealthContext?: string;
  growthAreas?: string[];
  [key: string]: any;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose }: PersonalProfileQuestionnaireProps) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  const [currentSection, setCurrentSection] = useState(1);
  
  // Initialize profile data from existing data
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const existingProfile = temporaryProfiles.your?.[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    return { ...existingProfile, ...existingDemographics };
  });
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  // Auto-save profile data every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(profileData).length > 0) {
        const newProfiles = {
          ...temporaryProfiles,
          your: [profileData]
        };
        const newDemographics = {
          ...temporaryDemographics,
          your: profileData
        };
        updateTemporaryProfile(newProfiles, newDemographics);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profileData, temporaryProfiles, temporaryDemographics, updateTemporaryProfile]);

  const updateField = (field: string, value: any) => {
    setProfileData(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  const handleMultiSelect = (field: string, value: string) => {
    setProfileData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateSection = (section: number) => {
    switch (section) {
      case 1: {
        const required = ['name', 'age', 'gender', 'orientation'];
        return required.every(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        });
      }
      case 2: {
        const required = ['relationshipStatus', 'whyRealTalk', 'biggestChallenge'];
        const isValid = required.every(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        });
        
        if (profileData.relationshipStatus && 
            !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus) &&
            !profileData.relationshipLength) {
          return false;
        }
        
        return isValid;
      }
      case 3: {
        const required = ['stressResponse', 'conflictNeeds', 'feelLovedWhen', 'attachmentStyle'];
        return required.every(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        });
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateSection(currentSection)) {
      toast.error("Please complete all required questions in this section");
      return;
    }

    if (currentSection < 4) {
      const nextSection = currentSection + 1;
      setSectionReadiness(prev => ({ ...prev, [nextSection]: true }));
      setCurrentSection(nextSection);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      type: 'personal',
      completionData: profileData
    });
  };

  const getRequiredCount = (section: number) => {
    switch (section) {
      case 1: return 4;
      case 2: return profileData.relationshipStatus && 
                    !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus) 
                    ? 4 : 3;
      case 3: return 4;
      default: return 0;
    }
  };

  const getCompletedCount = (section: number) => {
    switch (section) {
      case 1: {
        const fields = ['name', 'age', 'gender', 'orientation'];
        return fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
      }
      case 2: {
        let fields = ['relationshipStatus', 'whyRealTalk', 'biggestChallenge'];
        if (profileData.relationshipStatus && 
            !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus)) {
          fields.push('relationshipLength');
        }
        return fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
      }
      case 3: {
        const fields = ['stressResponse', 'conflictNeeds', 'feelLovedWhen', 'attachmentStyle'];
        return fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
      }
      default: return 0;
    }
  };

  const getSectionTitle = (section: number) => {
    switch (section) {
      case 1: return "Who You Are";
      case 2: return "Your Relationship World";
      case 3: return "How You Operate";
      case 4: return "Your Foundation";
      default: return "";
    }
  };

  const isSection3Complete = validateSection(3);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex">
        {/* Compact Sidebar Progress */}
        <div className="w-48 bg-gradient-to-b from-rose-50 to-pink-50 border-r p-3 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Your Profile</h3>
              <p className="text-xs text-gray-600">Building your foundation</p>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {[1, 2, 3, 4].map((section) => {
              const isActive = section === currentSection;
              const isCompleted = section < currentSection || (section <= 3 && validateSection(section));
              const isAccessible = sectionReadiness[section];
              const requiredCount = getRequiredCount(section);
              const completedCount = getCompletedCount(section);

              return (
                <button
                  key={section}
                  onClick={() => isAccessible && setCurrentSection(section)}
                  disabled={!isAccessible}
                  className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : isAccessible
                          ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Section {section}</span>
                    {isCompleted && <Check className="w-4 h-4" />}
                  </div>
                  <div className="text-xs opacity-90 mb-1">{getSectionTitle(section)}</div>
                  {section <= 3 && (
                    <div className="text-xs opacity-75">
                      {completedCount}/{requiredCount} required
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <Button variant="ghost" onClick={onClose} className="mt-3 text-gray-500 hover:text-gray-700 w-full py-2">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Compact Header */}
          <div className="p-3 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">
                {getSectionTitle(currentSection)}
              </h2>
              <div className="text-sm text-gray-600">
                Step {currentSection} of 4
              </div>
            </div>
            <Progress 
              value={(currentSection / 4) * 100} 
              className="h-1.5" 
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-6xl mx-auto">
              <QuestionnaireSection1 
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isReady={sectionReadiness[1] && currentSection === 1}
              />
              <QuestionnaireSection2 
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isReady={sectionReadiness[2] && currentSection === 2}
              />
              <QuestionnaireSection3 
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isReady={sectionReadiness[3] && currentSection === 3}
              />
              <QuestionnaireSection4 
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isReady={sectionReadiness[4] && currentSection === 4}
              />
            </div>
          </div>

          {/* Compact Footer */}
          <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 1}
              className="flex items-center gap-2 px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-xs text-gray-500">
              {currentSection <= 3 && (
                <>Progress: {getCompletedCount(currentSection)}/{getRequiredCount(currentSection)} required</>
              )}
            </div>

            <div className="flex gap-2">
              {currentSection < 3 && (
                <Button
                  onClick={handleNext}
                  disabled={!validateSection(currentSection)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex items-center gap-2 px-4 py-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {currentSection === 3 && validateSection(3) && (
                <Button
                  onClick={() => {
                    setSectionReadiness(prev => ({ ...prev, 4: true }));
                    setCurrentSection(4);
                  }}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex items-center gap-2 px-4 py-2"
                >
                  Continue Optional
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {currentSection === 3 && validateSection(3) && (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white flex items-center gap-2 px-4 py-2"
                >
                  <Check className="w-4 h-4" />
                  Complete Profile
                </Button>
              )}
              {currentSection === 4 && (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white flex items-center gap-2 px-4 py-2"
                >
                  <Check className="w-4 h-4" />
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
