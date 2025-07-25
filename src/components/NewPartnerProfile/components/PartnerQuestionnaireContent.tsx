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
  onScrollToSection: (scrollFn: (section: number) => void) => void;
  onSectionComplete: (nextSection: number) => void;
}

const PartnerQuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  onScrollToSection,
  onSectionComplete
}: PartnerQuestionnaireContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to a specific section
  const scrollToSection = (sectionNumber: number): void => {
    const container = scrollContainerRef.current;
    if (!container) {
      console.warn('🔴 Partner Profile: Scroll container not found');
      return;
    }

    const targetElement = container.querySelector(`#partner-section-${sectionNumber}`);
    if (!targetElement) {
      console.warn('🔴 Partner Profile: Target section not found:', sectionNumber);
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = targetElement.getBoundingClientRect().top;
    const offsetPosition = container.scrollTop + (targetTop - containerTop) - 20;

    container.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // Expose scroll function to parent
  useEffect(() => {
    onScrollToSection(scrollToSection);
  }, [onScrollToSection]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
    >
      <div className="px-6 py-8 space-y-12">
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
    </div>
  );
};

export default PartnerQuestionnaireContent;