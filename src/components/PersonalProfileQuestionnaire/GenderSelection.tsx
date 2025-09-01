
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, ChevronDown } from "lucide-react";

interface GenderSelectionProps {
  selectedGenders: string[];
  selfDescribe: string;
  onGenderSelect: (gender: string) => void;
  onSelfDescribeChange: (value: string) => void;
}

const GenderSelection = ({ selectedGenders, selfDescribe, onGenderSelect, onSelfDescribeChange }: GenderSelectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Prefer to self-describe'
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="w-full">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-2.5 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">
              Want to share your gender identity? (Optional)
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5 mt-1">
          <div>
            <Label className="text-sm font-semibold text-white">
              What's your gender identity?
              <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
              <Heart className="w-3 h-3 text-purple-300" />
              <span>We get that gender is complex and personal</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {genderOptions.map((gender) => (
              <button
                key={gender}
                onClick={() => onGenderSelect(gender)}
                className={`inline-flex items-center justify-start text-left break-words whitespace-normal max-w-full p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.01] ${
                  selectedGenders.includes(gender)
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
          
          {selectedGenders.includes('Prefer to self-describe') && (
            <div className="mt-1.5">
              <Label className="text-xs font-medium text-white mb-1 block">
                Please describe your gender identity:
              </Label>
              <Textarea
                value={selfDescribe}
                onChange={(e) => onSelfDescribeChange(e.target.value)}
                placeholder="How do you identify?"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 min-h-[50px] resize-none"
                rows={2}
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default GenderSelection;
