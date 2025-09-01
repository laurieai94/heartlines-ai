
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
      className={`group bg-burgundy-900/60 md:bg-gradient-to-br md:from-burgundy-900/80 md:to-burgundy-800/70 backdrop-blur-sm md:backdrop-blur-xl rounded-xl border border-white/15 md:border-white/25 px-4 md:px-5 py-3 space-y-2.5 transition-all duration-300 hover:bg-burgundy-800/70 md:hover:from-burgundy-800/85 md:hover:to-burgundy-700/75 hover:border-white/25 md:hover:border-white/35 hover:shadow-lg hover:shadow-burgundy-500/10 md:hover:-translate-y-0.5 relative overflow-hidden scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 ${className}`}
      data-question-card
      id={questionId}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] md:from-white/[0.08] to-burgundy-600/10 md:to-burgundy-600/20 rounded-2xl pointer-events-none"></div>
      
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
