import BrandLogo from "./BrandLogo";
import { BRAND } from "@/branding";
import SignInButton from "./SignInButton";
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

const DashboardHeader = ({ accessLevel, profileCompletion, compact = false, user, activeTab, onValueChange, onSignInClick, onOpenProfile }: DashboardHeaderProps) => {
  return (
    <div className="w-full sticky top-0 z-40 mb-6 sm:mb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between ${compact ? 'py-3' : 'py-6'}`}>
          <div className="flex items-center gap-4">
            <BrandLogo 
              className="w-10 h-10" 
              variant="rounded" 
              imgSrc={BRAND.logoSrc}
              imgAlt="RealTalk logo"
            />
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

          {/* Center Navigation */}
          <nav aria-label="Primary" className="flex flex-1 justify-center px-8">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {[
                { value: 'home', label: 'Home' },
                { value: 'profile', label: 'Profile' },
                { value: 'insights', label: 'Coach' },
                { value: 'actions', label: 'Actions' },
                { value: 'company', label: 'Company' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onValueChange(tab.value)}
                  className={`relative py-2 px-1 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.value
                      ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
          
          <div className="flex items-center">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
