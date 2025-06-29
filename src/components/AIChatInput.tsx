
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ArrowLeft } from "lucide-react";
import VoiceInterface from "./VoiceInterface";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName?: string;
  partnerName?: string;
  chatHistory?: any[];
  onSpeakResponse?: (speakFunction: (text: string) => void) => void;
}

const AIChatInput = ({ 
  onSendMessage, 
  loading, 
  userName, 
  partnerName, 
  chatHistory = [],
  onSpeakResponse 
}: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleVoiceMessage = (message: string) => {
    onSendMessage(message);
  };

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
    onSendMessage(starter);
    setSelectedCategory(null);
  };

  const showQuickStarters = chatHistory.length === 0;

  return (
    <div className="space-y-4">
      {/* Conversation Starters - only show if no chat history */}
      {showQuickStarters && (
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border border-orange-100/50 shadow-lg">
          {!selectedCategory ? (
            <>
              <h3 className="text-sm font-medium text-gray-700 mb-3 leading-relaxed">
                What's on your mind?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.keys(conversationCategories).map((category, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className="group cursor-pointer bg-white rounded-xl p-3 border border-coral-200/30 hover:border-coral-300 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                  >
                    <h4 className="font-medium text-gray-800 text-sm group-hover:text-coral-600 transition-colors">
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
                  className="p-2 hover:bg-coral-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-base font-medium text-gray-700 leading-relaxed">
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
                    className="group text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-coral-50 hover:to-peach-50 rounded-xl px-4 py-3 text-sm text-left justify-start h-auto whitespace-normal transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-coral-200"
                  >
                    <span className="leading-relaxed">{starter}</span>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Input area - ChatGPT style */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Textarea
            value={currentMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={chatHistory.length === 0 ? "Tell me what's happening... I'm here for you" : "Continue the conversation..."}
            disabled={loading}
            className="border-2 border-coral-200/50 focus:border-coral-300 rounded-2xl px-5 py-4 text-base resize-none min-h-[60px] max-h-[120px] focus:ring-2 focus:ring-coral-200/30 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:bg-white leading-relaxed"
            rows={1}
          />
        </div>
        
        {/* Voice Interface */}
        <VoiceInterface
          onVoiceMessage={handleVoiceMessage}
          onSpeakResponse={onSpeakResponse}
          disabled={loading}
        />
        
        <Button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || loading}
          className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 rounded-2xl w-14 h-14 p-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatInput;
