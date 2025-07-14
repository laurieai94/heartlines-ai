
import { useRef, useEffect } from "react";
import { ProfileData } from "../types";
import { useAutoScroll } from "../hooks/useAutoScroll";
import WhoYouAre from "./sections/WhoYouAre";
import YourRelationship from "./sections/YourRelationship";
import HowYouOperate from "./sections/HowYouOperate";
import YourFoundation from "./sections/YourFoundation";

interface QuestionnaireContentProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  currentSection: number;
  onSectionComplete?: (nextSection: number) => void;
}

const QuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  onScrollToSection,
  onSectionComplete
}: QuestionnaireContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollToNextQuestion } = useAutoScroll({ scrollContainerRef });

  const scrollToSection = (sectionNumber: number) => {
    console.log('🟠 QuestionnaireContent: scrollToSection called with:', sectionNumber);
    
    const container = scrollContainerRef.current;
    const element = document.getElementById(`section-${sectionNumber}`);
    
    console.log('🟠 QuestionnaireContent: Container found:', !!container);
    console.log('🟠 QuestionnaireContent: Target element found:', !!element);
    console.log('🟠 QuestionnaireContent: Target element ID:', element ? element.id : 'not found');
    
    if (container && element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      
      console.log('🟠 QuestionnaireContent: Scroll calculation:', {
        containerTop: containerRect.top,
        elementTop: elementRect.top,
        currentScrollTop: container.scrollTop,
        relativeTop,
        finalScrollPosition: relativeTop - 32
      });
      
      container.scrollTo({
        top: relativeTop - 32,
        behavior: 'smooth'
      });
      
      console.log('🟠 QuestionnaireContent: Scroll executed successfully');
    } else {
      console.error('🔴 QuestionnaireContent: Failed to scroll - missing container or element');
    }
  };

  // Expose scroll function to parent
  useEffect(() => {
    console.log('🟠 QuestionnaireContent: Setting up scroll function, onScrollToSection exists:', !!onScrollToSection);
    if (onScrollToSection) {
      onScrollToSection(scrollToSection);
      console.log('🟠 QuestionnaireContent: Scroll function exposed to parent');
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
          onSectionComplete={() => onSectionComplete?.(2)}
        />
        </div>

        <div id="section-2" className="px-6" data-section="2">
          <YourRelationship
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 2}
            onAutoScroll={scrollToNextQuestion}
            onSectionComplete={() => onSectionComplete?.(3)}
          />
        </div>

        <div id="section-3" className="px-6" data-section="3">
          <HowYouOperate
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 3}
            onAutoScroll={scrollToNextQuestion}
            onSectionComplete={() => onSectionComplete?.(4)}
          />
        </div>

        <div id="section-4" className="px-6" data-section="4">
          <YourFoundation
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 4}
            onAutoScroll={scrollToNextQuestion}
            onSectionComplete={() => {}} // Final section, no next section
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContent;
