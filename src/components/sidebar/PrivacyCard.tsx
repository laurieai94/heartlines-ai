
import { Lock } from "lucide-react";

const PrivacyCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-xl animate-slide-up" style={{animationDelay: '0.5s'}}>
      <div className="flex items-center gap-3">
        <Lock className="w-4 h-4 text-green-400" />
        <h3 className="text-white font-semibold text-sm">
          RealTalk Privacy Promise
        </h3>
      </div>
    </div>
  );
};

export default PrivacyCard;
