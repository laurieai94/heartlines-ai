
import { ReactNode, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { ChatConversation } from "@/hooks/useChatHistory";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
    <div className="h-full flex flex-col max-h-full">
      <div className="flex-1 min-h-0 max-h-full flex">
        {/* Chat Section - Full Width */}
        <div className="flex-1 min-h-0 max-h-full flex flex-col">
          <div className="flex-1 min-h-0 max-h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={handleOpenSidebar} />
            {children}
          </div>
        </div>
      </div>

      {/* Chat History Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="bg-background/10 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 sm:max-w-sm p-0">
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
