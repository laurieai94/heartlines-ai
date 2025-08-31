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
import { Crown, Menu, Home, User as UserIcon, Brain, CreditCard, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    { value: 'profile', label: 'Profile', icon: UserIcon },
    { value: 'insights', label: 'Coach', icon: Brain },
    { value: 'pricing', label: 'Plans', icon: CreditCard, isExternal: true },
    { value: 'mission', label: 'Mission', icon: Target, isExternal: true },
  ];

  const handleNavigation = (item: any) => {
    if (item.isExternal) {
      if (item.value === 'pricing') navigate('/pricing');
      else if (item.value === 'mission') navigate('/mission');
    } else {
      onValueChange(item.value);
    }
  };
  
  return (
    <div className={`w-full sticky top-0 z-50 bg-burgundy-900 ${compact ? 'mb-1 sm:mb-2' : 'mb-6 sm:mb-8'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between ${compact ? 'py-3' : 'py-6'}`}>
          
          {isCoachMode ? (
            // Coach Mode Layout: Hamburger + Wordmark + User Avatar
            <>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white h-8 w-8"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-56 z-[60] border-0 shadow-2xl rounded-xl p-2"
                    style={{
                      background: 'linear-gradient(135deg, hsl(349 67% 25% / 0.98), hsl(349 67% 20% / 0.96), hsl(349 67% 15% / 0.98))',
                      backdropFilter: 'blur(20px)',
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
                          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-none ${
                            isActive 
                              ? 'bg-white/10 text-white font-semibold border-l-4 border-l-white/60' 
                              : 'text-white/85 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
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
            </>
          ) : (
            // Default Layout: Brand + Center Navigation + User
            <>
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <BrandMark 
                    size={compact ? "sm" : "md"}
                    onClick={() => onValueChange('home')}
                    className="hover:opacity-80 transition-opacity"
                  />
                </div>
              </div>

              {/* Center Navigation */}
              <nav aria-label="Primary" className="flex flex-1 justify-center px-8">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                  {navigationItems.map((tab) => (
                    <button
                      key={tab.value}
                      onMouseEnter={() => handleTabHover(tab.value)}
                      onClick={() => handleNavigation(tab)}
                      className={`relative py-2 px-1 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.value
                          ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>
              
              <div className="flex items-center gap-3">
                <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
