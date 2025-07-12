
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles } from "lucide-react";
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import SectionNavigation from "./SectionNavigation";
import WhoYouAre from "./sections/WhoYouAre";
import YourRelationship from "./sections/YourRelationship";
import HowYouOperate from "./sections/HowYouOperate";
import YourFoundation from "./sections/YourFoundation";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const overallProgress = calculateProgress(profileData);
  
  const scrollToSection = (sectionNumber: number) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(`section-${sectionNumber}`);
    
    if (container && element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      
      container.scrollTo({
        top: relativeTop - 32, // Add some padding from top
        behavior: 'smooth'
      });
    }
  };

  const handleSectionClick = (section: number) => {
    setCurrentSection(section);
    setTimeout(() => scrollToSection(section), 100);
  };

  const handleNext = () => {
    if (currentSection < 4) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setTimeout(() => scrollToSection(nextSection), 100);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setTimeout(() => scrollToSection(prevSection), 100);
    }
  };

  const canComplete = validateSection(4, profileData);

  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full h-full max-h-[90vh] flex flex-col' : 'w-full max-w-2xl max-h-[80vh] flex flex-col'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                {overallProgress === 100 ? (
                  <Heart className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-white">Your Profile</h2>
                <p className="text-sm text-white/70">
                  {overallProgress === 100 ? "Complete! Ready to start" : "Personalized for your messy reality"}
                </p>
              </div>
            </div>
            
            <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Progress</span>
              <span className="text-white font-medium">{overallProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
          <SectionNavigation
            currentSection={currentSection}
            profileData={profileData}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Content - Natural Flow with Fixed Padding */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="py-8 space-y-6">
            
            <div id="section-1" className="px-6">
              <WhoYouAre
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 1}
              />
            </div>

            <div id="section-2" className="px-6">
              <YourRelationship
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 2}
              />
            </div>

            <div id="section-3" className="px-6">
              <HowYouOperate
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 3}
              />
            </div>

            <div id="section-4" className="px-6">
              <YourFoundation
                profileData={profileData}
                updateField={updateField}
                handleMultiSelect={handleMultiSelect}
                isActive={currentSection === 4}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentSection === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
          >
            Back
          </Button>

          <div className="text-center flex-1 mx-6">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15 max-w-md mx-auto">
              <div className="text-sm text-white/90 font-medium">
                Section {currentSection} of 4
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {currentSection < 4 && (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Next
              </Button>
            )}
            {currentSection === 4 && (
              <Button
                onClick={onComplete}
                disabled={!canComplete}
                className={`${
                  overallProgress === 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                    : 'bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700'
                } text-white flex items-center gap-2 px-5 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 font-semibold`}
              >
                <Heart className="w-3 h-3" />
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
