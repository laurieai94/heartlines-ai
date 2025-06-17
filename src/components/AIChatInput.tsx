
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ArrowLeft } from "lucide-react";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName?: string;
  partnerName?: string;
  chatHistory?: any[];
}

const AIChatInput = ({ onSendMessage, loading, userName, partnerName, chatHistory = [] }: AIChatInputProps) => {
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

  const conversationStarters = [
    "Something feels off between us",
    "I feel disconnected even when we're together", 
    "We keep missing each other somehow",
    "We argue about little things, but it feels bigger than that",
    "I love them deeply, but we've lost our rhythm",
    "I just want to feel close again"
  ];

  const handleQuickStarter = (starter: string) => {
    onSendMessage(starter);
  };

  const showQuickStarters = chatHistory.length === 0;

  return (
    <div className="space-y-6">
      {/* Warm Quick Starters */}
      {showQuickStarters && (
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100/50 shadow-lg">
          <h3 className="text-base font-medium text-gray-700 mb-4 leading-relaxed">
            What's on your mind?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {conversationStarters.slice(0, 3).map((starter, index) => (
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
        </div>
      )}

      {/* Enhanced Chat Input */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Textarea
            value={currentMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={chatHistory.length === 0 ? "Tell me what's happening... I'm here for you" : "Continue the conversation..."}
            disabled={loading}
            className="border-2 border-coral-200/50 focus:border-coral-300 rounded-2xl px-6 py-4 text-base resize-none min-h-[70px] max-h-[140px] focus:ring-2 focus:ring-coral-200/30 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:bg-white leading-relaxed"
            rows={2}
          />
        </div>
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
