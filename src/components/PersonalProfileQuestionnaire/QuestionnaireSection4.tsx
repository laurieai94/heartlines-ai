
import { Label } from "@/components/ui/label";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection4Props) => {
  if (!isReady) return null;

  const familyDynamicsOptions = [
    'Supportive/stable', 'Loving but chaotic', 'Emotionally distant', 'High conflict/unsafe',
    'Overprotective', 'Avoided conversations', 'Complex/unpacking', 'Prefer not to share'
  ];

  const parentConflictOptions = [
    'Talked calmly', 'Avoided entirely', 'Fought intensely', 'One gave in',
    'Silent treatment', 'Brought others in', 'Resolved quickly', 'Don\'t remember', 'Prefer not to share'
  ];

  const loveMessagesOptions = [
    'Love requires sacrifice', 'Independence more important', 'Conflict means failure',
    'Earn love through performance', 'Love should be easy', 'Trust is dangerous',
    'Never go to bed angry', 'Family first', 'Still discovering'
  ];

  const loveInfluencesOptions = [
    'Parents\' relationship', 'Friends/peers', 'Culture/religion', 'Books/media',
    'Past experiences', 'Therapy/development', 'Trauma', 'Creating own blueprint'
  ];

  return (
    <div className="space-y-6">
      {/* Two Column Layout for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Family Dynamics */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Family dynamics growing up
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              💡 <strong>Why we ask:</strong> Family patterns repeat. Let's break the cycle
            </p>
            <div className="space-y-2">
              {familyDynamicsOptions.map((dynamic) => (
                <button
                  key={dynamic}
                  onClick={() => handleMultiSelect('familyDynamics', dynamic)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.familyDynamics || []).includes(dynamic)
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  {dynamic}
                </button>
              ))}
            </div>
          </div>

          {/* Love Messages */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Messages about love received
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              💡 <strong>Why we ask:</strong> Challenge limiting beliefs about love
            </p>
            <div className="space-y-2">
              {loveMessagesOptions.map((message) => (
                <button
                  key={message}
                  onClick={() => handleMultiSelect('loveMessages', message)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.loveMessages || []).includes(message)
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Parent Conflict Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              How parents handled conflict
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              💡 <strong>Why we ask:</strong> Learn new conflict tools that actually work
            </p>
            <div className="space-y-2">
              {parentConflictOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => handleMultiSelect('parentConflictStyle', style)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.parentConflictStyle || []).includes(style)
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Love Influences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              What influenced love ideas
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              💡 <strong>Why we ask:</strong> Honor your values, challenge unhelpful patterns
            </p>
            <div className="space-y-2">
              {loveInfluencesOptions.map((influence) => (
                <button
                  key={influence}
                  onClick={() => handleMultiSelect('loveInfluences', influence)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.loveInfluences || []).includes(influence)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {influence}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final Encouragement */}
      <div className="text-center p-4 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 rounded-lg border border-rose-200">
        <div className="text-2xl mb-2">🌟</div>
        <p className="text-lg font-bold text-rose-900 mb-1">
          You're all set!
        </p>
        <p className="text-rose-700 text-sm mb-2">
          Thanks for sharing so thoughtfully. This foundation will help RealTalk provide truly personalized guidance.
        </p>
        <p className="text-rose-600 text-xs">
          Remember: You can always update your profile as you learn and grow
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
