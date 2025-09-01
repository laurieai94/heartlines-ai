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
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const overallProgress = calculatePartnerProgress(profileData);

  // Auto section detection hook (same as personal profile)
  useCurrentSectionDetection(setCurrentSection);

  // Measure sticky header height on tablet and desktop
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (stickyHeaderRef.current && window.innerWidth >= 640) {
        const height = stickyHeaderRef.current.offsetHeight;
        setHeaderHeight(height);
      } else {
        setHeaderHeight(0);
      }
    };

    measureHeaderHeight();
    window.addEventListener('resize', measureHeaderHeight);
    return () => window.removeEventListener('resize', measureHeaderHeight);
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

    return <div className={`${isModal ? 'w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center p-4'}`}>
      <div className={`${isModal ? 'w-full max-w-4xl mx-auto h-auto max-h-[88vh] flex flex-col' : 'w-full max-w-5xl max-h-[90vh] flex flex-col'} border border-white/20 rounded-3xl bg-gradient-to-br from-burgundy-900/95 to-burgundy-800/90 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10 overflow-hidden relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none animate-scale-in`}>
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ scrollPaddingTop: `${headerHeight}px` }}>
          {/* Sticky header and navigation on tablet and desktop */}
          <div ref={stickyHeaderRef} className="sm:sticky sm:top-0 sm:z-20 sm:backdrop-blur-sm">
            <PartnerQuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

            <div className="hidden sm:block bg-burgundy-800/30 backdrop-blur-sm border-b border-white/[0.12] px-3 py-1.5 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/20 to-transparent"></div>
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
        </div>

        <CleanPartnerFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={!!onAutoComplete} />
      </div>
    </div>;
};
export default PartnerQuestionnaireLayout;