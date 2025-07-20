
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import { Heart } from "lucide-react";

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
    isComplete: validateSection(1, profileData)
  }, {
    name: "Your Situation",
    isComplete: validateSection(2, profileData)
  }, {
    name: "How You Operate",
    isComplete: validateSection(3, profileData)
  }, {
    name: "Your Foundation",
    isComplete: validateSection(4, profileData)
  }];

  const completedSections = sectionCompletions.filter(s => s.isComplete).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-2 flex-shrink-0">
      <div className="max-w-lg mx-auto">
        {/* Section Progress Indicators - More Compact */}
        <div className="flex justify-center gap-2 mb-2">
          {sectionCompletions.map((section, index) => (
            <div key={index} className="flex flex-col items-center gap-0.5">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
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

        {/* Progress Text with Eye-catching Element - More Compact */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">AI relationship coach Kai is waiting</span>
          </div>
        </div>

        {/* Completion Button - More Compact */}
        {canComplete && (
          <div className="flex justify-center">
            <button 
              onClick={onComplete}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 text-white px-6 py-2 rounded-xl font-semibold shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unlock RealTalk's AI Coach</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanQuestionnaireFooter;
