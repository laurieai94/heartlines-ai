
import { Label } from "@/components/ui/label";
import { Heart, MessageSquare } from "lucide-react";

interface RelationshipQuestionsProps {
  profileData: any;
  handleMultiSelect: (field: string, value: string) => void;
}

const RelationshipQuestions = ({ profileData, handleMultiSelect }: RelationshipQuestionsProps) => {
  const workingWellOptions = [
    'Great communication', 'Strong physical connection', 'Shared values/goals',
    'Fun and laughter together', 'Good conflict resolution', 'Emotional support',
    'Trust and honesty', 'Respect for differences'
  ];

  const feelsDifficultOptions = [
    'Communication breakdowns', 'Different conflict styles', 'Intimacy challenges',
    'Time management/priorities', 'Family/friend dynamics', 'Financial stress',
    'Trust issues', 'Future planning disagreements'
  ];

  return (
    <>
      {/* What's Working Well */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What's working well in your relationship? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>We'll build on what's already good instead of fixing everything</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {workingWellOptions.map((item) => (
            <button
              key={item}
              onClick={() => handleMultiSelect('workingWell', item)}
              className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                (profileData.workingWell || []).includes(item)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* What Feels Difficult */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What feels difficult or challenging? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>Let's tackle the stuff that's actually driving you crazy</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {feelsDifficultOptions.map((challenge) => (
            <button
              key={challenge}
              onClick={() => handleMultiSelect('feelsDifficult', challenge)}
              className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                (profileData.feelsDifficult || []).includes(challenge)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default RelationshipQuestions;
