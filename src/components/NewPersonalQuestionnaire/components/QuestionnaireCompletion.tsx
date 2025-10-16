import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircleHeart, Sparkles } from "lucide-react";

interface QuestionnaireCompletionProps {
  onAddPartner: () => void;
  onStartCoaching: () => void;
  isModal?: boolean;
}

const QuestionnaireCompletion = ({ 
  onAddPartner, 
  onStartCoaching, 
  isModal = false 
}: QuestionnaireCompletionProps) => {
  return (
    <div className={`${isModal ? 'w-full h-auto min-h-fit' : 'fixed inset-0 questionnaire-bg backdrop-blur-sm z-50 flex items-center justify-center'}`}>
      <div className={`${isModal ? 'w-full max-w-lg mx-auto' : 'w-full max-w-lg'} border border-white/15 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden`}>
        
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Complete!</h2>
          <p className="text-white/80 text-sm">
            Great work! Now let's unlock the full power of personalized relationship coaching.
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            
            {/* Add Partner Option */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Add Your Partner's Profile</h3>
                  <p className="text-white/70 text-sm mb-3">
                    Get deeper, more personalized coaching by adding your partner's perspective and personality.
                  </p>
                  <Button
                    onClick={onAddPartner}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Create Partner Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Start Coaching Option */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircleHeart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">meet kai, your ai coach</h3>
                  <p className="text-white/70 text-sm mb-3">
                    start your personalized coaching journey right away with insights tailored to your profile.
                  </p>
                  <Button
                    onClick={onStartCoaching}
                    variant="outline"
                    className="w-full border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Start Coaching Now
                  </Button>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <p className="text-white/60 text-xs">
              You can always add your partner's profile later from your dashboard
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuestionnaireCompletion;