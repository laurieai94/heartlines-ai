
import { Check, Heart } from "lucide-react";

interface PartnerQuestionnaireSuccessProps {
  isModal?: boolean;
}

const PartnerQuestionnaireSuccess = ({ isModal = false }: PartnerQuestionnaireSuccessProps) => {
  return (
    <div className="flex items-center justify-center p-8 h-auto min-h-fit">
      <div className="text-center max-w-md bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Check className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        
        <div className="mb-4">
          <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Partner Profile Complete!</h2>
          <p className="text-white/95 leading-relaxed drop-shadow-md">
            Great work! Now RealTalk has a better understanding of your partner to give you more personalized relationship advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSuccess;
