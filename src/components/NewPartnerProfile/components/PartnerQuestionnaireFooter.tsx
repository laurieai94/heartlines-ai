import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { PartnerProfileData } from "../types";
import { calculatePartnerProgress, validatePartnerSection } from "../utils/partnerValidation";
import { useState, useEffect, useMemo } from "react";

interface PartnerQuestionnaireFooterProps {
  profileData: PartnerProfileData;
  onComplete: () => void;
  autoCompleteEnabled?: boolean;
}

const PartnerQuestionnaireFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false
}: PartnerQuestionnaireFooterProps) => {
  const overallProgress = calculatePartnerProgress(profileData);
  
  // Listen for profile updates to recalculate validation in real-time
  const [validationKey, setValidationKey] = useState(0);

  useEffect(() => {
    const handleProfileUpdate = () => {
      // Force re-validation by triggering state change
      setValidationKey(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    };
  }, []);
  
  // Check if all required fields are complete with real-time validation
  const canComplete = useMemo(() => {
    const hasName = !!profileData.partnerName?.trim();
    const hasPronouns = !!profileData.partnerPronouns?.trim();
    const hasLoveLanguage = profileData.partnerLoveLanguage?.length > 0;
    const hasAttachmentStyle = !!profileData.partnerAttachmentStyle?.trim();
    
    console.log('[PartnerFooter] Required fields check:', {
      hasName,
      hasPronouns,
      hasLoveLanguage,
      hasAttachmentStyle,
      canComplete: hasName && hasPronouns && hasLoveLanguage && hasAttachmentStyle
    });
    
    return hasName && hasPronouns && hasLoveLanguage && hasAttachmentStyle;
  }, [profileData.partnerName, profileData.partnerPronouns, profileData.partnerLoveLanguage, profileData.partnerAttachmentStyle, validationKey]);
  
  // Get completion status for each section
  const sectionCompletions = [
    validatePartnerSection(1, profileData),
    validatePartnerSection(2, profileData),
    validatePartnerSection(3, profileData)
  ];

  // Only show footer when all sections are complete (matching personal profile logic)
  if (overallProgress < 100) {
    return null;
  }

  return (
    <div className="p-6 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-center items-center flex-shrink-0">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center">
            <Heart className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-medium text-white/90">
            All sections complete!
          </div>
        </div>
        
        <Button
          onClick={onComplete}
          disabled={!canComplete}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-3 px-8 py-3 text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 font-semibold"
        >
          <Heart className="w-4 h-4" />
          unlock kai ai coach
        </Button>
        
        <p className="text-white/70 text-sm max-w-md">
          you're ready to start your personalized relationship coaching journey with kai!
        </p>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireFooter;