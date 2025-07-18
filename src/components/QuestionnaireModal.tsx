
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 w-full h-[95vh] max-w-5xl mx-4 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Questionnaire Content */}
        <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <PersonalProfileQuestionnaire onComplete={onClose} onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
