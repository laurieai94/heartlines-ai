
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";

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
  const sectionCompletions = [
    { name: "Who You Are", isComplete: validateSection(1, profileData) },
    { name: "Your Situation", isComplete: validateSection(2, profileData) },
    { name: "How You Operate", isComplete: validateSection(3, profileData) },
    { name: "Your Foundation", isComplete: validateSection(4, profileData) }
  ];

  const completedSections = sectionCompletions.filter(s => s.isComplete).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-6 flex-shrink-0">
      <div className="max-w-lg mx-auto">
        {/* Section Progress Indicators */}
        <div className="flex justify-center gap-3 mb-4">
          {sectionCompletions.map((section, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
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

        {/* Progress Text */}
        <div className="text-center mb-6">
          <p className="text-white text-sm font-medium mb-1">
            {completedSections} of 4 sections complete
          </p>
          <p className="text-white/70 text-sm">
            Complete profile to unlock RealTalk's Relationship Coach
          </p>
        </div>

        {/* Completion Button */}
        {canComplete && (
          <div className="flex justify-center">
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Unlock RealTalk's AI Coach
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanQuestionnaireFooter;
