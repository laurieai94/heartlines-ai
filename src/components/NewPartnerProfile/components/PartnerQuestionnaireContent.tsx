import { useRef, useEffect } from "react";
import { PartnerProfileData } from "../types";
import PartnerBasics from "./sections/PartnerBasics";
import PartnerOperations from "./sections/PartnerOperations";
import PartnerFoundation from "./sections/PartnerFoundation";

interface PartnerQuestionnaireContentProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  currentSection: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  onScrollToSection: (scrollFn: (section: number) => void) => void;
  onSectionComplete: (nextSection: number) => void;
}

const PartnerQuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  containerRef,
  onScrollToSection,
  onSectionComplete
}: PartnerQuestionnaireContentProps) => {
  const scrollContainerRef = containerRef || useRef<HTMLDivElement>(null);

  // Mapping of first question anchors per section
  const firstQuestionAnchors: { [key: number]: string } = {
    1: '#question-partner-name-pronouns',
    2: '#partner-love-language-question', 
    3: '#partner-attachment-question'
  };

  // Function to scroll to the first question of a specific section
  const scrollToSection = (sectionNumber: number): void => {
    const container = scrollContainerRef.current;
    if (!container) {
      console.warn('🔴 Partner Profile: Scroll container not found');
      return;
    }

    const anchor = firstQuestionAnchors[sectionNumber];
    const targetElement = container.querySelector(anchor);
    
    if (!targetElement) {
      console.warn('🔴 Partner Profile: Target question not found:', anchor);
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = targetElement.getBoundingClientRect().top;
    const offsetPosition = container.scrollTop + (targetTop - containerTop) - 5;

    container.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // Scroll to first question on mount (section 1)
  useEffect(() => {
    if (currentSection === 1) {
      setTimeout(() => scrollToSection(1), 100);
    }
  }, []);

  // Expose scroll function to parent
  useEffect(() => {
    onScrollToSection(scrollToSection);
  }, [onScrollToSection]);

  return (
    <div className="bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-6 py-3 space-y-5">
        <div id="partner-section-1">
          <PartnerBasics
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 1}
            onSectionComplete={() => onSectionComplete(2)}
          />
        </div>
        
        <div id="partner-section-2">
          <PartnerOperations
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 2}
            onSectionComplete={() => onSectionComplete(3)}
          />
        </div>
        
        <div id="partner-section-3">
          <PartnerFoundation
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 3}
            onSectionComplete={() => {}}
          />
        </div>
      </div>
  );
};

export default PartnerQuestionnaireContent;