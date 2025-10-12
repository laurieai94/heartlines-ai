import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, Home, User as UserIcon, MessageSquare, CreditCard, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignInButton from "./SignInButton";
import type { User } from '@supabase/supabase-js';

interface SimpleHeaderProps {
  user: User | null;
  activeTab: string;
  onSignInClick: () => void;
}

const SimpleHeader = ({ user, activeTab, onSignInClick }: SimpleHeaderProps) => {
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
    else if (item.value === 'account') navigate('/account');
    else if (item.value === 'profile') navigate('/profile');
    else if (item.value === 'insights') navigate('/coach');
    else if (item.value === 'home') navigate('/');
  };
  
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50 bg-burgundy-900 mb-1 sm:mb-2" style={{ transform: 'none', isolation: 'isolate' }}>
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4 sm:px-6 xl:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white h-8 w-8 bg-transparent hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start" 
                className="w-56 p-2 max-w-[calc(100vw-32px)] z-[60] bg-white/15 backdrop-blur-xl border border-white/15 ring-1 ring-white/10 rounded-2xl shadow-2xl"
              >
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.value;
                  return (
                    <button
                      key={item.value}
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
          
          <div className="flex items-center">
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={() => navigate('/profile')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHeader;
