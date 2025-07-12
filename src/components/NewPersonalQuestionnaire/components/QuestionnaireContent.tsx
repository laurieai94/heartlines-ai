
import { useRef, useEffect } from "react";
import { ProfileData } from "../types";
import WhoYouAre from "./sections/WhoYouAre";
import YourRelationship from "./sections/YourRelationship";
import HowYouOperate from "./sections/HowYouOperate";
import YourFoundation from "./sections/YourFoundation";

interface QuestionnaireContentProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  currentSection: number;
  onScrollToSection?: (scrollFn: (sectionNumber: number) => void) => void;
}

const QuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  onScrollToSection
}: QuestionnaireContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionNumber: number) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(`section-${sectionNumber}`);
    
    if (container && element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      
      container.scrollTo({
        top: relativeTop - 32,
        behavior: 'smooth'
      });
    }
  };

  // Expose scroll function to parent
  useEffect(() => {
    if (onScrollToSection) {
      onScrollToSection(scrollToSection);
    }
  }, [onScrollToSection]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="py-8 space-y-6">
        <div id="section-1" className="px-6" data-section="1">
        <WhoYouAre
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isActive={currentSection === 1}
          onSectionComplete={() => scrollToSection(2)}
        />
        </div>

        <div id="section-2" className="px-6" data-section="2">
          <YourRelationship
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 2}
            onSectionComplete={() => scrollToSection(3)}
          />
        </div>

        <div id="section-3" className="px-6" data-section="3">
          <HowYouOperate
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 3}
            onSectionComplete={() => scrollToSection(4)}
          />
        </div>

        <div id="section-4" className="px-6" data-section="4">
          <YourFoundation
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 4}
            onSectionComplete={() => {}} // Final section, no next section
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContent;
