import { useState, useRef, useEffect } from "react";
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
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTabletDesktop, setIsTabletDesktop] = useState(false);
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const navLock = useRef(false);

  // Use intersection observer to detect current section during scroll
  const handleSectionChange = (section: number) => {
    // Only update section if not in the middle of programmatic navigation
    if (!navLock.current) {
      setCurrentSection(section);
    }
  };
  useCurrentSectionDetection(handleSectionChange);
  
  // Track tablet/desktop state and measure header height
  useEffect(() => {
    const updateLayout = () => {
      const isTabletOrDesktop = window.innerWidth >= 640;
      setIsTabletDesktop(isTabletOrDesktop);
      
      // Measure header height on ALL screen sizes for better mobile scrolling
      if (stickyHeaderRef.current) {
        const height = stickyHeaderRef.current.offsetHeight;
        setHeaderHeight(height);
        console.log('📏 QuestionnaireLayout: Header height measured:', height, 'isTabletDesktop:', isTabletOrDesktop);
      } else {
        setHeaderHeight(0);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);
  
  const overallProgress = calculateProgress(profileData);

  // Handle section completion via continue buttons
  const handleSectionComplete = (nextSection: number) => {
    console.debug('🟠 Personal Layout: Section transition to:', nextSection);
    
    // Prevent intersection observer interference during navigation
    navLock.current = true;
    
    // Update section first
    setCurrentSection(nextSection);

    // Scroll to new section with simple retry
    if (scrollToSectionFn.current) {
      const scrollFn = scrollToSectionFn.current;
      
      // Immediate scroll attempt
      scrollFn(nextSection);
      
      // Backup scroll after component loads
      setTimeout(() => scrollFn(nextSection), 200);
    }
    
    // Release navigation lock
    setTimeout(() => {
      navLock.current = false;
    }, 500);
  };
  
  // Listen for auto-scroll events to advance sections
  useEffect(() => {
    const handleGoToSection = (event: CustomEvent) => {
      const { toSection, reason } = event.detail;
      console.log('🟢 QuestionnaireLayout: Received goToSection event:', { toSection, reason });
      
      if (toSection <= 4) {
        // Use the same logic as handleSectionComplete to ensure proper navigation
        handleSectionComplete(toSection);
      }
    };

    window.addEventListener('questionnaire:goToSection', handleGoToSection as EventListener);
    return () => {
      window.removeEventListener('questionnaire:goToSection', handleGoToSection as EventListener);
    };
  }, [handleSectionComplete]);
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return <div className={`${isModal ? 'w-full h-auto min-h-fit' : 'fixed inset-0 bg-transparent z-50 flex items-center justify-center p-2 sm:p-4'}`}>
      <div className={`${isModal ? 'w-full max-w-4xl mx-auto h-auto max-h-[92dvh] flex flex-col' : 'w-full max-w-5xl max-h-[98dvh] sm:max-h-[90dvh] flex flex-col'} ${
        // Force desktop styling on tablet and above
        isTabletDesktop 
          ? 'border-white/20 rounded-3xl bg-gradient-to-br from-burgundy-900/95 to-burgundy-800/90 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10'
          : 'border border-white/15 rounded-xl sm:rounded-2xl bg-burgundy-900/90 backdrop-blur-xl shadow-xl shadow-black/20 ring-1 ring-white/8'
      } overflow-hidden relative ${
        isTabletDesktop
          ? 'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none'
          : 'before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-white/3 before:to-transparent before:pointer-events-none'
      } animate-scale-in`}>
        
        <div ref={scrollContainerRef} data-scroll-container className="flex-1 overflow-y-auto overscroll-contain pb-safe scrollbar-sleek" style={{ scrollPaddingTop: `${headerHeight}px`, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', overflowAnchor: 'none' as any }}>
          {/* Sticky header and navigation - always visible, responsive design */}
          <div ref={stickyHeaderRef} data-sticky-header className={isTabletDesktop ? 'sticky top-0 z-20 backdrop-blur-sm' : 'sticky top-0 z-20 backdrop-blur-sm'}>
            <QuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

            <div className="hidden md:block bg-burgundy-800/20 backdrop-blur-sm border-b border-white/[0.08] px-3 py-1 sm:px-4 sm:py-2 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/15 to-transparent"></div>
              <SectionNavigation currentSection={currentSection} profileData={profileData} onSectionClick={handleSectionClick} />
            </div>
          </div>

          <QuestionnaireContent
            profileData={profileData} 
            updateField={updateField} 
            handleMultiSelect={handleMultiSelect} 
            currentSection={currentSection} 
            containerRef={scrollContainerRef}
            headerOffsetPx={headerHeight}
            onScrollToSection={scrollFn => {
              scrollToSectionFn.current = scrollFn;
            }} 
            onSectionComplete={handleSectionComplete} 
          />
          
          {/* Minimal bottom padding */}
          <div className="pb-6 sm:pb-10" />
        </div>

        <CleanQuestionnaireFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={false} />
      </div>
    </div>;
};
export default QuestionnaireLayout;