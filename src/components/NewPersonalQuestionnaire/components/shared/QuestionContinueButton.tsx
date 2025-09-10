
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionContinueButtonProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

const QuestionContinueButton = ({ isVisible, onClick, className = "" }: QuestionContinueButtonProps) => {
  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent event bubbling and default behavior to avoid collapsing
    e.preventDefault();
    e.stopPropagation();
    
    // Defocus the button and any active element to prevent scroll conflicts
    (e.target as HTMLElement)?.blur();
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement)?.blur();
    }
    
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  };

  return (
    <div className={`flex justify-center mt-3 animate-fade-in ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="questionnaire-continue-elegant"
        tabIndex={0}
        role="button"
        aria-label="Continue to next question"
      >
        <span>Continue</span>
        <ArrowDown className="w-3 h-3" />
      </button>
    </div>
  );
};

export default QuestionContinueButton;
