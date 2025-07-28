
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
      className={`group bg-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/12 px-7 py-5 space-y-4 transition-all duration-300 hover:bg-white/[0.12] hover:border-white/20 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-0.5 relative overflow-hidden ${className}`}
      data-question-card
      id={questionId}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl pointer-events-none"></div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full pointer-events-none"></div>
      
      <div className="relative z-10 space-y-4">
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
