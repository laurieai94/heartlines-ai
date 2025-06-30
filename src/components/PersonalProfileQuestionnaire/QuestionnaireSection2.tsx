
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
    'Single actively dating', 'Single not dating', 'Casually dating', 'In committed relationship',
    'Engaged', 'Married/life partnered', 'Open/polyamorous', 'It\'s complicated', 'Taking relationship break'
  ];

  const relationshipLengthOptions = [
    'Less than 6 months', '6 months-1 year', '1-3 years', '3-7 years', '7+ years', 'On/off complicated'
  ];

  const whyRealTalkOptions = [
    'Improve communication', 'Same fights/issues', 'New relationship guidance', 
    'Work through specific issue', 'Relationship feels stuck', 'Understand myself better',
    'Major relationship decision'
  ];

  const biggestChallengeOptions = [
    'Communication breakdowns', 'Feeling disconnected', 'Trust/safety/betrayal',
    'Boundaries', 'Intimacy/sexual connection', 'Understanding patterns/triggers',
    'Relationship decision', 'Breaking cycles'
  ];

  const workingWellOptions = [
    'Emotionally connected', 'Can laugh together', 'Talk through conflict',
    'Support growth', 'Sexually compatible', 'On same page',
    'Show up during hard times', 'Other'
  ];

  const difficultOptions = [
    'Argue often', 'Avoid issues', 'Feel distant', 'Don\'t feel heard',
    'Emotionally shut down', 'Trust/safety concerns', 'Betrayal/break',
    'Want different things', 'Stuck in pattern'
  ];

  const livingOptions = [
    'Live together full-time', 'Live apart', 'Stay over frequently',
    'On/off', 'It\'s complicated'
  ];

  const emotionalConnectionOptions = [
    'Deeply connected', 'Mostly close', 'Sometimes connected',
    'Often disconnected', 'On different pages', 'Unsure how I feel'
  ];

  const showRelationshipDeepDive = profileData.relationshipStatus && 
    !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus);

  const showRelationshipLength = profileData.relationshipStatus && 
    !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus);

  return (
    <div className="space-y-6">
      {/* Relationship Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Current relationship status <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
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
        <p className="text-xs text-gray-500">This helps us understand your relationship context</p>
      </div>

      {/* Conditional Relationship Length */}
      {showRelationshipLength && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            How long have you been together? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {relationshipLengthOptions.map((length) => (
              <button
                key={length}
                onClick={() => updateField('relationshipLength', length)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
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

      {/* Conditional Relationship Deep Dive */}
      {showRelationshipDeepDive && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* What's Working */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              What's working well <span className="text-gray-500 font-normal">(Optional)</span>
              <span className="text-green-600 font-medium text-xs ml-2 block">✨ Check all that apply</span>
            </Label>
            <div className="space-y-2">
              {workingWellOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMultiSelect('workingWell', item)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
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

          {/* What's Difficult */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              What feels difficult <span className="text-gray-500 font-normal">(Optional)</span>
              <span className="text-orange-600 font-medium text-xs ml-2 block">✨ Check all that apply</span>
            </Label>
            <div className="space-y-2">
              {difficultOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMultiSelect('feelsDifficult', item)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.feelsDifficult || []).includes(item)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why RealTalk */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What brings you to RealTalk? <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {whyRealTalkOptions.map((reason) => (
            <button
              key={reason}
              onClick={() => handleMultiSelect('whyRealTalk', reason)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.whyRealTalk || []).includes(reason)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">Helps us understand your coaching focus</p>
      </div>

      {/* Biggest Challenge */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Biggest relationship challenge <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Select up to 3</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {biggestChallengeOptions.map((challenge) => (
            <button
              key={challenge}
              onClick={() => handleMultiSelect('biggestChallenge', challenge)}
              disabled={(profileData.biggestChallenge || []).length >= 3 && !(profileData.biggestChallenge || []).includes(challenge)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.biggestChallenge || []).includes(challenge)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md'
                  : (profileData.biggestChallenge || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
        {(profileData.biggestChallenge || []).length > 0 && (
          <p className="text-sm text-rose-600 font-medium">
            Selected: {(profileData.biggestChallenge || []).length}/3
          </p>
        )}
        <p className="text-xs text-gray-500">Guides our coaching priorities for you</p>
      </div>

      {/* Progress Message */}
      <div className="text-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
        <p className="text-sm font-medium text-rose-900">
          Perfect! 🎯 Understanding your relationship world helps us provide relevant guidance
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection2;
