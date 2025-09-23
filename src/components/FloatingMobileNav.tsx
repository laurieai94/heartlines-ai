import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageSquare, User, Heart, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingMobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
  partnerName?: string;
}

export const FloatingMobileNav = ({ currentTab, onTabChange, userName, partnerName }: FloatingMobileNavProps) => {
  const [showButton, setShowButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      // Show button after scrolling 50px down
      if (scrollY > 50) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Listen to scroll events on window and document
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isMobile]);

  if (!isMobile || !showButton) return null;

  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'insights', label: 'Coach', icon: Heart },
    { id: 'profile', label: userName || 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="h-12 w-12 rounded-full shadow-lg bg-primary/90 hover:bg-primary backdrop-blur-sm border border-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto">
          <div className="py-6">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "outline"}
                    className="h-16 flex-col gap-2 text-xs"
                    onClick={() => handleTabSelect(item.id)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
            
            {partnerName && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('dashboard:openPartnerQuestionnaire'));
                    setIsOpen(false);
                  }}
                >
                  <Heart className="h-4 w-4" />
                  {partnerName}'s Profile
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};