
import { Check, Heart } from "lucide-react";

interface PartnerQuestionnaireSuccessProps {
  isModal?: boolean;
}

const PartnerQuestionnaireSuccess = ({ isModal = false }: PartnerQuestionnaireSuccessProps) => {
  return (
    <div className="flex items-center justify-center p-8 h-auto min-h-fit">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-8 h-8 text-white" />
        </div>
        
        <div className="mb-4">
          <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white mb-2">Partner Profile Complete!</h2>
          <p className="text-white/80 leading-relaxed">
            Great work! Now RealTalk has a better understanding of your partner to give you more personalized relationship advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSuccess;
