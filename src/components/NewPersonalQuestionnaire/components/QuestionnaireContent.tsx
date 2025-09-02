
import { useRef, useEffect, useState } from "react";
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
  containerRef?: React.RefObject<HTMLDivElement>;
  headerOffsetPx?: number;
  onScrollToSection?: (scrollFn: (sectionNumber: number) => void) => void;
  onSectionComplete?: (nextSection: number) => void;
}

const QuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  containerRef,
  headerOffsetPx = 0,
  onScrollToSection,
  onSectionComplete
}: QuestionnaireContentProps) => {
  const [isTabletDesktop, setIsTabletDesktop] = useState(false);
  const scrollContainerRef = containerRef || useRef<HTMLDivElement>(null);
  const { scrollToNextQuestion } = useAutoScroll();

  // Track tablet/desktop state
  useEffect(() => {
    const updateLayout = () => {
      setIsTabletDesktop(window.innerWidth >= 640);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const scrollToSection = (sectionNumber: number) => {
    console.log('🟠 QuestionnaireContent: scrollToSection called with:', sectionNumber);
    
    // Add null check for invalid section numbers
    if (!sectionNumber || sectionNumber < 1 || sectionNumber > 4) {
      console.error('🔴 QuestionnaireContent: Invalid section number:', sectionNumber);
      return;
    }
    
    const container = scrollContainerRef.current;
    if (!container) {
      console.error('🔴 QuestionnaireContent: No scroll container found');
      return;
    }
    
    // Map section numbers to their first question IDs
    const sectionToFirstQuestion: Record<number, string> = {
      1: 'question-name-pronouns',           // WhoYouAre section
      2: 'question-relationship-status',    // YourRelationship section  
      3: 'question-love-language',          // HowYouOperate section
      4: 'question-attachment-style'        // YourFoundation section (AttachmentStyle is now first)
    };
    
    const firstQuestionId = sectionToFirstQuestion[sectionNumber];
    console.log('🟠 QuestionnaireContent: Target question ID:', firstQuestionId);
    
    // Add DOM ready delay
    const attemptScroll = () => {
      const element = document.getElementById(firstQuestionId);
      const fallbackElement = document.getElementById(`section-${sectionNumber}`);
      
      console.log('🟠 QuestionnaireContent: First question element found:', !!element);
      console.log('🟠 QuestionnaireContent: Fallback section element found:', !!fallbackElement);
      
      const targetElement = element || fallbackElement;
      
      if (targetElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
        
        console.log('🟠 QuestionnaireContent: Scroll calculation:', {
          targetElementId: targetElement.id,
          containerTop: containerRect.top,
          elementTop: elementRect.top,
          currentScrollTop: container.scrollTop,
          relativeTop,
          finalScrollPosition: relativeTop - 80
        });
        
        container.scrollTo({
          top: relativeTop - Math.max(80, headerOffsetPx + 20),
          behavior: 'smooth'
        });
        
        console.log('🟠 QuestionnaireContent: Scroll executed successfully to:', targetElement.id);
      } else {
        console.error('🔴 QuestionnaireContent: Neither first question nor section element found for section:', sectionNumber);
      }
    };
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Add small delay to ensure all components are rendered
      setTimeout(attemptScroll, 100);
    });
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
    <div className={`py-2 space-y-4 ${isTabletDesktop ? 'px-8' : 'px-4'}`}>
        <div id="section-1" data-section="1" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
        <WhoYouAre
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isActive={currentSection === 1}
          onSectionComplete={() => onSectionComplete?.(2)}
        />
        </div>

        <div id="section-2" data-section="2" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
          <YourRelationship
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 2}
            onSectionComplete={() => onSectionComplete?.(3)}
          />
        </div>

        <div id="section-3" data-section="3" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
          <HowYouOperate
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 3}
            
            onSectionComplete={() => onSectionComplete?.(4)}
          />
        </div>

        <div id="section-4" data-section="4" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
          <YourFoundation
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 4}
            onSectionComplete={() => {}} // Final section, no next section
          />
        </div>
      </div>
  );
};

export default QuestionnaireContent;
