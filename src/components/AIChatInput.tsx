
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName?: string;
  partnerName?: string;
}

const AIChatInput = ({ onSendMessage, loading, userName, partnerName }: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

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

  const quickStarters = [
    "We keep having the same fight",
    "I feel disconnected lately",
    "How do I bring up a difficult topic?"
  ];

  const handleQuickStarter = (starter: string) => {
    setCurrentMessage(starter);
  };

  return (
    <div className="space-y-4">
      {/* Quick Starters - Only show when no conversation started */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
        <div className="flex gap-2 flex-wrap justify-center">
          {quickStarters.map((starter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickStarter(starter)}
              className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              {starter}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's happening in your relationship..."
              disabled={loading}
              className="border-0 bg-gray-50/50 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200"
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
