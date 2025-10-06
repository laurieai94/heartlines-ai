
import React from "react";
import QuestionnaireSection1 from "./QuestionnaireSection1";
import QuestionnaireSection2 from "./QuestionnaireSection2";
import QuestionnaireSection3 from "./QuestionnaireSection3";
import QuestionnaireSection4 from "./QuestionnaireSection4";

interface QuestionnaireContentProps {
  currentSection: number;
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  sectionReadiness: { [key: number]: boolean };
}

const QuestionnaireContent = ({
  currentSection,
  profileData,
  updateField,
  handleMultiSelect,
  sectionReadiness
}: QuestionnaireContentProps) => {
  return (
    <div className="bg-black/5 no-scrollbar">
      <div className="px-4 py-8 space-y-8">
        <div id="section-1">
          <QuestionnaireSection1 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[1]}
          />
        </div>
        
        <div id="section-2">
          <QuestionnaireSection2 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[2]}
          />
        </div>
        
        <div id="section-3">
          <QuestionnaireSection3 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[3]}
          />
        </div>
        
        <div id="section-4">
          <QuestionnaireSection4 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[4]}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContent;
