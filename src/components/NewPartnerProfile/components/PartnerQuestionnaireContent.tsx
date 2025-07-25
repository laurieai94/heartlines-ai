import { useEffect } from "react";
import { PartnerProfileData } from "../types";
import PartnerBasics from "./sections/PartnerBasics";
import PartnerOperations from "./sections/PartnerOperations";
import PartnerFoundation from "./sections/PartnerFoundation";

interface PartnerQuestionnaireContentProps {
  currentSection: number;
  profileData: PartnerProfileData;
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
  
  const scrollToTop = () => {
    const contentContainer = document.querySelector('.questionnaire-content');
    if (contentContainer) {
      contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [currentSection]);

  return (
    <div className="questionnaire-content h-full overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <div className="px-6 py-8 space-y-12">
        
        {/* Prominent Opening Note - Only show on section 1 */}
        {currentSection === 1 && (
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/15 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Building Your Partner's Profile</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Help us understand your partner better so we can provide insights tailored to your unique dynamic. 
              Only their name and pronouns are required - everything else helps us give you better guidance.
            </p>
          </div>
        )}
        
        <div id="section-1">
          <PartnerBasics 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[1]}
          />
        </div>
        
        <div id="section-2">
          <PartnerOperations 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[2]}
          />
        </div>
        
        <div id="section-3">
          <PartnerFoundation 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isReady={sectionReadiness[3]}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireContent;