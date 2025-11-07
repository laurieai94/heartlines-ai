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
        {/* Flip Phone Icon in Heart */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative rounded-[28%]"
            style={{
              width: '120px',
              height: '120px',
              background: 'radial-gradient(120% 120% at 50% 40%, #FFC76A 0%, #FF8B7A 45%, #FF6F98 75%, #E3476B 100%)',
              boxShadow: '0 18px 40px rgba(227, 71, 107, .35), inset 0 2px 0 rgba(255,255,255,.35), inset 0 -10px 30px rgba(0,0,0,.12)',
            }}
          >
            {/* Top-left glassy highlight */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[28%]"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,.10) 30%, rgba(255,255,255,0) 60%)',
                WebkitMask: 'radial-gradient(90% 65% at 20% 10%, #000 0%, transparent 60%)',
                mask: 'radial-gradient(90% 65% at 20% 10%, #000 0%, transparent 60%)',
              }}
            />
            
            {/* Subtle inner glow */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[28%]"
              style={{
                boxShadow: 'inset 0 0 80px rgba(255, 210, 120, .35)',
              }}
            />

            {/* Heart outline SVG */}
            <svg
              viewBox="0 0 200 200"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: '67px', height: '67px' }}
              fill="none"
              stroke="white"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z" />
            </svg>

            {/* Flip Phone Icon centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <FlipPhoneIcon size={50} className="text-white" />
            </div>
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
