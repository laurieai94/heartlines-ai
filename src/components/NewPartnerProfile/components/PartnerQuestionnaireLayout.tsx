import { useState, useRef } from "react";
import { PartnerProfileData } from "../types";
import { validatePartnerSection, calculatePartnerProgress } from "../utils/partnerValidation";
import PartnerSectionNavigation from "./PartnerSectionNavigation";
import PartnerQuestionnaireHeader from "./PartnerQuestionnaireHeader";
import PartnerQuestionnaireContent from "./PartnerQuestionnaireContent";
import PartnerQuestionnaireFooter from "./PartnerQuestionnaireFooter";

interface PartnerQuestionnaireLayoutProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  onComplete: () => void;
  onClose: () => void;
  isModal?: boolean;
  onAutoComplete?: () => void;
}

const PartnerQuestionnaireLayout = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  onAutoComplete
}: PartnerQuestionnaireLayoutProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const scrollToSectionFn = useRef<((section: number) => void) | null>(null);
  
  const overallProgress = calculatePartnerProgress(profileData);

  // Handle section completion via continue buttons
  const handleSectionComplete = (nextSection: number) => {
    setCurrentSection(nextSection);
    
    // Scroll to the next section using ref
    if (scrollToSectionFn.current) {
      setTimeout(() => {
        scrollToSectionFn.current!(nextSection);
      }, 200);
    }
  };

  const handleSectionClick = (section: number) => {
    setCurrentSection(section);
    
    // Scroll to the selected section using ref
    if (scrollToSectionFn.current) {
      scrollToSectionFn.current(section);
    }
  };

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full max-h-[95vh] flex flex-col' : 'w-full max-w-6xl max-h-[90vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <PartnerQuestionnaireHeader 
          overallProgress={overallProgress}
          onClose={onClose}
          profileData={profileData}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-2 flex-shrink-0">
          <PartnerSectionNavigation
            currentSection={currentSection}
            profileData={profileData}
            onSectionClick={handleSectionClick}
          />
        </div>

        <PartnerQuestionnaireContent
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          currentSection={currentSection}
          onScrollToSection={(scrollFn) => { scrollToSectionFn.current = scrollFn; }}
          onSectionComplete={handleSectionComplete}
        />

        <PartnerQuestionnaireFooter
          profileData={profileData}
          onComplete={onComplete}
          autoCompleteEnabled={!!onAutoComplete}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireLayout;