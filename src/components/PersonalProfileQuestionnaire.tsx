
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import QuestionnaireHeader from "./PersonalProfileQuestionnaire/QuestionnaireHeader";
import QuestionnaireFooter from "./PersonalProfileQuestionnaire/QuestionnaireFooter";
import QuestionnaireSuccess from "./PersonalProfileQuestionnaire/QuestionnaireSuccess";
import QuestionnaireLoading from "./PersonalProfileQuestionnaire/QuestionnaireLoading";
import QuestionnaireContent from "./PersonalProfileQuestionnaire/QuestionnaireContent";
import { useQuestionnaireState } from "./PersonalProfileQuestionnaire/QuestionnaireState";
import { useQuestionnaireActions } from "./PersonalProfileQuestionnaire/QuestionnaireActions";
import { validateSection, getRequiredCount, getCompletedCount } from "./PersonalProfileQuestionnaire/ValidationLogic";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PersonalProfileQuestionnaireProps) => {
  const { profileData, isLoading, updateField, handleMultiSelect } = usePersonalProfileData();
  const {
    currentSection,
    setCurrentSection,
    showSuccess,
    setShowSuccess,
    contentRef,
    sectionReadiness,
    setSectionReadiness
  } = useQuestionnaireState();

  const {
    handleNext,
    handleBack,
    handleComplete,
    handleSectionClick
  } = useQuestionnaireActions({
    profileData,
    currentSection,
    setCurrentSection,
    setSectionReadiness,
    setShowSuccess,
    onComplete
  });

  if (isLoading) {
    return <QuestionnaireLoading />;
  }

  // Success state
  if (showSuccess) {
    return <QuestionnaireSuccess isModal={isModal} />;
  }

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'} overflow-hidden`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-2xl h-[70vh]'} overflow-hidden flex flex-col border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        
        <QuestionnaireHeader 
          onClose={onClose}
          currentSection={currentSection}
          totalSections={4}
          profileData={profileData}
        />

        <QuestionnaireContent
          contentRef={contentRef}
          currentSection={currentSection}
          sectionReadiness={sectionReadiness}
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          onSectionClick={(section) => handleSectionClick(section, sectionReadiness)}
        />

        <QuestionnaireFooter
          currentSection={currentSection}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          validateSection={(section) => validateSection(section, profileData)}
          getRequiredCount={(section) => getRequiredCount(section, profileData)}
          getCompletedCount={(section) => getCompletedCount(section, profileData)}
          profileData={profileData}
        />
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
