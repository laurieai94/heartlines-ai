
import { Heart } from "lucide-react";
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
    <div className="w-full sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${compact ? 'py-3' : 'py-6'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
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

          {/* Center Navigation */}
          <nav aria-label="Primary" className="flex flex-1 justify-center px-2">
            <div className="max-w-3xl w-full rounded-full p-1 gap-1 bg-background/60 backdrop-blur-md border border-border/60 shadow-sm flex overflow-x-auto no-scrollbar">
              {[
                { value: 'profile', label: 'Profile' },
                { value: 'insights', label: 'Coach' },
                { value: 'conversation', label: 'Practice' },
                { value: 'actions', label: 'Actions' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onValueChange(tab.value)}
                  className={`flex-1 rounded-full py-2 px-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.value
                      ? 'bg-primary/15 text-primary shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
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
