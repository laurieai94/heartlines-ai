
import { Heart, PartyPopper } from "lucide-react";
import { BRAND } from "@/branding";

interface QuestionnaireSuccessProps {
  isModal?: boolean;
}

const QuestionnaireSuccess = ({ isModal = false }: QuestionnaireSuccessProps) => {
  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'} overflow-hidden`}>
      {/* Animated orbs background */}
      {!isModal && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-coral-400/20 to-peach-400/20 rounded-full animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-peach-400/15 to-coral-400/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-coral-300/10 to-peach-300/10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        </div>
      )}

      <div className={`${isModal ? 'questionnaire-modal-card w-full h-auto min-h-fit' : 'questionnaire-modal-card w-full max-w-2xl h-[70vh]'} overflow-hidden flex flex-col items-center justify-center relative z-10 animate-fade-in`}>
        <div className="text-center space-y-6 p-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-12 h-12 text-pink-400 animate-bounce" />
            <PartyPopper className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="questionnaire-text text-3xl font-bold">Profile Complete!</h2>
            <p className="text-lg text-gray-300">
              🎉 Congratulations! You're ready to start using {BRAND.name}
            </p>
          </div>
          
          <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
          
          <p className="text-sm text-gray-400">
            Starting your {BRAND.name} experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSuccess;
