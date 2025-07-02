
import { useState } from "react";
import { toast } from "sonner";
import QuestionnaireHeader from "./QuestionnaireHeader";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireFooter from "./QuestionnaireFooter";
import QuestionnaireContent from "./QuestionnaireContent";
import { validateSection, getRequiredCount, getCompletedCount } from "./ValidationLogic";

interface QuestionnaireContainerProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
  setShowSuccess: (show: boolean) => void;
}

const QuestionnaireContainer = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  setShowSuccess
}: QuestionnaireContainerProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

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

    // Show success state briefly
    setShowSuccess(true);
    
    setTimeout(() => {
      const completedData = {
        ...profileData,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };
      
      toast.success("🎉 Profile Complete! Welcome to RealTalk!", {
        duration: 3000,
      });
      
      onComplete({
        type: 'personal',
        completionData: completedData
      });
    }, 2000);
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
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'} overflow-hidden`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-2xl h-[70vh]'} overflow-hidden flex flex-col border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        
        <QuestionnaireHeader 
          onClose={onClose}
          currentSection={currentSection}
          totalSections={4}
          profileData={profileData}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <SectionNavigation
            currentSection={currentSection}
            sectionReadiness={sectionReadiness}
            validateSection={(section) => validateSection(section, profileData)}
            getRequiredCount={(section) => getRequiredCount(section, profileData)}
            getCompletedCount={(section) => getCompletedCount(section, profileData)}
            onSectionClick={handleSectionClick}
            profileData={profileData}
          />
        </div>

        <QuestionnaireContent
          currentSection={currentSection}
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          sectionReadiness={sectionReadiness}
        />

        <QuestionnaireFooter
          currentSection={currentSection}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          validateSection={(section) => validateSection(section, profileData)}
          getRequiredCount={(section) => getRequiredCount(section, profileData)}
          getCompletedCount={(section) => getCompletedCount(section, profileData)}
          profileData={profileData}
        />
      </div>
    </div>
  );
};

export default QuestionnaireContainer;
