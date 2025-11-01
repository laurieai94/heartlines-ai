import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

interface ConversationStartersProps {
  onStarterSelect: (starter: string) => void;
}

const ConversationStarters = ({ onStarterSelect }: ConversationStartersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isMobile } = useOptimizedMobile();

  const conversationCategories = {
    "Conflict & Repeating Patterns": [
      "We keep having the same fight",
      "Why do small things turn into big fights?",
      "It's hard to talk without it turning into an argument",
      "We're stuck in the same cycle"
    ],
    "Disconnection & Distance": [
      "I feel disconnected lately",
      "We're not on the same page",
      "I miss how we used to be",
      "Are we growing apart?"
    ],
    "Hard-to-Say Feelings": [
      "I don't know how to say this…",
      "I'm scared to be honest",
      "I don't feel heard",
      "How do I bring up a difficult topic?"
    ],
    "Growth & Understanding": [
      "I want us to understand each other better",
      "How can we communicate more clearly?",
      "What are we not saying out loud?",
      "Can we try to reset things?"
    ],
    "Intimacy & Closeness": [
      "I want to feel closer to you",
      "I miss being emotionally connected",
      "When did we stop being affectionate?",
      "How do we bring the spark back?"
    ],
    "Partnership & Fairness": [
      "I feel like I carry more of the emotional load",
      "Do you feel like we're a team?",
      "I need more support, but I don't know how to ask",
      "Are we both putting in the same effort?"
    ]
  };

  const handleQuickStarter = (starter: string) => {
    onStarterSelect(starter);
    setSelectedCategory(null);
  };

  return (
    <div className="animate-fade-in pointer-events-none">
      <div className={`bg-gradient-to-br from-burgundy-800/50 via-pink-900/30 to-coral-900/25 rounded-2xl border border-pink-400/20 px-4 py-3 shadow-lg shadow-pink-500/5 pointer-events-auto ${
        !isMobile ? 'backdrop-blur-lg' : ''
      }`}>
        {!selectedCategory ? (
          <>
            <h3 className="text-sm font-normal bg-gradient-to-r from-pink-200 via-coral-100 to-orange-100 bg-clip-text text-transparent mb-2 text-center">
              What's on your mind?
            </h3>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-2'}`}>
              {Object.keys(conversationCategories).map((category, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`group cursor-pointer bg-gradient-to-br backdrop-blur-sm rounded-lg border shadow-sm transition-all ${
                    isMobile
                      ? 'from-white/10 via-pink-500/5 to-coral-400/5 p-4 min-h-[56px] border-pink-400/15 active:scale-[0.98] active:from-pink-400/20 active:via-coral-400/20 active:to-orange-400/20 duration-150'
                      : 'from-white/8 via-pink-500/5 to-coral-400/5 p-2 border-pink-400/15 hover:bg-gradient-to-br hover:from-pink-400/15 hover:via-coral-400/15 hover:to-orange-400/15 hover:border-gradient-to-r hover:from-pink-400/40 hover:via-coral-400/40 hover:to-orange-400/40 duration-200'
                  }`}
                >
                  <h4 className={`font-medium text-white text-center leading-tight transition-all ${
                    isMobile
                      ? 'text-sm'
                      : 'text-xs group-hover:bg-gradient-to-r group-hover:from-pink-100 group-hover:via-coral-50 group-hover:to-orange-100 group-hover:bg-clip-text group-hover:text-transparent duration-200'
                  }`}>
                    {category}
                  </h4>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-lg transition-colors text-white ${
                  isMobile
                    ? 'p-2 min-w-[44px] min-h-[44px] active:scale-95 active:bg-coral-500/25 hover:text-white'
                    : 'p-1 hover:bg-gradient-to-r hover:from-coral-500/20 hover:to-pink-500/20 hover:text-white'
                }`}
              >
                <ArrowLeft className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
              </Button>
              <h3 className="text-sm font-medium bg-gradient-to-r from-pink-200 to-coral-200 bg-clip-text text-transparent">
                {selectedCategory}
              </h3>
            </div>
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'gap-1'}`}>
              {conversationCategories[selectedCategory].map((starter, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleQuickStarter(starter)}
                  className={`group text-left justify-start h-auto whitespace-normal rounded-lg transition-all ${
                    isMobile
                      ? 'text-white/90 bg-white/5 px-4 py-3 min-h-[56px] text-sm border-2 border-white/10 active:scale-[0.98] active:bg-white/10 active:border-white/20 duration-150'
                      : 'text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-coral-400/15 hover:via-pink-400/15 hover:to-orange-400/12 px-2 py-1 text-xs border-0 md:border md:border-transparent hover:border-coral-400/35 duration-200'
                  }`}
                >
                  <span className="leading-tight">{starter}</span>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationStarters;