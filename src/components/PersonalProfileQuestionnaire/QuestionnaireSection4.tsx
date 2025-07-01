
import { Label } from "@/components/ui/label";
import { Home, UserCheck, Heart, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Sparkles } from "lucide-react";
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

  // Completion checks (optional questions)
  const isFamilyComplete = profileData.familyDynamics && profileData.familyDynamics.length > 0;
  const isConflictComplete = profileData.parentConflictStyle && profileData.parentConflictStyle.length > 0;
  const isMessagesComplete = profileData.loveMessages && profileData.loveMessages.length > 0;
  const isInfluencesComplete = profileData.loveInfluences && profileData.loveInfluences.length > 0;

  // Reflective question themes
  const questionThemes = {
    family: 'from-green-500/10 to-emerald-500/10 border-green-400/20',
    conflict: 'from-orange-500/10 to-amber-500/10 border-orange-400/20',
    messages: 'from-pink-500/10 to-rose-500/10 border-pink-400/20',
    influences: 'from-blue-500/10 to-indigo-500/10 border-blue-400/20'
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Your Foundation</h2>
        <p className="text-white/70 text-sm">The deeper patterns that shape how you love</p>
      </div>

      <div className="space-y-6">
        {/* Family Dynamics */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.family} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.family} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isFamilyComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold text-white">
                How would you describe your family dynamics growing up?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 font-normal">
                <Home className="w-4 h-4 text-green-300" />
                <span>Your family shaped your relationship blueprint (for better or worse)</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border-l-4 border-green-300/50">
                <p className="text-orange-300 font-medium text-xs">Select all that feel relevant (optional)</p>
                <p className="text-white/60 text-xs mt-1">These questions help us understand your deeper patterns</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {familyDynamicsOptions.slice(0, showAllFamilyOptions ? familyDynamicsOptions.length : 6).map((dynamic) => (
                <button
                  key={dynamic}
                  onClick={() => handleMultiSelect('familyDynamics', dynamic)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.familyDynamics || []).includes(dynamic)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {dynamic}
                </button>
              ))}
              
              {familyDynamicsOptions.length > 6 && (
                <button
                  onClick={() => setShowAllFamilyOptions(!showAllFamilyOptions)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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
        </div>

        {/* Parent Conflict Style */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.conflict} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.conflict} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isConflictComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold text-white">
                How did your parents handle conflict?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 font-normal">
                <UserCheck className="w-4 h-4 text-orange-300" />
                <span>How they fought affects how you fight - let's break the cycle</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border-l-4 border-orange-300/50">
                <p className="text-orange-300 font-medium text-xs">Select all that apply (optional)</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {parentConflictOptions.slice(0, showAllConflictOptions ? parentConflictOptions.length : 6).map((style) => (
                <button
                  key={style}
                  onClick={() => handleMultiSelect('parentConflictStyle', style)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.parentConflictStyle || []).includes(style)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {style}
                </button>
              ))}
              
              {parentConflictOptions.length > 6 && (
                <button
                  onClick={() => setShowAllConflictOptions(!showAllConflictOptions)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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
        </div>

        {/* Love Messages */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.messages} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.messages} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isMessagesComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold text-white">
                What messages about love did you receive growing up?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 font-normal">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>The stuff about relationships you internalized growing up</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border-l-4 border-pink-300/50">
                <p className="text-orange-300 font-medium text-xs">Select all that resonate (optional)</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {loveMessagesOptions.slice(0, showAllMessageOptions ? loveMessagesOptions.length : 6).map((message) => (
                <button
                  key={message}
                  onClick={() => handleMultiSelect('loveMessages', message)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.loveMessages || []).includes(message)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {message}
                </button>
              ))}
              
              {loveMessagesOptions.length > 6 && (
                <button
                  onClick={() => setShowAllMessageOptions(!showAllMessageOptions)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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
        </div>

        {/* Love Influences */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.influences} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.influences} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isInfluencesComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-semibold text-white">
                What influenced your ideas about love?
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 font-normal">
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span>What shaped your ideas about how love should work</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border-l-4 border-blue-300/50">
                <p className="text-orange-300 font-medium text-xs">Select all that apply (optional)</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {loveInfluencesOptions.slice(0, showAllInfluenceOptions ? loveInfluencesOptions.length : 6).map((influence) => (
                <button
                  key={influence}
                  onClick={() => handleMultiSelect('loveInfluences', influence)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.loveInfluences || []).includes(influence)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {influence}
                </button>
              ))}
              
              {loveInfluencesOptions.length > 6 && (
                <button
                  onClick={() => setShowAllInfluenceOptions(!showAllInfluenceOptions)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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
        </div>

        {/* Completion Celebration */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-purple-400/20 p-6 text-center space-y-4 animate-fade-in">
            <div className="flex justify-center space-x-2">
              <div className="text-3xl animate-bounce">🌟</div>
              <div className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</div>
              <div className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</div>
            </div>
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

        {/* Progress Indicator */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>Section 4 Progress (Optional)</span>
            <span className="font-medium">
              {[isFamilyComplete, isConflictComplete, isMessagesComplete, isInfluencesComplete].filter(Boolean).length}/4
            </span>
          </div>
          <div className="mt-2 w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${([isFamilyComplete, isConflictComplete, isMessagesComplete, isInfluencesComplete].filter(Boolean).length / 4) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
