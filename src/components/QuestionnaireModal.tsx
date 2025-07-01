import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalProfileQuestionnaire from "./PersonalProfileQuestionnaire";

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestionnaireModal = ({ isOpen, onClose }: QuestionnaireModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[20px]"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-[65%] h-[85%] max-w-[850px] max-h-[700px] bg-white/5 backdrop-blur-lg rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden animate-scale-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
        
        {/* Questionnaire Content */}
        <div className="h-full overflow-y-auto">
          <PersonalProfileQuestionnaire onComplete={onClose} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;