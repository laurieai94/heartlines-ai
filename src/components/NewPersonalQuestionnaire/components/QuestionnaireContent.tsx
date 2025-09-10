
import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { ProfileData } from "../types";
import { useAutoScroll } from "../hooks/useAutoScroll";
import WhoYouAre from "./sections/WhoYouAre";

// Lazy load sections for better initial performance
const YourRelationship = lazy(() => import("./sections/YourRelationship"));
const HowYouOperate = lazy(() => import("./sections/HowYouOperate"));
const YourFoundation = lazy(() => import("./sections/YourFoundation"));

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
  const { scrollToElement } = useAutoScroll();

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
    console.debug('🟠 Personal: Section advance requested to:', sectionNumber);
    
    if (!sectionNumber || sectionNumber < 1 || sectionNumber > 4) {
      console.error('🔴 Personal: Invalid section number:', sectionNumber);
      return;
    }
    
    const sectionToFirstQuestion: Record<number, string> = {
      1: 'question-name-pronouns',
      2: 'question-relationship-status',  
      3: 'question-love-language',
      4: 'question-attachment-style'
    };
    
    const firstQuestionId = sectionToFirstQuestion[sectionNumber];
    const fallbackId = `section-${sectionNumber}`;
    
    // Simple retry logic with shorter delays
    const attemptScroll = (retryCount = 0) => {
      const element = document.getElementById(firstQuestionId);
      const fallbackElement = document.getElementById(fallbackId);
      
      if (element) {
        console.debug('🟠 Personal: Scrolling to first question:', firstQuestionId);
        scrollToElement(firstQuestionId, 150);
        return;
      } else if (fallbackElement) {
        console.debug('🟠 Personal: Scrolling to section:', fallbackId);
        scrollToElement(fallbackId, 150);
        return;
      } else if (retryCount < 8) {
        console.debug(`🟡 Personal: Retry ${retryCount + 1}/8 for section ${sectionNumber}`);
        setTimeout(() => attemptScroll(retryCount + 1), 150);
      } else {
        console.warn('🔴 Personal: Could not find scroll target for section:', sectionNumber);
      }
    };
    
    // Start with small delay for DOM updates
    setTimeout(() => attemptScroll(), 50);
  };

  // Expose scroll function to parent
  useEffect(() => {
    console.log('🟠 QuestionnaireContent: Setting up scroll function, onScrollToSection exists:', !!onScrollToSection);
    if (onScrollToSection) {
      onScrollToSection(scrollToSection);
      console.log('🟠 QuestionnaireContent: Scroll function exposed to parent');
    }
  }, [onScrollToSection]);

  // Component to show loading state for sections
  const SectionSkeleton = () => (
    <div className="space-y-4 p-4">
      <div className="h-6 bg-white/10 rounded animate-pulse" />
      <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
      <div className="space-y-2">
        <div className="h-12 bg-white/5 rounded animate-pulse" />
        <div className="h-12 bg-white/5 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className={`py-1 space-y-3 ${isTabletDesktop ? 'px-8' : 'px-1'}`}>
        <div id="section-1" data-section="1" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
        <WhoYouAre
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isActive={currentSection === 1}
          onSectionComplete={() => onSectionComplete?.(2)}
        />
        </div>

        {/* Keep sections mounted once visited to prevent collapse */}
        {(currentSection >= 2) && (
          <div id="section-2" data-section="2" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
            <Suspense fallback={<SectionSkeleton />}>
              <YourRelationship
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 2}
                onSectionComplete={() => onSectionComplete?.(3)}
              />
            </Suspense>
          </div>
        )}

        {(currentSection >= 3) && (
          <div id="section-3" data-section="3" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
            <Suspense fallback={<SectionSkeleton />}>
              <HowYouOperate
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 3}
                onSectionComplete={() => onSectionComplete?.(4)}
              />
            </Suspense>
          </div>
        )}

        {(currentSection >= 4) && (
          <div id="section-4" data-section="4" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
            <Suspense fallback={<SectionSkeleton />}>
              <YourFoundation
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 4}
                onSectionComplete={() => {}} // Final section, no next section
              />
            </Suspense>
          </div>
        )}
      </div>
  );
};

export default QuestionnaireContent;
