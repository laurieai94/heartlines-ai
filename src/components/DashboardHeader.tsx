import BrandMark from "./BrandMark";
import SignInButton from "./SignInButton";
import { Button } from "@/components/ui/button";
import { Crown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from '@supabase/supabase-js';
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  
  const tabs = [
    { value: 'home', label: 'Home' },
    { value: 'profile', label: 'Profile' },
    { value: 'insights', label: 'Coach' },
    { value: 'pricing', label: 'Plans', isExternal: true },
    { value: 'mission', label: 'Mission', isExternal: true },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.isExternal) {
      if (tab.value === 'pricing') navigate('/pricing');
      else if (tab.value === 'mission') navigate('/mission');
    } else {
      onValueChange(tab.value);
    }
  };
  
  return (
    <div className="w-full sticky top-0 z-50 bg-burgundy-900 mb-6 sm:mb-8 safe-top">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between ${compact ? 'py-3' : 'py-6'}`}>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <BrandMark 
                size={compact ? "sm" : "md"}
                onClick={() => onValueChange('home')}
                className="hover:opacity-80 transition-opacity"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav aria-label="Primary" className="flex flex-1 justify-center px-8">
              <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab)}
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
          )}
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white h-10 w-10 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-burgundy-900 border-burgundy-800">
                  <nav className="flex flex-col gap-4 mt-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => handleTabClick(tab)}
                        className={`text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.value
                            ? 'text-white bg-white/10'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            
            <SignInButton user={user} onSignInClick={onSignInClick} onOpenProfile={onOpenProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
