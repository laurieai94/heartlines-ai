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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const { visible } = useMobileHeaderVisibility();
  const isCoachMode = activeTab === 'insights';
  
  const handleTabHover = (tabValue: string) => {
    if (tabValue === 'pricing') {
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
    { value: 'insights', label: 'Coach', icon: MessageSquare },
    { value: 'profile', label: 'Profile', icon: UserIcon },
    { value: 'account', label: 'Account', icon: Settings, isExternal: true },
    { value: 'pricing', label: 'Plans', icon: CreditCard, isExternal: true },
    { value: 'mission', label: 'Mission', icon: Target, isExternal: true },
  ];

  const handleNavigation = (item: any) => {
    if (item.isExternal) {
      if (item.value === 'pricing') navigate('/pricing');
      else if (item.value === 'mission') navigate('/mission');
      else if (item.value === 'account') navigate('/account');
    } else {
      onValueChange(item.value);
    }
  };
  
  return (
    <div className={`w-full sticky top-0 z-50 bg-burgundy-900 ${compact ? 'mb-1 sm:mb-2' : 'mb-6 sm:mb-8'}`}>
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto pl-4 pr-2 sm:px-6 xl:px-8 py-3 relative">
        
        {/* Mobile Navigation - Hide in coach mode when scrolling */}
        <div className={`flex items-center justify-between md:hidden transition-all duration-150 min-h-[56px] ${
          isMobile && isCoachMode && !visible 
            ? '-translate-y-full opacity-0 pointer-events-none' 
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}>
          <div className="flex items-center gap-3">
            <DropdownMenu>
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
                className="w-48 z-[60] border-0 shadow-2xl rounded-xl p-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(349 67% 18% / 0.95), hsl(349 67% 15% / 0.92), hsl(349 67% 12% / 0.95))',
                  backdropFilter: 'blur(32px) saturate(180%)',
                  borderTop: '1px solid hsl(349 67% 35% / 0.3)',
                  borderLeft: '1px solid hsl(349 67% 35% / 0.2)',
                  boxShadow: '0 25px 50px -12px hsl(349 67% 10% / 0.4), inset 0 1px 0 hsl(349 67% 35% / 0.1)',
                  color: 'white'
                }}
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.value;
                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onMouseEnter={() => handleTabHover(item.value)}
                      onClick={() => handleNavigation(item)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-0.5 last:mb-0 ${
                        isActive 
                          ? 'bg-gradient-to-r from-white/20 to-white/10 text-white font-semibold shadow-lg border border-white/20 backdrop-blur-sm' 
                          : 'text-white/90 font-medium hover:bg-white/8 hover:text-white hover:shadow-md hover:backdrop-blur-sm hover:border hover:border-white/10'
                      }`}
                      style={isActive ? {
                        boxShadow: '0 8px 25px -8px hsl(349 67% 35% / 0.3), inset 0 1px 0 hsl(349 67% 50% / 0.2)'
                      } : {}}
                    >
                      <IconComponent className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/80'}`} />
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <HeartlinesWordmark 
              size="sm" 
              className="text-white text-xl leading-none cursor-pointer" 
              onClick={() => onValueChange('home')}
            />
          </div>
          
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className={`hidden md:flex items-center justify-between`}>
          {/* Always use hamburger layout on desktop */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
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
                className="w-48 z-[60] border-0 shadow-2xl rounded-xl p-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(349 67% 18% / 0.95), hsl(349 67% 15% / 0.92), hsl(349 67% 12% / 0.95))',
                  backdropFilter: 'blur(32px) saturate(180%)',
                  borderTop: '1px solid hsl(349 67% 35% / 0.3)',
                  borderLeft: '1px solid hsl(349 67% 35% / 0.2)',
                  boxShadow: '0 25px 50px -12px hsl(349 67% 10% / 0.4), inset 0 1px 0 hsl(349 67% 35% / 0.1)',
                  color: 'white'
                }}
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.value;
                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onMouseEnter={() => handleTabHover(item.value)}
                      onClick={() => handleNavigation(item)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-0.5 last:mb-0 ${
                        isActive 
                          ? 'bg-gradient-to-r from-white/20 to-white/10 text-white font-semibold shadow-lg border border-white/20 backdrop-blur-sm' 
                          : 'text-white/90 font-medium hover:bg-white/8 hover:text-white hover:shadow-md hover:backdrop-blur-sm hover:border hover:border-white/10'
                      }`}
                      style={isActive ? {
                        boxShadow: '0 8px 25px -8px hsl(349 67% 35% / 0.3), inset 0 1px 0 hsl(349 67% 50% / 0.2)'
                      } : {}}
                    >
                      <IconComponent className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/80'}`} />
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <HeartlinesWordmark 
              size="sm" 
              className="text-white cursor-pointer" 
              onClick={() => onValueChange('home')}
            />
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
