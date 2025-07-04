
import { Trophy, PartyPopper } from "lucide-react";

interface QuestionnaireSuccessProps {
  isModal?: boolean;
}

const QuestionnaireSuccess = ({ isModal = false }: QuestionnaireSuccessProps) => {
  return (
    <div className={`${isModal ? 'questionnaire-bg-modal w-full h-full' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'} overflow-hidden`}>
      <div className={`${isModal ? 'w-full h-full' : 'w-full max-w-2xl h-[70vh]'} overflow-hidden flex flex-col items-center justify-center border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl`}>
        <div className="text-center space-y-6 p-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
            <PartyPopper className="w-8 h-8 text-electric-blue animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Profile Complete!</h2>
            <p className="text-lg text-white/80">
              🎉 Congratulations! You're ready to start using RealTalk
            </p>
          </div>
          
          <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
          
          <p className="text-sm text-white/70">
            Starting your RealTalk experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSuccess;
