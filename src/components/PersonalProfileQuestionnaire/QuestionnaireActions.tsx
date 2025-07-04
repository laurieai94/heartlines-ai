
import { toast } from "sonner";
import { validateSection } from "./ValidationLogic";

interface QuestionnaireActionsProps {
  profileData: any;
  currentSection: number;
  setCurrentSection: (section: number) => void;
  setSectionReadiness: (updater: (prev: any) => any) => void;
  setShowSuccess: (show: boolean) => void;
  onComplete: (profileData: any) => void;
}

export const useQuestionnaireActions = ({
  profileData,
  currentSection,
  setCurrentSection,
  setSectionReadiness,
  setShowSuccess,
  onComplete
}: QuestionnaireActionsProps) => {
  
  const handleNext = () => {
    if (!validateSection(currentSection, profileData)) {
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
    if (!validateSection(4, profileData)) {
      toast.error("Please answer at least one question in Your Foundation section");
      return;
    }

    // Show success state briefly
    setShowSuccess(true);
    
    setTimeout(() => {
      const completedData = {
        ...profileData,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };
      
      toast.success("🎉 Profile Complete! Welcome to RealTalk!", {
        duration: 3000,
      });
      
      onComplete({
        type: 'personal',
        completionData: completedData
      });
    }, 2000);
  };

  const handleSectionClick = (section: number, sectionReadiness: any) => {
    const isAccessible = sectionReadiness[section];
    const isCompleted = section < currentSection || validateSection(section, profileData);
    
    if (isAccessible || isCompleted) {
      setCurrentSection(section);
      setSectionReadiness(prev => ({ ...prev, [section]: true }));
    }
  };

  return {
    handleNext,
    handleBack,
    handleComplete,
    handleSectionClick
  };
};
