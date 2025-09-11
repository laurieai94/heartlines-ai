
import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { ProfileData } from "../types";
import { useAutoScroll } from "../hooks/useAutoScroll";
import WhoYouAre from "./sections/WhoYouAre";

// Lazy load sections for better initial performance
const YourRelationship = lazy(() => import("./sections/YourRelationship"));
const HowYouOperate = lazy(() => import("./sections/HowYouOperate"));
const YourFoundation = lazy(() => import("./sections/YourFoundation"));

// Prefetch next sections during idle time
const prefetchSection = (sectionName: string) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      if (sectionName === 'YourRelationship') {
        import("./sections/YourRelationship");
      } else if (sectionName === 'HowYouOperate') {
        import("./sections/HowYouOperate");
      } else if (sectionName === 'YourFoundation') {
        import("./sections/YourFoundation");
      }
    });
  }
};

interface QuestionnaireContentProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  currentSection: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  headerOffsetPx?: number;
  
  
}

const QuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  containerRef,
  headerOffsetPx = 0
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

  // Prefetch next section when current section becomes active
  useEffect(() => {
    if (currentSection === 1) {
      prefetchSection('YourRelationship');
    } else if (currentSection === 2) {
      prefetchSection('HowYouOperate');
    } else if (currentSection === 3) {
      prefetchSection('YourFoundation');
    }
  }, [currentSection]);

  // Scroll logic removed - handled by FlowContext now

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
        <div id="section-1" data-section="1" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 cv-auto-tall">
        <WhoYouAre
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isActive={currentSection === 1}
        />
        </div>

        {/* Keep sections mounted once visited to prevent collapse */}
        {(currentSection >= 2) && (
          <div id="section-2" data-section="2" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 cv-auto-tall">
            <Suspense fallback={<SectionSkeleton />}>
              <YourRelationship
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 2}
              />
            </Suspense>
          </div>
        )}

        {(currentSection >= 3) && (
          <div id="section-3" data-section="3" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 cv-auto-tall">
            <Suspense fallback={<SectionSkeleton />}>
              <HowYouOperate
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 3}
              />
            </Suspense>
          </div>
        )}

        {(currentSection >= 4) && (
          <div id="section-4" data-section="4" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 cv-auto-tall">
            <Suspense fallback={<SectionSkeleton />}>
              <YourFoundation
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 4}
              />
            </Suspense>
          </div>
        )}
      </div>
  );
};

export default QuestionnaireContent;
