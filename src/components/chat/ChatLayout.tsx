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
    <div className="h-full flex flex-col min-h-0 px-0 lg:px-8" style={{ background: isMobilePhone ? '#58151A' : undefined }}>
      <div className="flex-1 flex md:min-h-0 md:max-h-full">
        {/* Chat Section - Proportional Width */}
        <div className="flex-1 flex flex-col relative mx-0 md:mx-auto w-full max-w-none md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl md:min-h-0 md:max-h-full">
          <div 
            data-mobile-chat
            className="flex flex-col bg-burgundy-800 md:relative md:flex-1 md:min-h-0 md:bg-gradient-to-b md:from-burgundy-900/30 md:to-burgundy-800/20 md:rounded-2xl lg:rounded-3xl md:border md:border-white/30 md:shadow-2xl md:shadow-black/30 md:ring-1 md:ring-white/10 md:ring-offset-1 md:ring-offset-burgundy-800/30 z-10 isolation-isolate"
            style={{
              marginTop: isMobilePhone ? '80px' : undefined,
              height: isMobilePhone ? 'calc(100dvh - 80px)' : undefined,
              maxHeight: isMobilePhone ? 'calc(100dvh - 80px)' : undefined
            }}
          >
            {/* Header - conditionally visible */}
            {!hideHeader && (
              <div className="w-full">
                <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={onOpenSidebar} />
              </div>
            )}
            <div className={`flex flex-col md:relative md:flex-1 md:min-h-0 lg:overflow-hidden ${hideHeader ? 'absolute inset-0' : 'absolute left-0 right-0 bottom-0 top-[80px] md:top-0'}`}>
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
