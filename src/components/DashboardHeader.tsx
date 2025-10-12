import BrandMark from "./BrandMark";
import SignInButton from "./SignInButton";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Crown, Menu, Home, User as UserIcon, MessageSquare, CreditCard, Target, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMobileHeaderVisibility } from "@/contexts/MobileHeaderVisibilityContext";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useState } from "react";
import type { User } from '@supabase/supabase-js';

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
      else if (item.value === 'account') navigate('/account');
      else if (item.value === 'profile') navigate('/profile');
    } else {
      onValueChange(item.value);
    }
  };
  
  return (
    <div className={`w-full fixed top-0 left-0 right-0 z-50 bg-burgundy-900 ${isCoachMode ? 'hidden md:block' : ''} ${compact ? 'mb-1 sm:mb-2' : activeTab === 'plans' ? 'mb-1 sm:mb-2 md:mb-6 lg:mb-10' : 'mb-1 sm:mb-2 md:mb-6'}`} style={{ transform: 'none', isolation: 'isolate' }}>
      <div className={`max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto sm:px-6 xl:px-8 relative ${
        isCoachMode 
          ? 'pl-1 pr-3 py-2' // Compact padding with more right breathing room on coach page
          : 'pl-4 pr-4 py-3' // Balanced padding on other pages
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
                  size="icon"
                  className={`text-white hover:text-white bg-white/5 hover:bg-white/15 hover:backdrop-blur-md hover:border hover:border-white/20 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white ${
                    isCoachMode ? 'h-7 w-7' : 'h-8 w-8'
                  }`}
                >
                  <Menu className={isCoachMode ? 'h-4 w-4' : 'h-5 w-5'} />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                sideOffset={8}
                className="w-56 p-2 max-w-[calc(100vw-32px)] z-[60] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl"
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = (!item.isExternal && activeTab === item.value) || (item.isExternal && activeTab === item.value);
                  return (
                    <button
                      key={item.value}
                      onMouseEnter={() => handleTabHover(item.value)}
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'text-white font-semibold bg-white/15' 
                          : 'text-white font-medium hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm">{item.label}</span>
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
                  size="icon"
                  className="text-white hover:text-white h-8 w-8 bg-white/5 hover:bg-white/15 hover:backdrop-blur-md hover:border hover:border-white/20 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                sideOffset={8}
                className="w-56 p-2 max-w-[calc(100vw-32px)] z-[60] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl"
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = (!item.isExternal && activeTab === item.value) || (item.isExternal && activeTab === item.value);
                  return (
                    <button
                      key={item.value}
                      onMouseEnter={() => handleTabHover(item.value)}
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'text-white font-semibold bg-white/15' 
                          : 'text-white font-medium hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
            
          </div>
          
          <div className="flex items-center md:mt-2 lg:mt-3">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
