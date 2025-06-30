
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
        <h3 className="text-2xl font-bold text-gray-900">How You Operate</h3>
        <p className="text-gray-600 text-lg">Understanding your patterns helps us provide better support</p>
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-full px-4 py-2 mx-auto w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Your answers are automatically saved
        </div>
      </div>

      {/* Stress Response */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          When relationship stress hits, you typically: <span className="text-red-500 text-lg">*</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stressResponseOptions.map((response) => (
            <button
              key={response}
              onClick={() => handleMultiSelect('stressResponse', response)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.stressResponse || []).includes(response)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Understanding your stress patterns helps us suggest coping strategies that actually work for you
        </p>
      </div>

      {/* Conflict Needs */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          In conflict, what do you need most? <span className="text-red-500 text-lg">*</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Select up to 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conflictNeedsOptions.map((need) => (
            <button
              key={need}
              onClick={() => handleMultiSelect('conflictNeeds', need)}
              disabled={(profileData.conflictNeeds || []).length >= 3 && !(profileData.conflictNeeds || []).includes(need)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.conflictNeeds || []).includes(need)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : (profileData.conflictNeeds || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {need}
            </button>
          ))}
        </div>
        {(profileData.conflictNeeds || []).length > 0 && (
          <p className="text-sm text-purple-600 font-medium">
            Selected: {(profileData.conflictNeeds || []).length}/3
          </p>
        )}
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Knowing what you need during conflict helps us coach you and your partner through difficult moments
        </p>
      </div>

      {/* Feel Loved When */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          You feel most loved when someone: <span className="text-red-500 text-lg">*</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Select up to 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {feelLovedOptions.map((way) => (
            <button
              key={way}
              onClick={() => handleMultiSelect('feelLovedWhen', way)}
              disabled={(profileData.feelLovedWhen || []).length >= 3 && !(profileData.feelLovedWhen || []).includes(way)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.feelLovedWhen || []).includes(way)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-lg'
                  : (profileData.feelLovedWhen || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50 shadow-sm hover:shadow-md'
              }`}
            >
              {way}
            </button>
          ))}
        </div>
        {(profileData.feelLovedWhen || []).length > 0 && (
          <p className="text-sm text-purple-600 font-medium">
            Selected: {(profileData.feelLovedWhen || []).length}/3
          </p>
        )}
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Understanding your love language helps us suggest ways to feel more connected in your relationships
        </p>
      </div>

      {/* Attachment Style */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          Your attachment style (if known): <span className="text-red-500 text-lg">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attachmentOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('attachmentStyle', style)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                profileData.attachmentStyle === style
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Don't worry if you're not sure - we can explore this together
        </p>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Attachment style influences how you connect, communicate, and handle relationship challenges
        </p>
      </div>

      {/* Encouraging Progress Message */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-100">
        <div className="text-2xl mb-2">🎉</div>
        <p className="text-lg font-semibold text-purple-900 mb-2">
          Great! You've covered the essentials
        </p>
        <p className="text-purple-700">
          You're helping RealTalk understand how to support you better. The next section is optional but helps provide even more personalized insights.
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection3;
