import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PartnerProfileData } from "../types";
import { validatePartnerSection, getPartnerRequiredCount, getPartnerCompletedCount } from "../utils/partnerValidation";
import PartnerQuestionnaireHeader from "./PartnerQuestionnaireHeader";
import PartnerSectionNavigation from "./PartnerSectionNavigation";
import PartnerQuestionnaireContent from "./PartnerQuestionnaireContent";
import PartnerQuestionnaireFooter from "./PartnerQuestionnaireFooter";

interface PartnerQuestionnaireLayoutProps {
  profileData: PartnerProfileData;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
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
  const [sectionReadiness, setSectionReadiness] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  // Simple scroll utility
  const scrollToSection = (section: number) => {
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Enhanced data handling with localStorage
  const enhancedUpdateField = (field: string, value: any) => {
    updateField(field, value);
    const updatedData = { ...profileData, [field]: value };
    localStorage.setItem('new_partner_profile_questionnaire', JSON.stringify(updatedData));
  };

  const enhancedHandleMultiSelect = (field: string, value: string) => {
    handleMultiSelect(field, value);
    // Get current array value
    const currentValues = profileData[field as keyof PartnerProfileData] as string[] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    const updatedData = { ...profileData, [field]: updatedValues };
    localStorage.setItem('new_partner_profile_questionnaire', JSON.stringify(updatedData));
  };

  // Navigation logic
  const handleNext = () => {
    if (currentSection < 3) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      scrollToSection(nextSection);
      setSectionReadiness(prev => ({ ...prev, [nextSection]: true }));
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      scrollToSection(prevSection);
    }
  };

  const handleComplete = () => {
    // Validation: Only name and pronouns are required
    const hasRequiredName = profileData.partnerName && profileData.partnerName.trim() !== '';
    const hasRequiredPronouns = profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '';
    
    if (!hasRequiredName || !hasRequiredPronouns) {
      console.log('Cannot complete: Missing required fields');
      if (!hasRequiredName || !hasRequiredPronouns) {
        setCurrentSection(1);
        scrollToSection(1);
      }
      return;
    }

    // Save to localStorage before completing
    localStorage.setItem('new_partner_profile_questionnaire', JSON.stringify(profileData));
    
    console.log('Partner questionnaire completed with data:', profileData);
    onComplete();
  };

  const handleSectionClick = (section: number) => {
    if (sectionReadiness[section] || validatePartnerSection(section, profileData)) {
      setCurrentSection(section);
      scrollToSection(section);
      setSectionReadiness(prev => ({ ...prev, [section]: true }));
    }
  };

  // Auto-unlock next sections based on completion
  useEffect(() => {
    const newReadiness = { ...sectionReadiness };
    
    // Section 2 unlocks when section 1 has some progress
    if (getPartnerCompletedCount(1, profileData) > 0) {
      newReadiness[2] = true;
    }
    
    // Section 3 unlocks when section 2 has some progress
    if (getPartnerCompletedCount(2, profileData) > 0) {
      newReadiness[3] = true;
    }
    
    setSectionReadiness(newReadiness);
  }, [profileData]);

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 flex flex-col h-screen">
        <PartnerQuestionnaireHeader
          onClose={onClose}
          currentSection={currentSection}
          totalSections={3}
          profileData={profileData}
        />
        
        <div className="px-4 py-2">
          <PartnerSectionNavigation
            currentSection={currentSection}
            sectionReadiness={sectionReadiness}
            validateSection={(section) => validatePartnerSection(section, profileData)}
            getRequiredCount={(section) => getPartnerRequiredCount(section)}
            getCompletedCount={(section) => getPartnerCompletedCount(section, profileData)}
            onSectionClick={handleSectionClick}
            profileData={profileData}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <PartnerQuestionnaireContent
            currentSection={currentSection}
            profileData={profileData}
            updateField={enhancedUpdateField}
            handleMultiSelect={enhancedHandleMultiSelect}
            sectionReadiness={sectionReadiness}
          />
        </div>
        
        <PartnerQuestionnaireFooter
          currentSection={currentSection}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          validateSection={(section) => validatePartnerSection(section, profileData)}
          getRequiredCount={(section) => getPartnerRequiredCount(section)}
          getCompletedCount={(section) => getPartnerCompletedCount(section, profileData)}
          profileData={profileData}
        />
      </div>
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-transparent border-none">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};

export default PartnerQuestionnaireLayout;