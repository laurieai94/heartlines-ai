
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
    'Single actively dating', 'Single not dating', 'Casually dating', 
    'In committed relationship', 'Engaged', 'Married/life partnered', 
    'Open/polyamorous', 'It\'s complicated', 'Taking relationship break'
  ];

  const relationshipLengthOptions = [
    'Less than 6 months', '6 months-1 year', '1-3 years', 
    '3-7 years', '7+ years', 'On/off complicated'
  ];

  const whyRealTalkOptions = [
    'Improve communication', 'Same fights/issues', 'New relationship guidance',
    'Work through specific issue', 'Relationship feels stuck', 'Understand myself better',
    'Major relationship decision'
  ];

  const challengeOptions = [
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

  const connectionOptions = [
    'Deeply connected', 'Mostly close', 'Sometimes connected',
    'Often disconnected', 'On different pages', 'Unsure how I feel'
  ];

  const inRelationship = ['In committed relationship', 'Engaged', 'Married/life partnered', 'Open/polyamorous', 'It\'s complicated', 'Taking relationship break'].includes(profileData.relationshipStatus);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Your Relationship World</h3>
        <p className="text-gray-600">Help us understand your current relationship context</p>
        <p className="text-xs text-green-600">✓ Your answers are automatically saved</p>
      </div>

      {/* Relationship Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Current relationship status <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {relationshipStatusOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateField('relationshipStatus', status)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                profileData.relationshipStatus === status
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Length - Conditional */}
      {inRelationship && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            How long have you been together? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {relationshipLengthOptions.map((length) => (
              <button
                key={length}
                onClick={() => updateField('relationshipLength', length)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                  profileData.relationshipLength === length
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {length}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Relationship Deep Dive */}
      {inRelationship && (
        <div className="space-y-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-gray-900">Tell us more about your relationship (Optional)</h4>
          
          {/* What's working well */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">What's working well (Check all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {workingWellOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('workingWell', option)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    (profileData.workingWell || []).includes(option)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* What feels difficult */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">What feels difficult (Check all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {difficultOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('feelsDifficult', option)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    (profileData.feelsDifficult || []).includes(option)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* How you live */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">How do you live (Check all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {livingOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('howYouLive', option)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    (profileData.howYouLive || []).includes(option)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional connection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Emotional connection right now</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {connectionOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => updateField('emotionalConnection', option)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    profileData.emotionalConnection === option
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {option}
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
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {whyRealTalkOptions.map((reason) => (
            <button
              key={reason}
              onClick={() => handleMultiSelect('whyRealTalk', reason)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.whyRealTalk || []).includes(reason)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>

      {/* Biggest Challenge */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Biggest relationship challenge <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Select up to 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {challengeOptions.map((challenge) => (
            <button
              key={challenge}
              onClick={() => handleMultiSelect('biggestChallenge', challenge)}
              disabled={(profileData.biggestChallenge || []).length >= 3 && !(profileData.biggestChallenge || []).includes(challenge)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.biggestChallenge || []).includes(challenge)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : (profileData.biggestChallenge || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
        {(profileData.biggestChallenge || []).length > 0 && (
          <p className="text-xs text-gray-500">
            Selected: {(profileData.biggestChallenge || []).length}/3
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireSection2;
