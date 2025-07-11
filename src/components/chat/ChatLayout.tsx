
import { ReactNode } from 'react';
import { ChatHeader } from './ChatHeader';

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
}

export const ChatLayout = ({ children, userName, onNewConversation }: ChatLayoutProps) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-red-900 via-rose-900 to-pink-900">
      <div className="flex-1 min-h-0 flex items-stretch justify-center p-3">
        <div className="w-full max-w-3xl flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <ChatHeader userName={userName} onNewConversation={onNewConversation} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
