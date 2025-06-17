
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
    "I don't feel like myself in this relationship lately",
    "We're close, but I still feel alone sometimes", 
    "I want us to understand each other better",
    "We argue about little things, but it feels bigger than that",
    "I love them deeply, but we've lost our rhythm",
    "I just want to feel close again"
  ];

  const handleQuickStarter = (starter: string) => {
    onSendMessage(starter);
  };

  const showQuickStarters = chatHistory.length === 0;

  return (
    <div className="space-y-4">
      {/* Minimal Quick Starters */}
      {showQuickStarters && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            What's on your mind?
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {conversationStarters.slice(0, 3).map((starter, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickStarter(starter)}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md px-3 py-2 text-sm text-left justify-start h-auto whitespace-normal"
              >
                {starter}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Clean Chat Input */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Textarea
            value={currentMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={chatHistory.length === 0 ? "What's going on? I'm here to listen..." : "Continue the conversation..."}
            disabled={loading}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none min-h-[60px] max-h-[120px] focus:ring-1 focus:ring-purple-300 focus:border-purple-300"
            rows={2}
          />
        </div>
        <Button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || loading}
          className="bg-purple-500 hover:bg-purple-600 rounded-lg w-12 h-12 p-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatInput;
