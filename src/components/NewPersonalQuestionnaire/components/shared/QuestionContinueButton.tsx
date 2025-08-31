import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
interface QuestionContinueButtonProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}
const QuestionContinueButton = ({
  isVisible,
  onClick,
  className = ""
}: QuestionContinueButtonProps) => {
  if (!isVisible) return null;
  const handleClick = () => {
    console.log('🟠 Continue button clicked, onClick function exists:', !!onClick);
    console.log('🟠 Continue button - isVisible:', isVisible);
    console.log('🟠 Continue button - className:', className);
    if (onClick) {
      console.log('🟠 Continue button - calling onClick function');
      onClick();
    } else {
      console.warn('🔴 Continue button clicked but no onClick function provided');
    }
  };
  return <div className={`flex justify-center mt-4 animate-fade-in ${className}`}>
      
    </div>;
};
export default QuestionContinueButton;