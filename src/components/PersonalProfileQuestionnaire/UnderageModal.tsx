
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Modal card with high opacity background for text readability */}
      <div className="questionnaire-modal-card max-w-md w-full p-8 animate-fade-in">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            We've got you covered
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
          </h3>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            You selected under 18 - no problem! We want you connected with resources that actually get it. Love is Respect is designed specifically for your age group.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Button
              onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
              className="questionnaire-button-primary px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-coral-500/25"
            >
              Visit Love is Respect
            </Button>
            <button
              onClick={onClose}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-300 hover:underline underline-offset-4 font-medium"
            >
              I'm 18+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderageModal;
