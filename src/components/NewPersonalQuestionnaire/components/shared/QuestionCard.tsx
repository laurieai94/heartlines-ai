
import { ReactNode } from "react";
import QuestionContinueButton from "./QuestionContinueButton";

interface QuestionCardProps {
  children: ReactNode;
  className?: string;
  questionId?: string;
  showContinue?: boolean;
  onContinue?: () => void;
}

const QuestionCard = ({ 
  children, 
  className = "", 
  questionId,
  showContinue = false,
  onContinue
}: QuestionCardProps) => {
  return (
    <div 
      className={`questionnaire-card-mobile px-3 py-3 sm:px-4 sm:py-3 space-y-2.5 sm:space-y-3 scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 ${className}`}
      data-question-card
      id={questionId}
    >
      <div className="space-y-2.5 sm:space-y-3">
        {children}
        <QuestionContinueButton 
          isVisible={showContinue}
          onClick={onContinue || (() => {})}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
