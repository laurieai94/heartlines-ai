
import { Heart } from "lucide-react";

interface DashboardHeaderProps {
  accessLevel: string;
  profileCompletion: number;
  compact?: boolean;
}

const DashboardHeader = ({ accessLevel, profileCompletion, compact = false }: DashboardHeaderProps) => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${compact ? 'py-3' : 'py-6'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-white font-serif leading-tight`}>RealTalk</h1>
              {accessLevel !== 'full-access' && (
                <p className="text-xs text-pink-200/70 font-medium mt-1 leading-relaxed">
                  {accessLevel === 'profile-required' ? 'Start by building your profile' : 
                   profileCompletion > 0 ? `${profileCompletion}% complete` : 'Complete your profile for full access'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
