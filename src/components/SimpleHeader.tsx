import { useState } from "react";
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
import { Home, User as UserIcon, MessageSquare, CreditCard, Settings, LogOut } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { useNavigate } from "react-router-dom";
import SignInButton from "./SignInButton";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from '@supabase/supabase-js';

interface SimpleHeaderProps {
  user: User | null;
  activeTab: string;
  onSignInClick: () => void;
  hideSignInButton?: boolean;
}

const SimpleHeader = ({ user, activeTab, onSignInClick, hideSignInButton = false }: SimpleHeaderProps) => {
  const navigate = useNavigate();
  const [navigationOpened, setNavigationOpened] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setNavigationOpened(false);
  };

  const navigationItems = [
    { value: 'home', label: 'home', icon: Home },
    { value: 'profile', label: 'profile', icon: UserIcon },
    { value: 'insights', label: 'coach', icon: MessageSquare },
    { value: 'plans', label: 'plans', icon: CreditCard },
    { value: 'account', label: 'account', icon: Settings },
  ];

  const handleNavigation = (item: any) => {
    if (item.value === 'plans') navigate('/plans');
    else if (item.value === 'account') {
      if (!user) {
        navigate('/signin');
      } else {
        navigate('/account');
      }
    }
    else if (item.value === 'profile') navigate('/profile');
    else if (item.value === 'insights') navigate('/coach');
    else if (item.value === 'home') navigate('/');
  };
  
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-burgundy-800 via-burgundy-800 to-burgundy-800 border-b border-coral-400/20 backdrop-blur-xl mb-1 sm:mb-2" style={{ transform: 'none', isolation: 'isolate' }}>
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto pl-4 pr-5 sm:px-6 xl:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Navigation - Sheet Drawer */}
          <div className="flex items-center gap-3 md:hidden">
            <Sheet open={navigationOpened} onOpenChange={setNavigationOpened}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                >
                  <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left"
                hideClose={true}
                className="w-[260px] bg-gradient-to-br from-burgundy-900/75 to-burgundy-800/75 backdrop-blur-2xl border-r border-coral-400/10 shadow-2xl p-0"
              >
                <nav className="flex flex-col gap-0.5 pt-3 px-3 pb-3">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => {
                          handleNavigation(item);
                          setNavigationOpened(false);
                        }}
                        className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer touch-manipulation transition-all duration-200 active:scale-98 ${
                          isActive 
                            ? 'text-white bg-white/20 shadow-lg' 
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                        style={{ 
                          minHeight: '48px',
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation'
                        }}
                      >
                        <IconComponent className="h-6 w-6 flex-shrink-0" strokeWidth={2} />
                        <span className="text-base font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                  
                  <div className="h-px bg-white/10 my-1" />
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer touch-manipulation transition-all duration-200 active:scale-98 text-rose-300 hover:text-white hover:bg-rose-500/20"
                    style={{ 
                      minHeight: '48px',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <LogOut className="h-6 w-6 flex-shrink-0" strokeWidth={2} />
                    <span className="text-base font-medium">sign out</span>
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop/Tablet Navigation - Popover */}
          <div className="hidden md:flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white"
                >
                  <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                sideOffset={8}
                className="w-16 p-2 z-[60] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl"
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleNavigation(item)}
                      title={item.label}
                      className={`w-full flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'text-white bg-white/15' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconComponent className="h-6 w-6" strokeWidth={2} />
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center">
            {!hideSignInButton && (
              <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={() => navigate('/profile')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHeader;
