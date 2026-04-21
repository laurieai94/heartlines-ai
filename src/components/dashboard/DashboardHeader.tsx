import BrandMark from '../brand/BrandMark';
import SignInButton from '../landing/SignInButton';
import HeartlinesWordmark from "./brand/HeartlinesWordmark";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Crown, Home, User as UserIcon, MessageSquare, CreditCard, Target, Settings, X, LogOut } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { useNavigate } from "react-router-dom";
import { useMobileHeaderVisibility } from "@/contexts/MobileHeaderVisibilityContext";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useState, useEffect } from "react";
import type { User } from '@supabase/supabase-js';
import { useIsAdmin } from "@/hooks/useUserRole";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  const { visible, navigationOpened, setNavigationOpened } = useMobileHeaderVisibility();
  const isCoachMode = activeTab === 'insights';
  const { isAdmin } = useIsAdmin();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setNavigationOpened(false);
  };

  // Lock scroll when nav is open on mobile - optimized for performance
  useEffect(() => {
    if (navigationOpened && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    }
  }, [navigationOpened, isMobile]);
  
  const handleTabHover = (tabValue: string) => {
    if (tabValue === 'plans') {
      import('@/pages/Pricing').catch(() => {});
    } else if (tabValue === 'insights') {
      // Prefetch AIInsights and related chat components
      import('@/components/system/AIInsights').catch(() => {});
      import('@/components/chat/ChatHistorySidebar').catch(() => {});
      import('@/components/chat/ChatInputSection').catch(() => {});
    }
  };

  const navigationItems = [
    { value: 'home', label: 'home', icon: Home },
    { value: 'profile', label: 'profile', icon: UserIcon, isExternal: true },
    { value: 'insights', label: 'coach', icon: MessageSquare },
    { value: 'plans', label: 'plans', icon: CreditCard, isExternal: true },
    { value: 'account', label: 'account', icon: Settings, isExternal: true },
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
        paddingTop: isCoachMode ? 'max(0px, env(safe-area-inset-top))' : '0'
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
          <div className={`flex items-center ${isCoachMode ? 'gap-2' : 'gap-3'}`}>
            <Sheet open={navigationOpened} onOpenChange={setNavigationOpened}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                >
                  <FlipPhoneIcon className="h-12 w-12 sm:h-14 sm:w-14" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left"
                hideClose={true}
                className="w-20 bg-burgundy-800/95 backdrop-blur-xl border-r border-coral-400/20 rounded-r-3xl p-0"
              >
                <nav className="flex flex-col items-center gap-2 py-6 h-full">
                  {/* Flip Phone Icon at Top */}
                  <div className="mb-4">
                    <FlipPhoneIcon className="h-10 w-10 text-white" />
                  </div>
                  <div className="h-px w-12 bg-white/10 mb-2" />

                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = (!item.isExternal && activeTab === item.value) || (item.isExternal && activeTab === item.value);
                    return (
                      <button
                        key={item.value}
                        onMouseEnter={() => handleTabHover(item.value)}
                        onClick={() => {
                          handleNavigation(item);
                          setNavigationOpened(false);
                        }}
                        className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'text-white bg-white/20' 
                            : 'text-white/80 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" strokeWidth={2} />
                      </button>
                    );
                  })}
                  
                  <div className="h-px w-12 bg-white/10 my-2 mt-auto" />
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center w-12 h-12 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all duration-200"
                  >
                    <LogOut className="w-6 h-6" strokeWidth={2} />
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
            
          </div>
          
          {/* User avatar on the right side */}
          <div className="hidden md:flex items-center">
            <SignInButton
              user={user} 
              onSignInClick={onSignInClick} 
              onOpenProfile={onOpenProfile}
              disableMenuOnMobile={true}
            />
          </div>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className={`hidden md:flex items-center justify-between`}>
          {/* Always use hamburger layout on desktop */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                >
                  <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                sideOffset={8}
                collisionPadding={0}
                avoidCollisions={false}
                className="w-16 p-2 z-[45] bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl"
                style={{ 
                  contain: 'layout',
                  transform: 'translateZ(0)',
                  willChange: 'transform, opacity',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
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
                
                <div className="h-px bg-white/10 my-0.5" />
                
                <button
                  onClick={handleSignOut}
                  title="sign out"
                  className="flex items-center justify-center rounded-xl cursor-pointer touch-manipulation md:transition-all md:duration-200 md:shadow-lg md:hover:shadow-xl active:scale-95 text-rose-300 hover:text-white hover:bg-rose-500/20"
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
                  <LogOut className="h-6 w-6" strokeWidth={2} />
                </button>
              </PopoverContent>
            </Popover>
            
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link 
                to="/admin"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-400/20 to-coral-400/20 hover:from-pink-400/30 hover:to-coral-400/30 border border-pink-400/30 text-white text-sm font-medium transition-all"
              >
                admin
              </Link>
            )}
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} disableMenuOnMobile={activeTab === 'insights'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
