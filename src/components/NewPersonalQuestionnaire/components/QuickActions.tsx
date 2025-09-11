import { useState } from "react";
import { FastForward, SkipForward, Eye, ChevronUp, ChevronDown, Zap } from "lucide-react";
import { ProfileData } from "../types";
import { useAutoScroll } from "../hooks/useAutoScroll";

interface QuickActionsProps {
  profileData: ProfileData;
  currentSection: number;
}

const QuickActions = ({ profileData, currentSection }: QuickActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollToElement } = useAutoScroll();

  const jumpToNextIncomplete = () => {
    // Find first incomplete question in current section
    const questionCards = document.querySelectorAll('[data-question-card]');
    for (const card of questionCards) {
      const questionId = card.id;
      if (questionId && !isQuestionCompleted(questionId)) {
        // Check if it's in current section or visible
        const optionalContent = card.closest('[data-optional-content]');
        const isInOptionalGroup = !!optionalContent;
        const isOptionalOpen = optionalContent?.getAttribute('data-optional-open') === 'true';
        
        if (!isInOptionalGroup || isOptionalOpen) {
          scrollToElement(questionId);
          return;
        }
      }
    }
  };

  const jumpToOptionalQuestions = () => {
    // Find first optional group and open it
    const optionalGroups = document.querySelectorAll('[data-optional-group]');
    const firstGroup = optionalGroups[0] as HTMLElement;
    
    if (firstGroup) {
      const trigger = firstGroup.querySelector('[data-optional-trigger]') as HTMLElement;
      const content = firstGroup.querySelector('[data-optional-content]') as HTMLElement;
      const isOpen = content?.getAttribute('data-optional-open') === 'true';
      
      if (!isOpen && trigger) {
        trigger.click();
      }
      
      // Find first question in optional content
      setTimeout(() => {
        const firstOptionalQuestion = firstGroup.querySelector('[data-question-card]') as HTMLElement;
        if (firstOptionalQuestion?.id) {
          scrollToElement(firstOptionalQuestion.id);
        }
      }, 300);
    }
  };

  const jumpToSectionEnd = () => {
    // Find last question in current section
    const questionCards = Array.from(document.querySelectorAll('[data-question-card]'));
    const lastCard = questionCards[questionCards.length - 1] as HTMLElement;
    
    if (lastCard?.id) {
      scrollToElement(lastCard.id);
    }
  };

  const openAllOptionalGroups = () => {
    // Open all collapsed optional groups in current section
    const optionalGroups = document.querySelectorAll('[data-optional-group]');
    
    optionalGroups.forEach((group) => {
      const trigger = group.querySelector('[data-optional-trigger]') as HTMLElement;
      const content = group.querySelector('[data-optional-content]') as HTMLElement;
      const isOpen = content?.getAttribute('data-optional-open') === 'true';
      
      if (!isOpen && trigger) {
        trigger.click();
      }
    });
  };

  const isQuestionCompleted = (questionId: string): boolean => {
    // Same completion logic as other components
    switch (questionId) {
      case 'question-name-pronouns':
        return !!(profileData.name && profileData.pronouns);
      case 'question-age-selection':
        return !!profileData.age;
      case 'question-gender-selection':
        return !!profileData.gender;
      case 'question-orientation-selection':
        return !!profileData.orientation;
      case 'question-relationship-status':
        return !!profileData.relationshipStatus;
      case 'question-love-language':
        return !!(profileData.loveLanguage && profileData.loveLanguage.length > 0);
      case 'question-conflict-style':
        return !!profileData.conflictStyle;
      case 'question-stress-response':
        return !!profileData.stressResponse;
      case 'question-attachment-style':
        return !!profileData.attachmentStyle;
      case 'question-family-structure':
        return !!profileData.familyStructure;
      case 'question-heartbreak-betrayal':
        return !!profileData.heartbreakBetrayal;
      default:
        return false;
    }
  };

  const hasOptionalQuestions = document.querySelectorAll('[data-optional-group]').length > 0;
  const hasCollapsedOptional = Array.from(document.querySelectorAll('[data-optional-content]'))
    .some(content => content.getAttribute('data-optional-open') !== 'true');

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 hover:from-purple-500 hover:to-indigo-500 backdrop-blur-sm text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        <Zap className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Quick</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-burgundy-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
            
            <div className="space-y-2">
              <button
                onClick={jumpToNextIncomplete}
                className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-all duration-200"
              >
                <FastForward className="w-4 h-4" />
                <span>Next Incomplete Question</span>
              </button>

              {hasOptionalQuestions && (
                <button
                  onClick={jumpToOptionalQuestions}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-all duration-200"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Jump to Optional Questions</span>
                </button>
              )}

              <button
                onClick={jumpToSectionEnd}
                className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>Jump to Section End</span>
              </button>

              {hasCollapsedOptional && (
                <button
                  onClick={openAllOptionalGroups}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 text-sm rounded-lg transition-all duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Show All Optional</span>
                </button>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-white/60 text-xs">
                Use these shortcuts to navigate quickly through the questionnaire.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;