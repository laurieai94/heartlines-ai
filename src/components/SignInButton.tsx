import { useState, useEffect, useCallback, useRef } from "react";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavAvatar from "@/components/NavAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MobileNavPortal } from "./MobileNavPortal";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SignInButtonProps {
  onSignInClick: () => void;
  user: SupabaseUser | null;
  onOpenProfile?: () => void;
  isFlipMenuOpen?: boolean;
  onFlipMenuOpenChange?: (open: boolean) => void;
}

const SignInButton = ({ 
  onSignInClick, 
  user, 
  onOpenProfile,
  isFlipMenuOpen = false,
  onFlipMenuOpenChange 
}: SignInButtonProps) => {
  const { signOut } = useAuth();
  const { profileData } = usePersonalProfileData();
  const { isMobile } = useOptimizedMobile();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  const handleAvatarToggle = useCallback(() => {
    // Close flip menu if open
    if (isFlipMenuOpen && onFlipMenuOpenChange) {
      onFlipMenuOpenChange(false);
    }
    // Toggle avatar menu
    setShowUserMenu(prev => !prev);
  }, [isFlipMenuOpen, onFlipMenuOpenChange]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setTriggerUpdate(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
  }, []);

  // Lock scroll when avatar menu is open on mobile
  useEffect(() => {
    if (showUserMenu && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    }
  }, [showUserMenu, isMobile]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
    return (
      <>
        <button
          className="header-avatar-btn h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
          aria-expanded={showUserMenu}
          aria-label="User menu"
          onPointerUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAvatarToggle();
          }}
          style={{
            position: 'relative',
            zIndex: 81,
            touchAction: 'manipulation',
            pointerEvents: 'auto',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <NavAvatar>{initial}</NavAvatar>
        </button>

        {/* Mobile: Portal-based drawer */}
        {isMobile && showUserMenu && (
          <MobileNavPortal>
            {/* Overlay */}
            <div
              className="mobile-overlay"
              onPointerUp={() => setShowUserMenu(false)}
              role="presentation"
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 40
              }}
            />
            
            {/* Avatar Menu Drawer */}
            <div
              className="mobile-drawer"
              role="dialog"
              aria-modal="true"
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                transform: 'translateY(0)',
                transition: 'transform 220ms ease',
                zIndex: 50,
                paddingBottom: `calc(64px + env(safe-area-inset-bottom))`,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(24px)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.4)'
              }}
            >
              <div className="w-14 p-2 mx-auto flex flex-col gap-1">
                {onOpenProfile && (
                  <button
                    className="w-full justify-center p-2.5 h-auto bg-transparent text-white hover:bg-white/15 hover:backdrop-blur-md rounded-xl flex items-center justify-center"
                    onPointerUp={(e) => {
                      e.preventDefault();
                      onOpenProfile();
                      setShowUserMenu(false);
                    }}
                    style={{
                      minHeight: '48px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <UserCircle className="h-5 w-5" />
                  </button>
                )}
                
                <button
                  className="w-full justify-center p-2.5 h-auto bg-transparent text-white hover:bg-white/15 hover:backdrop-blur-md rounded-xl flex items-center justify-center"
                  onPointerUp={(e) => {
                    e.preventDefault();
                    window.location.href = '/account';
                    setShowUserMenu(false);
                  }}
                  style={{
                    minHeight: '48px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                <div className="h-px bg-white/10 my-1" />
                
                <button
                  className="w-full justify-center p-2.5 h-auto bg-transparent text-rose-300 hover:text-white hover:bg-rose-500/20 hover:backdrop-blur-md rounded-xl flex items-center justify-center"
                  onPointerUp={(e) => {
                    e.preventDefault();
                    handleSignOut();
                  }}
                  style={{
                    minHeight: '48px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </MobileNavPortal>
        )}

        {/* Desktop: Keep Radix Popover (>768px) */}
        {!isMobile && (
          <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 w-11 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-full p-0 bg-transparent hover:bg-transparent shadow-none transition-all duration-300"
              >
                <NavAvatar>{initial}</NavAvatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-14 p-2 bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl" 
              align="end"
              side="bottom"
              sideOffset={12}
              style={{
                zIndex: 100
              }}
            >
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
        )}
      </>
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