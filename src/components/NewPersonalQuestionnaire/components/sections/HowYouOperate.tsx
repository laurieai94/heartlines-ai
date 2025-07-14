import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Zap, Heart, Shield } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import MultiSelect from "../shared/MultiSelect";
import SectionContinueButton from "../shared/SectionContinueButton";
import { validateSection } from "../../utils/validation";

interface HowYouOperateProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onAutoScroll?: (questionId: string) => void;
  onSectionComplete?: () => void;
}

const HowYouOperate = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  onAutoScroll,
  onSectionComplete
}: HowYouOperateProps) => {
  const stressResponseOptions = ['Get quiet and need my space', 'Want to talk it out right now', 'Get emotional and need comfort', 'Try to fix everything for everyone', 'Shut down completely', 'Become irritable and snappy AF', 'Overthink literally everything', 'Text my friends for support', 'Distract myself with work or scrolling'];
  const loveLanguageOptions = ['Uninterrupted quality time (no phones)', 'Physical touch and cuddles', 'Being hyped up with words', 'Someone doing things to make my life easier', 'Thoughtful gifts that show they get me', 'Deep 3am conversations about everything', 'Adventures and making memories together', 'Having them support my dreams and goals', 'Feeling genuinely appreciated for who I am'];
  const conflictStyleOptions = ['Want to hash it out immediately', 'Need space to calm down first or I\'ll say something dumb', 'Try to see where they\'re coming from', 'Just want to fix it and move on', 'Get emotional and need them to reassure me we\'re okay', 'Go full logic mode and analyze everything', 'Avoid conflict like it\'s my toxic ex', 'Stand my ground because I know I\'m right', 'Shut down and give them the silent treatment'];

  // Section completion check
  const isSectionComplete = validateSection(3, profileData);
  return <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">How You Operate</h3>
      </div>

      {/* Stress Response */}
      <QuestionCard questionId="question-stress-response" showContinue={!!profileData.stressResponse?.length} onContinue={() => {
      onAutoScroll?.('question-love-language');
    }}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          When you're stressed, what's your go-to? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Zap className="w-3 h-3 text-orange-300" />
          <span>Stress patterns affect how you show up in relationships</span>
        </div>
        <MultiSelect options={stressResponseOptions} selectedValues={profileData.stressResponse || []} onToggle={value => handleMultiSelect('stressResponse', value)} />
      </QuestionCard>

      {/* Love Language */}
      <QuestionCard questionId="question-love-language" showContinue={!!profileData.loveLanguage?.length} onContinue={() => {
      onAutoScroll?.('question-conflict-style');
    }}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          How do you feel most loved? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span> Knowing this helps you actually ask for what you need</span>
        </div>
        <MultiSelect options={loveLanguageOptions} selectedValues={profileData.loveLanguage || []} onToggle={value => handleMultiSelect('loveLanguage', value)} />
      </QuestionCard>

      {/* Conflict Style - Now Required */}
      <QuestionCard questionId="question-conflict-style" showContinue={!!profileData.conflictStyle?.length} onContinue={() => {
        // This is the last question in the section, so no auto-scroll needed
      }}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          How do you typically handle conflict? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Shield className="w-3 h-3 text-blue-300" />
          <span>Your conflict style is everything in relationships</span>
        </div>
        <MultiSelect options={conflictStyleOptions} selectedValues={profileData.conflictStyle || []} onToggle={value => handleMultiSelect('conflictStyle', value)} />
      </QuestionCard>

      {/* Section Continue Button */}
      <SectionContinueButton isVisible={isSectionComplete} currentSection={3} onClick={() => {
      // Scroll to first question of next section
      setTimeout(() => {
        const nextSectionFirstQuestion = document.querySelector('[data-section="4"] [data-question-card]');
        if (nextSectionFirstQuestion) {
          nextSectionFirstQuestion.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
      onSectionComplete?.();
    }} />
    </div>;
};

export default HowYouOperate;
