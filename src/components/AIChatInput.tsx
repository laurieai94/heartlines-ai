
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    onSendMessage(starter);
    setIsTyping(false);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const showQuickStarters = chatHistory.length === 0;

  return (
    <div className="space-y-8">
      {/* Quick Starters - Prominent when conversation hasn't started */}
      {showQuickStarters && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100 shadow-lg animate-fade-in">
          {!selectedCategory ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-900 mb-2">
                  What's on your mind?
                </h3>
                <p className="text-purple-700 text-lg">
                  Choose a topic to get started, or type your own message below
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(conversationCategories).slice(0, 6).map((category, index) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="lg"
                    onClick={() => handleCategorySelect(category)}
                    className="text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 rounded-2xl px-6 py-4 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-left justify-start h-auto whitespace-normal min-h-[60px]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleCategorySelect("Worry & Insecurity")}
                  className="text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 rounded-2xl px-6 py-4 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-left justify-start h-auto whitespace-normal max-w-md min-h-[60px]"
                  style={{ animationDelay: `0.6s` }}
                >
                  Worry & Insecurity
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleBackToCategories}
                  className="text-purple-600 hover:text-purple-700 p-3 rounded-xl hover:bg-purple-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h3 className="text-xl font-bold text-purple-900">
                  {selectedCategory}
                </h3>
              </div>
              <div className="space-y-3">
                {conversationCategories[selectedCategory].map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    onClick={() => handleQuickStarter(starter)}
                    className="text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 rounded-2xl px-6 py-4 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-left justify-start h-auto whitespace-normal w-full min-h-[60px]"
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-md animate-fade-in">
          <div className="flex items-center gap-3 text-purple-600">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-sm font-medium">Kai is listening...</span>
          </div>
        </div>
      )}

      {/* Main Chat Input - Large and Prominent */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Textarea
              value={currentMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={chatHistory.length === 0 ? "What's going on in your relationship? I'm here to listen..." : "Continue the conversation..."}
              disabled={loading}
              className="border-0 bg-gray-50 rounded-2xl px-6 py-4 text-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 resize-none min-h-[80px] max-h-[200px] leading-relaxed"
              rows={2}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl w-16 h-16 p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
