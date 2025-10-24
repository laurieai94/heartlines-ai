
import { ReactNode, useState, Suspense, lazy } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatConversation } from "@/hooks/useChatHistory";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Heart, Info, Menu, Plus } from "lucide-react";
import { BRAND } from "@/branding";

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
    <div className="h-full md:h-[calc(100%-2rem)] lg:h-[calc(100%-2.5rem)] flex flex-col min-h-0 md:max-h-full bg-transparent px-0 md:px-0 lg:px-8 pt-4 lg:pt-6">
      <div className="flex-1 flex md:min-h-0 md:max-h-full">
        {/* Chat Section - Proportional Width */}
        <div className="flex-1 flex flex-col relative mx-auto w-full max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1280px] md:min-h-0 md:max-h-full">
          {/* Mobile-Only Top Navigation - Appears ABOVE the chat container */}
          <div className="block md:hidden w-full bg-burgundy-800/95 backdrop-blur-sm border-b border-pink-400/10 px-4 py-3 mb-2 rounded-t-2xl">
            <div className="flex items-center justify-between gap-3">
              {/* Kai Avatar & Info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-coral-400 to-burgundy-500">
                  <AvatarImage src={BRAND.coach.avatarSrc} />
                  <AvatarFallback><Heart className="w-5 h-5 text-white" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">{BRAND.coach.name}</h3>
                  <span className="text-white/70 text-xs">your ai relationship coach</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                      <Info className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">About {BRAND.coach.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Your AI relationship coach, here to help you navigate your relationship journey with personalized insights and guidance.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleOpenSidebar} className="h-8 w-8 p-0 text-white hover:bg-white/10">
                  <Menu className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onNewConversation} className="h-8 w-8 p-0 text-white hover:bg-white/10">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Gradient frame and ambient glow - visible on all screens */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral-400/20 via-transparent to-burgundy-400/20 rounded-2xl lg:rounded-3xl blur-xl -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl lg:rounded-3xl -z-10"></div>
          
          <div className="flex-1 flex flex-col min-h-0 max-h-full bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/30 shadow-2xl shadow-black/30 ring-1 ring-white/10 ring-offset-1 ring-offset-burgundy-800/30 overflow-hidden relative z-10">
            {/* Header - hidden on mobile, visible on desktop */}
            <div className="w-full hidden md:block">
              <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={handleOpenSidebar} />
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
