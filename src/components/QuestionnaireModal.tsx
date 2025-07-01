
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with stronger blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Modal Container - Better sized and centered */}
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[600px] bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden animate-scale-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>
        
        {/* Questionnaire Content - Now properly sized for modal */}
        <div className="h-full">
          <PersonalProfileQuestionnaire onComplete={onClose} onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
