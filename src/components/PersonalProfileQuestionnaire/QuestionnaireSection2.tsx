
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

interface QuestionnaireSection2Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection2 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection2Props) => {
  if (!isReady) return null;

  const relationshipStatusOptions = [
    'Single, actively dating', 'Single, not dating', 'Casually dating/seeing people', 
    'Exclusive but not official', 'In a relationship', 'Engaged', 
    'Married', 'It\'s complicated'
  ];

  const relationshipLengthOptions = [
    'Less than 3 months', '3-6 months', '6 months - 1 year', 
    '1-2 years', '2-5 years', '5+ years'
  ];

  const whyRealTalkOptions = [
    'Want better communication', 'Working through conflict', 'Feeling disconnected',
    'Want to understand my patterns', 'Preparing for serious commitment', 
    'Recovery from past relationship', 'Just curious about relationships'
  ];

  const workingWellOptions = [
    'Great communication', 'Strong physical connection', 'Shared values/goals',
    'Fun and laughter together', 'Good conflict resolution', 'Emotional support',
    'Trust and honesty', 'Respect for differences'
  ];

  const feelsDifficultOptions = [
    'Communication breakdowns', 'Different conflict styles', 'Intimacy challenges',
    'Time management/priorities', 'Family/friend dynamics', 'Financial stress',
    'Trust issues', 'Future planning disagreements'
  ];

  // New refined dating-specific options (7 each)
  const datingChallengesOptions = [
    'Finding people who want the same thing I do',
    'Getting past the first few dates into something deeper',
    'Setting boundaries and not settling for less than I deserve',
    'Dating anxiety and putting myself out there',
    'Getting over past relationship patterns that keep showing up',
    'Being authentic while still trying to make a good impression',
    'Online dating fatigue and app overwhelm'
  ];

  const datingGoalsOptions = [
    'A serious, long-term partnership leading to marriage/commitment',
    'Better understanding of what I want and need in a partner',
    'Confidence and skills in dating and relationships',
    'Healing from past relationships before getting serious again',
    'Learning to be vulnerable and authentic in dating',
    'A partner who truly gets me and accepts me as I am',
    'Someone who shares my values and life vision'
  ];

  // Check if user is in some form of relationship (not single not dating)
  const isInRelationship = profileData.relationshipStatus && 
    !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
  
  // Check if user is in a defined relationship that has a length (not casual/complicated)
  const hasRelationshipLength = profileData.relationshipStatus && 
    !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people', 'It\'s complicated'].includes(profileData.relationshipStatus);

  // Check if user is single/dating (trigger for additional questions)
  const isSingleOrDating = profileData.relationshipStatus && 
    ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);

  return (
    <div className="space-y-3">
      <div className="questionnaire-card p-4 space-y-4">
        {/* Relationship Status */}
        <div className="space-y-2">
          <Label className="text-base font-semibold questionnaire-text">
            Current relationship status <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs questionnaire-text-muted mb-2">
            <Lightbulb className="w-3 h-3" />
            <span>From 'it's complicated' to married - we meet you where you are</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {relationshipStatusOptions.map((status) => (
              <button
                key={status}
                onClick={() => updateField('relationshipStatus', status)}
                className={`p-2 rounded-lg text-xs font-medium transition-all text-left hover:scale-105 h-8 ${
                  profileData.relationshipStatus === status
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Dating Questions for Single/Dating Users */}
          {isSingleOrDating && (
            <>
              {/* Dating Challenges */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold questionnaire-text">
                  What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
                  <span className="text-orange-300 font-medium text-sm ml-2">✨ Select up to 3</span>
                </Label>
                <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>Understanding your specific dating struggles helps RealTalk provide targeted guidance for your situation</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {datingChallengesOptions.map((challenge) => (
                    <button
                      key={challenge}
                      onClick={() => handleMultiSelect('datingChallenges', challenge)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                        (profileData.datingChallenges || []).includes(challenge)
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {challenge}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dating Goals */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold questionnaire-text">
                  What are you hoping to find or create in your dating life? <span className="text-red-400">*</span>
                  <span className="text-orange-300 font-medium text-sm ml-2">✨ Select up to 3</span>
                </Label>
                <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>Knowing what you're hoping to create helps RealTalk coach you toward your actual desires, not generic dating advice</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {datingGoalsOptions.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleMultiSelect('datingGoals', goal)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                        (profileData.datingGoals || []).includes(goal)
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        {/* Conditional Relationship Length */}
        {hasRelationshipLength && (
          <div className="space-y-2">
            <Label className="text-base font-semibold questionnaire-text">
              How long have you been together? <span className="text-red-400">*</span>
            </Label>
            <div className="flex items-center gap-2 text-xs questionnaire-text-muted mb-2">
              <Lightbulb className="w-3 h-3" />
              <span>The 6-month mark hits different than 2 years</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {relationshipLengthOptions.map((length) => (
                <button
                  key={length}
                  onClick={() => updateField('relationshipLength', length)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all text-center hover:scale-105 h-8 ${
                    profileData.relationshipLength === length
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

          {/* Conditional Relationship Details */}
          {isInRelationship && (
            <>
              {/* What's Working Well */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold questionnaire-text">
                  What's working well in your relationship? <span className="text-red-400">*</span>
                  <span className="text-orange-300 font-medium text-sm ml-2">✨ Check all that apply</span>
                </Label>
                <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>We'll build on what's already good instead of fixing everything</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {workingWellOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleMultiSelect('workingWell', item)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                        (profileData.workingWell || []).includes(item)
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* What Feels Difficult */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold questionnaire-text">
                  What feels difficult or challenging? <span className="text-red-400">*</span>
                  <span className="text-orange-300 font-medium text-sm ml-2">✨ Check all that apply</span>
                </Label>
                <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>Let's tackle the stuff that's actually driving you crazy</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {feelsDifficultOptions.map((challenge) => (
                    <button
                      key={challenge}
                      onClick={() => handleMultiSelect('feelsDifficult', challenge)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                        (profileData.feelsDifficult || []).includes(challenge)
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {challenge}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Why RealTalk */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold questionnaire-text">
              Why are you interested in RealTalk? <span className="text-red-400">*</span>
              <span className="text-orange-300 font-medium text-sm ml-2">✨ Check all that apply</span>
            </Label>
            <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>So we know what kind of help you're actually looking for</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {whyRealTalkOptions.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleMultiSelect('whyRealTalk', reason)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.whyRealTalk || []).includes(reason)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
      </div>
    </div>
    </div>
  );
};

export default QuestionnaireSection2;
