
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
    <div className="space-y-6">
      {/* Stress Response */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          When relationship stress hits, you typically: <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {stressResponseOptions.map((response) => (
            <button
              key={response}
              onClick={() => handleMultiSelect('stressResponse', response)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.stressResponse || []).includes(response)
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Understanding your stress patterns helps us suggest coping strategies that work for you
        </p>
      </div>

      {/* Conflict Needs */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          In conflict, what do you need most? <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Select up to 3</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {conflictNeedsOptions.map((need) => (
            <button
              key={need}
              onClick={() => handleMultiSelect('conflictNeeds', need)}
              disabled={(profileData.conflictNeeds || []).length >= 3 && !(profileData.conflictNeeds || []).includes(need)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.conflictNeeds || []).includes(need)
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                  : (profileData.conflictNeeds || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {need}
            </button>
          ))}
        </div>
        {(profileData.conflictNeeds || []).length > 0 && (
          <p className="text-sm text-rose-600 font-medium">
            Selected: {(profileData.conflictNeeds || []).length}/3
          </p>
        )}
        <p className="text-xs text-gray-500">
          Knowing what you need during conflict helps us coach you through difficult moments
        </p>
      </div>

      {/* Feel Loved When */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          You feel most loved when someone: <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Select up to 3</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {feelLovedOptions.map((way) => (
            <button
              key={way}
              onClick={() => handleMultiSelect('feelLovedWhen', way)}
              disabled={(profileData.feelLovedWhen || []).length >= 3 && !(profileData.feelLovedWhen || []).includes(way)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.feelLovedWhen || []).includes(way)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md'
                  : (profileData.feelLovedWhen || []).length >= 3
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {way}
            </button>
          ))}
        </div>
        {(profileData.feelLovedWhen || []).length > 0 && (
          <p className="text-sm text-rose-600 font-medium">
            Selected: {(profileData.feelLovedWhen || []).length}/3
          </p>
        )}
        <p className="text-xs text-gray-500">
          Understanding your love language helps us suggest ways to feel more connected
        </p>
      </div>

      {/* Attachment Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Your attachment style (if known): <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {attachmentOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('attachmentStyle', style)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                profileData.attachmentStyle === style
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Don't worry if you're not sure - we can explore this together
        </p>
        <p className="text-xs text-gray-500">
          Attachment style influences how you connect, communicate, and handle relationship challenges
        </p>
      </div>

      {/* Encouraging Progress Message */}
      <div className="text-center p-4 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 rounded-lg border border-rose-200">
        <div className="text-2xl mb-2">🎉</div>
        <p className="text-base font-semibold text-rose-900 mb-1">
          Great! You've covered the essentials
        </p>
        <p className="text-sm text-rose-700">
          You're helping RealTalk understand how to support you better. The next section is optional but helps provide even more personalized insights.
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection3;
