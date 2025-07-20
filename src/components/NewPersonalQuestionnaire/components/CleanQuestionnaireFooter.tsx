
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import { Heart, Lock, Unlock, Sparkles } from "lucide-react";

interface CleanQuestionnaireFooterProps {
  profileData: ProfileData;
  onComplete: () => void;
}

const CleanQuestionnaireFooter = ({
  profileData,
  onComplete
}: CleanQuestionnaireFooterProps) => {
  const overallProgress = calculateProgress(profileData);
  const canComplete = overallProgress === 100;

  // Section completion status
  const sectionCompletions = [{
    name: "Who You Are",
    isComplete: validateSection(1, profileData),
    unlocks: "Personalized communication insights"
  }, {
    name: "Your Situation",
    isComplete: validateSection(2, profileData),
    unlocks: "Relationship-specific coaching"
  }, {
    name: "How You Operate",
    isComplete: validateSection(3, profileData),
    unlocks: "Conflict resolution strategies"
  }, {
    name: "Your Foundation",
    isComplete: validateSection(4, profileData),
    unlocks: "Attachment-based guidance"
  }];

  const completedSections = sectionCompletions.filter(s => s.isComplete).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-4 flex-shrink-0">
      <div className="max-w-lg mx-auto">
        {/* Section Progress Indicators */}
        <div className="flex justify-center gap-3 mb-4">
          {sectionCompletions.map((section, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                section.isComplete 
                  ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' 
                  : 'bg-white/20'
              }`} />
              <span className={`text-xs font-medium transition-colors duration-300 ${
                section.isComplete ? 'text-emerald-400' : 'text-white/60'
              }`}>
                {section.name}
              </span>
            </div>
          ))}
        </div>

        {/* AI Coach Status */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-2 ${
            canComplete 
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/30' 
              : 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-orange-400/30'
          }`}>
            {canComplete ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Kai AI Coach Ready!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">
                  {4 - completedSections} section{4 - completedSections === 1 ? '' : 's'} to unlock Kai
                </span>
              </>
            )}
          </div>
          
          {!canComplete && (
            <div className="text-white/70 text-xs mb-3">
              <p className="font-medium mb-1">Complete your profile to unlock:</p>
              <div className="space-y-1">
                <div>🤖 Personalized AI relationship coaching</div>
                <div>💬 Real-time advice tailored to YOUR situation</div>
                <div>🎯 Communication strategies that actually work</div>
                <div>🔧 Conflict resolution tools designed for you</div>
              </div>
            </div>
          )}
        </div>

        {/* Completion Button */}
        {canComplete && (
          <div className="flex justify-center">
            <button 
              onClick={onComplete} 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
            >
              <Unlock className="w-4 h-4" />
              <span>Start Using Kai AI Coach</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanQuestionnaireFooter;
