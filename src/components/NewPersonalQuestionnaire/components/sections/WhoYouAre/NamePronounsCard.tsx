import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import SingleSelect from "../../shared/SingleSelect";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import { useState, useEffect } from "react";

interface NamePronounsCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
}

const NamePronounsCard = ({ profileData: propData, updateField, isComplete }: NamePronounsCardProps) => {
  const [customPronoun, setCustomPronoun] = useState('');
  const { profileData: localData, isSyncing, lastSaved, updateFieldImmediate, flush } = usePersonalProfileData();
  
  // Use local hook data for display (always most up-to-date)
  const displayData = localData;

  const primaryPronounOptions = [
    'she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'other'
  ];

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (flush) flush();
    };
  }, [flush]);

  // Initialize custom pronoun if it exists and isn't a standard option
  useEffect(() => {
    if (displayData.pronouns && !['she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'other'].includes(displayData.pronouns)) {
      setCustomPronoun(displayData.pronouns);
    }
  }, [displayData.pronouns]);

  const handlePronounSelect = (pronoun: string) => {
    if (pronoun === 'other') {
      updateFieldImmediate('pronouns', 'other');
      return;
    }
    updateFieldImmediate('pronouns', pronoun);
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
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Thin white heart outline */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          aria-hidden="true"
        >
          <path
            d="M50 85 C 45 80, 30 68, 20 58 C 8 45, 10 26, 25 20 C 33 16, 42 18, 50 27 C 58 18, 67 16, 75 20 C 90 26, 92 45, 80 58 C 70 68, 55 80, 50 85 Z"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>
        
        {/* Original circular avatar */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg z-10">
          {name.charAt(0).toLowerCase()}
        </div>
      </div>
    );
  };

  return (
    <QuestionCardSimple 
      questionId="question-name-pronouns"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left side: Name and Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {generateAvatar(displayData.name || '')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="name" className="questionnaire-label-mobile">
                what should we call you? <span className="text-red-400">*</span>
              </Label>
            </div>
            <Input
              id="name"
              type="text"
              value={displayData.name || ''}
              onChange={(e) => updateFieldImmediate('name', e.target.value.trim())}
              placeholder="your name"
              className="questionnaire-input-mobile font-medium w-full"
            />
          </div>
        </div>

        {/* Right side: Pronouns */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <Label className="questionnaire-label-mobile">
              what pronouns do you use? <span className="text-red-400">*</span>
            </Label>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>so we can refer to you correctly</span>
          </div>
          
          {/* Pronoun buttons */}
          <SingleSelect
            options={primaryPronounOptions}
            selectedValue={displayData.pronouns || ''}
            onSelect={handlePronounSelect}
          />

          {/* Custom pronoun input */}
          {(displayData.pronouns === 'other' || customPronoun) && (
            <div className="mt-3">
              <Label className="text-sm font-medium text-white mb-2 block">
                please specify your pronouns:
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
    </QuestionCardSimple>
  );
};

export default NamePronounsCard;