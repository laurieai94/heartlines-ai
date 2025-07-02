
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

  // Trigger scroll when section changes
  useEffect(() => {
    scrollToTop();
  }, [currentSection]);

  return (
    <div 
      ref={contentRef}
      className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
    >
      <div className="px-1.5 py-1">
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
  );
};

export default QuestionnaireContent;
