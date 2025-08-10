import { Heart, Lightbulb, MessageCircle, User } from "lucide-react";
import SignInButton from "./SignInButton";
import type { User as SupaUser } from "@supabase/supabase-js";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopNavBarProps {
  // Header bits
  accessLevel: string;
  profileCompletion: number;
  compact?: boolean;
  user: SupaUser | null;
  onSignInClick: () => void;
  onOpenProfile?: () => void;
  // Nav bits
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
  activeTab,
  onValueChange,
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
    <header className="sticky top-0 z-30">
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${compact ? "py-2" : "py-3"}`}>
        <div className="flex items-center justify-between nav-glass">
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
              {subtitle && (
                <p className="text-xs text-foreground/60 font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </button>

          {/* Center: Tabs */}
          <nav role="navigation" aria-label="Primary" className="flex-1 flex justify-center px-2">
            <Tabs value={activeTab} onValueChange={onValueChange} className="w-full">
              <TabsList className={`mx-auto ${compact ? "h-9" : "h-10"} w-full max-w-2xl p-0 gap-2 bg-transparent`}>
                <TabsTrigger
                  value="profile"
                  title="Profile"
                  className={`nav-trigger hover-scale rounded-full ${compact ? "py-1.5 px-2.5 text-xs" : "py-2 px-3 text-sm"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  title="Coach"
                  className={`nav-trigger hover-scale rounded-full ${compact ? "py-1.5 px-2.5 text-xs" : "py-2 px-3 text-sm"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Coach</span>
                </TabsTrigger>
                <TabsTrigger
                  value="conversation"
                  title="Practice"
                  className={`nav-trigger hover-scale rounded-full ${compact ? "py-1.5 px-2.5 text-xs" : "py-2 px-3 text-sm"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Practice</span>
                </TabsTrigger>
                <TabsTrigger
                  value="actions"
                  title="Actions"
                  className={`nav-trigger hover-scale rounded-full ${compact ? "py-1.5 px-2.5 text-xs" : "py-2 px-3 text-sm"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Actions</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>

          {/* Right: Auth/Profile */}
          <div className="pr-3 sm:pr-4 py-2.5">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
