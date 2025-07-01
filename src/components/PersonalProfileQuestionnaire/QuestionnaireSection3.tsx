
import { Label } from "@/components/ui/label";
import { Brain, MessageSquare, Shield, Users, ChevronDown, ChevronUp, CheckCircle2, Zap } from "lucide-react";
import { useState } from "react";

interface QuestionnaireSection3Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection3 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection3Props) => {
  const [showAllStressOptions, setShowAllStressOptions] = useState(false);
  const [showAllConflictOptions, setShowAllConflictOptions] = useState(false);
  const [showAllLovedOptions, setShowAllLovedOptions] = useState(false);

  if (!isReady) return null;

  const stressResponseOptions = [
    'Get quiet/withdraw', 'Want to talk it out immediately', 'Need time to think first',
    'Get emotional/cry', 'Get frustrated/angry', 'Try to fix it right away',
    'Avoid the situation', 'Seek comfort from others'
  ];

  const conflictNeedsOptions = [
    'Space to cool down', 'To be heard first', 'To understand their side',
    'To find solution quickly', 'Reassurance we\'re okay', 'Time to process',
    'Clear communication', 'Physical comfort'
  ];

  const feelLovedOptions = [
    'They listen without judgment', 'Physical affection/touch', 'Quality time together',
    'They do things for me', 'Words of affirmation', 'They remember important things',
    'We have fun together', 'They support my goals'
  ];

  const attachmentOptions = [
    'Secure - comfortable with intimacy and independence',
    'Anxious - worry about relationship, need reassurance',
    'Avoidant - value independence, uncomfortable with too much closeness',
    'Disorganized - mix of anxious and avoidant patterns',
    'Not sure/still figuring it out'
  ];

  // Completion checks
  const isStressComplete = profileData.stressResponse && profileData.stressResponse.length > 0;
  const isConflictComplete = profileData.conflictNeeds && profileData.conflictNeeds.length > 0;
  const isLovedComplete = profileData.feelLovedWhen && profileData.feelLovedWhen.length > 0;
  const isAttachmentComplete = profileData.attachmentStyle && profileData.attachmentStyle !== '';

  // Color themes for different question types
  const questionThemes = {
    stress: 'from-purple-500/10 to-indigo-500/10 border-purple-400/20',
    conflict: 'from-blue-500/10 to-cyan-500/10 border-blue-400/20',
    love: 'from-pink-500/10 to-rose-500/10 border-pink-400/20',
    attachment: 'from-orange-500/10 to-amber-500/10 border-orange-400/20'
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Your Vibe</h2>
        <p className="text-white/70 text-sm">How you operate in relationships</p>
      </div>

      <div className="space-y-6">
        {/* Stress Response */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.stress} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.stress} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isStressComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div>
              <Label className="text-base font-semibold text-white mb-1 block">
                When you're feeling stressed, how do you typically respond? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <Brain className="w-4 h-4 text-purple-300" />
                <span>How you react when life gets overwhelming (spoiler: we all have patterns)</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Check all that apply</p>
            </div>
            
            <div className="space-y-2">
              {stressResponseOptions.slice(0, showAllStressOptions ? stressResponseOptions.length : 6).map((response) => (
                <button
                  key={response}
                  onClick={() => handleMultiSelect('stressResponse', response)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.stressResponse || []).includes(response)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {response}
                </button>
              ))}
              
              {stressResponseOptions.length > 6 && (
                <button
                  onClick={() => setShowAllStressOptions(!showAllStressOptions)}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllStressOptions ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Show more responses <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Conflict Needs */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.conflict} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.conflict} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isConflictComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div>
              <Label className="text-base font-semibold text-white mb-1 block">
                When you're in conflict, what do you need? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <Shield className="w-4 h-4 text-blue-300" />
                <span>What you actually need during fights (not what you think you should need)</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Check all that apply</p>
            </div>
            
            <div className="space-y-2">
              {conflictNeedsOptions.slice(0, showAllConflictOptions ? conflictNeedsOptions.length : 6).map((need) => (
                <button
                  key={need}
                  onClick={() => handleMultiSelect('conflictNeeds', need)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.conflictNeeds || []).includes(need)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {need}
                </button>
              ))}
              
              {conflictNeedsOptions.length > 6 && (
                <button
                  onClick={() => setShowAllConflictOptions(!showAllConflictOptions)}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllConflictOptions ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Show more needs <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feel Loved When */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.love} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.love} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isLovedComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div>
              <Label className="text-base font-semibold text-white mb-1 block">
                When do you feel most loved? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <MessageSquare className="w-4 h-4 text-pink-300" />
                <span>Your specific love language, not generic relationship advice</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Check all that apply</p>
            </div>
            
            <div className="space-y-2">
              {feelLovedOptions.slice(0, showAllLovedOptions ? feelLovedOptions.length : 6).map((way) => (
                <button
                  key={way}
                  onClick={() => handleMultiSelect('feelLovedWhen', way)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    (profileData.feelLovedWhen || []).includes(way)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {way}
                </button>
              ))}
              
              {feelLovedOptions.length > 6 && (
                <button
                  onClick={() => setShowAllLovedOptions(!showAllLovedOptions)}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllLovedOptions ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Show more ways <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Attachment Style */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${questionThemes.attachment} rounded-2xl blur-xl`}></div>
          <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${questionThemes.attachment} p-6 space-y-4 transition-all duration-300 hover:bg-white/15`}>
            {isAttachmentComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            
            <div>
              <Label className="text-base font-semibold text-white mb-1 block">
                What's your attachment style? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-4 font-normal">
                <Users className="w-4 h-4 text-orange-300" />
                <span>The psychological patterns that run your relationships (yes, even yours)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {attachmentOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => updateField('attachmentStyle', style)}
                  className={`w-full p-3 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                    profileData.attachmentStyle === style
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>Section 3 Progress</span>
          <span className="font-medium">
            {[isStressComplete, isConflictComplete, isLovedComplete, isAttachmentComplete].filter(Boolean).length}/4
          </span>
        </div>
        <div className="mt-2 w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${([isStressComplete, isConflictComplete, isLovedComplete, isAttachmentComplete].filter(Boolean).length / 4) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection3;
