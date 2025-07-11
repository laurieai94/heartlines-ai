
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface DatingQuestionsProps {
  profileData: any;
  handleMultiSelect: (field: string, value: string) => void;
}

const DatingQuestions = ({ profileData, handleMultiSelect }: DatingQuestionsProps) => {
  const datingChallengesOptions = [
    'Finding people who want the same thing I do',
    'Getting past the first few dates into something deeper',
    'Setting boundaries and not settling for less than I deserve',
    'Dating anxiety and putting myself out there',
    'Getting over past relationship patterns that keep showing up',
    'Being authentic while still trying to make a good impression',
    'Online dating fatigue and app overwhelm'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 mb-4 font-normal">
          <MessageSquare className="w-3 h-3 text-blue-300" />
          <span>Understanding your specific dating struggles helps RealTalk provide targeted guidance</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {datingChallengesOptions.map((challenge) => (
          <button
            key={challenge}
            onClick={() => handleMultiSelect('datingChallenges', challenge)}
            className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
              (profileData.datingChallenges || []).includes(challenge)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {challenge}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatingQuestions;
