
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
    'Single actively dating', 'Single not dating', 'Casual/dating around', 
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

  // Check if user is in some form of relationship (not single not dating)
  const isInRelationship = profileData.relationshipStatus && 
    !['Single actively dating', 'Single not dating'].includes(profileData.relationshipStatus);
  
  // Check if user is in a defined relationship that has a length (not casual/complicated)
  const hasRelationshipLength = profileData.relationshipStatus && 
    !['Single actively dating', 'Single not dating', 'Casual/dating around', 'It\'s complicated'].includes(profileData.relationshipStatus);

  return (
    <div className="space-y-6">
      {/* Relationship Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Current relationship status <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-600 mb-3">
          💡 <strong>Why we ask:</strong> Your relationship status shapes what guidance is most helpful - from dating tips to deepening existing connections
        </p>
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

      {/* Conditional Relationship Length */}
      {hasRelationshipLength && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            How long have you been together? <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-600 mb-3">
            💡 <strong>Why we ask:</strong> Each relationship stage has unique dynamics and challenges - this helps us offer stage-appropriate guidance
          </p>
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
            <p className="text-xs text-gray-600 mb-3">
              💡 <strong>Why we ask:</strong> Knowing your relationship strengths helps us build on what's already working rather than starting from scratch
            </p>
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
            <p className="text-xs text-gray-600 mb-3">
              💡 <strong>Why we ask:</strong> Understanding your specific challenges lets us provide targeted strategies that address your actual pain points
            </p>
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
        <p className="text-xs text-gray-600 mb-3">
          💡 <strong>Why we ask:</strong> Your goals help us tailor conversations to what matters most to you right now in your relationship journey
        </p>
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
