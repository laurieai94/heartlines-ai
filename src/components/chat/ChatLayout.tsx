
import { ReactNode } from 'react';
import { ChatHeader } from './ChatHeader';

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
}

export const ChatLayout = ({ children, userName, onNewConversation, onOpenSidebar }: ChatLayoutProps) => {
  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="flex-1 min-h-0 max-h-full flex items-stretch justify-center">
        <div className="w-full flex flex-col min-h-0 max-h-full">
          <div className="flex-1 min-h-0 max-h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={onOpenSidebar} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
