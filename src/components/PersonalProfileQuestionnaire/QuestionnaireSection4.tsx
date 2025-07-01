
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

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
    <div className="questionnaire-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="questionnaire-card p-8 space-y-8">
      {/* Two Column Layout for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Family Dynamics */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              How would you describe your family dynamics growing up?
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>Your family shaped your relationship blueprint (for better or worse)</span>
            </div>
            <div className="space-y-2">
              {familyDynamicsOptions.map((dynamic) => (
                <button
                  key={dynamic}
                  onClick={() => handleMultiSelect('familyDynamics', dynamic)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.familyDynamics || []).includes(dynamic)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
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
              What messages about love did you receive growing up?
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>The stuff about relationships you internalized growing up</span>
            </div>
            <div className="space-y-2">
              {loveMessagesOptions.map((message) => (
                <button
                  key={message}
                  onClick={() => handleMultiSelect('loveMessages', message)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.loveMessages || []).includes(message)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
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
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>How they fought affects how you fight - let's break the cycle</span>
            </div>
            <div className="space-y-2">
              {parentConflictOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => handleMultiSelect('parentConflictStyle', style)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.parentConflictStyle || []).includes(style)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
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
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>What shaped your ideas about how love should work</span>
            </div>
            <div className="space-y-2">
              {loveInfluencesOptions.map((influence) => (
                <button
                  key={influence}
                  onClick={() => handleMultiSelect('loveInfluences', influence)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.loveInfluences || []).includes(influence)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
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
          <div className="text-center p-6 questionnaire-card">
            <div className="text-3xl mb-3">🌟</div>
            <p className="text-xl font-bold questionnaire-text mb-2">
              You're all set!
            </p>
            <p className="questionnaire-text-muted text-lg mb-3">
              Thanks for sharing so thoughtfully. This foundation will help RealTalk provide truly personalized guidance.
            </p>
            <p className="questionnaire-text-muted text-sm">
              Remember: You can always update your profile as you learn and grow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
