
import { ReactNode, useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatHeader } from './ChatHeader';
import { ChatConversation } from "@/hooks/useChatHistory";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, Home, User as UserIcon, MessageSquare, CreditCard, Settings } from 'lucide-react';

// Lazy load the sidebar for better performance
const ChatHistorySidebar = lazy(() => import('./ChatHistorySidebar').then(m => ({ default: m.ChatHistorySidebar })));

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
  conversations: ChatConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onLoadConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}

export const ChatLayout = ({ 
  children, 
  userName, 
  onNewConversation, 
  onOpenSidebar, 
  conversations,
  currentConversationId,
  loading,
  onLoadConversation,
  onDeleteConversation
}: ChatLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const handleOpenSidebar = () => {
    onOpenSidebar?.();
    setIsSidebarOpen(true);
  };

  const navigationItems = [
    { label: 'Home', icon: Home, onClick: () => navigate('/') },
    { label: 'Profile', icon: UserIcon, onClick: () => navigate('/profile') },
    { label: 'Coach', icon: MessageSquare, onClick: () => navigate('/coach') },
    { label: 'Plans', icon: CreditCard, onClick: () => navigate('/plans') },
    { label: 'My Account', icon: Settings, onClick: () => navigate('/account') },
  ];

  return (
    <div className="h-full md:h-[calc(100%-2rem)] lg:h-[calc(100%-2.5rem)] flex flex-col min-h-0 md:max-h-full bg-burgundy-900 md:bg-transparent px-0 md:px-0 lg:px-8 md:pt-4 lg:pt-6">
      {/* Mobile only: Site navigation bar */}
      <div className="md:hidden fixed top-safe left-0 right-0 z-50 bg-burgundy-900 px-4 h-12 flex items-center border-b border-white/10">
        <button 
          onClick={() => setIsNavOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Open site navigation"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile only: Chat Header below navigation bar */}
      <div className="md:hidden mt-12">
        <ChatHeader 
          userName={userName} 
          onNewConversation={onNewConversation} 
          onOpenSidebar={handleOpenSidebar}
          isMobilePhone={true}
        />
      </div>

      <div className="flex-1 flex md:min-h-0 md:max-h-full">
        {/* Chat Section - Proportional Width */}
        <div className="flex-1 flex flex-col relative mx-auto w-full max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1280px] md:min-h-0 md:max-h-full">
          {/* Gradient frame and ambient glow - desktop only */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral-400/20 via-transparent to-burgundy-400/20 md:rounded-2xl lg:rounded-3xl blur-xl -z-10 hidden md:block"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:rounded-2xl lg:rounded-3xl -z-10 hidden md:block"></div>
          
          <div className="flex-1 flex flex-col bg-burgundy-900 md:min-h-0 md:max-h-full md:bg-white/5 md:backdrop-blur-xl md:rounded-2xl lg:rounded-3xl md:border md:border-white/30 md:shadow-2xl md:shadow-black/30 md:ring-1 md:ring-white/10 md:ring-offset-1 md:ring-offset-burgundy-900/30 md:overflow-hidden relative z-10">
            {/* Desktop: Header outside scroll */}
            <div className="hidden md:block">
              <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={handleOpenSidebar} />
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Site Navigation Popover - Mobile only - matches main site style */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[59] md:hidden"
          onClick={() => setIsNavOpen(false)}
        />
      )}
      <div className={`fixed top-14 left-4 z-[60] md:hidden transition-all duration-200 ${isNavOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="w-16 bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-2xl rounded-xl p-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setIsNavOpen(false);
                }}
                className="w-full flex items-center justify-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-white/90 font-medium hover:bg-white/10 hover:text-white mb-1 last:mb-0"
                aria-label={item.label}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat History Sidebar - Lazy loaded */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="bg-background/10 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 sm:max-w-sm p-0">
          <Suspense fallback={
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
              </div>
            </div>
          }>
            <ChatHistorySidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              loading={loading}
              onNewConversation={() => {
                onNewConversation();
                setIsSidebarOpen(false);
              }}
              onLoadConversation={(id) => {
                onLoadConversation(id);
                setIsSidebarOpen(false);
              }}
              onDeleteConversation={onDeleteConversation}
            />
          </Suspense>
        </SheetContent>
      </Sheet>
    </div>
  );
};
