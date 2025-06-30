
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import QuestionnaireSection1 from "./PersonalProfileQuestionnaire/QuestionnaireSection1";
import QuestionnaireSection2 from "./PersonalProfileQuestionnaire/QuestionnaireSection2";
import QuestionnaireSection3 from "./PersonalProfileQuestionnaire/QuestionnaireSection3";
import QuestionnaireSection4 from "./PersonalProfileQuestionnaire/QuestionnaireSection4";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose }: PersonalProfileQuestionnaireProps) => {
  const { profileData, isLoading, updateField, handleMultiSelect } = usePersonalProfileData();
  const [currentSection, setCurrentSection] = useState(1);
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

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
        const required = ['relationshipStatus', 'whyRealTalk'];
        let isValid = required.every(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        });
        
        // If in a relationship, require relationship length and relationship details
        if (profileData.relationshipStatus && 
            !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus)) {
          if (!profileData.relationshipLength) {
            isValid = false;
          }
          // Require at least one selection for both working well and feels difficult
          if (!profileData.workingWell || profileData.workingWell.length === 0) {
            isValid = false;
          }
          if (!profileData.feelsDifficult || profileData.feelsDifficult.length === 0) {
            isValid = false;
          }
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
      case 4: {
        // Make foundation section required - at least one field must be filled
        const optionalFields = ['familyDynamics', 'parentConflictStyle', 'loveMessages', 'loveInfluences'];
        return optionalFields.some(field => {
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
    if (!validateSection(4)) {
      toast.error("Please answer at least one question in Your Foundation section");
      return;
    }

    const completedData = {
      ...profileData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    onComplete({
      type: 'personal',
      completionData: completedData
    });
  };

  const getRequiredCount = (section: number) => {
    switch (section) {
      case 1: return 4;
      case 2: {
        let base = 2; // relationshipStatus, whyRealTalk
        if (profileData.relationshipStatus && 
            !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus)) {
          base += 3; // relationshipLength, workingWell, feelsDifficult
        }
        return base;
      }
      case 3: return 4;
      case 4: return 1; // At least one field required
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
        let fields = ['relationshipStatus', 'whyRealTalk'];
        let completed = fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
        
        if (profileData.relationshipStatus && 
            !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus)) {
          if (profileData.relationshipLength) completed++;
          if (profileData.workingWell && profileData.workingWell.length > 0) completed++;
          if (profileData.feelsDifficult && profileData.feelsDifficult.length > 0) completed++;
        }
        
        return completed;
      }
      case 3: {
        const fields = ['stressResponse', 'conflictNeeds', 'feelLovedWhen', 'attachmentStyle'];
        return fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
      }
      case 4: {
        const fields = ['familyDynamics', 'parentConflictStyle', 'loveMessages', 'loveInfluences'];
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
      case 1: return "About You ✨";
      case 2: return "Your Situation 💕";
      case 3: return "Your Vibe 🧠";
      case 4: return "Your Foundation 🌱";
      default: return "";
    }
  };

  const getSectionDescription = (section: number) => {
    switch (section) {
      case 1: return "The essentials we need to know";
      case 2: return "What's your relationship status rn";
      case 3: return "How you handle conflict and connection";
      case 4: return "What shaped your love style";
      default: return "";
    }
  };

  const handleSectionClick = (section: number) => {
    const isAccessible = sectionReadiness[section];
    const isCompleted = section < currentSection || validateSection(section);
    
    if (isAccessible || isCompleted) {
      setCurrentSection(section);
      // Make sure the section is accessible
      setSectionReadiness(prev => ({ ...prev, [section]: true }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex">
        {/* Compact Sidebar Progress */}
        <div className="w-56 bg-gradient-to-b from-rose-50 to-pink-50 border-r p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Your Profile</h3>
              <p className="text-xs text-gray-600">Building your foundation</p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {[1, 2, 3, 4].map((section) => {
              const isActive = section === currentSection;
              const isCompleted = section < currentSection || validateSection(section);
              const isAccessible = sectionReadiness[section] || isCompleted;
              const requiredCount = getRequiredCount(section);
              const completedCount = getCompletedCount(section);

              return (
                <button
                  key={section}
                  onClick={() => handleSectionClick(section)}
                  disabled={!isAccessible}
                  className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : isAccessible
                          ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{getSectionTitle(section)}</span>
                    {isCompleted && <Check className="w-4 h-4" />}
                  </div>
                  <div className="text-xs opacity-75 mb-1">
                    {completedCount}/{requiredCount} required
                  </div>
                  <div className="text-xs opacity-75 text-left">
                    {getSectionDescription(section)}
                  </div>
                </button>
              );
            })}
          </div>

          <Button variant="ghost" onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700 w-full py-2">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Compact Header */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {getSectionTitle(currentSection)}
                </h2>
                <p className="text-sm text-gray-600">{getSectionDescription(currentSection)}</p>
              </div>
              <div className="text-sm text-gray-600">
                Step {currentSection} of 4
              </div>
            </div>
            <Progress 
              value={(currentSection / 4) * 100} 
              className="h-2" 
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
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
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
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
              Progress: {getCompletedCount(currentSection)}/{getRequiredCount(currentSection)} required
            </div>

            <div className="flex gap-2">
              {currentSection < 4 && (
                <Button
                  onClick={handleNext}
                  disabled={!validateSection(currentSection)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex items-center gap-2 px-4 py-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {currentSection === 4 && (
                <Button
                  onClick={handleComplete}
                  disabled={!validateSection(4)}
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
