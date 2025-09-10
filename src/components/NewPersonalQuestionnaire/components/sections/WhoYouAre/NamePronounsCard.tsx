import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import { useSnapFlow } from "../../../hooks/useSnapFlow";
import { useState, useEffect } from "react";

interface NamePronounsCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onSectionComplete?: () => void;
}

const NamePronounsCard = ({ profileData, updateField, isComplete, onSectionComplete }: NamePronounsCardProps) => {
  const { scrollToNextRequiredQuestion } = useSnapFlow();
  
  console.log('🔵 DEBUG: NamePronounsCard rendered, isComplete:', isComplete);
  console.log('🔵 DEBUG: NamePronounsCard scrollToNextRequiredQuestion function exists:', !!scrollToNextRequiredQuestion);
  const [customPronoun, setCustomPronoun] = useState('');

  const primaryPronounOptions = [
    'She/her', 'He/him', 'They/them', 'She/they', 'He/they', 'Other'
  ];

  // Initialize custom pronoun if it exists and isn't a standard option
  useEffect(() => {
    if (profileData.pronouns && !['She/her', 'He/him', 'They/them', 'She/they', 'He/they', 'Other'].includes(profileData.pronouns)) {
      setCustomPronoun(profileData.pronouns);
    }
  }, [profileData.pronouns]);

  const handlePronounSelect = (pronoun: string) => {
    if (pronoun === 'Other') {
      updateField('pronouns', 'Other');
      return;
    }
    updateField('pronouns', pronoun);
  };

  const handleCustomPronounChange = (value: string) => {
    setCustomPronoun(value);
    if (value.trim()) {
      updateField('pronouns', value.trim());
    }
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

  return (
    <QuestionCard 
      questionId="question-name-pronouns"
      showContinue={isComplete}
      onContinue={onSectionComplete || (() => scrollToNextRequiredQuestion('question-name-pronouns'))}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left side: Name and Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {generateAvatar(profileData.name || '')}
          </div>
          <div className="flex-1 min-w-0">
            <Label htmlFor="name" className="questionnaire-label-mobile">
              What should we call you? <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={profileData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your name"
              className="questionnaire-input-mobile font-medium w-full"
            />
          </div>
        </div>

        {/* Right side: Pronouns */}
        <div className="flex flex-col">
          <Label className="questionnaire-label-mobile">
            What pronouns do you use? <span className="text-red-400">*</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>So we can refer to you correctly</span>
          </div>
          
          {/* Pronoun buttons */}
          <SingleSelect
            options={primaryPronounOptions}
            selectedValue={profileData.pronouns || ''}
            onSelect={handlePronounSelect}
          />

          {/* Custom pronoun input */}
          {(profileData.pronouns === 'Other' || customPronoun) && (
            <div className="mt-3">
              <Label className="text-sm font-medium text-white mb-2 block">
                Please specify your pronouns:
              </Label>
              <Input
                value={customPronoun}
                onChange={(e) => handleCustomPronounChange(e.target.value)}
                placeholder="e.g., xe/xir, fae/faer, etc."
                className="questionnaire-input-mobile"
              />
            </div>
          )}

        </div>
      </div>
    </QuestionCard>
  );
};

export default NamePronounsCard;