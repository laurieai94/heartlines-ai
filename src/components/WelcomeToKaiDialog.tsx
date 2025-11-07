import { Button } from "@/components/ui/button";
import FlipPhoneIcon from "@/components/icons/FlipPhoneIcon";

interface WelcomeToKaiDialogProps {
  isOpen: boolean;
  onGetStarted: () => void;
}

const WelcomeToKaiDialog = ({ isOpen, onGetStarted }: WelcomeToKaiDialogProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-[100000] bg-[hsl(var(--questionnaire-bg))]/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-dialog-title"
    >
      {/* Non-dismissable backdrop */}
      <div className="absolute inset-0" />

      <div className="relative glass-burgundy border-burgundy-500/20 rounded-2xl p-8 max-w-md w-full animate-fade-in shadow-2xl">
        {/* Flip Phone Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-coral-500/20 to-burgundy-500/20 border border-coral-500/30">
            <FlipPhoneIcon size={64} className="text-coral-400" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            id="welcome-dialog-title"
            className="text-3xl font-brand text-white mb-3"
          >
            welcome to heartlines
          </h1>
          <p className="text-white/80 text-lg leading-relaxed md:whitespace-nowrap">
            you're 5 questions away from chatting with kai.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Button 
            onClick={onGetStarted} 
            className="w-full questionnaire-button-primary text-lg py-6"
          >
            let's go
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeToKaiDialog;
