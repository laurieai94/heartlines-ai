import { useState, useRef, useEffect } from "react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireHeader from "./QuestionnaireHeader";
import QuestionnaireContent from "./QuestionnaireContent";
import CleanQuestionnaireFooter from "./CleanQuestionnaireFooter";
import QuestionNavigator from "./QuestionNavigator";
import QuestionProgress from "./QuestionProgress";
import QuickActions from "./QuickActions";
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

  // Simple section management - no intersection observers
  
  // Track tablet/desktop state and measure header height
  useEffect(() => {
    const updateLayout = () => {
      const isTabletOrDesktop = window.innerWidth >= 640;
      setIsTabletDesktop(isTabletOrDesktop);
      
      // Measure header height on ALL screen sizes for better mobile scrolling
      if (stickyHeaderRef.current) {
        const height = stickyHeaderRef.current.offsetHeight;
        setHeaderHeight(height);
        if (import.meta.env.DEV) {
          console.log('📏 QuestionnaireLayout: Header height measured:', height, 'isTabletDesktop:', isTabletOrDesktop);
        }
      } else {
        setHeaderHeight(0);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);
  
  const overallProgress = calculateProgress(profileData);

  // Section navigation handlers - no scroll logic needed for dedicated screens
  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < 4 && validateSection(currentSection, profileData)) {
      setCurrentSection(currentSection + 1);
    }
  };
  
  const handleSectionClick = (section: number) => {
    setCurrentSection(section);
  };

  const handleQuestionClick = (questionId: string) => {
    // Optional: Could emit event or perform additional logic when question is clicked
    console.log('Question clicked:', questionId);
  };

  // Auto-advance handled by flow context now
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
        
        <div ref={scrollContainerRef} data-scroll-container className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-safe scrollbar-sleek touch-pan-y" style={{ scrollPaddingTop: `${headerHeight}px`, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', overflowAnchor: 'none' as any, touchAction: 'pan-y' }}>
          {/* Sticky header and navigation - always visible, responsive design */}
          <div ref={stickyHeaderRef} data-sticky-header className={isTabletDesktop ? 'sticky top-0 z-20 backdrop-blur-sm' : 'sticky top-0 z-20 backdrop-blur-sm'}>
            <QuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

            <div className="hidden md:block bg-burgundy-800/20 backdrop-blur-sm border-b border-white/[0.08] px-3 py-1 sm:px-4 sm:py-2 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/15 to-transparent"></div>
              <SectionNavigation currentSection={currentSection} profileData={profileData} onSectionClick={handleSectionClick} />
            </div>

            {/* Navigation Tools Row */}
            <div className="bg-burgundy-800/10 backdrop-blur-sm border-b border-white/[0.05] px-3 py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <QuestionNavigator 
                  profileData={profileData}
                  currentSection={currentSection}
                  onQuestionClick={handleQuestionClick}
                />
                <QuestionProgress 
                  profileData={profileData}
                  currentSection={currentSection}
                />
              </div>
              <QuickActions 
                profileData={profileData}
                currentSection={currentSection}
              />
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
          <div className="pb-6 sm:pb-10" />
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
    </div>;
};
export default QuestionnaireLayout;