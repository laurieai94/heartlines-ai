
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
    <div className="questionnaire-bg p-6">
      <div className="max-w-3xl mx-auto">
        <div className="questionnaire-card p-6 space-y-6">
      {/* Two Column Layout for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Family Dynamics */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold questionnaire-text">
              How would you describe your family dynamics growing up?
            </Label>
            <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>Your family shaped your relationship blueprint (for better or worse)</span>
            </div>
            <div className="space-y-2">
              {familyDynamicsOptions.map((dynamic) => (
                <button
                  key={dynamic}
                  onClick={() => handleMultiSelect('familyDynamics', dynamic)}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.familyDynamics || []).includes(dynamic)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {dynamic}
                </button>
              ))}
            </div>
          </div>

          {/* Love Messages */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold questionnaire-text">
              What messages about love did you receive growing up?
            </Label>
            <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>The stuff about relationships you internalized growing up</span>
            </div>
            <div className="space-y-2">
              {loveMessagesOptions.map((message) => (
                <button
                  key={message}
                  onClick={() => handleMultiSelect('loveMessages', message)}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.loveMessages || []).includes(message)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
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
            <Label className="text-lg font-semibold questionnaire-text">
              How parents handled conflict
            </Label>
            <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>How they fought affects how you fight - let's break the cycle</span>
            </div>
            <div className="space-y-2">
              {parentConflictOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => handleMultiSelect('parentConflictStyle', style)}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.parentConflictStyle || []).includes(style)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Love Influences */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold questionnaire-text">
              What influenced love ideas
            </Label>
            <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>What shaped your ideas about how love should work</span>
            </div>
            <div className="space-y-2">
              {loveInfluencesOptions.map((influence) => (
                <button
                  key={influence}
                  onClick={() => handleMultiSelect('loveInfluences', influence)}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.loveInfluences || []).includes(influence)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
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
            <p className="text-lg font-bold questionnaire-text mb-2">
              You're all set!
            </p>
            <p className="questionnaire-text-muted text-base mb-3">
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
