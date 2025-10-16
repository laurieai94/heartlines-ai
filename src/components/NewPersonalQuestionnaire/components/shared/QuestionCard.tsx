
import { ReactNode } from "react";


interface QuestionCardProps {
  children: ReactNode;
  className?: string;
  questionId?: string;
}

const QuestionCard = ({ 
  children, 
  className = "", 
  questionId
}: QuestionCardProps) => {
  return (
    <div 
      className={`questionnaire-card-mobile px-2 py-1 space-y-1.5 scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 cv-auto ${className}`}
      data-question-card
      id={questionId}
    >
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default QuestionCard;
