import { useState, useRef, useEffect, useMemo } from "react";
import { ProfileData } from "../types";
import { validateSectionOptimized, calculateProgressOptimized } from "../utils/optimizedValidation";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireHeader from "./QuestionnaireHeader";
import QuestionnaireContent from "./QuestionnaireContent";
import CleanQuestionnaireFooter from "./CleanQuestionnaireFooter";
import WelcomeBanner from "./WelcomeBanner";
import MobileProfileBoundary from "@/components/MobileProfileBoundary";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useGlobalResize } from '@/hooks/useGlobalResize';
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
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  
  // Mobile detection
  const { isMobile } = useOptimizedMobile();

  // Simple section management - no intersection observers
  
  // Optimized layout tracking with throttling and memoization
  useEffect(() => {
    let layoutTimer: NodeJS.Timeout | null = null;
    
    const updateLayout = () => {
      // Throttle layout updates to prevent excessive recalculations
      if (layoutTimer) clearTimeout(layoutTimer);
      
      layoutTimer = setTimeout(() => {
        const isTabletOrDesktop = window.innerWidth >= 640;
        setIsTabletDesktop(isTabletOrDesktop);
        
        // Defer header measurement to next frame
        requestAnimationFrame(() => {
          if (stickyHeaderRef.current) {
            const height = stickyHeaderRef.current.offsetHeight;
            setHeaderHeight(height);
            // Remove console logging for performance
          }
        });
      }, 100); // Throttle resize events
    };

    updateLayout();
    
    return () => {
      if (layoutTimer) clearTimeout(layoutTimer);
    };
  }, []);

  // Use global resize manager
  useGlobalResize(() => {
    const isTabletOrDesktop = window.innerWidth >= 640;
    setIsTabletDesktop(isTabletOrDesktop);
    
    // Defer header measurement to next frame
    requestAnimationFrame(() => {
      if (stickyHeaderRef.current) {
        const height = stickyHeaderRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    });
  }, []);
  
  // Memoize progress calculation to prevent unnecessary recalculations
  const overallProgress = useMemo(() => {
    return calculateProgressOptimized(profileData);
  }, [profileData]);

  // Section navigation handlers - no scroll logic needed for dedicated screens
  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < 4 && validateSectionOptimized(currentSection, profileData)) {
      setCurrentSection(currentSection + 1);
    }
  };
  
  const handleSectionClick = (section: number) => {
    setCurrentSection(section);
  };

  // Auto-advance handled by flow context now
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when section changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentSection]);

  // Component renders normally

  return <MobileProfileBoundary>
    <div className={`${isModal ? 'w-full h-full' : 'fixed inset-0 bg-transparent z-50 flex items-start sm:items-center justify-center p-0 sm:p-4'}`}>
      <div className={`${isModal ? 'w-full h-full flex flex-col' : 'w-full max-w-5xl max-h-[100dvh] sm:max-h-[70dvh] flex flex-col'} ${
        // Force desktop styling on tablet and above
        isTabletDesktop 
          ? 'border-white/20 rounded-3xl bg-gradient-to-br from-burgundy-800/95 to-burgundy-800/90 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10'
          : 'border border-white/15 rounded-xl sm:rounded-2xl bg-burgundy-800/90 backdrop-blur-xl shadow-xl shadow-black/20 ring-1 ring-white/8'
      } overflow-hidden relative ${
        isTabletDesktop
          ? 'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none'
          : 'before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-white/3 before:to-transparent before:pointer-events-none'
      } animate-scale-in`}>
        
        <div ref={scrollContainerRef} data-scroll-container className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y" style={{ scrollPaddingTop: `${headerHeight}px`, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', overflowAnchor: 'none' as any, touchAction: 'pan-y' }}>
          {/* Sticky header and navigation - always visible, responsive design */}
          <div ref={stickyHeaderRef} data-sticky-header className={isTabletDesktop ? 'sticky top-0 z-20 backdrop-blur-sm' : 'sticky top-0 z-20 backdrop-blur-sm'}>
            <QuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />
            
            <WelcomeBanner profileData={profileData} />

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
          />
          
          {/* Minimal bottom padding */}
          <div className="pb-20 sm:pb-10" />
        </div>

        <CleanQuestionnaireFooter 
          profileData={profileData} 
          onComplete={onComplete} 
          autoCompleteEnabled={false}
          currentSection={currentSection}
          onPreviousSection={handlePreviousSection}
          onNextSection={handleNextSection}
        />
      </div>
    </div>
  </MobileProfileBoundary>;
};
export default QuestionnaireLayout;