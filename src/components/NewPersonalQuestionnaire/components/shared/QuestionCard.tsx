
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
      className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3 ${className}`}
      data-question-card
      id={questionId}
    >
      {children}
      <QuestionContinueButton 
        isVisible={showContinue}
        onClick={onContinue || (() => {})}
      />
    </div>
  );
};

export default QuestionCard;
