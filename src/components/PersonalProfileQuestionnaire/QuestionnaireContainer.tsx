
import { useState, useEffect } from "react";
import { toast } from "sonner";
import QuestionnaireHeader from "./QuestionnaireHeader";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireFooter from "./QuestionnaireFooter";
import QuestionnaireContent from "./QuestionnaireContent";
import { validateSection, getRequiredCount, getCompletedCount } from "./ValidationLogic";

interface QuestionnaireContainerProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
  setShowSuccess: (show: boolean) => void;
}

const QuestionnaireContainer = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false,
  setShowSuccess
}: QuestionnaireContainerProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  // Bulletproof auto-scroll system
  const scrollToTop = () => {
    const container = document.getElementById('questionnaire-content');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const reliableScrollTo = (elementId: string, retries = 3) => {
    const attemptScroll = (attempt: number) => {
      console.log(`[AutoScroll] Attempt ${4 - attempt} for element: ${elementId}`);
      
      const element = document.querySelector(`[data-scroll-id="${elementId}"]`);
      
      if (!element) {
        console.log(`[AutoScroll] Element not found: ${elementId}`);
        if (attempt > 0) {
          setTimeout(() => attemptScroll(attempt - 1), 200);
        }
        return;
      }

      console.log(`[AutoScroll] Element found, scrolling to: ${elementId}`);
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    };

    // Wait for Radix UI animations, then attempt scroll
    setTimeout(() => attemptScroll(retries), 800);
  };

  // Global access for child components
  useEffect(() => {
    (window as any).reliableScroll = {
      toTop: scrollToTop,
      toElement: reliableScrollTo
    };
    
    return () => {
      delete (window as any).reliableScroll;
    };
  }, []);

  const handleNext = () => {
    if (!validateSection(currentSection, profileData)) {
      toast.error("Please complete all required questions in this section");
      return;
    }

    if (currentSection < 4) {
      const nextSection = currentSection + 1;
      setSectionReadiness(prev => ({ ...prev, [nextSection]: true }));
      setCurrentSection(nextSection);
      // Scroll to top when moving to next section
      setTimeout(scrollToTop, 150);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      // Scroll to top when going back
      setTimeout(scrollToTop, 150);
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

  const handleSectionClick = (section: number) => {
    const isAccessible = sectionReadiness[section];
    const isCompleted = section < currentSection || validateSection(section, profileData);
    
    if (isAccessible || isCompleted) {
      setCurrentSection(section);
      setSectionReadiness(prev => ({ ...prev, [section]: true }));
      // Scroll to top when switching sections
      setTimeout(scrollToTop, 150);
    }
  };

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full max-h-[90vh] flex flex-col' : 'w-full max-w-2xl max-h-[80vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <QuestionnaireHeader 
          onClose={onClose}
          currentSection={currentSection}
          totalSections={4}
          profileData={profileData}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <SectionNavigation
            currentSection={currentSection}
            sectionReadiness={sectionReadiness}
            validateSection={(section) => validateSection(section, profileData)}
            getRequiredCount={(section) => getRequiredCount(section, profileData)}
            getCompletedCount={(section) => getCompletedCount(section, profileData)}
            onSectionClick={handleSectionClick}
            profileData={profileData}
          />
        </div>

        <div id="questionnaire-content" className="flex-1 overflow-y-auto flex flex-col">
          <QuestionnaireContent
            currentSection={currentSection}
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            sectionReadiness={sectionReadiness}
          />
        </div>

        <div className="flex-shrink-0 border-t border-white/15 bg-white/10 backdrop-blur-xl">
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
    </div>
  );
};

export default QuestionnaireContainer;
