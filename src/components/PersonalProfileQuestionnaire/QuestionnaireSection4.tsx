import { Label } from "@/components/ui/label";
import { Home, Users, Heart, BookOpen } from "lucide-react";

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
    <div className="space-y-3">
      <div className="questionnaire-card p-3 space-y-3">
        {/* Two Column Layout for Desktop */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Family Dynamics */}
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                How would you describe your family dynamics growing up?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/90 mb-2 font-normal">
                <Home className="w-4 h-4 text-green-300" />
                <span>Your family shaped your relationship blueprint (for better or worse)</span>
              </div>
              <div className="space-y-1.5">
                {familyDynamicsOptions.map((dynamic) => (
                  <button
                    key={dynamic}
                    onClick={() => handleMultiSelect('familyDynamics', dynamic)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
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
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                What messages about love did you receive growing up?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/90 mb-2 font-normal">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>The stuff about relationships you internalized growing up</span>
              </div>
              <div className="space-y-1.5">
                {loveMessagesOptions.map((message) => (
                  <button
                    key={message}
                    onClick={() => handleMultiSelect('loveMessages', message)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
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
          <div className="space-y-3">
            {/* Parent Conflict Style */}
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                How did your parents handle conflict?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/90 mb-2 font-normal">
                <Users className="w-4 h-4 text-orange-300" />
                <span>How they fought affects how you fight - let's break the cycle</span>
              </div>
              <div className="space-y-1.5">
                {parentConflictOptions.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleMultiSelect('parentConflictStyle', style)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
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
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                What influenced your ideas about love?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/90 mb-2 font-normal">
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span>What shaped your ideas about how love should work</span>
              </div>
              <div className="space-y-1.5">
                {loveInfluencesOptions.map((influence) => (
                  <button
                    key={influence}
                    onClick={() => handleMultiSelect('loveInfluences', influence)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
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
        <div className="text-center p-3 questionnaire-card">
          <div className="text-2xl mb-2">🌟</div>
          <p className="text-base font-semibold questionnaire-text mb-1">
            You're all set!
          </p>
          <p className="text-white/90 text-[13px] mb-2 font-normal">
            Thanks for sharing so thoughtfully. This foundation will help RealTalk provide truly personalized guidance.
          </p>
          <p className="text-white/90 text-xs font-normal">
            Remember: You can always update your profile as you learn and grow
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;