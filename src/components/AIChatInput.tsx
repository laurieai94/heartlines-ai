
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName?: string;
  partnerName?: string;
  chatHistory?: any[]; // Add chat history to track if conversation has started
}

const AIChatInput = ({ onSendMessage, loading, userName, partnerName, chatHistory = [] }: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const conversationCategories = {
    "Distance & Disconnection": [
      "I don't feel like myself in this relationship lately",
      "We're close, but I still feel alone sometimes",
      "I crave deeper connection, not just routine"
    ],
    "Stuckness & Repetition": [
      "We're caught in the same loop, and I don't know how to break it",
      "I don't know if we're growing together or growing apart"
    ],
    "Love & Effort": [
      "I love them deeply, but we've lost our rhythm",
      "I'm showing up, but I don't know if it's landing"
    ],
    "Conflict & Communication": [
      "We argue about little things, but it feels bigger than that",
      "I want to talk without it turning into a fight"
    ],
    "Unspoken Needs": [
      "I don't feel fully seen or heard",
      "I'm scared to ask for what I really need"
    ],
    "Hopeful & Curious": [
      "I want us to understand each other better",
      "We're good… but I know we could be great",
      "I just want to feel close again"
    ],
    "Worry & Insecurity": [
      "I feel like I'm the only one trying",
      "I'm worried I'm not enough for them"
    ]
  };

  const handleQuickStarter = (starter: string) => {
    // Immediately send the message instead of just setting it in the input
    onSendMessage(starter);
    setIsTyping(false);
    setSelectedCategory(null); // Reset category selection after sending
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Only show conversation starters if there are no messages in chat history
  const showQuickStarters = chatHistory.length === 0;

  return (
    <div className="space-y-4">
      {/* Quick Starters - only show when conversation hasn't started */}
      {showQuickStarters && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg animate-fade-in">
          {!selectedCategory ? (
            // Show categories
            <div className="space-y-3">
              <h3 className="text-center text-sm font-medium text-purple-700 mb-3">
                What's on your mind?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(conversationCategories).slice(0, 6).map((category, index) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                    className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-102 hover:shadow-md text-left justify-start h-auto whitespace-normal"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              {/* Center the last category */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategorySelect("Worry & Insecurity")}
                  className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-102 hover:shadow-md text-left justify-start h-auto whitespace-normal max-w-md"
                  style={{ animationDelay: `0.6s` }}
                >
                  Worry & Insecurity
                </Button>
              </div>
            </div>
          ) : (
            // Show conversation starters for selected category
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCategories}
                  className="text-purple-600 hover:text-purple-700 p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-sm font-medium text-purple-700">
                  {selectedCategory}
                </h3>
              </div>
              <div className="space-y-2">
                {conversationCategories[selectedCategory].map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickStarter(starter)}
                    className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-102 hover:shadow-md text-left justify-start h-auto whitespace-normal w-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {starter}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && !loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-md animate-fade-in">
          <div className="flex items-center gap-2 text-purple-600">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-sm font-medium">Kai is listening...</span>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
        <div className="space-y-2">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={currentMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what's going on."
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
          <p className="text-xs text-gray-500 px-2">
            Say as much or as little as you want
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
