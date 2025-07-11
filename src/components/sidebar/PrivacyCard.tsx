
import { Lock } from "lucide-react";

const PrivacyCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-xl animate-slide-up" style={{animationDelay: '0.5s'}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
          <Lock className="w-4 h-4 text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm mb-1">
            RealTalk Privacy Promise
          </h3>
          <p className="text-white/70 text-xs mb-3">
            Bank-level encryption. We can't read your messages.
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-white/80 text-xs">End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-white/80 text-xs">Never sold or shared</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-white/80 text-xs">Delete anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyCard;
