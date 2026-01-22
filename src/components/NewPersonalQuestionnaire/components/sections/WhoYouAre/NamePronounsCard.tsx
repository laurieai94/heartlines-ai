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
      updateFieldImmediate('pronouns', value.trim());
    }
  };

  const generateAvatar = (name: string) => {
    const uniqueId = `personal-avatar-${Math.random().toString(36).substring(2, 9)}`;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    if (!name) {
      return (
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
          <User className="w-6 h-6 text-white/60" />
        </div>
      );
    }
    
    return (
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <defs>
            {/* Clear glass gradient with subtle color */}
            <linearGradient id={`clearGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="50%" stopColor="rgba(255, 182, 193, 0.25)" />
              <stop offset="100%" stopColor="rgba(255, 105, 180, 0.2)" />
            </linearGradient>

            {/* Liquid distortion filter for molten effect */}
            <filter id={`liquid-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed="2" result="noise">
                {!reduceMotion && <animate attributeName="baseFrequency" values="0.55;0.8;0.55" dur="6s" repeatCount="indefinite" />}
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={reduceMotion ? 2 : 4} xChannelSelector="R" yChannelSelector="G">
                {!reduceMotion && <animate attributeName="scale" values="2;5;2" dur="6s" repeatCount="indefinite" />}
              </feDisplacementMap>
            </filter>

            {/* Soft glow filter */}
            <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer glow stroke */}
          <path
            d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z"
            fill="none"
            stroke="white"
            strokeOpacity="0.6"
            strokeWidth="6"
            filter={`url(#glow-${uniqueId})`}
          />

          {/* Main heart with clear glass fill and liquid effect */}
          <path
            d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z"
            fill={`url(#clearGrad-${uniqueId})`}
            filter={`url(#liquid-${uniqueId})`}
            stroke="white"
            strokeWidth="2.5"
            strokeOpacity="0.9"
          />

          {/* Inner dashed accent */}
          <path
            d="M100 150 C 94 144, 67 123, 54 108 C 37 88, 39 63, 58 55 C 69 50, 83 53, 92 65 C 101 53, 115 50, 126 55 C 145 63, 147 86, 133 105 C 121 121, 106 139, 100 150 Z"
            fill="none"
            stroke="white"
            strokeDasharray="2,3"
            strokeOpacity="0.4"
            className={!reduceMotion ? 'animate-spin' : undefined}
            style={{ animationDuration: '12s' }}
          />
        </svg>

        {/* Initial centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-4xl font-bold drop-shadow-lg -mt-1">
            {name.charAt(0).toLowerCase()}
          </span>
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
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
          )}

        </div>
      </div>
    </QuestionCardSimple>
  );
};

export default NamePronounsCard;