import { Label } from "@/components/ui/label";
import { Clock, MessageCircle, Brain } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { talkingDurationOptions, talkingDescriptionOptions, talkingChallengesOptions } from "./constants";
interface TalkingStageQuestionsProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}
const TalkingStageQuestions = ({
  profileData,
  updateField,
  handleMultiSelect
}: TalkingStageQuestionsProps) => {
  const {
    scrollToNextQuestion
  } = useAutoScroll();
  return <div className="space-y-4">
      <QuestionCard questionId="question-talking-duration" showContinue={!!profileData.talkingDuration} onContinue={() => scrollToNextQuestion('question-talking-duration')}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          How long have you been talking? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Clock className="w-3 h-3 text-green-300" />
          <span>Early stages have their own unique dynamics and challenges</span>
        </div>
        <SingleSelect options={talkingDurationOptions} selectedValue={profileData.talkingDuration || ''} onSelect={value => updateField('talkingDuration', value)} />
      </QuestionCard>

      <QuestionCard questionId="question-talking-description" showContinue={profileData.talkingDescription && profileData.talkingDescription.length > 0} onContinue={() => scrollToNextQuestion('question-talking-description')}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          How would you describe what you have right now? <span className="text-red-400">*</span> Select all that resonate
        </Label>
        
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <MessageCircle className="w-3 h-3 text-green-300" />
          <span>The talking stage has its own unique energy</span>
        </div>
        <MultiSelect options={talkingDescriptionOptions} selectedValues={profileData.talkingDescription || []} onToggle={value => handleMultiSelect('talkingDescription', value)} columns={2} />
      </QuestionCard>

      <QuestionCard questionId="question-talking-challenges" showContinue={profileData.talkingChallenges && profileData.talkingChallenges.length > 0} onContinue={() => scrollToNextQuestion('question-talking-challenges')}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          What feels most challenging about the talking stage? <span className="text-red-400">*</span> Select all that resonate
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Brain className="w-3 h-3 text-green-300" />
          <span>We get that this stage is weird - navigating uncertainty is tough - we're here to help</span>
        </div>
        <MultiSelect options={talkingChallengesOptions} selectedValues={profileData.talkingChallenges || []} onToggle={value => handleMultiSelect('talkingChallenges', value)} columns={2} />
      </QuestionCard>
    </div>;
};
export default TalkingStageQuestions;