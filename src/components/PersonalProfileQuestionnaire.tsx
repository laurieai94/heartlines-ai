
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Camera, User, Heart, Brain } from "lucide-react";
import { toast } from "sonner";
import { usePersonalProfilePersistence } from "@/hooks/usePersonalProfilePersistence";
import QuestionnaireSection1 from "./PersonalProfileQuestionnaire/QuestionnaireSection1";
import QuestionnaireSection2 from "./PersonalProfileQuestionnaire/QuestionnaireSection2";
import QuestionnaireSection3 from "./PersonalProfileQuestionnaire/QuestionnaireSection3";
import QuestionnaireSection4 from "./PersonalProfileQuestionnaire/QuestionnaireSection4";

interface PersonalProfileQuestionnaireProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose }: PersonalProfileQuestionnaireProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const { profileData, isLoading, isReady, saveData, updateField, handleMultiSelect } = usePersonalProfilePersistence();
  
  const [sectionProgress, setSectionProgress] = useState({
    section1: 0,
    section2: 0,
    section3: 0,
    section4: 0
  });

  // Calculate progress for each section
  useEffect(() => {
    if (!isReady) return;

    const calculateSection1Progress = () => {
      const required = ['name', 'age', 'gender', 'sexualOrientation'];
      const completed = required.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value !== '');
      }).length;
      return Math.round((completed / required.length) * 100);
    };

    const calculateSection2Progress = () => {
      const required = ['relationshipStatus', 'whyRealTalk', 'biggestChallenge'];
      let completed = 0;
      
      if (profileData.relationshipStatus && profileData.relationshipStatus !== '') completed++;
      if (profileData.whyRealTalk && profileData.whyRealTalk.length > 0) completed++;
      if (profileData.biggestChallenge && profileData.biggestChallenge.length > 0) completed++;
      
      // Add conditional relationship length if in relationship
      const inRelationship = ['committed', 'engaged', 'married', 'open', 'complicated', 'break'].includes(profileData.relationshipStatus);
      const totalRequired = inRelationship ? required.length + 1 : required.length;
      
      if (inRelationship && profileData.relationshipLength && profileData.relationshipLength !== '') {
        completed++;
      } else if (!inRelationship) {
        // If not in relationship, don't count the relationship length question
      }
      
      return Math.round((completed / totalRequired) * 100);
    };

    const calculateSection3Progress = () => {
      const required = ['stressResponse', 'conflictNeeds', 'feelLovedWhen', 'attachmentStyle'];
      const completed = required.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value !== '');
      }).length;
      return Math.round((completed / required.length) * 100);
    };

    const calculateSection4Progress = () => {
      // Section 4 is optional, so always shows 100% if any questions are answered
      const optionalFields = ['familyDynamics', 'parentConflictStyle', 'loveMessages', 'loveInfluences', 'mentalHealthContext', 'growthAreas'];
      const answered = optionalFields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value !== '');
      }).length;
      return answered > 0 ? 100 : 0;
    };

    setSectionProgress({
      section1: calculateSection1Progress(),
      section2: calculateSection2Progress(),
      section3: calculateSection3Progress(),
      section4: calculateSection4Progress()
    });
  }, [profileData, isReady]);

  const canProceedToNext = (section: number) => {
    switch (section) {
      case 1:
        return sectionProgress.section1 === 100;
      case 2:
        return sectionProgress.section2 === 100;
      case 3:
        return sectionProgress.section3 === 100;
      case 4:
        return true; // Section 4 is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentSection < 4 && canProceedToNext(currentSection)) {
      setCurrentSection(currentSection + 1);
    } else if (currentSection === 4) {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    const completedData = {
      ...profileData,
      completedAt: new Date().toISOString(),
      profileComplete: true
    };
    saveData(completedData);
    onComplete(completedData);
    toast.success("Your profile is complete! Let's start your journey with RealTalk.");
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-4 h-4" />;
      case 2: return <Heart className="w-4 h-4" />;
      case 3: return <Brain className="w-4 h-4" />;
      case 4: return <Check className="w-4 h-4" />;
      default: return null;
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

  const getSectionTime = (section: number) => {
    switch (section) {
      case 1: return "~1 minute";
      case 2: return "~1.5 minutes";
      case 3: return "~1.5 minutes";
      case 4: return "~2-3 minutes (Optional)";
      default: return "";
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {getSectionIcon(currentSection)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Let's Get to Know You
                  </h2>
                  <p className="text-gray-600">
                    Building your personalized relationship profile
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Section Progress */}
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Section {currentSection} of 4</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-600 font-medium">
                    {getSectionTitle(currentSection)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getSectionTime(currentSection)}
                  </div>
                </div>
              </div>
              <Progress value={sectionProgress[`section${currentSection}` as keyof typeof sectionProgress]} className="h-3 bg-gray-200" />
              <div className="text-xs text-gray-500 mt-2 text-center">
                {sectionProgress[`section${currentSection}` as keyof typeof sectionProgress]}% complete
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderCurrentSection()}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 border-t bg-gray-50/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 1}
              className="flex items-center gap-2 px-6 py-2 rounded-xl border-gray-300 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {/* Section Indicators */}
            <div className="flex gap-2 items-center">
              {Array.from({ length: 4 }, (_, i) => {
                const sectionNum = i + 1;
                const isCurrent = sectionNum === currentSection;
                const isCompleted = sectionProgress[`section${sectionNum}` as keyof typeof sectionProgress] === 100;
                const isAccessible = sectionNum <= currentSection || isCompleted;
                
                return (
                  <button
                    key={i}
                    onClick={() => isAccessible && setCurrentSection(sectionNum)}
                    disabled={!isAccessible}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
                        : isCompleted 
                          ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:scale-105 shadow-md' 
                          : isAccessible
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer hover:scale-105 shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted && sectionNum !== currentSection ? <Check className="w-5 h-5" /> : sectionNum}
                  </button>
                );
              })}
            </div>

            {/* Next/Complete Button */}
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext(currentSection) && currentSection !== 4}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl ${
                currentSection === 4 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentSection === 4 ? 'Complete Profile' : 'Next Section'}
              {currentSection === 4 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Help text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 bg-white/60 rounded-full px-4 py-2 inline-block">
              💡 {currentSection < 4 ? 'Complete all required questions to proceed' : 'This section is optional but helps personalize your experience'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
