import BrandMark from "./BrandMark";
import SignInButton from "./SignInButton";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import type { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  accessLevel: string;
  profileCompletion: number;
  compact?: boolean;
  user: User | null;
  activeTab: string;
  onValueChange: (value: string) => void;
  onSignInClick: () => void;
  onOpenProfile?: () => void;
}

const DashboardHeader = ({ 
  accessLevel, 
  profileCompletion, 
  compact = false, 
  user, 
  activeTab, 
  onSignInClick, 
  onOpenProfile 
}: DashboardHeaderProps) => {
  const isCoachMode = activeTab === 'insights';
  
  return (
    <div className={`w-full sticky top-0 z-50 bg-burgundy-900 border-b border-white/10 ${
      compact ? 'mb-1 sm:mb-2' : 'mb-1 sm:mb-2 md:mb-6'
    }`}>
      <div className={`max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto sm:px-6 xl:px-8 relative ${
        isCoachMode 
          ? 'px-1 py-2' // Compact padding for coach mode
          : 'pl-4 pr-2 py-3' // Normal padding
      }`}>
        
        {/* Simplified Header - Just branding and user controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div className="hidden sm:block">
              <HeartlinesWordmark />
            </div>
          </div>
          
          <div className="flex items-center">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
