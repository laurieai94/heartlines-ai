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
      case 1: return (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>The Real You</span>
        </div>
      );
      case 2: return (
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          <span>Your Situation</span>
        </div>
      );
      case 3: return (
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Your Vibe</span>
        </div>
      );
      case 4: return (
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>Your Foundation</span>
        </div>
      );
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

  const getSectionGradient = (section: number, isActive: boolean, isCompleted: boolean) => {
    const gradients = {
      1: isActive ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600' : 
         isCompleted ? 'bg-white/15 backdrop-blur-sm border border-white/20' : 
         'bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15',
      2: isActive ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600' : 
         isCompleted ? 'bg-white/15 backdrop-blur-sm border border-white/20' : 
         'bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15',
      3: isActive ? 'bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600' : 
         isCompleted ? 'bg-white/15 backdrop-blur-sm border border-white/20' : 
         'bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15',
      4: isActive ? 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600' : 
         isCompleted ? 'bg-white/15 backdrop-blur-sm border border-white/20' : 
         'bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15'
    };
    return gradients[section];
  };

  const getSectionTextColor = (section: number, isActive: boolean, isCompleted: boolean) => {
    if (isActive) return 'text-white';
    if (isCompleted) return 'text-white';
    return 'text-white/80';
  };

  // Single unified layout with fixed sidebar and proper scroll containment
  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center p-4'} overflow-hidden flex`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-7xl h-[85vh]'} overflow-hidden flex border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        {/* Fixed Sidebar Progress - Always visible */}
        <div className="w-56 bg-white/10 backdrop-blur-xl border-r border-white/15 p-5 flex flex-col flex-shrink-0 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Your Profile</h3>
              <p className="text-xs text-white/70 font-medium">Building your foundation</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
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
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    getSectionGradient(section, isActive, isCompleted)
                  } ${
                    isActive ? 'shadow-lg shadow-rose-500/20' :
                    isCompleted ? 'shadow-md' :
                    isAccessible ? 'hover:shadow-md shadow-sm' : 'opacity-60 cursor-not-allowed'
                  } ${getSectionTextColor(section, isActive, isCompleted)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm leading-tight">{getSectionTitle(section)}</span>
                    {isCompleted && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-white/20' : 'bg-emerald-500'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className={`text-xs font-medium mb-2 ${
                    isActive ? 'text-white/90' : isCompleted ? 'text-current/80' : 'text-gray-500'
                  }`}>
                    {completedCount}/{requiredCount} required
                  </div>
                  <div className={`text-xs leading-relaxed ${
                    isActive ? 'text-white/80' : isCompleted ? 'text-current/70' : 'text-gray-500'
                  }`}>
                    {getSectionDescription(section)}
                  </div>
                </button>
              );
            })}
          </div>

          <Button variant="ghost" onClick={onClose} className="mt-4 text-white/80 hover:text-white hover:bg-white/10 w-full py-2 text-sm">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        {/* Main Content - Only this area scrolls */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Modern Header - Fixed */}
          <div className={`${isModal ? 'p-4' : 'p-6'} border-b border-white/15 bg-white/5 backdrop-blur-sm flex-shrink-0`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`${isModal ? 'text-lg' : 'text-2xl'} font-bold text-white mb-1`}>
                  {getSectionTitle(currentSection)}
                </h2>
                <p className="text-sm text-white/80 font-medium">{getSectionDescription(currentSection)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white/90 font-medium border border-white/15">
                Step {currentSection} of 4
              </div>
            </div>
            <div className="relative">
              <div className={`w-full bg-white/20 rounded-full ${isModal ? 'h-2' : 'h-3'} overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(currentSection / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step}
                    className={`text-xs font-medium ${
                      step <= currentSection ? 'text-orange-300' : 'text-white/50'
                    }`}
                  >
                    {step === 1 ? 'Real' : step === 2 ? 'Situation' : step === 3 ? 'Vibe' : 'Foundation'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area - Only this scrolls */}
          <div className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className={`${isModal ? 'p-4' : 'p-8'} ${isModal ? 'max-w-5xl' : 'max-w-6xl'} mx-auto`}>
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

          {/* Modern Footer - Fixed */}
          <div className={`${isModal ? 'p-4' : 'p-6'} border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0`}>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 1}
              className={`flex items-center gap-2 ${isModal ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-xl border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white`}
            >
              <ArrowLeft className={`${isModal ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Back
            </Button>

            <div className={`bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full ${isModal ? 'text-xs' : 'text-sm'} text-white/90 font-medium border border-white/15`}>
              {getCompletedCount(currentSection)}/{getRequiredCount(currentSection)} required
            </div>

            <div className="flex gap-3">
              {currentSection < 4 && (
                <Button
                  onClick={handleNext}
                  disabled={!validateSection(currentSection)}
                  className={`bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 ${isModal ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100`}
                >
                  Next
                  <ArrowRight className={`${isModal ? 'w-3 h-3' : 'w-4 h-4'}`} />
                </Button>
              )}
              {currentSection === 4 && (
                <Button
                  onClick={handleComplete}
                  disabled={!validateSection(4)}
                  className={`bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 ${isModal ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100`}
                >
                  <Check className={`${isModal ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  {isModal ? 'Complete' : 'Complete Profile'}
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
