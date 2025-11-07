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
          <FlipPhoneIcon size={110} className="text-coral-400" animated={true} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            id="welcome-dialog-title"
            className="text-3xl font-brand mb-3 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider"
            style={{
              textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
            }}
          >
            heartlines calling
          </h1>
          <p className="text-white/80 text-lg leading-relaxed md:whitespace-nowrap">
            just 5 q's to break the ice.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Button 
            onClick={onGetStarted} 
            className="w-full questionnaire-button-primary text-lg py-6"
          >
            let's get real
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeToKaiDialog;
