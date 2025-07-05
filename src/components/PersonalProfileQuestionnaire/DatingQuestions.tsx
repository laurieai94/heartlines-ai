
import { Label } from "@/components/ui/label";
import { MessageSquare, Heart } from "lucide-react";

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

  const datingGoalsOptions = [
    'A serious, long-term partnership leading to marriage/commitment',
    'Better understanding of what I want and need in a partner',
    'Confidence and skills in dating and relationships',
    'Healing from past relationships before getting serious again',
    'Learning to be vulnerable and authentic in dating',
    'A partner who truly gets me and accepts me as I am',
    'Someone who shares my values and life vision'
  ];

  return (
    <>
      {/* Dating Challenges */}
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

      {/* Dating Goals */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white mb-2 block">
            What are you hoping to find or create in your dating life? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 mb-4 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>Knowing what you're hoping to create helps RealTalk coach you toward your actual desires</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {datingGoalsOptions.map((goal) => (
            <button
              key={goal}
              onClick={() => handleMultiSelect('datingGoals', goal)}
              className={`w-full p-1.5 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                (profileData.datingGoals || []).includes(goal)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default DatingQuestions;
