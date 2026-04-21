
import { Check, Heart } from "lucide-react";
import { BRAND } from "@/branding";

interface PartnerQuestionnaireSuccessProps {
  isModal?: boolean;
}

const PartnerQuestionnaireSuccess = ({ isModal = false }: PartnerQuestionnaireSuccessProps) => {
  return (
    <div className="flex items-center justify-center p-8 h-auto min-h-fit questionnaire-bg-modal">
      {/* Animated orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-coral-400/20 to-peach-400/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-peach-400/15 to-coral-400/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="questionnaire-modal-card text-center max-w-md relative z-10 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Check className="w-8 h-8 text-white" />
        </div>
        
        <div className="mb-4">
          <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
          <h2 className="questionnaire-text text-2xl font-bold mb-2">Partner Profile Complete!</h2>
          <p className="text-gray-300 leading-relaxed">
            Great work! Now {BRAND.name} has a better understanding of your partner to give you more personalized relationship advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSuccess;
