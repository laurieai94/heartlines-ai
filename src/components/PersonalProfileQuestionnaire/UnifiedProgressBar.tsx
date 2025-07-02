
import { validateSection, getRequiredCount, getCompletedCount } from "./ValidationLogic";

interface UnifiedProgressBarProps {
  currentSection: number;
  profileData: any;
}

const UnifiedProgressBar = ({ currentSection, profileData }: UnifiedProgressBarProps) => {
  const sections = [1, 2, 3, 4];
  
  const getSegmentStatus = (section: number) => {
    const isCompleted = validateSection(section, profileData);
    const isActive = section === currentSection;
    const completedCount = getCompletedCount(section, profileData);
    const requiredCount = getRequiredCount(section, profileData);
    const progressPercentage = requiredCount > 0 ? (completedCount / requiredCount) * 100 : 0;
    
    return {
      isCompleted,
      isActive,
      progressPercentage
    };
  };

  return (
    <div className="w-full bg-white/10 rounded-lg overflow-hidden border border-white/20">
      <div className="flex">
        {sections.map((section, index) => {
          const { isCompleted, isActive, progressPercentage } = getSegmentStatus(section);
          
          return (
            <div
              key={section}
              className={`flex-1 h-2 relative ${
                index < sections.length - 1 ? 'border-r border-white/20' : ''
              }`}
            >
              <div
                className={`h-full transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600'
                    : isCompleted
                    ? 'bg-emerald-400'
                    : 'bg-white/20'
                }`}
                style={{ 
                  width: `${Math.min(progressPercentage, 100)}%`,
                  minWidth: isCompleted ? '100%' : undefined
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnifiedProgressBar;
