import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { PartnerProfileData } from "../types";
import { calculatePartnerProgress, validatePartnerSection } from "../utils/partnerValidation";

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
  
  // Check if minimum required fields are complete (name and pronouns)
  const canComplete = !!profileData.partnerName?.trim() && !!profileData.partnerPronouns?.trim();
  
  // Get completion status for each section
  const sectionCompletions = [
    validatePartnerSection(1, profileData),
    validatePartnerSection(2, profileData),
    validatePartnerSection(3, profileData)
  ];

  return (
    <div className="p-4 border-t border-white/15 bg-white/5 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Compact section progress indicators */}
          <div className="flex items-center gap-2">
            {sectionCompletions.map((isComplete, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  isComplete 
                    ? 'bg-emerald-500' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          
          <div className="text-sm text-white/70">
            AI relationship coach Kai is waiting...
          </div>
        </div>

        <div className="flex items-center gap-4">
          {canComplete && !autoCompleteEnabled && (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-2 text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Heart className="w-4 h-4" />
              Unlock RealTalk's AI Coach
            </Button>
          )}
          
          {canComplete && autoCompleteEnabled && (
            <div className="text-sm text-emerald-400 font-medium">
              ✨ Auto-completing soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireFooter;