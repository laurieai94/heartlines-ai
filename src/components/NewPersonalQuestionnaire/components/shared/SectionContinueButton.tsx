import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

interface SectionContinueButtonProps {
  onClick: () => void;
  text: string;
  className?: string;
}

const SectionContinueButton = ({ onClick, text, className = "" }: SectionContinueButtonProps) => {
  return (
    <div className={`flex justify-center mt-8 animate-fade-in ${className}`}>
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl font-semibold text-base hover:scale-105"
      >
        <Sparkles className="w-5 h-5" />
        <span>{text}</span>
        <ArrowDown className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SectionContinueButton;