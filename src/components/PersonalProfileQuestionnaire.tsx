
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import QuestionnaireHeader from "./PersonalProfileQuestionnaire/QuestionnaireHeader";
import SectionNavigation from "./PersonalProfileQuestionnaire/SectionNavigation";
import QuestionnaireFooter from "./PersonalProfileQuestionnaire/QuestionnaireFooter";
import QuestionnaireSection1 from "./PersonalProfileQuestionnaire/QuestionnaireSection1";
import QuestionnaireSection2 from "./PersonalProfileQuestionnaire/QuestionnaireSection2";
import QuestionnaireSection3 from "./PersonalProfileQuestionnaire/QuestionnaireSection3";
import QuestionnaireSection4 from "./PersonalProfileQuestionnaire/QuestionnaireSection4";
import { validateSection, getRequiredCount, getCompletedCount } from "./PersonalProfileQuestionnaire/ValidationLogic";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PersonalProfileQuestionnaireProps) => {
  const { profileData, isLoading, updateField, handleMultiSelect } = usePersonalProfileData();
  const [currentSection, setCurrentSection] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  // Auto-scroll to top when section changes
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Trigger scroll when section changes
  useEffect(() => {
    scrollToTop();
  }, [currentSection]);

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

  const handleNext = () => {
    if (!validateSection(currentSection, profileData)) {
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
    if (!validateSection(4, profileData)) {
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

  const handleSectionClick = (section: number) => {
    const isAccessible = sectionReadiness[section];
    const isCompleted = section < currentSection || validateSection(section, profileData);
    
    if (isAccessible || isCompleted) {
      setCurrentSection(section);
      setSectionReadiness(prev => ({ ...prev, [section]: true }));
    }
  };

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center p-4'} overflow-hidden`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'} overflow-hidden flex flex-col border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        
        <QuestionnaireHeader 
          onClose={onClose}
          currentSection={currentSection}
          totalSections={4}
          profileData={profileData}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-3 flex-shrink-0">
          <SectionNavigation
            currentSection={currentSection}
            sectionReadiness={sectionReadiness}
            validateSection={(section) => validateSection(section, profileData)}
            getRequiredCount={(section) => getRequiredCount(section, profileData)}
            getCompletedCount={(section) => getCompletedCount(section, profileData)}
            onSectionClick={handleSectionClick}
          />
        </div>

        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          <div className="p-4 max-w-5xl mx-auto">
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

        <QuestionnaireFooter
          currentSection={currentSection}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          validateSection={(section) => validateSection(section, profileData)}
          getRequiredCount={(section) => getRequiredCount(section, profileData)}
          getCompletedCount={(section) => getCompletedCount(section, profileData)}
        />
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
