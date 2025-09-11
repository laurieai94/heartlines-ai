import { useState, useEffect } from "react";
import { Check, Circle, ArrowRight } from "lucide-react";
import { ProfileData } from "../types";
import { useAutoScroll } from "../hooks/useAutoScroll";

interface QuestionProgressProps {
  profileData: ProfileData;
  currentSection: number;
}

interface ProgressDot {
  id: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isAccessible: boolean;
}

const QuestionProgress = ({ profileData, currentSection }: QuestionProgressProps) => {
  const [progressDots, setProgressDots] = useState<ProgressDot[]>([]);
  const { scrollToElement } = useAutoScroll();

  useEffect(() => {
    // Build progress dots based on visible questions in current section
    const buildProgressDots = (): ProgressDot[] => {
      const dots: ProgressDot[] = [];
      const questionCards = document.querySelectorAll(`[data-question-card]`);
      
      questionCards.forEach((element, index) => {
        const questionId = element.id;
        if (questionId) {
          // Check if in current section (basic heuristic)
          const sectionElement = element.closest('[data-section]');
          const elementSection = sectionElement?.getAttribute('data-section');
          
          if (!elementSection || parseInt(elementSection) === currentSection) {
            // Check if question is in an optional group that's collapsed
            const optionalContent = element.closest('[data-optional-content]');
            const isInOptionalGroup = !!optionalContent;
            const isOptionalOpen = optionalContent?.getAttribute('data-optional-open') === 'true';
            
            // Only include if visible
            if (!isInOptionalGroup || isOptionalOpen) {
              const isCompleted = checkQuestionCompletion(questionId, profileData);
              const rect = element.getBoundingClientRect();
              const isCurrent = isElementInView(element);
              
              dots.push({
                id: questionId,
                isCompleted,
                isCurrent,
                isAccessible: true // Simplified for now
              });
            }
          }
        }
      });

      return dots;
    };

    setProgressDots(buildProgressDots());
  }, [profileData, currentSection]);

  const checkQuestionCompletion = (questionId: string, data: ProfileData): boolean => {
    // Same logic as in QuestionNavigator
    switch (questionId) {
      case 'question-name-pronouns':
        return !!(data.name && data.pronouns);
      case 'question-age-selection':
        return !!data.age;
      case 'question-gender-selection':
        return !!data.gender;
      case 'question-orientation-selection':
        return !!data.orientation;
      case 'question-relationship-status':
        return !!data.relationshipStatus;
      case 'question-love-language':
        return !!(data.loveLanguage && data.loveLanguage.length > 0);
      case 'question-conflict-style':
        return !!data.conflictStyle;
      case 'question-stress-response':
        return !!data.stressResponse;
      case 'question-attachment-style':
        return !!data.attachmentStyle;
      case 'question-family-structure':
        return !!data.familyStructure;
      case 'question-heartbreak-betrayal':
        return !!data.heartbreakBetrayal;
      default:
        return false;
    }
  };

  const isElementInView = (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    
    return elementCenter >= 0 && elementCenter <= windowHeight;
  };

  const handleDotClick = (questionId: string) => {
    scrollToElement(questionId);
  };

  const findNextIncomplete = () => {
    return progressDots.find(dot => !dot.isCompleted && dot.isAccessible);
  };

  const nextIncomplete = findNextIncomplete();

  if (progressDots.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
      {/* Progress Dots */}
      <div className="flex items-center gap-1.5">
        {progressDots.slice(0, 8).map((dot, index) => (
          <button
            key={dot.id}
            onClick={() => handleDotClick(dot.id)}
            className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
              dot.isCompleted
                ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30'
                : dot.isCurrent
                  ? 'bg-white ring-2 ring-white/40 animate-pulse'
                  : dot.isAccessible
                    ? 'bg-white/40 hover:bg-white/60'
                    : 'bg-white/20 cursor-not-allowed'
            }`}
            disabled={!dot.isAccessible}
            title={`Question ${index + 1}`}
          />
        ))}
        
        {progressDots.length > 8 && (
          <span className="text-white/60 text-xs">+{progressDots.length - 8}</span>
        )}
      </div>

      {/* Quick Next Button */}
      {nextIncomplete && (
        <button
          onClick={() => handleDotClick(nextIncomplete.id)}
          className="ml-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-rose-500/80 to-pink-500/80 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-medium rounded-full transition-all duration-200 transform hover:scale-105"
        >
          <ArrowRight className="w-3 h-3" />
          <span className="hidden sm:inline">Next</span>
        </button>
      )}
    </div>
  );
};

export default QuestionProgress;