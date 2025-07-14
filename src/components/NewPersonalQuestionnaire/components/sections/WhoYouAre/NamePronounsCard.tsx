import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";

interface NamePronounsCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onContinue: () => void;
}

const NamePronounsCard = ({ profileData, updateField, isComplete, onContinue }: NamePronounsCardProps) => {
  const [customPronoun, setCustomPronoun] = useState("");

  // Initialize custom pronoun from saved data
  useEffect(() => {
    const standardPronouns = ['She/her', 'He/him', 'They/them', 'Other'];
    if (profileData.pronouns && !standardPronouns.includes(profileData.pronouns)) {
      setCustomPronoun(profileData.pronouns);
    }
  }, [profileData.pronouns]);

  const primaryPronounOptions = [
    'She/her', 'He/him', 'They/them', 'Other'
  ];

  // Helper function to check if pronouns are complete
  const isPronounsComplete = () => {
    if (!profileData.pronouns) return false;
    if (profileData.pronouns === 'Other') {
      return customPronoun.trim().length > 0;
    }
    return true;
  };

  // Handle custom pronoun blur event
  const handleCustomPronounBlur = () => {
    if (customPronoun.trim().length > 0) {
      updateField('pronouns', customPronoun.trim());
    } else {
      updateField('pronouns', null);
    }
  };

  const handlePronounSelect = (pronoun: string) => {
    if (pronoun === 'Other') {
      updateField('pronouns', 'Other');
      setCustomPronoun("");
    } else {
      updateField('pronouns', pronoun);
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
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  const isNamePronounsComplete = profileData.name && isPronounsComplete();

  return (
    <QuestionCard questionId="question-name-pronouns">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left side: Name and Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {generateAvatar(profileData.name || '')}
          </div>
          <div className="flex-1 min-w-0">
            <Label htmlFor="name" className="text-sm font-semibold text-white mb-2 block">
              What should we call you? <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={profileData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your name"
              className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-3 h-auto font-medium w-full"
            />
          </div>
        </div>

        {/* Right side: Pronouns */}
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What pronouns do you use? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>So we can refer to you correctly</span>
          </div>
          
          {/* Pronoun buttons */}
          <SingleSelect
            options={primaryPronounOptions}
            selectedValue={profileData.pronouns || ''}
            onSelect={handlePronounSelect}
            columns={2}
          />

          {/* Custom pronoun input */}
          {(profileData.pronouns === 'Other' || (!['She/her', 'He/him', 'They/them'].includes(profileData.pronouns || '') && profileData.pronouns)) && (
            <div className="mt-3 animate-fade-in">
              <Input
                type="text"
                value={customPronoun}
                onChange={(e) => handleCustomPronounChange(e.target.value)}
                onBlur={handleCustomPronounBlur}
                placeholder="Enter your pronouns"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 h-auto font-medium"
              />
            </div>
          )}
        </div>
      </div>
    </QuestionCard>
  );
};

export default NamePronounsCard;