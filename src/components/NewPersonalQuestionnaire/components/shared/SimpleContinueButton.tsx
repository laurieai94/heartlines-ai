import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface SimpleContinueButtonProps {
  onClick: () => void;
  text?: string;
  className?: string;
}

const SimpleContinueButton = ({ onClick, text = "Continue", className = "" }: SimpleContinueButtonProps) => {
  return (
    <div className={`flex justify-center mt-6 animate-fade-in ${className}`}>
      <Button
        onClick={onClick}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] shadow-lg"
      >
        <span className="text-sm font-medium">{text}</span>
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SimpleContinueButton;