import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare, Lock } from "lucide-react";
import { PartnerProfileData } from "../../types";
import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { usePartnerFlow } from "../../context/FlowContext";
import { usePartnerProfiles } from "@/hooks/usePartnerProfiles";
import { usePartnerNameLock } from "@/hooks/usePartnerNameLock";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PartnerNamePronounsCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete: boolean;
  onSectionComplete?: () => void;
}

const PartnerNamePronounsCard = ({ profileData, updateField, isComplete = false }: PartnerNamePronounsCardProps) => {
  const { goToNext } = usePartnerFlow();
  const { profiles, activeProfileId } = usePartnerProfiles();
  const [customPronoun, setCustomPronoun] = useState("");
  const [hasCleared, setHasCleared] = useState(false);

  // Get lock status for current profile
  const activeProfile = profiles.find(p => p.partner_profile_id === activeProfileId);
  const { isLocked, formattedTime, isInGracePeriod } = usePartnerNameLock(activeProfile?.partner_name_locked_at);

  // Clear default placeholder text on first focus
  const handleNameFocus = () => {
    if (!hasCleared && profileData.partnerName === 'their name') {
      updateField('partnerName', '');
      setHasCleared(true);
    }
  };

  // Initialize custom pronoun from saved data
  useEffect(() => {
    const standardPronouns = ['she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'other'];
    if (profileData.partnerPronouns && !standardPronouns.includes(profileData.partnerPronouns)) {
      setCustomPronoun(profileData.partnerPronouns);
    }
  }, [profileData.partnerPronouns]);

  const primaryPronounOptions = [
    'she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'other'
  ];

  // Helper function to check if pronouns are complete
  const isPronounsComplete = () => {
    if (!profileData.partnerPronouns) return false;
    if (profileData.partnerPronouns === 'other') {
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
    if (pronoun === 'other') {
      updateField('partnerPronouns', 'other');
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
    const uniqueId = `partner-avatar-${Math.random().toString(36).substring(2, 9)}`;
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

  const isNamePronounsComplete = profileData.partnerName && isPronounsComplete();

  return (
    <QuestionCard 
      questionId="question-partner-name-pronouns"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left side: Name and Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {generateAvatar(profileData.partnerName || '')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="partnerName" className="text-sm font-semibold text-white">
                what should we call them? <span className="text-red-400">*</span>
              </Label>
              {isLocked && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="w-3.5 h-3.5 text-white/50" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-background/95 border-white/10">
                      <p className="text-xs">name is locked to prevent profile gaming</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {isLocked ? (
              <div className="questionnaire-button-secondary border-0 text-white/70 text-sm p-3 h-auto font-medium w-full flex items-center gap-2 cursor-not-allowed">
                <span>{profileData.partnerName}</span>
              </div>
            ) : (
              <Input
                id="partnerName"
                type="text"
                value={profileData.partnerName === 'their name' ? '' : (profileData.partnerName || '')}
                onChange={(e) => updateField('partnerName', e.target.value)}
                onFocus={handleNameFocus}
                placeholder="their name"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-3 h-auto font-medium w-full"
                autoComplete="off"
              />
            )}
          </div>
        </div>

        {/* Right side: Pronouns */}
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-white mb-2 block">
            what pronouns do they use? <span className="text-red-400">*</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>so we refer to them right</span>
          </div>
          
          {/* Pronoun buttons */}
          <SingleSelect
            options={primaryPronounOptions}
            selectedValue={profileData.partnerPronouns || ''}
            onSelect={handlePronounSelect}
          />

          {/* Custom pronoun input */}
          {(profileData.partnerPronouns === 'other' || (!['she/her', 'he/him', 'they/them', 'she/they', 'he/they'].includes(profileData.partnerPronouns || '') && profileData.partnerPronouns)) && (
            <div className="mt-3 animate-fade-in">
              <Input
                type="text"
                value={customPronoun}
                onChange={(e) => handleCustomPronounChange(e.target.value)}
                onBlur={handleCustomPronounBlur}
                placeholder="enter their pronouns"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 h-auto font-medium"
                autoComplete="off"
              />
            </div>
          )}
        </div>
      </div>
    </QuestionCard>
  );
};

export default PartnerNamePronounsCard;