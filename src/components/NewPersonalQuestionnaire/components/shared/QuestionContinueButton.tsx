import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionContinueButtonProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

const QuestionContinueButton = ({ isVisible, onClick, className = "" }: QuestionContinueButtonProps) => {
  if (!isVisible) return null;

  return (
    <div className={`flex justify-center mt-4 animate-fade-in ${className}`}>
      <Button
        onClick={onClick}
        className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] shadow-sm"
      >
        <span className="text-sm font-medium">Continue</span>
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuestionContinueButton;