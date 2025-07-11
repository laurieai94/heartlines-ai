
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, Heart } from "lucide-react";
import { useState } from "react";

interface RelationshipQuestionsProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  relationshipStatus?: string;
}

const RelationshipQuestions = ({ profileData, updateField, handleMultiSelect, relationshipStatus }: RelationshipQuestionsProps) => {
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

  // Status-specific relationship length options and labels
  const getRelationshipLengthConfig = () => {
    switch (relationshipStatus) {
      case 'Talking to someone':
        return null; // Skip length question entirely
      case 'Married':
        return {
          label: 'How long have you been married?',
          options: [
            'Less than 1 year',
            '1-3 years',
            '3-5 years',
            '5-10 years',
            '10-20 years',
            '20+ years'
          ]
        };
      case 'Separated/Divorced':
        return {
          label: 'How long were you together?',
          options: [
            'Less than 1 year',
            '1-3 years',
            '3-5 years',
            '5-10 years',
            '10-20 years',
            '20+ years'
          ]
        };
      case 'It\'s complicated':
        return {
          label: 'How long have you known each other?',
          options: [
            'Less than 1 month',
            '1-3 months',
            '3-6 months',
            '6 months - 1 year',
            '1-2 years',
            '2-5 years',
            '5+ years'
          ]
        };
      default: // In a relationship, Engaged
        return {
          label: 'How long have you been together?',
          options: [
            'Less than 1 month',
            '1-3 months',
            '3-6 months',
            '6 months - 1 year',
            '1-2 years',
            '2-5 years',
            '5-10 years',
            '10+ years'
          ]
        };
    }
  };

  // Status-specific "working well" options and labels
  const getWorkingWellConfig = () => {
    switch (relationshipStatus) {
      case 'Talking to someone':
        return {
          label: 'What\'s going well so far?',
          subtitle: 'Early connections that feel promising',
          options: [
            'Easy conversation flow',
            'Shared sense of humor',
            'Similar values coming through',
            'Good texting rhythm',
            'Mutual effort and interest',
            'Comfortable being ourselves',
            'Exciting chemistry',
            'Respectful boundaries',
            'Fun and light energy'
          ]
        };
      case 'Separated/Divorced':
        return {
          label: 'What are your priorities now?',
          subtitle: 'Focus areas for moving forward',
          options: [
            'Healing and self-care',
            'Co-parenting effectively',
            'Rediscovering myself',
            'Building new friendships',
            'Career and financial stability',
            'Learning from past patterns',
            'Setting healthy boundaries',
            'Eventually dating again',
            'Creating a stable routine'
          ]
        };
      case 'It\'s complicated':
        return {
          label: 'What\'s working despite the complications?',
          subtitle: 'The good parts worth acknowledging',
          options: [
            'Strong emotional connection',
            'Great communication when we talk',
            'Shared understanding',
            'Mutual respect for the situation',
            'Good physical connection',
            'Supporting each other',
            'Honest about the challenges',
            'Taking things day by day',
            'Both trying to figure it out'
          ]
        };
      case 'Married':
        return {
          label: 'What\'s working well in your marriage?',
          subtitle: 'The foundations that keep you strong',
          options: [
            'Deep trust and commitment',
            'Great communication',
            'Strong physical connection',
            'Shared life goals',
            'Good teamwork on daily life',
            'Emotional support',
            'Maintaining individual interests',
            'Handling conflict well',
            'Growing together over time'
          ]
        };
      case 'Engaged':
        return {
          label: 'What\'s working well as you plan your future?',
          subtitle: 'Strengths you\'re building on',
          options: [
            'Excited about the future together',
            'Great communication',
            'Strong physical connection',
            'Aligned on major life decisions',
            'Good conflict resolution',
            'Family and friend support',
            'Shared values and goals',
            'Trust and honesty',
            'Planning wedding together well'
          ]
        };
      default: // In a relationship
        return {
          label: 'What\'s actually working well?',
          subtitle: 'Let\'s celebrate the good stuff too',
          options: [
            'Great communication',
            'Strong physical connection',
            'Shared values/goals',
            'Fun and laughter',
            'Good conflict resolution',
            'Emotional support',
            'Trust and honesty',
            'Respect for differences',
            'Similar life priorities'
          ]
        };
    }
  };

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
  const relationshipLengthConfig = getRelationshipLengthConfig();
  const workingWellConfig = getWorkingWellConfig();

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
          {/* Conditional Relationship Length */}
          {relationshipLengthConfig && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
              <div>
                <Label className="text-sm font-medium text-white">
                  {relationshipLengthConfig.label}
                </Label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {relationshipLengthConfig.options.map((length) => (
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
          )}

          {/* Status-specific Working Well Question */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
            <div>
              <Label className="text-sm font-medium text-white">
                {workingWellConfig.label} (Select all that apply)
              </Label>
              <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
                <Heart className="w-3 h-3 text-pink-300" />
                <span>{workingWellConfig.subtitle}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {workingWellConfig.options.map((item) => (
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
