
import { useState } from "react";
import { TreeDeciduous, ChevronDown, Users, MessageSquare, Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection4Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isReady) return null;

  const emotionalVibeOptions = [
    "Open & healthy emotional expression",
    "Happy feelings okay, sad/angry ones shut down",
    "We weren't an emotions family",
    "Emotions were unpredictable/overwhelming",
    "I became the family therapist",
    "Big emotions were dramatic & scary",
    "Emotions were used to manipulate",
    "Everything looked fine but wasn't",
    "Love expressed but other feelings weren't"
  ];

  const familyStructureOptions = [
    "Parents married - healthy relationship",
    "Parents married - typical ups and downs",
    "Parents married - constant fighting",
    "Parents divorced when I was young",
    "Parents divorced when I was older",
    "Single parent household",
    "Raised by grandparents/other family",
    "Foster care/adopted",
    "Other/complex situation"
  ];

  const conflictHandlingOptions = [
    "Actually talked through problems",
    "Someone always gave in to avoid drama",
    "Conflict was avoided at all costs",
    "Screaming matches were normal",
    "Silent treatment & passive-aggressive",
    "I was constantly the peacekeeper",
    "Arguments felt scary & unpredictable",
    "One parent always won",
    "Fight then pretend nothing happened"
  ];

  const loveExpressionOptions = [
    "Lots of \"I love yous\" & physical affection",
    "Love through doing things/helping out",
    "Love through quality time together",
    "Love through gifts & buying things",
    "Love felt conditional - had to earn it",
    "Love was assumed but rarely shown",
    "Love felt overwhelming or suffocating",
    "Love through achievements & making proud",
    "Love was inconsistent (hot and cold)"
  ];

  return (
    <div className="space-y-1.5">
      {/* Main Emotional Vibe Question - CONVERTED TO MULTI-SELECT */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            How did emotions work in your family?
            <span className="text-red-300 ml-1">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {emotionalVibeOptions.map((option) => {
            const isSelected = (profileData.familyEmotionalVibe || []).includes(option);
            return (
              <button
                key={option}
                onClick={() => handleMultiSelect('familyEmotionalVibe', option)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Family Context - Collapsible */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-white">
                  Want to share more family context?
                  <span className="text-orange-300 font-medium text-xs ml-2">(Optional)</span>
                </Label>
                <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
                  <MessageSquare className="w-3 h-3 text-blue-300" />
                  <span>Helps us understand your relationship patterns</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1.5">
            {/* Family Structure - CONVERTED TO MULTI-SELECT */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-white/90">
                Family structure growing up:
                <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {familyStructureOptions.map((option) => {
                  const isSelected = (profileData.familyStructure || []).includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('familyStructure', option)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                        isSelected
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conflict Handling - CONVERTED TO MULTI-SELECT */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-white/90">
                How did your family handle conflict?
                <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {conflictHandlingOptions.map((option) => {
                  const isSelected = (profileData.familyConflictHandling || []).includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('familyConflictHandling', option)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                        isSelected
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Love Expression - CONVERTED TO MULTI-SELECT */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-white/90">
                How was love typically shown?
                <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {loveExpressionOptions.map((option) => {
                  const isSelected = (profileData.familyLoveExpression || []).includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('familyLoveExpression', option)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                        isSelected
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

export default QuestionnaireSection4;
