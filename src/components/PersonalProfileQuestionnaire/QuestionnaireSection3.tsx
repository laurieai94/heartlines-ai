
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

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
    <div className="space-y-6">
      {/* Two Column Layout for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Stress Response */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              When stressed, you typically... <span className="text-red-500">*</span>
              <span className="text-orange-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>How you react when life gets overwhelming (spoiler: we all have patterns)</span>
            </div>
            <div className="space-y-2">
              {stressResponseOptions.map((response) => (
                <button
                  key={response}
                  onClick={() => handleMultiSelect('stressResponse', response)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.stressResponse || []).includes(response)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {response}
                </button>
              ))}
            </div>
          </div>

          {/* Feel Loved When */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              You feel most loved when... <span className="text-red-500">*</span>
              <span className="text-orange-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>Your specific love language, not generic relationship advice</span>
            </div>
            <div className="space-y-2">
              {feelLovedOptions.map((way) => (
                <button
                  key={way}
                  onClick={() => handleMultiSelect('feelLovedWhen', way)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.feelLovedWhen || []).includes(way)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {way}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Conflict Needs */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              During conflict, you need... <span className="text-red-500">*</span>
              <span className="text-orange-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>What you actually need during fights (not what you think you should need)</span>
            </div>
            <div className="space-y-2">
              {conflictNeedsOptions.map((need) => (
                <button
                  key={need}
                  onClick={() => handleMultiSelect('conflictNeeds', need)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.conflictNeeds || []).includes(need)
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>

          {/* Attachment Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              What's your attachment style? <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Lightbulb className="w-3 h-3" />
              <span>The psychological patterns that run your relationships (yes, even yours)</span>
            </div>
            <div className="space-y-2">
              {attachmentOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => updateField('attachmentStyle', style)}
                  className={`w-full p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    profileData.attachmentStyle === style
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
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
  );
};

export default QuestionnaireSection3;
