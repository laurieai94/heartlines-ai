
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
    'Get quiet & need space',
    'Want to talk it out immediately', 
    'Get emotional & need comfort',
    'Try to fix everything',
    'Shut down completely',
    'Become irritable/snappy',
    'Overthink everything',
    'Seek support from friends',
    'Distract with work/activities'
  ];

  const loveLanguageOptions = [
    'Quality time together',
    'Physical touch & affection',
    'Words of affirmation',
    'Acts of service',
    'Gifts & thoughtful gestures',
    'Deep conversations',
    'Shared experiences',
    'Being supported in goals',
    'Feeling appreciated & valued'
  ];

  const conflictNeedsOptions = [
    'Space to cool down first',
    'To be heard & understood',
    'To understand their perspective',
    'To find solutions quickly',
    'Reassurance we\'re okay',
    'Time to process feelings',
    'Clear, direct communication',
    'Physical comfort',
    'Know they\'re not leaving'
  ];

  const attachmentOptions = [
    'Secure (comfortable with intimacy & independence)',
    'Anxious (worry about relationship, need reassurance)',
    'Avoidant (value independence, uncomfortable with closeness)',
    'Fearful-avoidant (want closeness but afraid of hurt)',
    'Disorganized (mix of patterns)',
    'Depends on the relationship',
    'Not sure/still figuring it out'
  ];

  return (
    <div className="space-y-1.5">
      {/* Stress Response */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            When you're stressed, what's your go-to? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Brain className="w-3 h-3 text-purple-300" />
            <span>Your automatic stress response</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {stressResponseOptions.map((response) => (
            <button
              key={response}
              onClick={() => handleMultiSelect('stressResponse', response)}
              className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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

      {/* Love Language */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            How do you feel most loved? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>Your main love language</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {loveLanguageOptions.map((language) => (
            <button
              key={language}
              onClick={() => updateField('loveLanguage', language)}
              className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                profileData.loveLanguage === language
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Section Header */}
      <div className="py-2">
        <Label className="text-sm font-semibold text-white/90">
          Want to dive deeper? (Optional)
        </Label>
        <div className="text-xs text-white/60 mt-0.5">
          These help us give you more personalized insights
        </div>
      </div>

      {/* Conflict Needs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            When you're in conflict, what do you actually need?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that apply</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Shield className="w-3 h-3 text-blue-300" />
            <span>What you actually need during fights</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {conflictNeedsOptions.map((need) => (
            <button
              key={need}
              onClick={() => handleMultiSelect('conflictNeeds', need)}
              className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white mb-1 block">
            What's your attachment style?
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Users className="w-3 h-3 text-orange-300" />
            <span>The psychological patterns that run your relationships</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {attachmentOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('attachmentStyle', style)}
              className={`w-full p-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
