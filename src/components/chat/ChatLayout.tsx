
import { ReactNode, useState, Suspense, lazy } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatConversation } from "@/hooks/useChatHistory";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpenSidebar = () => {
    onOpenSidebar?.();
    setIsSidebarOpen(true);
  };
  return (
    <div className="h-full md:h-[calc(100%-2rem)] lg:h-[calc(100%-2.5rem)] flex flex-col min-h-0 md:max-h-full bg-burgundy-900 md:bg-transparent px-0 md:px-0 lg:px-8 md:pt-4 lg:pt-6">
      <div className="flex-1 flex md:min-h-0 md:max-h-full">
        {/* Chat Section - Proportional Width */}
        <div className="flex-1 flex flex-col relative mx-auto w-full max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1280px] md:min-h-0 md:max-h-full">
          {/* Gradient frame and ambient glow - desktop only */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral-400/20 via-transparent to-burgundy-400/20 md:rounded-2xl lg:rounded-3xl blur-xl -z-10 hidden md:block"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:rounded-2xl lg:rounded-3xl -z-10 hidden md:block"></div>
          
          <div className="flex-1 flex flex-col bg-burgundy-900 md:min-h-0 md:max-h-full md:bg-white/5 md:backdrop-blur-xl md:rounded-2xl lg:rounded-3xl md:border md:border-white/30 md:shadow-2xl md:shadow-black/30 md:ring-1 md:ring-white/10 md:ring-offset-1 md:ring-offset-burgundy-900/30 md:overflow-hidden relative z-10">
            {/* Mobile: Header with navigation */}
            <div className="md:hidden">
              <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={handleOpenSidebar} onOpenMenu={handleOpenSidebar} isMobilePhone={true} />
            </div>
            
            {/* Desktop: Header outside scroll */}
            <div className="hidden md:block">
              <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={handleOpenSidebar} onOpenMenu={handleOpenSidebar} />
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              {children}
            </div>
          </div>
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
