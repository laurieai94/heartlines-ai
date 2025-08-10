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
            className="h-10 w-10 rounded-full p-0 bg-background/60 backdrop-blur-xl border border-border/60 text-foreground hover:bg-foreground/5 transition-all duration-300"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 bg-background/95 backdrop-blur-md border border-border/60 text-foreground shadow-sm" align="end">
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm">
              <p className="font-medium text-foreground/90">Signed in as</p>
              <p className="text-foreground/70 truncate">{user.email}</p>
            </div>
            
            {onOpenProfile && (
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:bg-foreground/5"
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
              variant="ghost"
              className="w-full justify-start text-foreground hover:bg-foreground/5"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
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
      className="rounded-full px-4 h-10 bg-background/60 backdrop-blur-xl border border-border/60 text-foreground hover:bg-foreground/5 transition-all duration-300"
    >
      <User className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  );
};

export default SignInButton;