import BrandMark from "./BrandMark";
import SignInButton from "./SignInButton";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  
  const handleTabHover = (tabValue: string) => {
    if (tabValue === 'plans') {
      import('@/pages/Pricing').catch(() => {});
    } else if (tabValue === 'mission') {
      import('@/pages/Mission').catch(() => {});
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
    { value: 'mission', label: 'Mission', icon: Target, isExternal: true },
    { value: 'account', label: 'My Account', icon: Settings, isExternal: true },
    { value: 'plans', label: 'Plans', icon: CreditCard, isExternal: true },
  ];

  const handleNavigation = (item: any, isMobileNav = false) => {
    // Navigation tracking handled by analytics
    
    // Close the appropriate dropdown
    if (isMobileNav) {
      setMobileDropdownOpen(false);
    } else {
      setDesktopDropdownOpen(false);
    }
    
    if (item.isExternal) {
      if (item.value === 'plans') navigate('/plans');
      else if (item.value === 'mission') navigate('/mission');
      else if (item.value === 'account') navigate('/account');
      else if (item.value === 'profile') navigate('/profile');
    } else {
      // For internal navigation, call onValueChange which should trigger navigation
      // Value change tracking handled by analytics
      onValueChange(item.value);
    }
  };
  
  return (
    <div className={`w-full sticky top-0 z-50 bg-burgundy-900 ${compact ? 'mb-1 sm:mb-2' : activeTab === 'plans' ? 'mb-1 sm:mb-2 md:mb-6 lg:mb-10' : 'mb-1 sm:mb-2 md:mb-6'}`}>
      <div className={`max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto sm:px-6 xl:px-8 relative ${
        isCoachMode 
          ? 'px-1 py-2' // Compact padding with adequate breathing room on coach page
          : 'pl-4 pr-2 py-3' // Normal padding on other pages
      }`}>
        
        {/* Mobile Navigation - Hide in coach mode when scrolling */}
        <div className={`flex items-center justify-between md:hidden transition-all duration-150 ${
          isCoachMode ? 'min-h-[44px]' : 'min-h-[56px]'
        } ${
          isMobile && isCoachMode && !visible 
            ? '-translate-y-full opacity-0 pointer-events-none' 
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}>
          <div className={`flex items-center ${isCoachMode ? 'gap-2' : 'gap-3'}`}>
            <DropdownMenu open={mobileDropdownOpen} onOpenChange={setMobileDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`text-white bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-white data-[state=open]:bg-transparent ${
                    isCoachMode ? 'h-7 w-7' : 'h-8 w-8'
                  }`}
                >
                  <Menu className={isCoachMode ? 'h-4 w-4' : 'h-5 w-5'} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-8 z-[60] border-0 shadow-2xl rounded-xl py-0.5 px-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(349 67% 25% / 0.15), hsl(349 67% 20% / 0.12), hsl(349 67% 15% / 0.15))',
                  backdropFilter: 'blur(20px)',
                  color: 'white'
                }}
              >
                 {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = (!item.isExternal && activeTab === item.value) || (item.isExternal && activeTab === item.value);
                    return (
                     <DropdownMenuItem
                       key={item.value}
                       onMouseEnter={() => handleTabHover(item.value)}
                       onClick={() => handleNavigation(item, true)}
                         className={`relative flex items-center justify-center mx-2 my-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                           isActive 
                             ? 'text-white font-semibold bg-white/15' 
                             : 'text-white font-medium hover:bg-transparent hover:ring-1 hover:ring-white/20 focus:bg-transparent focus:ring-1 focus:ring-white/20 focus:text-white hover:text-white'
                         }`}
                     >
                       <IconComponent className="h-4 w-4 flex-shrink-0" />
                     </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
          
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className={`hidden md:flex items-center justify-between`}>
          {/* Always use hamburger layout on desktop */}
          <div className="flex items-center gap-3">
            <DropdownMenu open={desktopDropdownOpen} onOpenChange={setDesktopDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white h-8 w-8 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-white data-[state=open]:bg-transparent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
               <DropdownMenuContent 
                align="start" 
                className="w-8 z-[60] border-0 shadow-2xl rounded-xl py-0.5 px-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(349 67% 25% / 0.15), hsl(349 67% 20% / 0.12), hsl(349 67% 15% / 0.15))',
                  backdropFilter: 'blur(20px)',
                  color: 'white'
                }}
              >
                 {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = (!item.isExternal && activeTab === item.value) || (item.isExternal && activeTab === item.value);
                    return (
                     <DropdownMenuItem
                       key={item.value}
                       onMouseEnter={() => handleTabHover(item.value)}
                       onClick={() => handleNavigation(item, false)}
                         className={`relative flex items-center justify-center mx-2 my-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                           isActive 
                             ? 'text-white font-semibold bg-white/15' 
                             : 'text-white font-medium hover:bg-transparent hover:ring-1 hover:ring-white/20 focus:bg-transparent focus:ring-1 focus:ring-white/20 focus:text-white hover:text-white'
                         }`}
                     >
                       <IconComponent className="h-4 w-4 flex-shrink-0" />
                     </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
          
          <div className="flex items-center">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
