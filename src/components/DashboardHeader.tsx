import BrandMark from "./BrandMark";
import SignInButton from "./SignInButton";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Crown, Home, User as UserIcon, MessageSquare, CreditCard, Target, Settings } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { useNavigate } from "react-router-dom";
import { useMobileHeaderVisibility } from "@/contexts/MobileHeaderVisibilityContext";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useState, useEffect } from "react";
import type { User } from '@supabase/supabase-js';
import { useIsAdmin } from "@/hooks/useUserRole";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MobileNavPortal } from "./MobileNavPortal";

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
  const navigate = useNavigate();
  const { isMobile } = useOptimizedMobile();
  const { visible } = useMobileHeaderVisibility();
  const isCoachMode = activeTab === 'insights';
  const { isAdmin } = useIsAdmin();
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Lock scroll when nav is open on mobile - optimized for performance
  useEffect(() => {
    if (isNavOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isNavOpen, isMobile]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  
  const handleTabHover = (tabValue: string) => {
    if (tabValue === 'plans') {
      import('@/pages/Pricing').catch(() => {});
    } else if (tabValue === 'insights') {
      // Prefetch AIInsights and related chat components
      import('@/components/AIInsights').catch(() => {});
      import('@/components/chat/ChatHistorySidebar').catch(() => {});
      import('@/components/chat/ChatInputSection').catch(() => {});
    }
  };

  const navigationItems = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'profile', label: 'Profile', icon: UserIcon, isExternal: true },
    { value: 'insights', label: 'Coach', icon: MessageSquare },
    { value: 'plans', label: 'Plans', icon: CreditCard, isExternal: true },
    { value: 'account', label: 'My Account', icon: Settings, isExternal: true },
  ];

  const handleNavigation = (item: any) => {
    if (item.isExternal) {
      if (item.value === 'plans') navigate('/plans');
      else if (item.value === 'account') {
        if (!user) {
          navigate('/signin');
        } else {
          navigate('/account');
        }
      }
      else if (item.value === 'profile') navigate('/profile');
    } else {
      onValueChange(item.value);
    }
  };
  
  return (
    <div 
      className={`w-full fixed top-0 left-0 right-0 z-50 ${isCoachMode ? 'bg-transparent backdrop-blur-sm' : 'bg-transparent'} ${
        compact ? 'pt-0 md:pt-0 lg:pt-0' : 'pt-0 md:pt-0 lg:pt-2'
      }`}
      style={{ 
        transform: 'none', 
        isolation: 'isolate',
        paddingTop: isCoachMode ? 'max(0px, env(safe-area-inset-top))' : 'max(12px, calc(env(safe-area-inset-top) + 8px))'
      }}
    >
      <div className={`max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto sm:px-6 xl:px-8 relative ${
        isCoachMode 
          ? 'pl-1 pr-3 py-2' // Compact padding with more right breathing room on coach page
          : 'pl-4 pr-2 sm:pr-4 py-3' // Match homepage padding on mobile, balanced on larger screens
      }`}>
        
        {/* Mobile Navigation - Always visible */}
        <div className={`flex items-center justify-between md:hidden transition-all duration-150 ${
          isCoachMode ? 'min-h-[44px]' : 'min-h-[56px]'
        }`}>
          <div className={`flex items-center ${isCoachMode ? 'gap-2' : 'gap-3'} header-actions`}>
            <button
              className="header-flip-btn text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200"
              aria-expanded={isNavOpen}
              aria-label="Open navigation menu"
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsNavOpen(prev => !prev);
              }}
              style={{
                position: 'relative',
                zIndex: 81,
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11" />
            </button>
          </div>
          
          {/* User avatar on the right side */}
          <div className="flex items-center header-actions">
            <SignInButton 
              user={user} 
              onSignInClick={onSignInClick} 
              onOpenProfile={onOpenProfile}
              isFlipMenuOpen={isNavOpen}
              onFlipMenuOpenChange={setIsNavOpen}
            />
          </div>
        </div>

        {/* Mobile Portal: Overlay + Drawer */}
        {isMobile && (
          <MobileNavPortal>
            {/* Overlay - dims background, closes menus on tap */}
            {isNavOpen && (
              <div
                className="mobile-overlay"
                onPointerUp={(e) => {
                  e.preventDefault();
                  setIsNavOpen(false);
                }}
                role="presentation"
                aria-hidden="true"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 40,
                  touchAction: 'manipulation'
                }}
              />
            )}
            
            {/* Bottom Drawer - slides up from bottom */}
            <div
              className={cn("mobile-drawer", isNavOpen && "open")}
              role="dialog"
              aria-modal="true"
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                transform: isNavOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 220ms ease',
                zIndex: 50,
                paddingBottom: `calc(64px + env(safe-area-inset-bottom))`,
                background: 'rgba(98, 30, 50, 0.95)',
                backdropFilter: 'blur(16px)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                borderTop: '1px solid rgba(255, 139, 139, 0.2)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.4)'
              }}
            >
              <div className="w-16 p-2 mx-auto">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = (!item.isExternal && activeTab === item.value) || 
                                  (item.isExternal && activeTab === item.value);
                  return (
                    <button
                      key={item.value}
                      onPointerUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavigation(item);
                        setIsNavOpen(false);
                      }}
                      title={item.label}
                      className={`flex items-center justify-center rounded-xl cursor-pointer touch-manipulation active:scale-95 ${
                        isActive 
                          ? 'text-white bg-white/20' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`}
                      style={{ 
                        minHeight: '48px', 
                        minWidth: '48px', 
                        maxHeight: '48px', 
                        maxWidth: '48px', 
                        padding: '12px',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        transform: 'translateZ(0)'
                      }}
                    >
                      <IconComponent className="h-6 w-6" strokeWidth={2} />
                    </button>
                  );
                })}
              </div>
            </div>
          </MobileNavPortal>
        )}

        {/* Desktop Navigation - Hidden on mobile */}
        <div className={`hidden md:flex items-center justify-between`}>
          {/* Always use hamburger layout on desktop */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                >
                  <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                side="bottom"
                sideOffset={16}
                alignOffset={-4}
                collisionPadding={16}
                avoidCollisions={false}
                className="w-16 p-2 bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl"
                style={{ 
                  contain: 'layout',
                  transform: 'translateZ(0)',
                  willChange: 'transform, opacity',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  zIndex: 60
                }}
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = (!item.isExternal && activeTab === item.value) || (item.isExternal && activeTab === item.value);
                  return (
                    <button
                      key={item.value}
                      onMouseEnter={() => handleTabHover(item.value)}
                      onClick={() => handleNavigation(item)}
                      title={item.label}
                      className={`flex items-center justify-center rounded-xl cursor-pointer touch-manipulation md:transition-all md:duration-200 md:shadow-lg md:hover:shadow-xl active:scale-95 ${
                        isActive 
                          ? 'text-white bg-white/20' 
                          : 'text-white/80 md:hover:bg-white/15 md:hover:text-white'
                      }`}
                      style={{ 
                        minHeight: '48px', 
                        minWidth: '48px', 
                        maxHeight: '48px', 
                        maxWidth: '48px', 
                        padding: '12px',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        transform: 'translateZ(0)'
                      }}
                    >
                      <IconComponent className="h-6 w-6" strokeWidth={2} />
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
            
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link 
                to="/admin"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-400/20 to-coral-400/20 hover:from-pink-400/30 hover:to-coral-400/30 border border-pink-400/30 text-white text-sm font-medium transition-all"
              >
                Admin
              </Link>
            )}
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
