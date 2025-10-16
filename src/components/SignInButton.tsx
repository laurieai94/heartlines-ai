import { useState, useEffect } from "react";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavAvatar from "@/components/NavAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SignInButtonProps {
  onSignInClick: () => void;
  user: SupabaseUser | null;
  onOpenProfile?: () => void;
}

const SignInButton = ({ onSignInClick, user, onOpenProfile }: SignInButtonProps) => {
  const { signOut } = useAuth();
  const { profileData } = usePersonalProfileData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setTriggerUpdate(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const getInitialFromProfile = () => {
    // Priority 1: Profile name from questionnaire
    if (profileData?.name && profileData.name.trim()) {
      return profileData.name.trim().charAt(0).toLowerCase();
    }
    // Priority 2: Email (legacy fallback)
    if (user?.email) {
      return user.email.charAt(0).toLowerCase();
    }
    // Priority 3: No initial available
    return null;
  };

  const initial = getInitialFromProfile();

  if (user) {
    // Show user avatar/menu for authenticated users
    return (
      <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
        <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
        >
          <NavAvatar>{initial}</NavAvatar>
        </Button>
        </PopoverTrigger>
        <PopoverContent className="w-14 p-2 max-w-[calc(100vw-32px)] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl z-50" align="end">
          <TooltipProvider delayDuration={600} skipDelayDuration={300}>
            <div className="flex flex-col gap-1">
              {onOpenProfile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full justify-center p-2.5 h-auto bg-transparent text-white hover:bg-white/15 hover:backdrop-blur-md focus-visible:ring-1 focus-visible:ring-white/30 transition-all duration-200 rounded-xl"
                      onClick={() => {
                        onOpenProfile();
                        setShowUserMenu(false);
                      }}
                    >
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>View Profile</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full justify-center p-2.5 h-auto bg-transparent text-white hover:bg-white/15 hover:backdrop-blur-md focus-visible:ring-1 focus-visible:ring-white/30 transition-all duration-200 rounded-xl"
                    onClick={() => {
                      window.location.href = '/account';
                      setShowUserMenu(false);
                    }}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Account Settings</p>
                </TooltipContent>
              </Tooltip>
              
              <div className="h-px bg-white/10 my-1" />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full justify-center p-2.5 h-auto bg-transparent text-rose-300 hover:text-white hover:bg-rose-500/20 hover:backdrop-blur-md focus-visible:ring-1 focus-visible:ring-rose-400/40 transition-all duration-200 rounded-xl"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Sign Out</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </PopoverContent>
      </Popover>
    );
  }

  // Show sign-in button for non-authenticated users
  return (
    <Button
      onClick={onSignInClick}
      className="bg-transparent hover:bg-white/10 shadow-sm transition-all duration-300 p-2 rounded-full"
    >
      <User className="h-5 w-5" style={{ color: '#ffc0cb' }} />
    </Button>
  );
};

export default SignInButton;