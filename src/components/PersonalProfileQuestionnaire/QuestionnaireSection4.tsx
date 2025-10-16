
import { useState } from "react";
import { Heart, MessageCircle, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: QuestionnaireSection4Props) => {
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

  if (!isReady) return null;


  const familySituationOptions = [
    'Parents married - healthy relationship',
    'Parents married - typical ups and downs',
    'Parents married - constant fighting',
    'Parents divorced when I was young',
    'Parents divorced when I was older',
    'Single parent household',
    'Raised by grandparents/other family',
    'Foster care/adopted',
    'Other/complex situation'
  ];

  const familyConflictOptions = [
    'Actually talked through problems',
    'Someone always gave in to avoid drama',
    'Conflict was avoided at all costs',
    'Screaming matches were normal',
    'Silent treatment & passive-aggressive',
    'I was constantly the peacekeeper',
    'Arguments felt scary & unpredictable',
    'One parent always won',
    'Fight then pretend nothing happened'
  ];

  const familyLoveOptions = [
    'Lots of "I love yous" & physical affection',
    'Love through doing things/helping out',
    'Love through quality time together',
    'Love through gifts & buying things',
    'Love felt conditional - had to earn it',
    'Love was assumed but rarely shown',
    'Love felt overwhelming or suffocating',
    'Love through achievements & making proud',
    'Love was inconsistent (hot and cold)'
  ];

  return (
    <div className="space-y-2.5">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="text-base font-semibold text-white">Your Foundation</h3>
        </div>
        
      </div>

      {/* Optional Family Context */}
      <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-white">
                Want to share more about your family background?
                <span className="text-orange-300 font-medium text-xs ml-2">(Optional)</span>
              </Label>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOptionalOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            {/* Family Situation */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
              <Label className="text-sm font-semibold text-white">
                Family structure growing up:
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {familySituationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateField('familySituation', option)}
                    className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                      profileData.familySituation === option
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Family Conflict */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
              <Label className="text-sm font-semibold text-white">
                How did your family handle conflict?
                <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {familyConflictOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleMultiSelect('familyConflict', option)}
                    className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                      (profileData.familyConflict || []).includes(option)
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Family Love */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
              <Label className="text-sm font-semibold text-white">
                How was love typically shown?
                <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {familyLoveOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleMultiSelect('familyLove', option)}
                    className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                      (profileData.familyLove || []).includes(option)
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {option}
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

export default QuestionnaireSection4;
