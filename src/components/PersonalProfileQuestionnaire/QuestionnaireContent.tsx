
import { RefObject } from "react";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireSection1 from "./QuestionnaireSection1";
import QuestionnaireSection2 from "./QuestionnaireSection2";
import QuestionnaireSection3 from "./QuestionnaireSection3";
import QuestionnaireSection4 from "./QuestionnaireSection4";
import { validateSection, getRequiredCount, getCompletedCount } from "./ValidationLogic";

interface QuestionnaireContentProps {
  contentRef: RefObject<HTMLDivElement>;
  currentSection: number;
  sectionReadiness: Record<number, boolean>;
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onSectionClick: (section: number) => void;
}

const QuestionnaireContent = ({
  contentRef,
  currentSection,
  sectionReadiness,
  profileData,
  updateField,
  handleMultiSelect,
  onSectionClick
}: QuestionnaireContentProps) => {
  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
        <SectionNavigation
          currentSection={currentSection}
          sectionReadiness={sectionReadiness}
          validateSection={(section) => validateSection(section, profileData)}
          getRequiredCount={(section) => getRequiredCount(section, profileData)}
          getCompletedCount={(section) => getCompletedCount(section, profileData)}
          onSectionClick={onSectionClick}
          profileData={profileData}
        />
      </div>

      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        <div className="px-2 py-1">
          <QuestionnaireSection1 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[1] && currentSection === 1}
          />
          <QuestionnaireSection2 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[2] && currentSection === 2}
          />
          <QuestionnaireSection3 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[3] && currentSection === 3}
          />
          <QuestionnaireSection4 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[4] && currentSection === 4}
          />
        </div>
      </div>
    </>
  );
};

export default QuestionnaireContent;
