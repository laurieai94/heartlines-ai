import { useState } from "react";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (user) {
    // Show user avatar/menu for authenticated users
    return (
      <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0 bg-white text-burgundy-900 hover:bg-gray-100 shadow-sm transition-all duration-300"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="text-sm bg-gradient-to-br from-pink-500 to-coral-500 text-white">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 max-w-[calc(100vw-32px)] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl z-50" align="end">
          <div className="space-y-1">
            <div className="space-y-1">
              {onOpenProfile && (
                <Button
                  className="w-full justify-start bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/20 transition-colors duration-200"
                  onClick={() => {
                    onOpenProfile();
                    setShowUserMenu(false);
                  }}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              )}
              
              <Button
                className="w-full justify-start bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/20 transition-colors duration-200"
                onClick={() => {
                  window.location.href = '/account';
                  setShowUserMenu(false);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              
              <Button
                className="w-full justify-start bg-transparent text-rose-300 hover:text-rose-200 hover:bg-rose-400/15 focus-visible:ring-2 focus-visible:ring-rose-300/30 transition-colors duration-200"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
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