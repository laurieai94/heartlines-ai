
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
              <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Your stress patterns predict how you'll handle relationship challenges
            </p>
            <div className="space-y-2">
              {stressResponseOptions.map((response) => (
                <button
                  key={response}
                  onClick={() => handleMultiSelect('stressResponse', response)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.stressResponse || []).includes(response)
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-blue-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
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
              <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Your love language preferences guide how we suggest showing and receiving love
            </p>
            <div className="space-y-2">
              {feelLovedOptions.map((way) => (
                <button
                  key={way}
                  onClick={() => handleMultiSelect('feelLovedWhen', way)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.feelLovedWhen || []).includes(way)
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
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
              <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
            </Label>
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Conflict needs help us suggest resolution strategies that honor your emotional processing style
            </p>
            <div className="space-y-2">
              {conflictNeedsOptions.map((need) => (
                <button
                  key={need}
                  onClick={() => handleMultiSelect('conflictNeeds', need)}
                  className={`w-full p-2 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    (profileData.conflictNeeds || []).includes(need)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-md'
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
              Your attachment style <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Attachment style is the foundation of how you connect, trust, and handle intimacy
            </p>
            <div className="space-y-2">
              {attachmentOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => updateField('attachmentStyle', style)}
                  className={`w-full p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    profileData.attachmentStyle === style
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
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
