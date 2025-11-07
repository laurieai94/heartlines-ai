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
          <div 
            className="p-4 bg-gradient-to-br from-coral-500/20 to-burgundy-500/20 border border-coral-500/30"
            style={{
              clipPath: "path('M50,15 C50,10 55,5 60,5 C70,5 75,15 75,25 C75,40 50,55 50,55 C50,55 25,40 25,25 C25,15 30,5 40,5 C45,5 50,10 50,15 Z')",
              width: '100px',
              height: '100px'
            }}
          >
            <FlipPhoneIcon size={64} className="text-coral-400" />
          </div>
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
            5 questions before kai picks up.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Button 
            onClick={onGetStarted} 
            className="w-full questionnaire-button-primary text-lg py-6"
          >
            lets go
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeToKaiDialog;
