import { ReactNode, useState, Suspense, lazy } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatConversation } from "@/hooks/useChatHistory";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

// Lazy load the sidebar for better performance
const ChatHistorySidebar = lazy(() => import('./ChatHistorySidebar').then(m => ({ default: m.ChatHistorySidebar })));

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  conversations: ChatConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onLoadConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  hideHeader?: boolean;
}

export const ChatLayout = ({ 
  children, 
  userName, 
  onNewConversation, 
  onOpenSidebar, 
  isSidebarOpen,
  setIsSidebarOpen,
  conversations,
  currentConversationId,
  loading,
  onLoadConversation,
  onDeleteConversation,
  hideHeader = false
}: ChatLayoutProps) => {
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;

  return (
    <div className="h-full md:h-[calc(100%-2rem)] lg:h-[calc(100%-2.5rem)] flex flex-col min-h-0 md:max-h-full px-0 lg:px-8 md:pt-4 lg:pt-6">
      <div className="flex-1 flex md:min-h-0 md:max-h-full">
        {/* Chat Section - Proportional Width */}
        <div className="flex-1 flex flex-col relative mx-0 md:mx-auto w-full max-w-none md:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1280px] md:min-h-0 md:max-h-full">
          <div 
            data-mobile-chat
            className="fixed left-0 right-0 flex flex-col bg-burgundy-800 md:relative md:flex-1 md:min-h-0 md:rounded-2xl lg:rounded-3xl md:border md:border-white/30 md:shadow-2xl md:shadow-black/30 md:ring-1 md:ring-white/10 md:ring-offset-1 md:ring-offset-burgundy-800/30 z-10 isolation-isolate"
            style={{
              top: isMobilePhone ? '120px' : undefined,
              bottom: isMobilePhone ? 0 : undefined,
              backgroundColor: '#660026'
            }}
          >
            {/* Header - conditionally visible */}
            {!hideHeader && (
              <div className="w-full">
                <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={onOpenSidebar} />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col md:relative md:flex-1 md:min-h-0 md:overflow-hidden">
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
