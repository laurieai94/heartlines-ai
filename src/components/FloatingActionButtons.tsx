import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Plus, ArrowUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface FloatingActionButtonsProps {
  onOpenSidebar?: () => void;
  onNewConversation: () => void;
  showScrollToTop: boolean;
  onScrollToTop: () => void;
}

export const FloatingActionButtons = ({ 
  onOpenSidebar, 
  onNewConversation, 
  showScrollToTop, 
  onScrollToTop 
}: FloatingActionButtonsProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-[env(safe-area-inset-bottom)] left-0 right-0 z-50 pointer-events-none">
      <div className="relative w-full h-20 px-4 pb-4">
        {/* Left side - Hamburger menu */}
        {onOpenSidebar && (
          <Button
            onClick={onOpenSidebar}
            className="absolute bottom-0 left-4 w-14 h-14 rounded-full bg-burgundy-900/90 backdrop-blur-sm border border-white/20 shadow-2xl hover:bg-burgundy-800/90 transition-all duration-200 pointer-events-auto group"
            size="icon"
          >
            <Menu className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          </Button>
        )}

        {/* Center - Scroll to top (when visible) */}
        {showScrollToTop && (
          <Button
            onClick={onScrollToTop}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-burgundy-800/80 backdrop-blur-sm border border-white/15 shadow-lg hover:bg-burgundy-700/80 transition-all duration-200 pointer-events-auto group"
            size="icon"
          >
            <ArrowUp className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
          </Button>
        )}

        {/* Right side - New conversation */}
        <Button
          onClick={onNewConversation}
          className="absolute bottom-0 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-coral-500 to-pink-600 shadow-2xl hover:from-coral-400 hover:to-pink-500 transition-all duration-200 pointer-events-auto group border border-white/20"
          size="icon"
        >
          <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );
};