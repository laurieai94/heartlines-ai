
import { Label } from "@/components/ui/label";

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

  // Updated streamlined dating challenge options (7 options)
  const datingChallengesOptions = [
    'Finding people who want the same thing I do',
    'Getting past the first few dates into something deeper',
    'Setting boundaries and not settling for less than I deserve',
    'Dating anxiety and putting yourself out there',
    'Getting over past relationship patterns that keep showing up',
    'Being authentic while still trying to make a good impression',
    'Online dating fatigue and app overwhelm'
  ];

  // Updated streamlined dating goals options (7 options)
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
    <div className="space-y-6">
      {/* Relationship Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Current relationship status <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {relationshipStatusOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateField('relationshipStatus', status)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                profileData.relationshipStatus === status
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
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
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <Label className="text-sm font-medium text-gray-700">
              What's your biggest challenge in the dating world right now? <span className="text-red-500">*</span>
              <span className="text-blue-600 font-medium text-xs ml-2">✨ Select up to 3</span>
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              Understanding your specific dating struggles helps RealTalk provide targeted guidance for your situation
            </p>
            <div className="grid grid-cols-1 gap-2">
              {datingChallengesOptions.map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => handleMultiSelect('datingChallenges', challenge)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.datingChallenges || []).includes(challenge)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
          </div>

          {/* Dating Goals */}
          <div className="space-y-3 bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <Label className="text-sm font-medium text-gray-700">
              What are you hoping to find or create in your dating life? <span className="text-red-500">*</span>
              <span className="text-purple-600 font-medium text-xs ml-2">✨ Select up to 3</span>
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              Knowing what you're hoping to create helps RealTalk coach you toward your actual desires, not generic dating advice
            </p>
            <div className="grid grid-cols-1 gap-2">
              {datingGoalsOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect('datingGoals', goal)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.datingGoals || []).includes(goal)
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
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
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            How long have you been together? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {relationshipLengthOptions.map((length) => (
              <button
                key={length}
                onClick={() => updateField('relationshipLength', length)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-center hover:scale-105 ${
                  profileData.relationshipLength === length
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
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
            <Label className="text-sm font-medium text-gray-700">
              What's working well in your relationship? <span className="text-red-500">*</span>
              <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {workingWellOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMultiSelect('workingWell', item)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.workingWell || []).includes(item)
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-green-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* What Feels Difficult */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              What feels difficult or challenging? <span className="text-red-500">*</span>
              <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {feelsDifficultOptions.map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => handleMultiSelect('feelsDifficult', challenge)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.feelsDifficult || []).includes(challenge)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
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
        <Label className="text-sm font-medium text-gray-700">
          Why are you interested in RealTalk? <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {whyRealTalkOptions.map((reason) => (
            <button
              key={reason}
              onClick={() => handleMultiSelect('whyRealTalk', reason)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.whyRealTalk || []).includes(reason)
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection2;
