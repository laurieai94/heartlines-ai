
import { Label } from "@/components/ui/label";
import { Clock, MessageSquare, AlertTriangle } from "lucide-react";
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
  const { scrollToNextQuestion } = useAutoScroll();

  return (
    <>
      {/* Talking Duration */}
      <QuestionCard 
        questionId="question-talking-duration"
        showContinue={!!profileData.talkingDuration}
        onContinue={() => scrollToNextQuestion('question-talking-duration')}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          How long have you been talking? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Clock className="w-3 h-3 text-green-300" />
          <span>Early stages have their own unique dynamics and challenges</span>
        </div>
        <SingleSelect
          options={talkingDurationOptions}
          selectedValue={profileData.talkingDuration || ''}
          onSelect={(value) => updateField('talkingDuration', value)}
        />
      </QuestionCard>

      {/* Talking Description */}
      {profileData.talkingDuration && (
        <QuestionCard 
          questionId="question-talking-description"
          showContinue={!!(profileData.talkingDescription?.length)}
          onContinue={() => scrollToNextQuestion('question-talking-description')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            How would you describe what you have right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>The talking stage has its own unique energy</span>
          </div>
          <MultiSelect
            options={talkingDescriptionOptions}
            selectedValues={profileData.talkingDescription || []}
            onToggle={(value) => handleMultiSelect('talkingDescription', value)}
            columns={1}
          />
        </QuestionCard>
      )}

      {/* Talking Challenges */}
      {(profileData.talkingDescription?.length) && (
        <QuestionCard 
          questionId="question-talking-challenges"
          showContinue={!!(profileData.talkingChallenges?.length)}
          onContinue={() => scrollToNextQuestion('question-talking-challenges')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging about the talking stage? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate - we get that this stage is weird</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <AlertTriangle className="w-3 h-3 text-yellow-300" />
            <span>Navigating uncertainty is tough - we're here to help</span>
          </div>
          <MultiSelect
            options={talkingChallengesOptions}
            selectedValues={profileData.talkingChallenges || []}
            onToggle={(value) => handleMultiSelect('talkingChallenges', value)}
            columns={1}
          />
        </QuestionCard>
      )}
    </>
  );
};

export default TalkingStageQuestions;
