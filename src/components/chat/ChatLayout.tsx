
import { ReactNode } from 'react';
import { ChatHeader } from './ChatHeader';

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
}

export const ChatLayout = ({ children, userName, onNewConversation }: ChatLayoutProps) => {
  return (
    <div className="h-[100svh] flex flex-col">
      <div className="flex-1 min-h-0 flex items-stretch justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col min-h-0 max-h-full">
          <div className="flex-1 min-h-0 max-h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <ChatHeader userName={userName} onNewConversation={onNewConversation} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
