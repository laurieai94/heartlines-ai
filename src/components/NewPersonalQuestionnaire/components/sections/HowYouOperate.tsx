
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

const HowYouOperate = ({ profileData, updateField, handleMultiSelect, isActive, onAutoScroll, onSectionComplete }: HowYouOperateProps) => {
  const stressResponseOptions = [
    'Get quiet & need space',
    'Want to talk it out immediately', 
    'Get emotional & need comfort',
    'Try to fix everything',
    'Shut down completely',
    'Become irritable/snappy',
    'Overthink everything',
    'Seek support from friends',
    'Distract with work/activities'
  ];

  const loveLanguageOptions = [
    'Quality time together',
    'Physical touch & affection',
    'Words of affirmation',
    'Acts of service',
    'Gifts & thoughtful gestures',
    'Deep conversations',
    'Shared experiences',
    'Being supported in goals',
    'Feeling appreciated & valued'
  ];

  const conflictStyleOptions = [
    'Want to talk it through right away',
    'Need space to cool down first',
    'Try to understand their perspective',
    'Focus on finding solutions quickly',
    'Get emotional and need reassurance',
    'Become analytical and logical',
    'Avoid conflict if possible',
    'Stand my ground and argue my point',
    'Shut down and withdraw'
  ];

  // Section completion check
  const isSectionComplete = validateSection(3, profileData);

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">How You Operate</h3>
      </div>

      {/* Stress Response */}
      <QuestionCard questionId="question-stress-response">
        <Label className="text-sm font-semibold text-white mb-2 block">
          When you're stressed, what's your go-to? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Zap className="w-3 h-3 text-orange-300" />
          <span>Stress patterns affect how you show up in relationships</span>
        </div>
        <MultiSelect
          options={stressResponseOptions}
          selectedValues={profileData.stressResponse || []}
          onToggle={(value) => handleMultiSelect('stressResponse', value)}
        />
      </QuestionCard>

      {/* Love Language */}
      <QuestionCard questionId="question-love-language">
        <Label className="text-sm font-semibold text-white mb-2 block">
          How do you feel most loved? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>Understanding your needs helps you communicate them</span>
        </div>
        <MultiSelect
          options={loveLanguageOptions}
          selectedValues={profileData.loveLanguage || []}
          onToggle={(value) => handleMultiSelect('loveLanguage', value)}
        />
      </QuestionCard>

      {/* Conflict Style - Optional */}
      <QuestionCard className="opacity-80" questionId="question-conflict-style">
        <Label className="text-sm font-semibold text-white mb-2 block">
          How do you typically handle conflict?
          <span className="text-orange-300 font-medium text-xs ml-2">(Optional - Select all that resonate)</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Shield className="w-3 h-3 text-blue-300" />
          <span>Knowing your conflict style helps navigate disagreements</span>
        </div>
        <MultiSelect
          options={conflictStyleOptions}
          selectedValues={profileData.conflictStyle || []}
          onToggle={(value) => handleMultiSelect('conflictStyle', value)}
        />
      </QuestionCard>

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={3}
        onClick={() => {
          // Scroll to first question of next section
          setTimeout(() => {
            const nextSectionFirstQuestion = document.querySelector('[data-section="4"] [data-question-card]');
            if (nextSectionFirstQuestion) {
              nextSectionFirstQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          onSectionComplete?.();
        }}
      />
    </div>
  );
};

export default HowYouOperate;
