import { useState, useRef, useEffect } from "react";
import { PartnerProfileData } from "../types";
import { validatePartnerSection, calculatePartnerProgress } from "../utils/partnerValidation";
import PartnerSectionNavigation from "./PartnerSectionNavigation";
import PartnerQuestionnaireHeader from "./PartnerQuestionnaireHeader";
import PartnerQuestionnaireContent from "./PartnerQuestionnaireContent";
import CleanPartnerFooter from "./CleanPartnerFooter";
import MobileProfileBoundary from "@/components/MobileProfileBoundary";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useGlobalResize } from '@/hooks/useGlobalResize';
interface PartnerQuestionnaireLayoutProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  onComplete: (skipPopup?: boolean) => void;
  onClose: () => void;
  isModal?: boolean;
  onAutoComplete?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}
const PartnerQuestionnaireLayout = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  onAutoComplete,
  onDelete,
  canDelete
}: PartnerQuestionnaireLayoutProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTabletDesktop, setIsTabletDesktop] = useState(false);
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const overallProgress = calculatePartnerProgress(profileData);
  
  // Mobile detection
  const { isMobile } = useOptimizedMobile();

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
  }, []);

  // Use global resize manager
  useGlobalResize(() => {
    const isTabletOrDesktop = window.innerWidth >= 640;
    setIsTabletDesktop(isTabletOrDesktop);
    
    // Always measure header height on all screen sizes
    if (stickyHeaderRef.current) {
      const height = stickyHeaderRef.current.offsetHeight;
      setHeaderHeight(height);
    } else {
      setHeaderHeight(0);
    }
  }, []);

  const handleSectionClick = (section: number) => {
    setCurrentSection(section);

    // Scroll to the selected section using ref
    if (scrollToSectionFn.current) {
      scrollToSectionFn.current(section);
    }
  };

  const handleNextSection = () => {
    if (currentSection < 3) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      
      if (scrollToSectionFn.current) {
        scrollToSectionFn.current(nextSection);
      }
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      
      if (scrollToSectionFn.current) {
        scrollToSectionFn.current(prevSection);
      }
    }
  };
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
           
           <div ref={scrollContainerRef} data-scroll-container className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y" style={{ scrollPaddingTop: `${headerHeight}px`, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
             {/* Sticky header and navigation - always visible, responsive design */}
              <div ref={stickyHeaderRef} data-sticky-header className={isTabletDesktop ? 'sticky top-0 z-20 backdrop-blur-sm' : 'sticky top-0 z-20 backdrop-blur-sm'}>
                <PartnerQuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} onDelete={onDelete} canDelete={canDelete} />

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
               onSectionComplete={() => {}} 
             />
             
             {/* Minimal bottom padding */}
             <div className="pb-20 sm:pb-10" />
           </div>

           <CleanPartnerFooter 
             profileData={profileData} 
             onComplete={onComplete} 
             autoCompleteEnabled={!!onAutoComplete}
             currentSection={currentSection}
             onNextSection={handleNextSection}
             onPreviousSection={handlePreviousSection}
           />
         </div>
       </div>
     </MobileProfileBoundary>;
};
export default PartnerQuestionnaireLayout;