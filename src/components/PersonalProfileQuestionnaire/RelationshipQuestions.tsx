
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, Heart } from "lucide-react";
import { useState } from "react";

interface RelationshipQuestionsProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}

const RelationshipQuestions = ({ profileData, updateField, handleMultiSelect }: RelationshipQuestionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const challengeOptions = [
    'Communication breakdowns',
    'Finding quality people',
    'Trust/intimacy issues',
    'Balancing time & priorities',
    'Different future goals',
    'Family/friend drama',
    'Dating app fatigue',
    'Getting over an ex',
    'Money/financial stress'
  ];

  const relationshipLengthOptions = [
    'Less than 1 month',
    '1-3 months',
    '3-6 months',
    '6 months - 1 year',
    '1-2 years',
    '2-5 years',
    '5-10 years',
    '10+ years'
  ];

  const workingWellOptions = [
    'Great communication',
    'Strong physical connection',
    'Shared values/goals',
    'Fun and laughter',
    'Good conflict resolution',
    'Emotional support',
    'Trust and honesty',
    'Respect for differences',
    'Similar life priorities'
  ];

  // Handle challenge selection with limit of 3
  const handleChallengeSelect = (challenge: string) => {
    const currentChallenges = profileData.relationshipChallenges || [];
    
    if (currentChallenges.includes(challenge)) {
      // Remove if already selected
      const updated = currentChallenges.filter((c: string) => c !== challenge);
      updateField('relationshipChallenges', updated);
    } else if (currentChallenges.length < 3) {
      // Add if under limit
      const updated = [...currentChallenges, challenge];
      updateField('relationshipChallenges', updated);
    }
  };

  const selectedChallengesCount = (profileData.relationshipChallenges || []).length;

  return (
    <>
      {/* Main Relationship Challenges Question */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What's your biggest relationship challenges right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select up to 3</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <AlertTriangle className="w-3 h-3 text-yellow-300" />
            <span>The thing that's actually driving you crazy</span>
          </div>
          {selectedChallengesCount > 0 && (
            <div className="text-xs text-white/60 mt-1">
              {selectedChallengesCount}/3 selected
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {challengeOptions.map((challenge) => {
            const isSelected = (profileData.relationshipChallenges || []).includes(challenge);
            const isDisabled = !isSelected && selectedChallengesCount >= 3;
            
            return (
              <button
                key={challenge}
                onClick={() => handleChallengeSelect(challenge)}
                disabled={isDisabled}
                className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : isDisabled
                    ? 'questionnaire-button-secondary opacity-50 cursor-not-allowed'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {challenge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Dive Deeper Section */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-2.5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-white/90">
                  Want to share more context? (Optional)
                </Label>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/60" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-1.5 mt-1.5">
          {/* Relationship Length */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
            <div>
              <Label className="text-sm font-medium text-white">
                How long have you been together? (If applicable)
              </Label>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {relationshipLengthOptions.map((length) => (
                <button
                  key={length}
                  onClick={() => updateField('relationshipLengthContext', length)}
                  className={`p-1.5 rounded-lg text-center transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                    profileData.relationshipLengthContext === length
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* What's Working Well */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
            <div>
              <Label className="text-sm font-medium text-white">
                What's actually working well? (Select all that apply)
              </Label>
              <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
                <Heart className="w-3 h-3 text-pink-300" />
                <span>Let's celebrate the good stuff too</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {workingWellOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMultiSelect('relationshipWorkingWell', item)}
                  className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                    (profileData.relationshipWorkingWell || []).includes(item)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default RelationshipQuestions;
