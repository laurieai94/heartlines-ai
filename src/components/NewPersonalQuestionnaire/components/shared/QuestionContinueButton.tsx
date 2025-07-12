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
        className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <span className="text-sm font-medium">Continue</span>
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuestionContinueButton;