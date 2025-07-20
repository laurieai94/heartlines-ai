
import { Button } from "@/components/ui/button";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Modal card with enhanced glassmorphism styling for better readability */}
      <div className="questionnaire-modal-card max-w-md w-full p-8 animate-fade-in">
        <div className="text-center">
          <h3 className="text-2xl font-bold questionnaire-text mb-6">
            We've got you covered
          </h3>
          <p className="questionnaire-text-muted mb-8 text-sm leading-relaxed">
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
              className="questionnaire-text-muted text-sm hover:questionnaire-text transition-colors duration-300 hover:underline underline-offset-4 font-medium"
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
