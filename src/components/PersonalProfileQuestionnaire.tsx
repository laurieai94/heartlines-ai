import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Sparkles, User, Heart, Zap, Award } from "lucide-react";
import { toast } from "sonner";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import QuestionnaireSection1 from "./PersonalProfileQuestionnaire/QuestionnaireSection1";
import QuestionnaireSection2 from "./PersonalProfileQuestionnaire/QuestionnaireSection2";
import QuestionnaireSection3 from "./PersonalProfileQuestionnaire/QuestionnaireSection3";
import QuestionnaireSection4 from "./PersonalProfileQuestionnaire/QuestionnaireSection4";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PersonalProfileQuestionnaireProps) => {
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
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const validateSection = (section: number) => {
    switch (section) {
      case 1: {
        // Now includes pronouns as required field
        const required = ['name', 'pronouns', 'age', 'gender', 'orientation'];
        return required.every(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        });
      }
      case 2: {
        // Only require relationshipStatus - removed whyRealTalk
        const required = ['relationshipStatus'];
        let isValid = required.every(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        });
        
        // Check if user is single/dating (needs additional questions)
        const isSingleOrDating = profileData.relationshipStatus && 
          ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
        
        if (isSingleOrDating) {
          // Require dating challenges and goals for single/dating users
          if (!profileData.datingChallenges || profileData.datingChallenges.length === 0) {
            isValid = false;
          }
          if (!profileData.datingGoals || profileData.datingGoals.length === 0) {
            isValid = false;
          }
        }
        
        // If in a relationship (not single not dating), require relationship details
        if (profileData.relationshipStatus && 
            !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus)) {
          
          // Only require relationship length for defined relationships (not casual/complicated)
          if (!['It\'s complicated'].includes(profileData.relationshipStatus)) {
            if (!profileData.relationshipLength) {
              isValid = false;
            }
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
      case 1: return 5; // Updated to include pronouns
      case 2: {
        let base = 1; // Only relationshipStatus now - removed whyRealTalk
        
        // Add dating-specific requirements
        const isSingleOrDating = profileData.relationshipStatus && 
          ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
        
        if (isSingleOrDating) {
          base += 2; // datingChallenges, datingGoals
        } else if (profileData.relationshipStatus && 
                   !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus)) {
          // Only add relationship length requirement for defined relationships
          if (!['It\'s complicated'].includes(profileData.relationshipStatus)) {
            base += 1; // relationshipLength
          }
          base += 2; // workingWell, feelsDifficult
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
        // Updated to include pronouns
        const fields = ['name', 'pronouns', 'age', 'gender', 'orientation'];
        return fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
      }
      case 2: {
        let fields = ['relationshipStatus']; // Removed whyRealTalk
        let completed = fields.filter(field => {
          const value = profileData[field];
          return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
        }).length;
        
        // Add dating-specific completions
        const isSingleOrDating = profileData.relationshipStatus && 
          ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
        
        if (isSingleOrDating) {
          if (profileData.datingChallenges && profileData.datingChallenges.length > 0) completed++;
          if (profileData.datingGoals && profileData.datingGoals.length > 0) completed++;
        } else if (profileData.relationshipStatus && 
                   !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus)) {
          // Only count relationship length for defined relationships
          if (!['It\'s complicated'].includes(profileData.relationshipStatus)) {
            if (profileData.relationshipLength) completed++;
          }
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
      case 1: return "The Real You";
      case 2: return "Your Situation";
      case 3: return "Your Vibe";
      case 4: return "Your Foundation";
      default: return "";
    }
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-4 h-4" />;
      case 2: return <Heart className="w-4 h-4" />;
      case 3: return <Zap className="w-4 h-4" />;
      case 4: return <Award className="w-4 h-4" />;
      default: return null;
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

  // Optimized layout with horizontal navigation and questions front and center
  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center p-4'} overflow-hidden`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'} overflow-hidden flex flex-col border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        
        {/* Compact Header with Horizontal Navigation */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Personal Profile</h2>
                <p className="text-xs text-white/70">Building your foundation</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Horizontal Section Navigation */}
          <div className="grid grid-cols-4 gap-3 mb-4">
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
                  className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-left ${
                    isActive 
                      ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg' 
                      : isCompleted 
                        ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
                        : isAccessible 
                          ? 'bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/15' 
                          : 'bg-white/5 border border-white/10 text-white/50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getSectionIcon(section)}
                      <span className="font-semibold text-sm">{getSectionTitle(section)}</span>
                    </div>
                    {isCompleted && (
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-white/20' : 'bg-emerald-500'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs opacity-80">
                    {completedCount}/{requiredCount} required
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentSection / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area - Questions Front and Center */}
        <div className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="p-8 max-w-4xl mx-auto">
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
        <div className="p-4 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentSection === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Button>

          <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/90 font-medium border border-white/15">
            {getCompletedCount(currentSection)}/{getRequiredCount(currentSection)} required
          </div>

          <div className="flex gap-3">
            {currentSection < 4 && (
              <Button
                onClick={handleNext}
                disabled={!validateSection(currentSection)}
                className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              >
                Next
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
            {currentSection === 4 && (
              <Button
                onClick={handleComplete}
                disabled={!validateSection(4)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Check className="w-3 h-3" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
