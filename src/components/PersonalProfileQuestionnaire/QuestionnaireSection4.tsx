
import { Label } from "@/components/ui/label";
import { Home, UserCheck, Heart, BookOpen, Sparkles } from "lucide-react";

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
    <div className="space-y-2">
      {/* Family Dynamics */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            How would you describe your family dynamics growing up? <span className="text-red-400">*</span>
            <span className="text-electric-blue font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <Home className="w-3 h-3 text-electric-blue" />
            <span>Your family shaped your relationship blueprint (for better or worse)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {familyDynamicsOptions.map((dynamic) => (
            <button
              key={dynamic}
              onClick={() => handleMultiSelect('familyDynamics', dynamic)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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

      {/* Parent Conflict Style */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            How did your parents handle conflict? <span className="text-red-400">*</span>
            <span className="text-electric-blue font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <UserCheck className="w-3 h-3 text-electric-purple" />
            <span>How they fought affects how you fight - let's break the cycle</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {parentConflictOptions.map((style) => (
            <button
              key={style}
              onClick={() => handleMultiSelect('parentConflictStyle', style)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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

      {/* Love Messages */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            What messages about love did you receive growing up? <span className="text-red-400">*</span>
            <span className="text-electric-blue font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <Heart className="w-3 h-3 text-neon-cyan" />
            <span>The stuff about relationships you internalized growing up</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {loveMessagesOptions.map((message) => (
            <button
              key={message}
              onClick={() => handleMultiSelect('loveMessages', message)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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

      {/* Love Influences */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            What influenced your ideas about love? <span className="text-red-400">*</span>
            <span className="text-electric-blue font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <BookOpen className="w-3 h-3 text-electric-blue" />
            <span>What shaped your ideas about how love should work</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {loveInfluencesOptions.map((influence) => (
            <button
              key={influence}
              onClick={() => handleMultiSelect('loveInfluences', influence)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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

      {/* Final Encouragement */}
      <div className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10 backdrop-blur-lg rounded-xl border border-electric-blue/20 p-3 text-center space-y-2">
        <div className="flex justify-center mb-1">
          <Sparkles className="w-6 h-6 text-electric-blue" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1">
          You're all set!
        </h3>
        <p className="text-white/90 text-xs mb-1 max-w-md mx-auto">
          Thanks for sharing so thoughtfully. This foundation will help RealTalk provide truly personalized guidance.
        </p>
        <p className="text-white/70 text-xs">
          Remember: You can always update your profile as you learn and grow
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
