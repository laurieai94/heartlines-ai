import { Label } from "@/components/ui/label";
import { MessageCircle, Brain } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { talkingDescriptionOptions, talkingChallengesOptions, talkingDurationOptions } from "./constants";
import SingleSelect from "../../shared/SingleSelect";
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
      <QuestionCardSimple questionId="question-talking-duration">
        <Label className="text-sm font-semibold text-white mb-2 block">
          How long have you been in the talking stage?
          <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select one</span>
        </Label>
        
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <MessageCircle className="w-3 h-3 text-blue-300" />
          <span>Timeline helps us understand your situation</span>
        </div>
        <SingleSelect 
          options={talkingDurationOptions} 
          selectedValue={profileData.talkingDuration} 
          onSelect={value => updateField('talkingDuration', value)} 
        />
      </QuestionCardSimple>

      <QuestionCardSimple questionId="question-talking-description">
        <Label className="text-sm font-semibold text-white mb-2 block">
          How would you describe what you have right now? <span className="text-red-400">*</span>
          <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <MessageCircle className="w-3 h-3 text-green-300" />
          <span>Help us understand your unique situation</span>
        </div>
        <MultiSelect options={talkingDescriptionOptions} selectedValues={profileData.talkingDescription || []} onToggle={value => handleMultiSelect('talkingDescription', value)} />
      </QuestionCardSimple>

      <QuestionCardSimple questionId="question-talking-challenges">
        <Label className="text-sm font-semibold text-white mb-2 block">
          What feels most challenging about the talking stage? <span className="text-red-400">*</span>
          <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Brain className="w-3 h-3 text-green-300" />
          <span>The talking stage has its own unique energy</span>
        </div>
        <MultiSelect options={talkingChallengesOptions} selectedValues={profileData.talkingChallenges || []} onToggle={value => handleMultiSelect('talkingChallenges', value)} />
      </QuestionCardSimple>
    </div>;
};
export default TalkingStageQuestions;