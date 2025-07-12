
import { useState, useEffect } from "react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireHeader from "./QuestionnaireHeader";
import QuestionnaireFooter from "./QuestionnaireFooter";
import QuestionnaireContent from "./QuestionnaireContent";

interface QuestionnaireLayoutProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onComplete: () => void;
  onClose: () => void;
  isModal?: boolean;
}

const QuestionnaireLayout = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false
}: QuestionnaireLayoutProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  
  const overallProgress = calculateProgress(profileData);

  // Auto-advance to next section when current section is complete
  useEffect(() => {
    const isCurrentSectionComplete = validateSection(currentSection, profileData);
    
    if (isCurrentSectionComplete && currentSection < 4) {
      const timer = setTimeout(() => {
        setCurrentSection(currentSection + 1);
      }, 800); // Brief delay to let users see completion
      
      return () => clearTimeout(timer);
    }
  }, [currentSection, profileData]);

  const handleSectionClick = (section: number) => {
    setCurrentSection(section);
  };

  const handleNext = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const canComplete = validateSection(4, profileData);

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full max-h-[90vh] flex flex-col' : 'w-full max-w-2xl max-h-[80vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <QuestionnaireHeader 
          overallProgress={overallProgress}
          onClose={onClose}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <SectionNavigation
            currentSection={currentSection}
            profileData={profileData}
            onSectionClick={handleSectionClick}
          />
        </div>

        <QuestionnaireContent
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          currentSection={currentSection}
        />

        <QuestionnaireFooter
          currentSection={currentSection}
          overallProgress={overallProgress}
          canComplete={canComplete}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default QuestionnaireLayout;
