import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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

  const getUserInitial = (user: SupabaseUser) => {
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
          <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-coral-400 to-pink-400 text-white font-medium">
                {getUserInitial(user)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 glass rounded-2xl border-white/10 shadow-3xl" align="end">
          <div className="flex flex-col space-y-1 p-3">
            <p className="px-3 py-2 text-sm font-medium text-white/90 bg-white/5 rounded-lg">
              {user.email}
            </p>
            <Separator className="bg-white/10" />
            {onOpenProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenProfile();
                  setShowUserMenu(false);
                }}
                className="justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
              >
                View Profile
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Account Settings
            </Button>
            <Separator className="bg-white/10" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Sign out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Show sign in button for unauthenticated users
  return (
    <Button
      onClick={onSignInClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
    >
      <User className="h-4 w-4" />
      Sign In
    </Button>
  );
};

export default SignInButton;