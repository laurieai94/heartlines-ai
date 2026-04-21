
import { useState } from "react";
import { toast } from "sonner";
import QuestionnaireHeader from "./QuestionnaireHeader";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireFooter from "./QuestionnaireFooter";
import QuestionnaireContent from "./QuestionnaireContent";
import { validateSection, getRequiredCount, getCompletedCount } from "./ValidationLogic";
import { BRAND } from "@/branding";

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

  const scrollToSection = (sectionNumber: number) => {
    const element = document.getElementById(`section-${sectionNumber}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  const handleNext = () => {
    if (!validateSection(currentSection, profileData)) {
      toast.error("Please complete all required questions in this section");
      return;
    }

    if (currentSection < 4) {
      const nextSection = currentSection + 1;
      setSectionReadiness(prev => ({ ...prev, [nextSection]: true }));
      setCurrentSection(nextSection);
      setTimeout(() => scrollToSection(nextSection), 100);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setTimeout(() => scrollToSection(prevSection), 100);
    }
  };

  const handleComplete = () => {
    if (!validateSection(4, profileData)) {
      toast.error("Please answer at least one question in Your Foundation section");
      return;
    }

    setShowSuccess(true);
    
    setTimeout(() => {
      const completedData = {
        ...profileData,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };
      
      toast.success(`🎉 Profile Complete! Welcome to ${BRAND.name}!`, {
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
      setTimeout(() => scrollToSection(section), 100);
    }
  };

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full max-h-[90vh] flex flex-col' : 'w-full max-w-2xl max-h-[80vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <QuestionnaireHeader 
          onClose={onClose}
          currentSection={currentSection}
          totalSections={4}
          profileData={profileData}
        />

        <div className="hidden md:block bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto scrollbar-sleek">
          <QuestionnaireContent
            currentSection={currentSection}
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            sectionReadiness={sectionReadiness}
          />
        </div>

        <div className="flex-shrink-0 border-t border-white/15 bg-white/10 backdrop-blur-xl">
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
    </div>
  );
};

export default QuestionnaireContainer;
