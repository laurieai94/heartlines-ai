
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Heart } from "lucide-react";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName?: string;
  partnerName?: string;
}

const AIChatInput = ({ onSendMessage, loading, userName, partnerName }: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Enhanced Chat Input */}
      <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-xl transition-all duration-300 ${
        isFocused 
          ? 'border-coral-300 shadow-2xl shadow-coral-100/50' 
          : 'border-white/40 shadow-lg'
      }`}>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's on your mind about your relationship?"
              disabled={loading}
              className="border-0 bg-gray-50/70 rounded-xl px-6 py-4 text-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-coral-300 focus:bg-white transition-all duration-300 min-h-[56px]"
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || loading}
            className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 rounded-xl w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-6 h-6" />
            )}
          </Button>
        </div>
        
        {/* Input Helper Text */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Heart className="w-3 h-3 text-coral-400" />
          <span>Kai is here to listen and help you both grow stronger together</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
