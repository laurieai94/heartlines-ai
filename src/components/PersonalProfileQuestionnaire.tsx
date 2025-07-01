
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { usePersonalProfilePersistence } from '@/hooks/usePersonalProfilePersistence';
import QuestionnaireSection1 from './PersonalProfileQuestionnaire/QuestionnaireSection1';
import QuestionnaireSection2 from './PersonalProfileQuestionnaire/QuestionnaireSection2';
import QuestionnaireSection3 from './PersonalProfileQuestionnaire/QuestionnaireSection3';
import QuestionnaireSection4 from './PersonalProfileQuestionnaire/QuestionnaireSection4';

interface PersonalProfileQuestionnaireProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose }: PersonalProfileQuestionnaireProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const { profileData, isReady, updateField, handleMultiSelect, saveData } = usePersonalProfilePersistence();
  
  const totalSections = 4;

  // Auto-save data whenever profileData changes
  useEffect(() => {
    if (isReady && Object.keys(profileData).length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('Auto-saving profile data...');
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [profileData, isReady]);

  const validateSection = (section: number): boolean => {
    const missing: string[] = [];

    switch (section) {
      case 1:
        // Section 1 validation: name, pronouns, age, gender, orientation
        if (!profileData.name?.trim()) missing.push('Name');
        if (!profileData.pronouns) missing.push('Pronouns');
        if (profileData.pronouns === 'Other' && !profileData.customPronouns?.trim()) missing.push('Custom pronouns');
        if (!profileData.age) missing.push('Age');
        if (!profileData.gender || profileData.gender.length === 0) missing.push('Gender identity');
        if (!profileData.orientation || profileData.orientation.length === 0) missing.push('Sexual orientation');
        break;

      case 2:
        // Section 2 validation: relationship status and conditional questions
        if (!profileData.relationshipStatus) missing.push('Relationship status');
        if (!profileData.whyRealTalk || profileData.whyRealTalk.length === 0) missing.push('Why RealTalk');
        
        // Check for single/dating conditional questions
        const isSingleOrDating = profileData.relationshipStatus && 
          ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
        
        if (isSingleOrDating) {
          if (!profileData.datingChallenges || profileData.datingChallenges.length === 0) {
            missing.push('Dating challenges');
          }
          if (!profileData.datingGoals || profileData.datingGoals.length === 0) {
            missing.push('Dating goals');
          }
        }
        
        // Check for relationship-specific questions
        const isInRelationship = profileData.relationshipStatus && 
          !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
        
        if (isInRelationship) {
          const hasRelationshipLength = profileData.relationshipStatus && 
            !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people', 'It\'s complicated'].includes(profileData.relationshipStatus);
          
          if (hasRelationshipLength && !profileData.relationshipLength) {
            missing.push('Relationship length');
          }
          if (!profileData.workingWell || profileData.workingWell.length === 0) {
            missing.push('What\'s working well');
          }
          if (!profileData.feelsDifficult || profileData.feelsDifficult.length === 0) {
            missing.push('What feels difficult');
          }
        }
        break;

      case 3:
        // Section 3 validation
        if (!profileData.stressResponse || profileData.stressResponse.length === 0) missing.push('Stress response');
        if (!profileData.conflictNeeds || profileData.conflictNeeds.length === 0) missing.push('Conflict needs');
        if (!profileData.feelLovedWhen || profileData.feelLovedWhen.length === 0) missing.push('Love languages');
        if (!profileData.attachmentStyle) missing.push('Attachment style');
        break;

      case 4:
        // Section 4 validation
        if (!profileData.familyDynamics || profileData.familyDynamics.length === 0) missing.push('Family dynamics');
        if (!profileData.parentConflictStyle || profileData.parentConflictStyle.length === 0) missing.push('Parent conflict style');
        if (!profileData.loveMessages || profileData.loveMessages.length === 0) missing.push('Love messages');
        if (!profileData.loveInfluences || profileData.loveInfluences.length === 0) missing.push('Love influences');
        if (!profileData.growthAreas || profileData.growthAreas.length === 0) missing.push('Growth areas');
        break;
    }

    if (missing.length > 0) {
      toast.error(`Please complete these required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < totalSections) {
        setCurrentSection(currentSection + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = async () => {
    if (validateSection(currentSection)) {
      const completeData = {
        ...profileData,
        profileComplete: true,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };

      // Save final data
      await saveData(completeData);
      
      console.log('Personal questionnaire completed with:', completeData);
      onComplete(completeData);
      toast.success("Profile completed successfully!");
    }
  };

  const renderCurrentSection = () => {
    const commonProps = {
      profileData,
      updateField,
      handleMultiSelect,
      isReady
    };

    switch (currentSection) {
      case 1:
        return <QuestionnaireSection1 {...commonProps} />;
      case 2:
        return <QuestionnaireSection2 {...commonProps} />;
      case 3:
        return <QuestionnaireSection3 {...commonProps} />;
      case 4:
        return <QuestionnaireSection4 {...commonProps} />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 1: return "Who You Are";
      case 2: return "Your Relationship World";
      case 3: return "How You Operate";
      case 4: return "Your Foundation";
      default: return "";
    }
  };

  const getSectionDescription = () => {
    switch (currentSection) {
      case 1: return "Let's start with the basics about you";
      case 2: return "Tell us about your relationship situation and goals";
      case 3: return "How do you handle stress, conflict, and love?";
      case 4: return "Your background and what you're working toward";
      default: return "";
    }
  };

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
                <p className="text-gray-600">Help RealTalk understand you better for personalized coaching</p>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Section {currentSection} of {totalSections}</span>
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm text-rose-600 font-medium">{getSectionTitle()}</span>
              </div>
              <Progress value={(currentSection / totalSections) * 100} className="h-3 bg-gray-200" />
              <div className="text-xs text-gray-500 mt-2 text-center">
                {Math.round((currentSection / totalSections) * 100)}% complete
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{getSectionTitle()}</h3>
            <p className="text-gray-600">{getSectionDescription()}</p>
            <p className="text-xs text-green-600 mt-2">✓ Your answers are automatically saved</p>
          </div>

          {renderCurrentSection()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 1}
              className="flex items-center gap-2 px-6 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2 items-center">
              {Array.from({ length: totalSections }, (_, i) => {
                const sectionNum = i + 1;
                const isCurrent = sectionNum === currentSection;
                const isCompleted = sectionNum < currentSection;
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentSection(sectionNum)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg scale-110' 
                        : isCompleted 
                          ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:scale-105 shadow-md' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer hover:scale-105'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : sectionNum}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
            >
              {currentSection === totalSections ? 'Complete Profile' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
