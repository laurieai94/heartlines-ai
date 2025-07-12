
import { useRef } from "react";
import { ProfileData } from "../types";
import WhoYouAre from "./sections/WhoYouAre";
import YourRelationship from "./sections/YourRelationship";
import HowYouOperate from "./sections/HowYouOperate";
import YourFoundation from "./sections/YourFoundation";

interface QuestionnaireContentProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  currentSection: number;
}

const QuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection
}: QuestionnaireContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionNumber: number) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(`section-${sectionNumber}`);
    
    if (container && element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      
      container.scrollTo({
        top: relativeTop - 32,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="py-8 space-y-6">
        <div id="section-1" className="px-6">
          <WhoYouAre
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 1}
          />
        </div>

        <div id="section-2" className="px-6">
          <YourRelationship
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 2}
          />
        </div>

        <div id="section-3" className="px-6">
          <HowYouOperate
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 3}
          />
        </div>

        <div id="section-4" className="px-6">
          <YourFoundation
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 4}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContent;
