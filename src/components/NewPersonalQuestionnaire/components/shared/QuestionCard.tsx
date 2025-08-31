
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
      className={`group bg-gradient-to-br from-burgundy-900/80 to-burgundy-800/70 backdrop-blur-xl rounded-xl border border-white/25 px-5 py-3 space-y-2.5 transition-all duration-300 hover:from-burgundy-800/85 hover:to-burgundy-700/75 hover:border-white/35 hover:shadow-lg hover:shadow-burgundy-500/10 hover:-translate-y-0.5 relative overflow-hidden ${className}`}
      data-question-card
      id={questionId}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-burgundy-600/20 rounded-2xl pointer-events-none"></div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full pointer-events-none"></div>
      
      <div className="relative z-10 space-y-2.5">
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
