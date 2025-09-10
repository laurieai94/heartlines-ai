
import { ReactNode, useEffect, useState } from "react";
import QuestionContinueButton from "./QuestionContinueButton";
import { useFlow } from "../../context/FlowContext";

interface QuestionCardProps {
  children: ReactNode;
  className?: string;
  questionId?: string;
  showContinue?: boolean;
  onContinue?: () => void;
  hideContinueButton?: boolean; // Hide continue button for this specific question
}

const QuestionCard = ({ 
  children, 
  className = "", 
  questionId,
  showContinue = false,
  onContinue,
  hideContinueButton = false
}: QuestionCardProps) => {
  const [isInOptionalGroup, setIsInOptionalGroup] = useState(false);
  const { goToNext } = useFlow();

  // Check if this card is inside an OptionalGroup
  useEffect(() => {
    const checkOptionalGroup = () => {
      const cardElement = document.getElementById(questionId || '');
      if (cardElement) {
        const optionalGroup = cardElement.closest('[data-optional-group]');
        setIsInOptionalGroup(!!optionalGroup);
      }
    };

    // Check immediately and after a brief delay to ensure DOM is ready
    checkOptionalGroup();
    const timer = setTimeout(checkOptionalGroup, 100);
    
    return () => clearTimeout(timer);
  }, [questionId]);

  // Hide continue button if inside OptionalGroup or specifically disabled
  const shouldShowContinue = showContinue && !isInOptionalGroup && !hideContinueButton;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else if (questionId) {
      goToNext(questionId);
    }
  };

  return (
    <div 
      className={`questionnaire-card-mobile px-2 py-1.5 space-y-2 scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 cv-auto ${className}`}
      data-question-card
      id={questionId}
    >
      <div className="space-y-2">
        {children}
        <QuestionContinueButton 
          isVisible={shouldShowContinue}
          onClick={handleContinue}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
