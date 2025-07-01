import { Label } from "@/components/ui/label";
import { Brain, Heart, Shield, Users } from "lucide-react";

interface QuestionnaireSection3Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection3 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection3Props) => {
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
      <div className="questionnaire-card p-3 space-y-3">
        {/* Two Column Layout for Desktop */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Stress Response */}
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                When stressed, you typically... <span className="text-red-400">*</span>
                <span className="text-orange-300 font-medium text-xs ml-2">Check all that apply</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] questionnaire-text-muted mb-2 font-normal">
                <Brain className="w-4 h-4 text-purple-300" />
                <span>How you react when life gets overwhelming (spoiler: we all have patterns)</span>
              </div>
              <div className="space-y-1.5">
                {stressResponseOptions.map((response) => (
                  <button
                    key={response}
                    onClick={() => handleMultiSelect('stressResponse', response)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
                      (profileData.stressResponse || []).includes(response)
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Feel Loved When */}
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                You feel most loved when... <span className="text-red-400">*</span>
                <span className="text-orange-300 font-medium text-xs ml-2">Check all that apply</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] questionnaire-text-muted mb-2 font-normal">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>Your specific love language, not generic relationship advice</span>
              </div>
              <div className="space-y-1.5">
                {feelLovedOptions.map((way) => (
                  <button
                    key={way}
                    onClick={() => handleMultiSelect('feelLovedWhen', way)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
                      (profileData.feelLovedWhen || []).includes(way)
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {way}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Conflict Needs */}
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                During conflict, you need... <span className="text-red-400">*</span>
                <span className="text-orange-300 font-medium text-xs ml-2">Check all that apply</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] questionnaire-text-muted mb-2 font-normal">
                <Shield className="w-4 h-4 text-blue-300" />
                <span>What you actually need during fights (not what you think you should need)</span>
              </div>
              <div className="space-y-1.5">
                {conflictNeedsOptions.map((need) => (
                  <button
                    key={need}
                    onClick={() => handleMultiSelect('conflictNeeds', need)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-9 ${
                      (profileData.conflictNeeds || []).includes(need)
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            {/* Attachment Style */}
            <div className="space-y-2">
              <Label className="text-base font-semibold questionnaire-text">
                What's your attachment style? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] questionnaire-text-muted mb-2 font-normal">
                <Users className="w-4 h-4 text-orange-300" />
                <span>The psychological patterns that run your relationships (yes, even yours)</span>
              </div>
              <div className="space-y-1.5">
                {attachmentOptions.map((style) => (
                  <button
                    key={style}
                    onClick={() => updateField('attachmentStyle', style)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all text-left hover:scale-105 h-auto min-h-[36px] ${
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
      </div>
    </div>
  );
};

export default QuestionnaireSection3;