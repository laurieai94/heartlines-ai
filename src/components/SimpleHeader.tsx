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
import { Home, User as UserIcon, MessageSquare, CreditCard, Settings, LogOut, X } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { useNavigate } from "react-router-dom";
import SignInButton from "./SignInButton";
import type { User } from '@supabase/supabase-js';
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

interface SimpleHeaderProps {
  user: User | null;
  activeTab: string;
  onSignInClick: () => void;
  hideSignInButton?: boolean;
}

const SimpleHeader = ({ user, activeTab, onSignInClick, hideSignInButton = false }: SimpleHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isMobile } = useOptimizedMobile();
  const [navigationOpened, setNavigationOpened] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setNavigationOpened(false);
  };

  // Lock scroll when nav is open on mobile
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
    setNavigationOpened(false);
  };
  
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-burgundy-800 via-burgundy-800 to-burgundy-800 border-b border-coral-400/20 backdrop-blur-xl mb-1 sm:mb-2" style={{ transform: 'none', isolation: 'isolate' }}>
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto pl-4 pr-5 sm:px-6 xl:px-8 py-3">
        
        {/* Navigation - All Screens */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Drawer */}
            <div className="md:hidden">
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
                  className="w-20 bg-burgundy-800/95 backdrop-blur-xl border-r border-coral-400/20 rounded-r-3xl p-0"
                >
                  <nav className="flex flex-col items-center gap-2 py-6 h-full">
                    {/* Flip Phone Icon at Top */}
                    <div className="mb-6">
                      <FlipPhoneIcon className="h-10 w-10 text-white" />
                    </div>
                    <div className="h-px w-12 bg-white/10 mb-4" />

                    {navigationItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.value;
                      
                      return (
                        <button
                          key={item.value}
                          onClick={() => handleNavigation(item)}
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

                    {user && (
                      <>
                        <div className="h-px w-12 bg-white/10 my-2 mt-auto" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center justify-center w-12 h-12 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all duration-200"
                        >
                          <LogOut className="w-6 h-6" strokeWidth={2} />
                        </button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Popover */}
            <div className="hidden md:block">
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
                  <nav className="flex flex-col gap-0.5">
                    {navigationItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.value;
                      return (
                        <button
                          key={item.value}
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
                    
                    {user && (
                      <>
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
                      </>
                    )}
                  </nav>
                </PopoverContent>
              </Popover>
            </div>
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
