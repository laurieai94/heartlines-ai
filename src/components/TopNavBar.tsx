import { Heart } from "lucide-react";
import SignInButton from "./SignInButton";
import type { User as SupaUser } from "@supabase/supabase-js";

interface TopNavBarProps {
  // Header bits
  accessLevel: string;
  profileCompletion: number;
  compact?: boolean;
  user: SupaUser | null;
  onSignInClick: () => void;
  onOpenProfile?: () => void;
  // Nav bits (kept for compatibility, unused in minimal nav)
  activeTab: string;
  onValueChange: (value: string) => void;
}

const TopNavBar = ({
  accessLevel,
  profileCompletion,
  compact = false,
  user,
  onSignInClick,
  onOpenProfile,
}: TopNavBarProps) => {
  const subtitle =
    accessLevel !== "full-access"
      ? accessLevel === "profile-required"
        ? "Start by building your profile"
        : profileCompletion > 0
        ? `${profileCompletion}% complete`
        : "Complete your profile for full access"
      : undefined;

  return (
    <header className="sticky top-0 z-30 nav-safe pointer-events-none pt-3 sm:pt-5 mb-4 sm:mb-6">
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${compact ? "py-2" : "py-3"}`}>
        <div className="flex items-center justify-between nav-glass pointer-events-auto">
          {/* Left: Brand */}
          <button
            type="button"
            onClick={onOpenProfile}
            className={`group flex items-center gap-3 pl-3 sm:pl-4 py-2.5 transition-colors hover:bg-foreground/5 rounded-l-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
            aria-label="Open profile"
          >
            <div className="h-9 w-9 rounded-xl shadow-sm bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 grid place-items-center">
              <Heart className="h-4 w-4 text-background" />
            </div>
            <div className="hidden sm:block text-left">
              <h1 className={`${compact ? "text-base" : "text-lg"} font-bold font-serif text-foreground leading-tight`}>
                RealTalk
              </h1>
              {/* Minimal design: subtitle hidden intentionally */}
              {/* {subtitle && (
                <p className="text-xs text-foreground/60 font-medium leading-relaxed">{subtitle}</p>
              )} */}
            </div>
          </button>

          {/* Right: Auth/Profile - single frosted button */}
          <div className="pr-3 sm:pr-4 py-2.5">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
