
import { ReactNode } from "react";

interface QuestionCardProps {
  children: ReactNode;
  className?: string;
}

const QuestionCard = ({ children, className = "" }: QuestionCardProps) => {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3 ${className}`}>
      {children}
    </div>
  );
};

export default QuestionCard;
