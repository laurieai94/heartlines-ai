import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ConversationStartersProps {
  onStarterSelect: (starter: string) => void;
}

const ConversationStarters = ({ onStarterSelect }: ConversationStartersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    <div className="animate-fade-in">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
        {!selectedCategory ? (
          <>
            <h3 className="text-lg font-medium text-white mb-4 text-center">
              What's on your mind?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(conversationCategories).map((category, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className="group cursor-pointer bg-white/10 hover:bg-white/20 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <h4 className="font-medium text-white text-sm group-hover:text-white/90 transition-colors text-center">
                    {category}
                  </h4>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-lg font-medium text-white">
                {selectedCategory}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {conversationCategories[selectedCategory].map((starter, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleQuickStarter(starter)}
                  className="group text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-4 py-3 text-sm text-left justify-start h-auto whitespace-normal transition-all duration-300 hover:shadow-md hover:scale-[1.01] border border-transparent hover:border-white/20"
                >
                  <span className="leading-relaxed">{starter}</span>
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