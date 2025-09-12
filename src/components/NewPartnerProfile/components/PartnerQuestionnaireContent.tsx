import { useState, useEffect, lazy, Suspense } from "react";
import { PartnerProfileData } from "../types";

// Lazy load sections for better initial performance
const PartnerBasics = lazy(() => import("./sections/PartnerBasics"));
const PartnerOperations = lazy(() => import("./sections/PartnerOperations"));
const PartnerFoundation = lazy(() => import("./sections/PartnerFoundation"));

interface PartnerQuestionnaireContentProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  currentSection: number;
  onSectionComplete: (nextSection: number) => void;
}

const PartnerQuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  onSectionComplete
}: PartnerQuestionnaireContentProps) => {
  const [isTabletDesktop, setIsTabletDesktop] = useState(false);

  // Track tablet/desktop state
  useEffect(() => {
    const updateLayout = () => {
      setIsTabletDesktop(window.innerWidth >= 640);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

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
        {currentSection === 1 && (
          <div id="partner-section-1" data-section="1">
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
        )}
        
        {currentSection === 2 && (
          <div id="partner-section-2" data-section="2">
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
        
        {currentSection === 3 && (
          <div id="partner-section-3" data-section="3">
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