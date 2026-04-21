
import { Heart } from "lucide-react";

interface UnderageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderageModal = ({ isOpen, onClose }: UnderageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Simple backdrop blur */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 min-h-[400px] flex items-center justify-center">
        {/* Softened background orbs with site colors */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-coral-500/10 to-peach-500/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-burgundy-500/12 to-coral-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-peach-400/8 to-coral-400/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute -top-5 -right-8 w-24 h-24 bg-gradient-to-br from-coral-600/8 to-burgundy-600/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-5 -left-8 w-36 h-36 bg-gradient-to-br from-burgundy-500/6 to-coral-500/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        {/* Questionnaire modal card */}
        <div className="questionnaire-modal-card max-w-md w-full overflow-hidden border border-transparent ring-1 ring-inset ring-white/20 shadow-2xl shadow-black/40">
          <div className="relative p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold questionnaire-text flex items-center justify-center gap-2">
                We've got you covered
                <Heart className="w-6 h-6 text-coral-400 fill-coral-400" />
              </h3>
              <p className="questionnaire-text-muted text-sm leading-relaxed">
                You selected under 18 - no problem! We want you connected with resources that actually get it. Love is Respect is designed specifically for your age group.
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-4 pt-2">
              <button
                onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
                className="questionnaire-button-primary w-full"
                aria-label="Visit Love is Respect website in a new tab"
              >
                Visit Love is Respect
              </button>
              <button
                onClick={onClose}
                className="w-full text-sm questionnaire-text-muted hover:questionnaire-text transition-colors"
              >
                I'm 18+
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderageModal;
