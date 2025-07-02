
import { Button } from "@/components/ui/button";
import { X, Sparkles, Trophy, Heart, MessageCircle, Lightbulb } from "lucide-react";
import { calculateOverallProgress } from "./ValidationLogic";

interface QuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
  profileData: any;
}

const QuestionnaireHeader = ({ onClose, currentSection, totalSections, profileData }: QuestionnaireHeaderProps) => {
  const overallProgress = calculateOverallProgress(profileData);
  
  const getMotivationalMessage = () => {
    if (overallProgress === 100) return {
      title: "🎉 Profile Complete! Ready for RealTalk!",
      subtitle: "Access personalized insights, conversation starters, and relationship tools"
    };
    if (overallProgress >= 80) return {
      title: "🚀 Complete your profile to unlock RealTalk",
      subtitle: "Get AI-powered relationship insights tailored to your unique situation"
    };
    if (overallProgress >= 50) return {
      title: "💪 Great progress! Keep going to unlock RealTalk",
      subtitle: "Soon you'll have personalized conversation starters and conflict resolution tools"
    };
    if (overallProgress >= 25) return {
      title: "✨ Nice start! Continue building your profile",
      subtitle: "Each question helps create better, more personalized relationship guidance"
    };
    return {
      title: "🌟 Building your foundation for better conversations",
      subtitle: "Your answers help us provide personalized relationship insights and tools"
    };
  };

  const message = getMotivationalMessage();

  const getFeaturePreview = () => {
    if (overallProgress >= 75) return (
      <div className="flex items-center gap-3 text-xs text-white/80">
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3 text-emerald-300" />
          <span>Smart Conversations</span>
        </div>
        <div className="flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-yellow-300" />
          <span>AI Insights</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>Relationship Tools</span>
        </div>
      </div>
    );
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            {overallProgress === 100 ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-white">Your Personal Profile</h2>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-white font-medium">{message.title}</p>
              <p className="text-xs text-white/70 leading-relaxed">{message.subtitle}</p>
              
              {getFeaturePreview()}
              
              <div className="flex items-center gap-2 mt-2">
                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-xs text-white/70 font-medium">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
