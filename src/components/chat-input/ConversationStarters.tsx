import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ConversationStartersProps {
  onSelectStarter: (starter: string) => void;
}

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

export const ConversationStarters = ({ onSelectStarter }: ConversationStartersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleQuickStarter = (starter: string) => {
    onSelectStarter(starter);
    setSelectedCategory(null);
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-3 border border-orange-100/50 shadow-lg">
      {!selectedCategory ? (
        <>
          <h3 className="text-xs font-medium text-gray-700 mb-2 leading-relaxed">
            What's on your mind?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {Object.keys(conversationCategories).map((category, index) => (
              <div
                key={index}
                onClick={() => setSelectedCategory(category)}
                className="group cursor-pointer bg-white rounded-lg p-1.5 border border-coral-200/30 hover:border-coral-300 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
              >
                <h4 className="font-medium text-gray-800 text-xs group-hover:text-coral-600 transition-colors">
                  {category}
                </h4>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="p-1.5 hover:bg-coral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>
            <h3 className="text-sm font-medium text-gray-700 leading-relaxed">
              {selectedCategory}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {conversationCategories[selectedCategory].map((starter, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickStarter(starter)}
                className="group text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-coral-50 hover:to-peach-50 rounded-xl px-3 py-2 text-xs text-left justify-start h-auto whitespace-normal transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-coral-200"
              >
                <span className="leading-relaxed">{starter}</span>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};