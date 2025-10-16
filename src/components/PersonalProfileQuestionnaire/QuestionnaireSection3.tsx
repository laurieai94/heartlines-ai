
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Users, ChevronDown, Zap, Heart, MessageCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QuestionnaireSection3Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection3 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection3Props) => {
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

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
    <div className="space-y-2.5">
      {/* Stress Response */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
        <div>
          <Label className="text-sm font-semibold text-white mb-2 block">
            When you're stressed, what's your go-to? 
            <span className="text-red-400 ml-1">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Zap className="w-3 h-3 text-orange-300" />
            <span>Stress patterns affect how you show up in relationships</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {stressResponseOptions.map((response) => (
            <button
              key={response}
              onClick={() => handleMultiSelect('stressResponse', response)}
              className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
        <div>
          <Label className="text-sm font-semibold text-white mb-2 block">
            How do you feel most loved? 
            <span className="text-red-400 ml-1">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>Understanding your needs helps you communicate them</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {loveLanguageOptions.map((language) => (
            <button
              key={language}
              onClick={() => handleMultiSelect('loveLanguage', language)}
              className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.loveLanguage || []).includes(language)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Section */}
      <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-white">
                Want to dive deeper?
                <span className="text-orange-300 font-medium text-xs ml-2">(Optional)</span>
              </Label>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOptionalOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            {/* Conflict Needs */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
              <div>
                <Label className="text-sm font-semibold text-white mb-2 block">
                  When you're in conflict, what do you actually need?
                  <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
                </Label>
                <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
                  <MessageCircle className="w-3 h-3 text-blue-300" />
                  <span>Knowing what you need during fights changes everything</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {conflictNeedsOptions.map((need) => (
                  <button
                    key={need}
                    onClick={() => handleMultiSelect('conflictStyle', need)}
                    className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                      (profileData.conflictStyle || profileData.conflictNeeds || []).includes(need)
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
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
              <div>
                <Label className="text-sm font-semibold text-white mb-2 block">
                  What's your attachment style?
                </Label>
                <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
                  <Users className="w-3 h-3 text-orange-300" />
                  <span>The psychological patterns that run your relationships</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {attachmentOptions.map((style) => (
                  <button
                    key={style}
                    onClick={() => updateField('attachmentStyle', style)}
                    className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
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
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

export default QuestionnaireSection3;
