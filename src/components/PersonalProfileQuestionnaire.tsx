
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, User, Heart, Brain, Sparkles } from "lucide-react";
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
  const [showOptionalPrompt, setShowOptionalPrompt] = useState(false);
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
      const inRelationship = ['In committed relationship', 'Engaged', 'Married/life partnered', 'Open/polyamorous', 'It\'s complicated', 'Taking relationship break'].includes(profileData.relationshipStatus);
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
      // Section 4 is optional, so shows progress based on answered questions
      const optionalFields = ['familyDynamics', 'parentConflictStyle', 'loveMessages', 'loveInfluences', 'mentalHealthContext', 'growthAreas'];
      const answered = optionalFields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value !== '');
      }).length;
      
      return answered > 0 ? Math.round((answered / optionalFields.length) * 100) : 0;
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
    if (currentSection === 3 && canProceedToNext(3)) {
      // After section 3, show optional prompt
      setShowOptionalPrompt(true);
    } else if (currentSection < 4 && canProceedToNext(currentSection)) {
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

  const handleOptionalYes = () => {
    setShowOptionalPrompt(false);
    setCurrentSection(4);
  };

  const handleOptionalNo = () => {
    setShowOptionalPrompt(false);
    handleComplete();
  };

  const handleComplete = () => {
    const completedData = {
      ...profileData,
      completedAt: new Date().toISOString(),
      profileComplete: true
    };
    saveData(completedData);
    onComplete(completedData);
    toast.success("🎉 Your profile is complete! Let's start your journey with RealTalk.");
  };

  const getSectionIcon = (section: number) => {
    switch (section) {
      case 1: return <User className="w-5 h-5" />;
      case 2: return <Heart className="w-5 h-5" />;
      case 3: return <Brain className="w-5 h-5" />;
      case 4: return <Sparkles className="w-5 h-5" />;
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
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-8 border-b bg-gradient-to-br from-[#8B2635] via-[#A0334A] to-[#B8405F] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    {getSectionIcon(currentSection)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Let's Get to Know You
                    </h2>
                    <p className="text-pink-200">
                      Building your personalized relationship profile
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={onClose} className="text-pink-200 hover:text-white hover:bg-white/10 rounded-full p-2">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Section Progress */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">Section {currentSection} of 4</span>
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-white">
                      {getSectionTitle(currentSection)}
                    </div>
                    <div className="text-sm text-pink-200">
                      {getSectionTime(currentSection)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={sectionProgress[`section${currentSection}` as keyof typeof sectionProgress]} 
                    className="h-3 bg-black/20" 
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-pink-200">
                      {sectionProgress[`section${currentSection}` as keyof typeof sectionProgress]}% complete
                    </span>
                    <span className="text-orange-200 font-medium">
                      {currentSection === 4 ? 'Optional section' : 'Required'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderCurrentSection()}
          </div>

          {/* Navigation Footer */}
          <div className="p-8 border-t bg-gray-50/80 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentSection === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </Button>
              
              {/* Section Indicators */}
              <div className="flex gap-3 items-center">
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
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg scale-110 ring-4 ring-pink-200' 
                          : isCompleted 
                            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:scale-105 shadow-md' 
                            : isAccessible
                              ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer hover:scale-105 shadow-md'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted && sectionNum !== currentSection ? <Check className="w-6 h-6" /> : sectionNum}
                    </button>
                  );
                })}
              </div>

              {/* Next/Complete Button */}
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext(currentSection) && currentSection !== 4}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                  currentSection === 4 
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white' 
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {currentSection === 4 ? 'Complete Profile' : 'Next Section'}
                {currentSection === 4 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </Button>
            </div>
            
            {/* Help text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-gray-200">
                {currentSection < 4 
                  ? '💡 Complete all required questions to proceed to the next section' 
                  : '🌟 This section is optional but helps provide more personalized insights'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Section Prompt */}
      {showOptionalPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nice work! You've covered the essentials.
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Want to unlock even deeper insights? Adding more context helps 
              our relationship coach give you more personalized guidance.
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleOptionalYes}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Yes, let's go deeper
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleOptionalNo}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                I'm ready to start coaching
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              You can always add more details later in your profile
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalProfileQuestionnaire;
