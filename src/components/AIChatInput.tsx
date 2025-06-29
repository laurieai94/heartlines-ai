
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
    <div className="space-y-3">
      {/* Compact Category Selection - Only show when no chat history */}
      {showQuickStarters && (
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          {!selectedCategory ? (
            <>
              <h3 className="text-xs font-medium text-gray-700 mb-2">
                What's on your mind?
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(conversationCategories).map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className="text-left p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-xs font-medium text-gray-800">{category}</span>
                  </button>
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
                  className="p-1 h-6 w-6"
                >
                  <ArrowLeft className="w-3 h-3" />
                </Button>
                <h3 className="text-xs font-medium text-gray-700">
                  {selectedCategory}
                </h3>
              </div>
              <div className="space-y-1">
                {conversationCategories[selectedCategory].map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickStarter(starter)}
                    className="w-full text-left p-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Input Area - ChatGPT style */}
      <div className="relative">
        <div className="flex items-end gap-2 p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:border-purple-400 focus-within:shadow-md transition-all">
          <Textarea
            value={currentMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={chatHistory.length === 0 ? "Tell me what's happening... I'm here for you" : "Message Kai..."}
            disabled={loading}
            className="flex-1 border-0 p-0 resize-none min-h-[20px] max-h-[120px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed"
            rows={1}
          />
          
          <div className="flex items-center gap-1">
            <VoiceInterface
              onVoiceMessage={handleVoiceMessage}
              onSpeakResponse={onSpeakResponse}
              disabled={loading}
            />
            
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || loading}
              size="sm"
              className="h-8 w-8 p-0 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
