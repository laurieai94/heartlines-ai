
import { Label } from "@/components/ui/label";
import { Brain, MessageSquare, Shield, Users, ChevronDown, ChevronUp } from "lucide-react";
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

  return (
    <div className="space-y-3">
      {/* Stress Response */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-base font-semibold text-white mb-1 block">
            When you're feeling stressed, how do you typically respond? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
            <Brain className="w-4 h-4 text-purple-300" />
            <span>How you react when life gets overwhelming (spoiler: we all have patterns)</span>
          </div>
          <p className="text-orange-300 font-medium text-xs mb-2">Check all that apply</p>
        </div>
        
        <div className="space-y-1">
          {stressResponseOptions.slice(0, showAllStressOptions ? stressResponseOptions.length : 6).map((response) => (
            <button
              key={response}
              onClick={() => handleMultiSelect('stressResponse', response)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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

      {/* Conflict Needs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-base font-semibold text-white mb-1 block">
            When you're in conflict, what do you need? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
            <Shield className="w-4 h-4 text-blue-300" />
            <span>What you actually need during fights (not what you think you should need)</span>
          </div>
          <p className="text-orange-300 font-medium text-xs mb-2">Check all that apply</p>
        </div>
        
        <div className="space-y-1">
          {conflictNeedsOptions.slice(0, showAllConflictOptions ? conflictNeedsOptions.length : 6).map((need) => (
            <button
              key={need}
              onClick={() => handleMultiSelect('conflictNeeds', need)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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

      {/* Feel Loved When */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-base font-semibold text-white mb-1 block">
            When do you feel most loved? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
            <MessageSquare className="w-4 h-4 text-pink-300" />
            <span>Your specific love language, not generic relationship advice</span>
          </div>
          <p className="text-orange-300 font-medium text-xs mb-2">Check all that apply</p>
        </div>
        
        <div className="space-y-1">
          {feelLovedOptions.slice(0, showAllLovedOptions ? feelLovedOptions.length : 6).map((way) => (
            <button
              key={way}
              onClick={() => handleMultiSelect('feelLovedWhen', way)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
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

      {/* Attachment Style */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div>
          <Label className="text-base font-semibold text-white mb-1 block">
            What's your attachment style? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
            <Users className="w-4 h-4 text-orange-300" />
            <span>The psychological patterns that run your relationships (yes, even yours)</span>
          </div>
        </div>
        
        <div className="space-y-1">
          {attachmentOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('attachmentStyle', style)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
  );
};

export default QuestionnaireSection3;
