
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
    "How can I support my partner better?",
    "We keep having the same argument...",
    "I'm feeling anxious about us..."
  ];

  const handleQuickStarter = (starter: string) => {
    setCurrentMessage(starter);
  };

  return (
    <div className="space-y-4">
      {/* Quick Starters */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Start with something that's actually on your mind:</p>
        <div className="flex gap-2 flex-wrap">
          {quickStarters.map((starter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickStarter(starter)}
              className="text-coral-700 border-coral-200 hover:bg-coral-50 hover:text-coral-800"
            >
              {starter}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={userName && partnerName ? 
            `What's actually happening with you and ${partnerName}?` :
            "What's going on in your relationship that you want to talk through?"
          }
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || loading}
          className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatInput;
