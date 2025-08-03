
import { ReactNode } from 'react';
import { ChatHeader } from './ChatHeader';
import AISidebar from '../AISidebar';
import { ProfileData, DemographicsData } from "@/types/AIInsights";

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
}

export const ChatLayout = ({ 
  children, 
  userName, 
  onNewConversation, 
  onOpenSidebar, 
  profiles, 
  demographicsData, 
  chatHistory, 
  isConfigured, 
  onSupabaseConfigured 
}: ChatLayoutProps) => {
  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="flex-1 min-h-0 max-h-full flex gap-4">
        {/* Chat Section - Left Side */}
        <div className="flex-1 min-h-0 max-h-full flex flex-col">
          <div className="flex-1 min-h-0 max-h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={onOpenSidebar} />
            {children}
          </div>
        </div>
        
        {/* Sidebar Section - Right Side */}
        <div className="w-72 flex-shrink-0">
          <div className="p-4">
            <AISidebar
              profiles={profiles}
              demographicsData={demographicsData}
              chatHistory={chatHistory}
              isConfigured={isConfigured}
              onSupabaseConfigured={onSupabaseConfigured}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
