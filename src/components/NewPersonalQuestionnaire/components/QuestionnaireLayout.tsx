
import { useState, useEffect } from "react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import SectionNavigation from "./SectionNavigation";
import QuestionnaireHeader from "./QuestionnaireHeader";
import QuestionnaireContent from "./QuestionnaireContent";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface QuestionnaireLayoutProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onComplete: () => void;
  onClose: () => void;
  isModal?: boolean;
}

const QuestionnaireLayout = ({
  profileData,
  updateField,
  handleMultiSelect,
  onComplete,
  onClose,
  isModal = false
}: QuestionnaireLayoutProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [scrollToSectionFn, setScrollToSectionFn] = useState<((section: number) => void) | null>(null);
  
  const overallProgress = calculateProgress(profileData);

  // Auto-advance to next section when current section is complete
  useEffect(() => {
    const isCurrentSectionComplete = validateSection(currentSection, profileData);
    
    if (isCurrentSectionComplete && currentSection < 4) {
      const timer = setTimeout(() => {
        const nextSection = currentSection + 1;
        setCurrentSection(nextSection);
        
        // Auto-scroll to next section after brief delay
        if (scrollToSectionFn) {
          setTimeout(() => {
            scrollToSectionFn(nextSection);
          }, 200);
        }
      }, 800); // Brief delay to show section completion
      
      return () => clearTimeout(timer);
    }
  }, [currentSection, profileData, scrollToSectionFn]);

  const handleSectionClick = (section: number) => {
    setCurrentSection(section);
  };

  const handleNext = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const canComplete = validateSection(4, profileData);

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full max-h-[90vh] flex flex-col' : 'w-full max-w-2xl max-h-[80vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        <QuestionnaireHeader 
          overallProgress={overallProgress}
          onClose={onClose}
        />

        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <SectionNavigation
            currentSection={currentSection}
            profileData={profileData}
            onSectionClick={handleSectionClick}
          />
        </div>

        <QuestionnaireContent
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          currentSection={currentSection}
          onScrollToSection={setScrollToSectionFn}
        />

        <div className="p-4 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-center items-center flex-shrink-0">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/15">
              <div className="text-sm text-white/90 font-medium">
                Section {currentSection} of 4 • {Math.round(overallProgress)}% Complete
              </div>
            </div>
            {currentSection === 4 && canComplete && (
              <Button
                onClick={onComplete}
                className="mt-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-3 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Heart className="w-4 h-4" />
                Complete Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireLayout;
