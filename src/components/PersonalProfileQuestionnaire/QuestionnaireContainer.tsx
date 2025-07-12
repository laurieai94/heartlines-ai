
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

  // Simple, reliable scroll system
  const scrollToTop = () => {
    const container = document.getElementById('questionnaire-content');
    if (container) {
      container.scrollTop = 0;
    }
  };

  const scrollToVisible = (elementId: string, delay = 600) => {
    setTimeout(() => {
      const container = document.getElementById('questionnaire-content');
      const element = document.querySelector(`[data-scroll-id="${elementId}"]`);
      
      if (container && element) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const containerTop = container.scrollTop;
        
        // Calculate element position relative to container
        const elementTop = containerTop + (elementRect.top - containerRect.top);
        const elementBottom = elementTop + elementRect.height;
        
        // Check if element is fully visible
        const viewportTop = containerTop;
        const viewportBottom = containerTop + containerRect.height;
        
        if (elementTop < viewportTop || elementBottom > viewportBottom) {
          // Scroll to center the element
          const scrollTarget = elementTop - (containerRect.height / 2) + (elementRect.height / 2);
          container.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }
      }
    }, delay);
  };

  // Global access for child components
  useEffect(() => {
    (window as any).simpleScroll = {
      toTop: scrollToTop,
      toVisible: scrollToVisible
    };
    
    return () => {
      delete (window as any).simpleScroll;
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

        <div id="questionnaire-content" className="flex-1 overflow-y-auto">
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
