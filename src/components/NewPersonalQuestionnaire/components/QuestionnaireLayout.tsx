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
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  // Use intersection observer to detect current section during scroll
  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
  };
  useCurrentSectionDetection(handleSectionChange);
  
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
  
  const overallProgress = calculateProgress(profileData);

  // Handle section completion via continue buttons
  const handleSectionComplete = (nextSection: number) => {
    setCurrentSection(nextSection);

    // Scroll to the next section using ref
    if (scrollToSectionFn.current) {
      setTimeout(() => {
        scrollToSectionFn.current!(nextSection);
      }, 200);
    }
  };
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

  return <div className={`${isModal ? 'w-full h-auto min-h-fit' : 'fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4'}`}>
      <div className={`${isModal ? 'w-full max-w-4xl mx-auto h-auto max-h-[88vh] flex flex-col' : 'w-full max-w-5xl max-h-[90vh] flex flex-col'} border border-white/15 sm:border-white/20 rounded-2xl sm:rounded-3xl bg-burgundy-900/90 sm:bg-gradient-to-br sm:from-burgundy-900/95 sm:to-burgundy-800/90 backdrop-blur-xl sm:backdrop-blur-2xl shadow-xl sm:shadow-2xl shadow-black/20 sm:shadow-black/30 ring-1 ring-white/8 sm:ring-white/10 overflow-hidden relative before:absolute before:inset-0 before:rounded-2xl sm:before:rounded-3xl before:bg-gradient-to-br before:from-white/3 sm:before:from-white/5 before:to-transparent before:pointer-events-none animate-scale-in`}>
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ scrollPaddingTop: `${headerHeight}px` }}>
          {/* Sticky header and navigation on tablet and desktop */}
          <div ref={stickyHeaderRef} className="sm:sticky sm:top-0 sm:z-20 sm:backdrop-blur-sm">
            <QuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

            <div className="hidden sm:block bg-burgundy-800/30 backdrop-blur-sm border-b border-white/[0.12] px-3 py-1.5 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/20 to-transparent"></div>
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
        </div>

        <CleanQuestionnaireFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={false} />
      </div>
    </div>;
};
export default QuestionnaireLayout;