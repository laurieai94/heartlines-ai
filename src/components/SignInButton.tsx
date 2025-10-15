import { useState } from "react";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardAvatar from "@/components/ProfileBuilder/CardAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SignInButtonProps {
  onSignInClick: () => void;
  user: SupabaseUser | null;
  onOpenProfile?: () => void;
}

const SignInButton = ({ onSignInClick, user, onOpenProfile }: SignInButtonProps) => {
  const { signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toLowerCase();
    }
    return 'u';
  };

  if (user) {
    // Show user avatar/menu for authenticated users
    return (
      <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
          >
            <CardAvatar className="scale-75 sm:scale-100">
              <span className="text-2xl sm:text-3xl font-bold uppercase">
                {getUserInitial()}
              </span>
            </CardAvatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-14 p-2 max-w-[calc(100vw-32px)] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl z-50" align="end">
          <TooltipProvider>
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