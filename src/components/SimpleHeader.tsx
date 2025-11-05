import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Home, User as UserIcon, MessageSquare, CreditCard, Settings } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { useNavigate } from "react-router-dom";
import SignInButton from "./SignInButton";
import type { User } from '@supabase/supabase-js';

interface SimpleHeaderProps {
  user: User | null;
  activeTab: string;
  onSignInClick: () => void;
  hideSignInButton?: boolean;
}

const SimpleHeader = ({ user, activeTab, onSignInClick, hideSignInButton = false }: SimpleHeaderProps) => {
  const navigate = useNavigate();

  const navigationItems = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'profile', label: 'Profile', icon: UserIcon },
    { value: 'insights', label: 'Coach', icon: MessageSquare },
    { value: 'plans', label: 'Plans', icon: CreditCard },
    { value: 'account', label: 'My Account', icon: Settings },
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
          <div className="flex items-center gap-3">
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
                className="w-16 p-2 z-[60] bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl"
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
