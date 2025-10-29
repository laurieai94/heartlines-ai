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
import { useState } from "react";
import type { User } from '@supabase/supabase-js';
import { useIsAdmin } from "@/hooks/useUserRole";
import { Link } from "react-router-dom";

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
      className={`w-full fixed top-0 left-0 right-0 z-50 ${isCoachMode ? 'bg-burgundy-800/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none' : 'bg-transparent'} ${
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
                sideOffset={8}
                className="w-16 p-2 z-[60] bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
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
                      className={`w-full flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl ${
                        isActive 
                          ? 'text-white bg-white/20 shadow-white/10' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white shadow-transparent hover:shadow-white/5'
                      }`}
                    >
                      <IconComponent className="h-6 w-6" strokeWidth={2} />
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
            
          </div>
          
          {/* User avatar on the right side */}
          <div className="flex items-center">
            <SignInButton 
              user={user} 
              onSignInClick={onSignInClick} 
              onOpenProfile={onOpenProfile} 
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
                  className="text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                >
                  <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                sideOffset={8}
                className="w-16 p-2 z-[60] bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
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
                      className={`w-full flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl ${
                        isActive 
                          ? 'text-white bg-white/20 shadow-white/10' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white shadow-transparent hover:shadow-white/5'
                      }`}
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
