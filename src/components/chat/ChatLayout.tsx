
import { ReactNode, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { ChatConversation } from "@/hooks/useChatHistory";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const handleOpenSidebar = () => {
    onOpenSidebar?.();
    setIsSidebarOpen(true);
  };
  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="flex-1 min-h-0 max-h-full flex">
        {/* Chat Section - Full Width */}
        <div className="flex-1 min-h-0 max-h-full flex flex-col">
          <div className={`flex-1 min-h-0 max-h-full flex flex-col ${
            isMobile 
              ? 'bg-transparent border-0 rounded-none shadow-none ring-0' 
              : 'bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5'
          } overflow-visible`}>
            <div className={isMobile ? 'sticky top-0 z-20 bg-burgundy-900/95 backdrop-blur-sm border-b border-white/10' : ''}>
              <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={handleOpenSidebar} />
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Chat History Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent 
          side="left" 
          className={`bg-background/10 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 p-0 ${
            isMobile ? 'w-[85vw]' : 'sm:max-w-sm'
          }`}
        >
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
        </SheetContent>
      </Sheet>
    </div>
  );
};
