import { useState, useEffect } from "react";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavAvatar from "@/components/NavAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SignInButtonProps {
  onSignInClick: () => void;
  user: SupabaseUser | null;
  onOpenProfile?: () => void;
  disableMenuOnMobile?: boolean;
}

const SignInButton = ({ onSignInClick, user, onOpenProfile, disableMenuOnMobile }: SignInButtonProps) => {
  const { signOut } = useAuth();
  const { profileData } = usePersonalProfileData();
  const { isMobile } = useOptimizedMobile();
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
      return profileData.name.trim().charAt(0).toUpperCase();
    }
    // Priority 2: Email (legacy fallback)
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    // Priority 3: No initial available
    return null;
  };

  const initial = getInitialFromProfile();

  if (user) {
    // Show user avatar/menu for authenticated users
    
    // Mobile: Full drawer with text labels
    if (isMobile) {
      // If menu is disabled on mobile, just show the avatar without drawer
      if (disableMenuOnMobile) {
        return (
          <Button
            variant="ghost"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
          >
            <NavAvatar />
          </Button>
        );
      }
      
      return (
        <Drawer open={showUserMenu} onOpenChange={setShowUserMenu} direction="right">
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
            >
              <NavAvatar />
            </Button>
          </DrawerTrigger>
          <DrawerContent 
            className="w-[200px] h-full !bg-transparent bg-gradient-to-br from-burgundy-900/95 to-burgundy-800/98 backdrop-blur-xl border-l border-coral-400/20 p-0 fixed right-0 top-0 bottom-0 [&>div:first-child]:hidden"
          >
            <nav className="flex flex-col gap-0.5 pt-3 px-3 pb-3">
              {onOpenProfile && (
                <button
                  onClick={() => {
                    onOpenProfile();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer touch-manipulation transition-all duration-200 active:scale-98 text-white/80 hover:bg-white/10 hover:text-white w-full text-left"
                  style={{ 
                    minHeight: '48px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <UserCircle className="h-6 w-6 flex-shrink-0" strokeWidth={2} />
                  <span className="text-base font-medium">open profile</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  window.location.href = '/account';
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer touch-manipulation transition-all duration-200 active:scale-98 text-white/80 hover:bg-white/10 hover:text-white w-full text-left"
                style={{ 
                  minHeight: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <Settings className="h-6 w-6 flex-shrink-0" strokeWidth={2} />
                <span className="text-base font-medium">my account</span>
              </button>
              
              <div className="h-px bg-white/10 my-1" />
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer touch-manipulation transition-all duration-200 active:scale-98 text-rose-300 hover:text-white hover:bg-rose-500/20 w-full text-left"
                style={{ 
                  minHeight: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <LogOut className="h-6 w-6 flex-shrink-0" strokeWidth={2} />
                <span className="text-base font-medium">sign out</span>
              </button>
            </nav>
          </DrawerContent>
        </Drawer>
      );
    }
    
    // Desktop: Compact popover (unchanged)
    return (
      <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
        <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
        >
          <NavAvatar />
        </Button>
        </PopoverTrigger>
        <PopoverContent className="w-14 p-2 max-w-[calc(100vw-32px)] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl z-50" align="end">
          <div className="flex flex-col gap-1">
            {onOpenProfile && (
              <Button
                className="w-full justify-center p-2.5 h-auto bg-transparent text-white hover:bg-white/15 hover:backdrop-blur-md focus-visible:ring-1 focus-visible:ring-white/30 transition-all duration-200 rounded-xl"
                onClick={() => {
                  onOpenProfile();
                  setShowUserMenu(false);
                }}
              >
                <UserCircle className="h-5 w-5" />
              </Button>
            )}
            
            <Button
              className="w-full justify-center p-2.5 h-auto bg-transparent text-white hover:bg-white/15 hover:backdrop-blur-md focus-visible:ring-1 focus-visible:ring-white/30 transition-all duration-200 rounded-xl"
              onClick={() => {
                window.location.href = '/account';
                setShowUserMenu(false);
              }}
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <div className="h-px bg-white/10 my-1" />
            
            <Button
              className="w-full justify-center p-2.5 h-auto bg-transparent text-rose-300 hover:text-white hover:bg-rose-500/20 hover:backdrop-blur-md focus-visible:ring-1 focus-visible:ring-rose-400/40 transition-all duration-200 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
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