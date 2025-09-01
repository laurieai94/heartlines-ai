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
  const overallProgress = calculatePartnerProgress(profileData);

  // Auto section detection hook with partner section prefix
  useCurrentSectionDetection(setCurrentSection, 'partner-section-');

  // Track tablet/desktop state and measure header height
  useEffect(() => {
    const updateLayout = () => {
      const isTabletOrDesktop = window.innerWidth >= 640;
      setIsTabletDesktop(isTabletOrDesktop);
      
      if (stickyHeaderRef.current && isTabletOrDesktop) {
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

  // Handle section completion via continue buttons with auto-advance
  const handleSectionComplete = (nextSection: number) => {
    setCurrentSection(nextSection);

    // Scroll to the next section using ref
    if (scrollToSectionFn.current) {
      setTimeout(() => {
        scrollToSectionFn.current!(nextSection);
      }, 200);
    }
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

    return <div className={`${isModal ? 'w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'}`}>
      <div className={`${isModal ? 'w-full max-w-4xl mx-auto h-auto max-h-[88vh] flex flex-col' : 'w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col'} ${
        // Force desktop styling on tablet and above
        isTabletDesktop 
          ? 'border border-white/20 rounded-3xl bg-gradient-to-br from-burgundy-900/95 to-burgundy-800/90 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10'
          : 'border border-white/15 rounded-xl sm:rounded-2xl bg-burgundy-900/90 backdrop-blur-xl shadow-xl shadow-black/20 ring-1 ring-white/8'
      } overflow-hidden relative ${
        isTabletDesktop
          ? 'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none'
          : 'before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-white/3 before:to-transparent before:pointer-events-none'
      } animate-scale-in`}>
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ scrollPaddingTop: `${headerHeight}px` }}>
          {/* Sticky header and navigation - always visible, responsive design */}
          <div ref={stickyHeaderRef} className={isTabletDesktop ? 'sticky top-0 z-20 backdrop-blur-sm' : 'sticky top-0 z-20 backdrop-blur-sm'}>
            <PartnerQuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

            <div className="bg-burgundy-800/20 backdrop-blur-sm border-b border-white/[0.08] px-3 py-1 sm:px-4 sm:py-2 flex-shrink-0 relative">
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
            onSectionComplete={handleSectionAutoAdvance} 
          />
          
          {/* Minimal bottom padding */}
          <div className="pb-12" />
        </div>

        <CleanPartnerFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={!!onAutoComplete} />
      </div>
    </div>;
};
export default PartnerQuestionnaireLayout;