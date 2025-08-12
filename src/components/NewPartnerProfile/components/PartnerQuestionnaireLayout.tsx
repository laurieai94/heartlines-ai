import { useState, useRef } from "react";
import { PartnerProfileData } from "../types";
import { validatePartnerSection, calculatePartnerProgress } from "../utils/partnerValidation";
import { useCurrentSectionDetection } from "../../NewPersonalQuestionnaire/hooks/useCurrentSectionDetection";
import PartnerSectionNavigation from "./PartnerSectionNavigation";
import PartnerQuestionnaireHeader from "./PartnerQuestionnaireHeader";
import PartnerQuestionnaireContent from "./PartnerQuestionnaireContent";
import CleanPartnerFooter from "./CleanPartnerFooter";
interface PartnerQuestionnaireLayoutProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  onComplete: (skipPopup?: boolean) => void;
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

  // Auto section detection hook (same as personal profile)
  useCurrentSectionDetection(setCurrentSection);

  // Handle section completion via continue buttons with auto-advance
  const handleSectionComplete = (nextSection: number) => {
    setCurrentSection(nextSection);

    // Scroll to the next section using ref
    if (scrollToSectionFn.current) {
      setTimeout(() => {
        scrollToSectionFn.current!(nextSection);
      }, 200);
    }
  };

  // Auto-advance logic (same as personal profile)
  const handleSectionAutoAdvance = () => {
    const isSection1Complete = validatePartnerSection(1, profileData);
    const isSection2Complete = validatePartnerSection(2, profileData);
    const isSection3Complete = validatePartnerSection(3, profileData);
    if (currentSection === 1 && isSection1Complete && !isSection2Complete) {
      handleSectionComplete(2);
    } else if (currentSection === 2 && isSection2Complete && !isSection3Complete) {
      handleSectionComplete(3);
    }
  };
  const handleSectionClick = (section: number) => {
    setCurrentSection(section);

    // Scroll to the selected section using ref
    if (scrollToSectionFn.current) {
      scrollToSectionFn.current(section);
    }
  };
  return <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full max-w-4xl mx-auto h-auto max-h-[80vh] flex flex-col' : 'w-full max-w-6xl max-h-[90vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <PartnerQuestionnaireHeader overallProgress={overallProgress} onClose={onClose} profileData={profileData} />

        {/* Reassuring message banner */}
        <div className="bg-gradient-to-r from-primary/15 to-accent/15 px-6 py-3 flex-shrink-0 animate-fade-in backdrop-blur-sm">
          <p className="text-sm text-white/90 text-center">Situationship or soulmate? This profile flexes to your vibe—totally optional.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-2 flex-shrink-0">
          <PartnerSectionNavigation currentSection={currentSection} profileData={profileData} onSectionClick={handleSectionClick} />
        </div>

        <PartnerQuestionnaireContent profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} currentSection={currentSection} onScrollToSection={scrollFn => {
        scrollToSectionFn.current = scrollFn;
      }} onSectionComplete={handleSectionAutoAdvance} />

        <CleanPartnerFooter profileData={profileData} onComplete={onComplete} autoCompleteEnabled={!!onAutoComplete} />
      </div>
    </div>;
};
export default PartnerQuestionnaireLayout;