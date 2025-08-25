import { useState, useRef } from "react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireHeader from "./QuestionnaireHeader";
import QuestionnaireContent from "./QuestionnaireContent";
import CleanQuestionnaireFooter from "./CleanQuestionnaireFooter";
import { useCurrentSectionDetection } from "../hooks/useCurrentSectionDetection";
interface QuestionnaireLayoutProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onComplete: () => void;
  onClose: () => void;
  isModal?: boolean;
  onAutoComplete?: () => void;
}
const QuestionnaireLayout = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  onAutoComplete
}: QuestionnaireLayoutProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);

  // Use intersection observer to detect current section during scroll
  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
  };
  useCurrentSectionDetection(handleSectionChange);
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
  return <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full max-w-4xl mx-auto h-auto max-h-[80vh] flex flex-col' : 'w-full max-w-6xl max-h-[90vh] flex flex-col'} border border-white/10 rounded-3xl bg-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/20 overflow-hidden relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none`}>
        
        <QuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

        <div className="bg-white/[0.03] backdrop-blur-sm border-b border-white/[0.08] px-3 py-1.5 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent"></div>
          <SectionNavigation currentSection={currentSection} profileData={profileData} onSectionClick={handleSectionClick} />
        </div>

        <QuestionnaireContent profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} currentSection={currentSection} onScrollToSection={scrollFn => {
        scrollToSectionFn.current = scrollFn;
      }} onSectionComplete={handleSectionComplete} />

        <CleanQuestionnaireFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={false} />
      </div>
    </div>;
};
export default QuestionnaireLayout;