
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface QuestionnaireSection2Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection2 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection2Props) => {
  const [showRelationshipDeepDive, setShowRelationshipDeepDive] = useState(false);

  if (!isReady) return null;

  const relationshipStatusOptions = [
    'Single actively dating', 'Single not dating', 'Casually dating', 
    'In committed relationship', 'Engaged', 'Married/life partnered', 
    'Open/polyamorous', 'It\'s complicated', 'Taking relationship break'
  ];

  const relationshipLengthOptions = [
    'Less than 6 months', '6 months-1 year', '1-3 years', '3-7 years', '7+ years', 
    'On/off complicated'
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

  // Relationship deep dive options
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

  const inRelationshipStatuses = [
    'In committed relationship', 'Engaged', 'Married/life partnered', 
    'Open/polyamorous', 'It\'s complicated', 'Taking relationship break'
  ];

  const shouldShowRelationshipLength = inRelationshipStatuses.includes(profileData.relationshipStatus);
  const shouldShowDeepDive = inRelationshipStatuses.includes(profileData.relationshipStatus);

  const handleRelationshipStatusChange = (status: string) => {
    updateField('relationshipStatus', status);
    if (shouldShowDeepDive && !showRelationshipDeepDive) {
      setShowRelationshipDeepDive(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Your Relationship World</h3>
        <p className="text-gray-600 text-lg">Help us understand your relationship context</p>
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-full px-4 py-2 mx-auto w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Your answers are automatically saved
        </div>
      </div>

      {/* Relationship Status */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          Current relationship status <span className="text-red-500 text-lg">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {relationshipStatusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleRelationshipStatusChange(status)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                profileData.relationshipStatus === status
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Your relationship status shapes what kind of guidance will be most helpful
        </p>
      </div>

      {/* Relationship Length - Conditional */}
      {shouldShowRelationshipLength && (
        <div className="space-y-4 animate-fade-in">
          <Label className="text-base font-semibold text-gray-700">
            How long have you been together? <span className="text-red-500 text-lg">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relationshipLengthOptions.map((length) => (
              <button
                key={length}
                onClick={() => updateField('relationshipLength', length)}
                className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                  profileData.relationshipLength === length
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
                }`}
              >
                {length}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            💡 <strong>Why we ask:</strong> Relationship length affects the types of challenges and growth opportunities you might face
          </p>
        </div>
      )}

      {/* Conditional Relationship Deep Dive */}
      {shouldShowDeepDive && (
        <div className="space-y-8 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-100 animate-fade-in">
          <div className="text-center">
            <h4 className="text-xl font-bold text-purple-900 mb-2">
              Tell us more about your relationship
            </h4>
            <p className="text-purple-700 text-sm">
              <span className="font-medium">Optional:</span> These details help us provide more specific guidance
            </p>
          </div>

          {/* What's Working Well */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">
              What's working well? <span className="text-gray-500 font-normal">(Check all that apply)</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {workingWellOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('relationshipWorking', option)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left hover:scale-105 ${
                    (profileData.relationshipWorking || []).includes(option)
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 shadow-sm'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* What Feels Difficult */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">
              What feels difficult? <span className="text-gray-500 font-normal">(Check all that apply)</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {difficultOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('relationshipDifficult', option)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left hover:scale-105 ${
                    (profileData.relationshipDifficult || []).includes(option)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 shadow-sm'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Living Situation */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">
              How do you live? <span className="text-gray-500 font-normal">(Check all that apply)</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {livingOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('livingArrangement', option)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left hover:scale-105 ${
                    (profileData.livingArrangement || []).includes(option)
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional Connection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">
              Emotional connection right now <span className="text-gray-500 font-normal">(Select one)</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {connectionOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => updateField('emotionalConnection', option)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left hover:scale-105 ${
                    profileData.emotionalConnection === option
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50 shadow-sm'
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
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          What brings you to RealTalk? <span className="text-red-500 text-lg">*</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {whyRealTalkOptions.map((reason) => (
            <button
              key={reason}
              onClick={() => handleMultiSelect('whyRealTalk', reason)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.whyRealTalk || []).includes(reason)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Helps us understand your goals and tailor our coaching approach
        </p>
      </div>

      {/* Biggest Challenge */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          Biggest relationship challenge <span className="text-red-500 text-lg">*</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Select up to 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {biggestChallengeOptions.map((challenge) => (
            <button
              key={challenge}
              onClick={() => handleMultiSelect('biggestChallenge', challenge)}
              disabled={(profileData.biggestChallenge || []).length >= 3 && !(profileData.biggestChallenge || []).includes(challenge)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.biggestChallenge || []).includes(challenge)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : (profileData.biggestChallenge || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
        {(profileData.biggestChallenge || []).length > 0 && (
          <p className="text-sm text-purple-600 font-medium">
            Selected: {(profileData.biggestChallenge || []).length}/3
          </p>
        )}
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Knowing your main challenges helps us prioritize the most relevant guidance
        </p>
      </div>

      {/* Encouraging Progress Message */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-100">
        <div className="text-2xl mb-2">💪</div>
        <p className="text-lg font-semibold text-purple-900 mb-2">
          Awesome progress!
        </p>
        <p className="text-purple-700">
          You're building a foundation for truly personalized relationship coaching
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection2;
