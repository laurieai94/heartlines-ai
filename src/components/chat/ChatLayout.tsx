
import { ReactNode, useEffect, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { Card } from "@/components/ui/card";
import { Heart, Lightbulb } from "lucide-react";

interface ChatLayoutProps {
  children: ReactNode;
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
}

const UnintuitiveSidebar = () => {
  const [showWeirdCards, setShowWeirdCards] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(0.7);
  const [kaiCardVisible, setKaiCardVisible] = useState(true);
  const [safeSpaceClicked, setSafeSpaceClicked] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowWeirdCards(true), Math.random() * 3000 + 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCardOpacity(Math.random() * 0.5 + 0.3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKaiCardClick = () => {
    setKaiCardVisible(!kaiCardVisible);
    setTimeout(() => setKaiCardVisible(true), 1500);
  };

  const handleSafeSpaceHover = () => {
    setSafeSpaceClicked(prev => prev + 1);
  };

  return (
    <div className="w-64 space-y-4 relative">
      {showWeirdCards && kaiCardVisible && (
        <Card 
          onClick={handleKaiCardClick}
          className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm animate-pulse cursor-pointer transform hover:rotate-1 transition-transform"
          style={{ 
            opacity: cardOpacity,
            transform: `translateX(${Math.sin(Date.now() / 1000) * 3}px) rotate(${safeSpaceClicked % 2 === 0 ? '2deg' : '-1deg'})`
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-spin">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white flex items-center gap-1">
                <Lightbulb className="w-2 h-2 text-orange-300" />
                Meet Kai
              </h3>
            </div>
          </div>
          <p className="text-xs text-pink-200/60 leading-relaxed">
            Click me and I'll disappear! Your AI relationship coach, trained on 15+ years of PhD-level clinical psychology.
          </p>
        </Card>
      )}

      {showWeirdCards && (
        <Card 
          onMouseEnter={handleSafeSpaceHover}
          className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm transition-all duration-300 hover:scale-110 cursor-help"
          style={{ 
            opacity: cardOpacity * 0.8,
            transform: `translateY(${safeSpaceClicked * 2}px) scale(${0.8 + (safeSpaceClicked % 3) * 0.1})`
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Heart className="w-2 h-2 text-orange-300 animate-bounce" />
            <h3 className="text-xs font-medium text-white">Safe Space</h3>
          </div>
          <div className="text-xs text-pink-200/60 space-y-0.5">
            <p>• Hover me: {safeSpaceClicked}</p>
            <p>• Feelings valid</p>
            <p>• Messy normal</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export const ChatLayout = ({ children, userName, onNewConversation, onOpenSidebar }: ChatLayoutProps) => {
  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="flex-1 min-h-0 max-h-full flex items-stretch justify-center">
        <div className="flex flex-1 gap-4 min-h-0 max-h-full">
          <div className="flex-1 flex flex-col min-h-0 max-h-full">
            <div className="flex-1 min-h-0 max-h-full flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
              <ChatHeader userName={userName} onNewConversation={onNewConversation} onOpenSidebar={onOpenSidebar} />
              {children}
            </div>
          </div>
          <UnintuitiveSidebar />
        </div>
      </div>
    </div>
  );
};
