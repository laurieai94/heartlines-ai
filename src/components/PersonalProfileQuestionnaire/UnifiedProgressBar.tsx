
import { validateSection, getRequiredCount, getCompletedCount, calculateOverallProgress } from "./ValidationLogic";

interface UnifiedProgressBarProps {
  currentSection: number;
  profileData: any;
}

const UnifiedProgressBar = ({ currentSection, profileData }: UnifiedProgressBarProps) => {
  const sections = [1, 2, 3, 4];
  const overallProgress = calculateOverallProgress(profileData);
  
  const getSegmentStatus = (section: number) => {
    const isCompleted = validateSection(section, profileData);
    const isActive = section === currentSection;
    const completedCount = getCompletedCount(section, profileData);
    const requiredCount = getRequiredCount(section, profileData);
    const progressPercentage = requiredCount > 0 ? (completedCount / requiredCount) * 100 : 0;
    
    return {
      isCompleted,
      isActive,
      progressPercentage,
      completedCount,
      requiredCount
    };
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-white/80">
        <span>Profile Progress</span>
        <span className="font-semibold">{overallProgress}% Complete</span>
      </div>
      
      <div className="w-full bg-white/10 rounded-lg overflow-hidden border border-white/20 relative group">
        <div className="flex">
          {sections.map((section, index) => {
            const { isCompleted, isActive, progressPercentage, completedCount, requiredCount } = getSegmentStatus(section);
            
            return (
              <div
                key={section}
                className={`flex-1 h-3 relative ${
                  index < sections.length - 1 ? 'border-r border-white/20' : ''
                } group/segment`}
                title={`Section ${section}: ${completedCount}/${requiredCount} complete`}
              >
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg'
                      : isCompleted
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                      : 'bg-white/20'
                  }`}
                  style={{ 
                    width: `${Math.min(progressPercentage, 100)}%`,
                    minWidth: isCompleted ? '100%' : undefined
                  }}
                />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/segment:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Section {section}: {completedCount}/{requiredCount} ({Math.round(progressPercentage)}%)
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Overall progress indicator */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/30 to-purple-500/30 pointer-events-none transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default UnifiedProgressBar;
