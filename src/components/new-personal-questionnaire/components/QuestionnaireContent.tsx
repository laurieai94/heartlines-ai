
import { useRef, useState } from "react";
import { ProfileData } from "../types";
import { useAutoScroll } from "../hooks/useAutoScroll";
// Direct imports for instant loading - no lazy loading
import WhoYouAre from "./sections/WhoYouAre";
import YourRelationship from "./sections/YourRelationship";
import HowYouOperate from "./sections/HowYouOperate";
import YourFoundation from "./sections/YourFoundation";
import { useGlobalResize } from '@/hooks/useGlobalResize';

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

  // Track tablet/desktop state using global resize manager
  useGlobalResize(() => {
    setIsTabletDesktop(window.innerWidth >= 640);
  }, []);

  return (
    <div className={`pt-0 md:pt-6 lg:pt-8 pb-1 space-y-2 ${isTabletDesktop ? 'px-8' : 'px-1'}`}>
        {/* Section 1: The Basics - Instant render */}
        {currentSection === 1 && (
          <WhoYouAre
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={true}
          />
        )}

        {/* Section 2: Your Situationship - Instant render */}
        {currentSection === 2 && (
          <YourRelationship
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={true}
          />
        )}

        {/* Section 3: How You Operate - Instant render */}
        {currentSection === 3 && (
          <HowYouOperate
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={true}
          />
        )}

        {/* Section 4: Your Foundation - Instant render */}
        {currentSection === 4 && (
          <YourFoundation
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={true}
          />
        )}
      </div>
  );
};

export default QuestionnaireContent;
