
import { useRef, useEffect } from "react";
import QuestionnaireSection1 from "./QuestionnaireSection1";
import QuestionnaireSection2 from "./QuestionnaireSection2";
import QuestionnaireSection3 from "./QuestionnaireSection3";
import QuestionnaireSection4 from "./QuestionnaireSection4";

interface QuestionnaireContentProps {
  currentSection: number;
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  sectionReadiness: { [key: number]: boolean };
}

const QuestionnaireContent = ({
  currentSection,
  profileData,
  updateField,
  handleMultiSelect,
  sectionReadiness
}: QuestionnaireContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when section changes
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll to element when optional sections expand
  const scrollToElement = (elementId: string) => {
    setTimeout(() => {
      if (contentRef.current) {
        const element = contentRef.current.querySelector(`[data-scroll-id="${elementId}"]`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    }, 200); // Wait for animation to start
  };

  // Trigger scroll when section changes
  useEffect(() => {
    scrollToTop();
  }, [currentSection]);

  // Provide scroll function to child components via context or prop
  useEffect(() => {
    (window as any).scrollToOptionalSection = scrollToElement;
    return () => {
      delete (window as any).scrollToOptionalSection;
    };
  }, []);

  // Render only the current active section
  const renderCurrentSection = () => {
    const isReady = sectionReadiness[currentSection];
    
    switch (currentSection) {
      case 1:
        return (
          <QuestionnaireSection1 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={isReady}
          />
        );
      case 2:
        return (
          <QuestionnaireSection2 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={isReady}
          />
        );
      case 3:
        return (
          <QuestionnaireSection3 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={isReady}
          />
        );
      case 4:
        return (
          <QuestionnaireSection4 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={isReady}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={contentRef}
      className="flex-1 overflow-y-auto max-h-[60vh] bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
    >
      <div className="px-1.5 py-1">
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default QuestionnaireContent;
