
import { Label } from "@/components/ui/label";
import { Home, UserCheck, Heart, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection4Props) => {
  const [showAllFamilyOptions, setShowAllFamilyOptions] = useState(false);
  const [showAllConflictOptions, setShowAllConflictOptions] = useState(false);
  const [showAllMessageOptions, setShowAllMessageOptions] = useState(false);
  const [showAllInfluenceOptions, setShowAllInfluenceOptions] = useState(false);

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
      {/* Family Dynamics */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-white">
            How would you describe your family dynamics growing up?
          </Label>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Home className="w-4 h-4 text-green-300" />
            <span>Your family shaped your relationship blueprint (for better or worse)</span>
          </div>
          <p className="text-orange-300 font-medium text-sm mb-4">Select all that feel relevant (optional)</p>
        </div>
        
        <div className="space-y-3">
          {familyDynamicsOptions.slice(0, showAllFamilyOptions ? familyDynamicsOptions.length : 6).map((dynamic) => (
            <button
              key={dynamic}
              onClick={() => handleMultiSelect('familyDynamics', dynamic)}
              className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.familyDynamics || []).includes(dynamic)
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 text-white shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/15'
              }`}
            >
              {dynamic}
            </button>
          ))}
          
          {familyDynamicsOptions.length > 6 && (
            <button
              onClick={() => setShowAllFamilyOptions(!showAllFamilyOptions)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {showAllFamilyOptions ? (
                <>Show less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show more options <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Parent Conflict Style */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-white">
            How did your parents handle conflict?
          </Label>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <UserCheck className="w-4 h-4 text-orange-300" />
            <span>How they fought affects how you fight - let's break the cycle</span>
          </div>
          <p className="text-orange-300 font-medium text-sm mb-4">Select all that apply (optional)</p>
        </div>
        
        <div className="space-y-3">
          {parentConflictOptions.slice(0, showAllConflictOptions ? parentConflictOptions.length : 6).map((style) => (
            <button
              key={style}
              onClick={() => handleMultiSelect('parentConflictStyle', style)}
              className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.parentConflictStyle || []).includes(style)
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-2 border-orange-400/50 text-white shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/15'
              }`}
            >
              {style}
            </button>
          ))}
          
          {parentConflictOptions.length > 6 && (
            <button
              onClick={() => setShowAllConflictOptions(!showAllConflictOptions)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {showAllConflictOptions ? (
                <>Show less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show more styles <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Love Messages */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-white">
            What messages about love did you receive growing up?
          </Label>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Heart className="w-4 h-4 text-pink-300" />
            <span>The stuff about relationships you internalized growing up</span>
          </div>
          <p className="text-orange-300 font-medium text-sm mb-4">Select all that resonate (optional)</p>
        </div>
        
        <div className="space-y-3">
          {loveMessagesOptions.slice(0, showAllMessageOptions ? loveMessagesOptions.length : 6).map((message) => (
            <button
              key={message}
              onClick={() => handleMultiSelect('loveMessages', message)}
              className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.loveMessages || []).includes(message)
                  ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-2 border-pink-400/50 text-white shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/15'
              }`}
            >
              {message}
            </button>
          ))}
          
          {loveMessagesOptions.length > 6 && (
            <button
              onClick={() => setShowAllMessageOptions(!showAllMessageOptions)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {showAllMessageOptions ? (
                <>Show less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show more messages <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Love Influences */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-white">
            What influenced your ideas about love?
          </Label>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>What shaped your ideas about how love should work</span>
          </div>
          <p className="text-orange-300 font-medium text-sm mb-4">Select all that apply (optional)</p>
        </div>
        
        <div className="space-y-3">
          {loveInfluencesOptions.slice(0, showAllInfluenceOptions ? loveInfluencesOptions.length : 6).map((influence) => (
            <button
              key={influence}
              onClick={() => handleMultiSelect('loveInfluences', influence)}
              className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.loveInfluences || []).includes(influence)
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50 text-white shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/15'
              }`}
            >
              {influence}
            </button>
          ))}
          
          {loveInfluencesOptions.length > 6 && (
            <button
              onClick={() => setShowAllInfluenceOptions(!showAllInfluenceOptions)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {showAllInfluenceOptions ? (
                <>Show less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show more influences <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Final Encouragement */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl border border-purple-400/20 p-6 text-center space-y-4">
        <div className="text-4xl mb-3">🌟</div>
        <h3 className="text-lg font-semibold text-white mb-2">
          You're all set!
        </h3>
        <p className="text-white/90 text-sm mb-3 max-w-md mx-auto">
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
