
import { Progress } from "@/components/ui/progress";

interface ProfileBuilderHeaderProps {
  profileCompletion: number;
}

const ProfileBuilderHeader = ({ profileCompletion }: ProfileBuilderHeaderProps) => {
  return (
    <div className="text-center space-y-2 flex-shrink-0">
      <h1 className="text-2xl font-bold text-white">
        Let's Get to Know the Real You
      </h1>
      <p className="text-base text-gray-100 max-w-2xl mx-auto">
        Build your relationship profiles to unlock personalized insights
      </p>
      {/* Real-time overall progress indicator */}
      {profileCompletion > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-100">
          <span>Overall Progress:</span>
          <div className="w-32 h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-electric-blue to-electric-purple transition-all duration-500 ease-out"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <span className="font-semibold text-white">{profileCompletion}%</span>
        </div>
      )}
    </div>
  );
};

export default ProfileBuilderHeader;
