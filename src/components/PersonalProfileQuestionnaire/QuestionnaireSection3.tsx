
import { Label } from "@/components/ui/label";

interface QuestionnaireSection3Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection3 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection3Props) => {
  if (!isReady) return null;

  const stressResponseOptions = [
    'Shut down/withdraw', 'Get anxious/seek reassurance', 'Try to fix everything',
    'Get defensive/argumentative', 'Avoid and hope it passes', 'Cycle between reactions',
    'Still figuring out patterns'
  ];

  const conflictNeedsOptions = [
    'To be heard/understood', 'Emotional comfort/reassurance', 'Time/space to process',
    'Clear problem-solving steps', 'Tensions to cool naturally', 'Help expressing feelings'
  ];

  const feelLovedOptions = [
    'Uses encouraging words', 'Gives focused time/attention', 'Does thoughtful acts of service',
    'Shows physical affection', 'Gives meaningful gifts', 'Really sees/understands you'
  ];

  const attachmentOptions = [
    'Secure', 'Anxious', 'Avoidant', 'Fearful-avoidant', 
    'Don\'t know', 'Don\'t connect with attachment theory'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">How You Operate</h3>
        <p className="text-gray-600">Understanding your patterns helps us provide better support</p>
        <p className="text-xs text-green-600">✓ Your answers are automatically saved</p>
      </div>

      {/* Stress Response */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          When relationship stress hits, you typically: <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stressResponseOptions.map((response) => (
            <button
              key={response}
              onClick={() => handleMultiSelect('stressResponse', response)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.stressResponse || []).includes(response)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* Conflict Needs */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          In conflict, what do you need most? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Select up to 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {conflictNeedsOptions.map((need) => (
            <button
              key={need}
              onClick={() => handleMultiSelect('conflictNeeds', need)}
              disabled={(profileData.conflictNeeds || []).length >= 3 && !(profileData.conflictNeeds || []).includes(need)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.conflictNeeds || []).includes(need)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : (profileData.conflictNeeds || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {need}
            </button>
          ))}
        </div>
        {(profileData.conflictNeeds || []).length > 0 && (
          <p className="text-xs text-gray-500">
            Selected: {(profileData.conflictNeeds || []).length}/3
          </p>
        )}
      </div>

      {/* Feel Loved When */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          You feel most loved when someone: <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Select up to 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {feelLovedOptions.map((way) => (
            <button
              key={way}
              onClick={() => handleMultiSelect('feelLovedWhen', way)}
              disabled={(profileData.feelLovedWhen || []).length >= 3 && !(profileData.feelLovedWhen || []).includes(way)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.feelLovedWhen || []).includes(way)
                  ? 'bg-pink-500 text-white border-pink-500'
                  : (profileData.feelLovedWhen || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {way}
            </button>
          ))}
        </div>
        {(profileData.feelLovedWhen || []).length > 0 && (
          <p className="text-xs text-gray-500">
            Selected: {(profileData.feelLovedWhen || []).length}/3
          </p>
        )}
      </div>

      {/* Attachment Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Your attachment style (if known): <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {attachmentOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('attachmentStyle', style)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                profileData.attachmentStyle === style
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Don't worry if you're not sure - we can explore this together
        </p>
      </div>

      {/* Encouragement */}
      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-gray-700 font-medium">
          🎉 Great! You're helping RealTalk understand how to support you better
        </p>
        <p className="text-xs text-gray-500 mt-1">
          The next section is optional but helps provide even more personalized insights
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection3;
