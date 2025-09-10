import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare } from "lucide-react";
import { PartnerProfileData } from "../../types";
import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { usePartnerFlow } from "../../context/FlowContext";

interface PartnerNamePronounsCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete: boolean;
  onSectionComplete?: () => void;
}

const PartnerNamePronounsCard = ({ profileData, updateField, isComplete = false }: PartnerNamePronounsCardProps) => {
  const { goToNext } = usePartnerFlow();
  const [customPronoun, setCustomPronoun] = useState("");

  // Initialize custom pronoun from saved data
  useEffect(() => {
    const standardPronouns = ['She/her', 'He/him', 'They/them', 'She/they', 'He/they', 'Other'];
    if (profileData.partnerPronouns && !standardPronouns.includes(profileData.partnerPronouns)) {
      setCustomPronoun(profileData.partnerPronouns);
    }
  }, [profileData.partnerPronouns]);

  const primaryPronounOptions = [
    'She/her', 'He/him', 'They/them', 'She/they', 'He/they', 'Other'
  ];

  // Helper function to check if pronouns are complete
  const isPronounsComplete = () => {
    if (!profileData.partnerPronouns) return false;
    if (profileData.partnerPronouns === 'Other') {
      return customPronoun.trim().length > 0;
    }
    return true;
  };

  // Handle custom pronoun blur event
  const handleCustomPronounBlur = () => {
    if (customPronoun.trim().length > 0) {
      updateField('partnerPronouns', customPronoun.trim());
    } else {
      updateField('partnerPronouns', null);
    }
  };

  const handlePronounSelect = (pronoun: string) => {
    if (pronoun === 'Other') {
      updateField('partnerPronouns', 'Other');
      setCustomPronoun("");
    } else {
      updateField('partnerPronouns', pronoun);
      setCustomPronoun("");
    }
  };

  const handleCustomPronounChange = (value: string) => {
    setCustomPronoun(value);
  };

  const generateAvatar = (name: string) => {
    if (!name) {
      return (
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
          <User className="w-6 h-6 text-white/60" />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold border border-white">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  const isNamePronounsComplete = profileData.partnerName && isPronounsComplete();

  return (
    <QuestionCard 
      questionId="partner-name-pronouns-question"
      showContinue={isComplete}
      onContinue={() => goToNext('partner-name-pronouns-question')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left side: Name and Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {generateAvatar(profileData.partnerName || '')}
          </div>
          <div className="flex-1 min-w-0">
            <Label htmlFor="partnerName" className="text-sm font-semibold text-white mb-2 block">
              What should we call them?
            </Label>
            <Input
              id="partnerName"
              type="text"
              value={profileData.partnerName || ''}
              onChange={(e) => updateField('partnerName', e.target.value)}
              placeholder="Their name"
              className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-3 h-auto font-medium w-full"
            />
          </div>
        </div>

        {/* Right side: Pronouns */}
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What pronouns do they use?
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>So we refer to them right</span>
          </div>
          
          {/* Pronoun buttons */}
          <SingleSelect
            options={primaryPronounOptions}
            selectedValue={profileData.partnerPronouns || ''}
            onSelect={handlePronounSelect}
          />

          {/* Custom pronoun input */}
          {(profileData.partnerPronouns === 'Other' || (!['She/her', 'He/him', 'They/them', 'She/they', 'He/they'].includes(profileData.partnerPronouns || '') && profileData.partnerPronouns)) && (
            <div className="mt-3 animate-fade-in">
              <Input
                type="text"
                value={customPronoun}
                onChange={(e) => handleCustomPronounChange(e.target.value)}
                onBlur={handleCustomPronounBlur}
                placeholder="Enter their pronouns"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 h-auto font-medium"
              />
            </div>
          )}
        </div>
      </div>
    </QuestionCard>
  );
};

export default PartnerNamePronounsCard;