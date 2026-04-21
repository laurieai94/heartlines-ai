
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[hsl(var(--questionnaire-bg))]/45 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container with side padding */}
      <div className="relative z-10 w-full max-w-5xl mx-6 h-[95dvh] bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-white/60 hover:text-white transition-all duration-200 hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Questionnaire Content */}
        <div className="h-full w-full overflow-hidden">
          <PersonalProfileQuestionnaire onComplete={onClose} onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
