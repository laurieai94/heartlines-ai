
import { useRef, useEffect } from "react";
import PartnerQuestionnaireSection1 from "./PartnerQuestionnaireSection1";
import PartnerQuestionnaireSection2 from "./PartnerQuestionnaireSection2";
import PartnerQuestionnaireSection3 from "./PartnerQuestionnaireSection3";
import PartnerQuestionnaireSection4 from "./PartnerQuestionnaireSection4";

interface PartnerQuestionnaireContentProps {
  currentSection: number;
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  sectionReadiness: { [key: number]: boolean };
}

const PartnerQuestionnaireContent = ({
  currentSection,
  profileData,
  updateField,
  handleMultiSelect,
  sectionReadiness
}: PartnerQuestionnaireContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when section changes
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Trigger scroll when section changes
  useEffect(() => {
    scrollToTop();
  }, [currentSection]);

  return (
    <div 
      ref={contentRef}
      className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
    >
      <div className="px-1.5 py-1">
        {/* Opening Note - only show on section 1 */}
        {currentSection === 1 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 mb-1.5">
            <p className="text-sm text-white/90 leading-relaxed">
              Whether you've been together 20 years or just started talking - answer what you know and skip what you don't. RealTalk works with whatever you can share.
            </p>
          </div>
        )}

        <PartnerQuestionnaireSection1 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[1] && currentSection === 1}
        />
        <PartnerQuestionnaireSection2 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[2] && currentSection === 2}
        />
        <PartnerQuestionnaireSection3 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[3] && currentSection === 3}
        />
        <PartnerQuestionnaireSection4 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[4] && currentSection === 4}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireContent;
