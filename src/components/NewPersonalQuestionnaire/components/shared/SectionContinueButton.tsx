import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TreeDeciduous, Heart, Zap } from "lucide-react";

interface SectionContinueButtonProps {
  isVisible: boolean;
  currentSection: number;
  onClick: () => void;
  className?: string;
}

const SectionContinueButton = ({ 
  isVisible, 
  currentSection, 
  onClick, 
  className = "" 
}: SectionContinueButtonProps) => {
  if (!isVisible) return null;

  const getSectionInfo = () => {
    switch (currentSection) {
      case 1:
        return {
          text: "Continue to Your Foundation",
          icon: TreeDeciduous,
          gradient: "from-rose-500 to-pink-600"
        };
      case 2:
        return {
          text: "Continue to Your Relationship",
          icon: Heart,
          gradient: "from-pink-500 to-purple-600"
        };
      case 3:
        return {
          text: "Continue to How You Operate",
          icon: Zap,
          gradient: "from-purple-500 to-indigo-600"
        };
      default:
        return {
          text: "Continue",
          icon: ArrowRight,
          gradient: "from-indigo-500 to-blue-600"
        };
    }
  };

  const { text, icon: Icon, gradient } = getSectionInfo();

  return (
    <div className={`flex justify-center mt-6 animate-fade-in ${className}`}>
      <Button
        onClick={onClick}
        className={`bg-gradient-to-r ${gradient} hover:scale-105 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl font-semibold`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">{text}</span>
        <Icon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SectionContinueButton;