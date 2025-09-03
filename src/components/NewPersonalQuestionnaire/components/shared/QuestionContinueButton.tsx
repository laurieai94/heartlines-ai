
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionContinueButtonProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

const QuestionContinueButton = ({ isVisible, onClick, className = "" }: QuestionContinueButtonProps) => {
  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    console.log('🔵 DEBUG: Continue button clicked, onClick function exists:', !!onClick);
    console.log('🔵 DEBUG: Continue button - isVisible:', isVisible);
    console.log('🔵 DEBUG: Continue button - className:', className);
    
    // Defocus the button and any active element to prevent scroll conflicts
    console.log('🟠 Continue button - defocusing elements before scroll');
    (e.target as HTMLElement)?.blur();
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement)?.blur();
    }
    
    if (onClick) {
      console.log('🟠 Continue button - calling onClick function');
      onClick();
    } else {
      console.warn('🔴 Continue button clicked but no onClick function provided');
    }
  };

  return (
    <div className={`flex justify-center mt-3 animate-fade-in ${className}`}>
      <button
        onClick={handleClick}
        className="questionnaire-continue-elegant"
      >
        <span>Continue</span>
        <ArrowDown className="w-3 h-3" />
      </button>
    </div>
  );
};

export default QuestionContinueButton;
