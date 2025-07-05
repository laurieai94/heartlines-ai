
import { useState } from "react";
import { toast } from "sonner";
import PartnerQuestionnaireHeader from "./PartnerQuestionnaireHeader";
import PartnerSectionNavigation from "./PartnerSectionNavigation";
import PartnerQuestionnaireFooter from "./PartnerQuestionnaireFooter";
import PartnerQuestionnaireContent from "./PartnerQuestionnaireContent";
import { validatePartnerSection, getPartnerRequiredCount, getPartnerCompletedCount } from "./PartnerValidationLogic";

interface PartnerQuestionnaireContainerProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
  setShowSuccess: (show: boolean) => void;
}

const PartnerQuestionnaireContainer = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  setShowSuccess
}: PartnerQuestionnaireContainerProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  const handleNext = () => {
    if (!validatePartnerSection(currentSection, profileData)) {
      toast.error("Please complete all required questions in this section");
      return;
    }

    if (currentSection < 4) {
      const nextSection = currentSection + 1;
      setSectionReadiness(prev => ({ ...prev, [nextSection]: true }));
      setCurrentSection(nextSection);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    if (!validatePartnerSection(4, profileData)) {
      toast.error("Please answer at least one question in Background section");
      return;
    }

    // Show success state briefly
    setShowSuccess(true);
    
    setTimeout(() => {
      const completedData = {
        ...profileData,
        completedAt: new Date().toISOString(),
        profileSource: 'partner-questionnaire'
      };
      
      toast.success("🎉 Partner Profile Complete!", {
        duration: 3000,
      });
      
      onComplete({
        type: 'partner',
        completionData: completedData
      });
    }, 2000);
  };

  const handleSectionClick = (section: number) => {
    const isAccessible = sectionReadiness[section];
    const isCompleted = section < currentSection || validatePartnerSection(section, profileData);
    
    if (isAccessible || isCompleted) {
      setCurrentSection(section);
      setSectionReadiness(prev => ({ ...prev, [section]: true }));
    }
  };

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'} overflow-hidden`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-2xl h-[70vh]'} overflow-hidden flex flex-col border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        
        <PartnerQuestionnaireHeader 
          onClose={onClose}
          currentSection={currentSection}
          totalSections={4}
          profileData={profileData}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <PartnerSectionNavigation
            currentSection={currentSection}
            sectionReadiness={sectionReadiness}
            validateSection={(section) => validatePartnerSection(section, profileData)}
            getRequiredCount={(section) => getPartnerRequiredCount(section, profileData)}
            getCompletedCount={(section) => getPartnerCompletedCount(section, profileData)}
            onSectionClick={handleSectionClick}
            profileData={profileData}
          />
        </div>

        <PartnerQuestionnaireContent
          currentSection={currentSection}
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          sectionReadiness={sectionReadiness}
        />

        <PartnerQuestionnaireFooter
          currentSection={currentSection}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          validateSection={(section) => validatePartnerSection(section, profileData)}
          getRequiredCount={(section) => getPartnerRequiredCount(section, profileData)}
          getCompletedCount={(section) => getPartnerCompletedCount(section, profileData)}
          profileData={profileData}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireContainer;
