import { useState, useRef, useEffect } from "react";
import { PartnerProfileData } from "../types";
import { validatePartnerSection, calculatePartnerProgress } from "../utils/partnerValidation";
import { useCurrentSectionDetection } from "../../NewPersonalQuestionnaire/hooks/useCurrentSectionDetection";
import PartnerSectionNavigation from "./PartnerSectionNavigation";
import PartnerQuestionnaireHeader from "./PartnerQuestionnaireHeader";
import PartnerQuestionnaireContent from "./PartnerQuestionnaireContent";
import CleanPartnerFooter from "./CleanPartnerFooter";
interface PartnerQuestionnaireLayoutProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  onComplete: (skipPopup?: boolean) => void;
  onClose: () => void;
  isModal?: boolean;
  onAutoComplete?: () => void;
}
const PartnerQuestionnaireLayout = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  onAutoComplete
}: PartnerQuestionnaireLayoutProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTabletDesktop, setIsTabletDesktop] = useState(false);
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const navLock = useRef(false);
  const overallProgress = calculatePartnerProgress(profileData);

  // Auto section detection hook with partner section prefix
  const handleSectionChange = (section: number) => {
    // Only update section if not in the middle of programmatic navigation
    if (!navLock.current) {
      setCurrentSection(section);
    }
  };
  useCurrentSectionDetection(handleSectionChange, 'partner-section-');

  // Track tablet/desktop state and measure header height
  useEffect(() => {
    const updateLayout = () => {
      const isTabletOrDesktop = window.innerWidth >= 640;
      setIsTabletDesktop(isTabletOrDesktop);
      
      // Always measure header height on all screen sizes
      if (stickyHeaderRef.current) {
        const height = stickyHeaderRef.current.offsetHeight;
        setHeaderHeight(height);
      } else {
        setHeaderHeight(0);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Listen for auto-advance events from useAutoScroll
  useEffect(() => {
    const handleGoToSection = (event: CustomEvent) => {
      const { toSection, sectionType } = event.detail;
      console.log('🟡 PartnerQuestionnaireLayout: Received goToSection event:', toSection, sectionType);
      
      // Only handle partner section events
      if (sectionType === 'partner') {
        handleSectionComplete(toSection);
      }
    };

    window.addEventListener('questionnaire:goToSection', handleGoToSection as EventListener);
    return () => window.removeEventListener('questionnaire:goToSection', handleGoToSection as EventListener);
  }, []);

  // Handle section completion via continue buttons
  const handleSectionComplete = (nextSection: number) => {
    console.debug('🟠 Partner Layout: Section transition to:', nextSection);
    
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
    } else {
      console.warn('🔶 Partner: No scroll function available');
    }
    
    // Release navigation lock
    setTimeout(() => {
      navLock.current = false;
    }, 500);
  };

  // Auto-advance logic (same as personal profile)
  const handleSectionAutoAdvance = () => {
    const isSection1Complete = validatePartnerSection(1, profileData);
    const isSection2Complete = validatePartnerSection(2, profileData);
    const isSection3Complete = validatePartnerSection(3, profileData);
    if (currentSection === 1 && isSection1Complete && !isSection2Complete) {
      handleSectionComplete(2);
    } else if (currentSection === 2 && isSection2Complete && !isSection3Complete) {
      handleSectionComplete(3);
    }
  };
  const handleSectionClick = (section: number) => {
    setCurrentSection(section);

    // Scroll to the selected section using ref
    if (scrollToSectionFn.current) {
      scrollToSectionFn.current(section);
    }
  };
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return <div className={`${isModal ? 'w-full h-full' : 'fixed inset-0 bg-transparent z-50 flex items-center justify-center p-2 sm:p-4'}`}>
      <div className={`${isModal ? 'w-full h-full flex flex-col' : 'w-full max-w-5xl max-h-[98dvh] sm:max-h-[90dvh] flex flex-col'} ${
        // Force desktop styling on tablet and above
        isTabletDesktop 
          ? 'border-white/20 rounded-3xl bg-gradient-to-br from-burgundy-900/95 to-burgundy-800/90 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10'
          : 'border border-white/15 rounded-xl sm:rounded-2xl bg-burgundy-900/90 backdrop-blur-xl shadow-xl shadow-black/20 ring-1 ring-white/8'
      } overflow-hidden relative ${
        isTabletDesktop
          ? 'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none'
          : 'before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-white/3 before:to-transparent before:pointer-events-none'
      } animate-scale-in`}>
        
        <div ref={scrollContainerRef} data-scroll-container className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-safe scrollbar-sleek touch-pan-y snap-flow-container" style={{ scrollPaddingTop: `${headerHeight}px`, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', scrollSnapType: 'y proximity' }}>
          {/* Sticky header and navigation - always visible, responsive design */}
          <div ref={stickyHeaderRef} data-sticky-header className={isTabletDesktop ? 'sticky top-0 z-20 backdrop-blur-sm' : 'sticky top-0 z-20 backdrop-blur-sm'}>
            <PartnerQuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

            <div className="hidden md:block bg-burgundy-800/20 backdrop-blur-sm border-b border-white/[0.08] px-3 py-1 sm:px-4 sm:py-2 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/15 to-transparent"></div>
              <PartnerSectionNavigation currentSection={currentSection} profileData={profileData} onSectionClick={handleSectionClick} />
            </div>
          </div>

          <PartnerQuestionnaireContent
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

        <CleanPartnerFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={!!onAutoComplete} />
      </div>
    </div>;
};
export default PartnerQuestionnaireLayout;