import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { PartnerProfileData } from "../types";
import { useAutoScroll } from "../../NewPersonalQuestionnaire/hooks/useAutoScroll";

// Lazy load sections for better initial performance
const PartnerBasics = lazy(() => import("./sections/PartnerBasics"));
const PartnerOperations = lazy(() => import("./sections/PartnerOperations"));
const PartnerFoundation = lazy(() => import("./sections/PartnerFoundation"));

interface PartnerQuestionnaireContentProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  currentSection: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  headerOffsetPx?: number;
  onScrollToSection: (scrollFn: (section: number) => void) => void;
  onSectionComplete: (nextSection: number) => void;
}

const PartnerQuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  containerRef,
  headerOffsetPx = 0,
  onScrollToSection,
  onSectionComplete
}: PartnerQuestionnaireContentProps) => {
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

  // Mapping of first question IDs per section
  const firstQuestionIds: { [key: number]: string } = {
    1: 'question-partner-name-pronouns',
    2: 'partner-love-language-question', 
    3: 'partner-attachment-question'
  };

  // Robust function to scroll to the first question of a specific section
  const scrollToSection = (sectionNumber: number): void => {
    console.debug('🟠 Partner: Section advance requested to:', sectionNumber);
    
    const questionId = firstQuestionIds[sectionNumber];
    if (!questionId) {
      console.warn('🔴 Partner: No question ID mapped for section:', sectionNumber);
      return;
    }

    const fallbackId = `partner-section-${sectionNumber}`;
    let retryCount = 0;
    const maxRetries = 20; // ~4s total
    let observer: MutationObserver | null = null;

    const attemptScroll = () => {
      const element = document.getElementById(questionId);
      const fallbackElement = document.getElementById(fallbackId);
      
      if (element) {
        console.debug('🟠 Partner: Target element found, scrolling to:', questionId);
        scrollToElement(questionId, 150);
        observer?.disconnect();
        return true;
      } else if (fallbackElement) {
        console.debug('🟠 Partner: Fallback to section container:', fallbackId);
        scrollToElement(fallbackId, 150);
        observer?.disconnect();
        return true;
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.debug(`🟡 Partner: Retry ${retryCount}/${maxRetries} for section ${sectionNumber}`);
        setTimeout(attemptScroll, 200);
        return false;
      } else {
        console.error('🔴 Partner: Failed to find element after retries:', questionId);
        // Last resort: watch for DOM changes
        observer = new MutationObserver(() => {
          if (document.getElementById(questionId) || document.getElementById(fallbackId)) {
            console.debug('🟠 Partner: Observer triggered, scrolling');
            attemptScroll();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer?.disconnect(), 2000);
        return false;
      }
    };

    // Initial attempt with small delay for DOM stability
    setTimeout(attemptScroll, 100);
  };

  // Scroll to first question on mount (section 1) with stability delay
  useEffect(() => {
    if (currentSection === 1) {
      setTimeout(() => scrollToSection(1), 150);
    }
  }, []);

  // Expose scroll function to parent
  useEffect(() => {
    onScrollToSection(scrollToSection);
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
        <div id="partner-section-1" data-section="1" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
          <Suspense fallback={<SectionSkeleton />}>
            <PartnerBasics
              profileData={profileData}
              updateField={updateField}
              handleMultiSelect={handleMultiSelect}
              isActive={currentSection === 1}
              onSectionComplete={() => onSectionComplete(2)}
            />
          </Suspense>
        </div>
        
        {/* Only render section 2 when section 1 is accessed or completed */}
        {(currentSection >= 2) && (
          <div id="partner-section-2" data-section="2" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
            <Suspense fallback={<SectionSkeleton />}>
              <PartnerOperations
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 2}
                onSectionComplete={() => onSectionComplete(3)}
              />
            </Suspense>
          </div>
        )}
        
        {/* Only render section 3 when section 2 is accessed or completed */}
        {(currentSection >= 3) && (
          <div id="partner-section-3" data-section="3" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
            <Suspense fallback={<SectionSkeleton />}>
              <PartnerFoundation
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 3}
                onSectionComplete={() => {}}
              />
            </Suspense>
          </div>
        )}
      </div>
  );
};

export default PartnerQuestionnaireContent;