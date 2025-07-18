
import { useState, useRef } from "react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireHeader from "./QuestionnaireHeader";
import QuestionnaireContent from "./QuestionnaireContent";
import CleanQuestionnaireFooter from "./CleanQuestionnaireFooter";

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
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  
  const overallProgress = calculateProgress(profileData);

  // Handle section completion via continue buttons
  const handleSectionComplete = (nextSection: number) => {
    setCurrentSection(nextSection);
    
    // Scroll to the next section using ref
    if (scrollToSectionFn.current) {
      setTimeout(() => {
        scrollToSectionFn.current!(nextSection);
      }, 200);
    }
  };

  const handleSectionClick = (section: number) => {
    console.log('🟢 QuestionnaireLayout: handleSectionClick called with section:', section);
    setCurrentSection(section);
    
    // Scroll to the selected section using ref
    console.log('🟢 QuestionnaireLayout: Scroll function exists:', !!scrollToSectionFn.current);
    if (scrollToSectionFn.current) {
      console.log('🟢 QuestionnaireLayout: Calling scroll function immediately for section:', section);
      scrollToSectionFn.current(section);
    } else {
      console.warn('🔴 QuestionnaireLayout: Scroll function not available yet');
    }
  };

  // Auto-advance to next section when current section is completed
  const handleSectionAutoAdvance = (completedSection: number) => {
    if (completedSection < 4 && validateSection(completedSection, profileData)) {
      const nextSection = completedSection + 1;
      setTimeout(() => {
        setCurrentSection(nextSection);
        if (scrollToSectionFn.current) {
          scrollToSectionFn.current(nextSection);
        }
      }, 500); // Small delay to show completion celebration
    }
  };

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full flex flex-col' : 'w-full max-w-6xl max-h-[90vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <QuestionnaireHeader 
          overallProgress={overallProgress}
          onClose={onClose}
          profileData={profileData}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-2 flex-shrink-0">
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
          onScrollToSection={(scrollFn) => { scrollToSectionFn.current = scrollFn; }}
          onSectionComplete={handleSectionComplete}
        />

        <CleanQuestionnaireFooter
          profileData={profileData}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default QuestionnaireLayout;
