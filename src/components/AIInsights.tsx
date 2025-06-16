
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Shield, MessageCircle, Heart, Lightbulb, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AIInsights = () => {
  const [apiKey, setApiKey] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickStarters = [
    "How can I support my partner better?",
    "We keep having the same argument...",
    "I'm feeling anxious about us..."
  ];

  const recentTopics = [
    "Communication patterns",
    "Supporting each other", 
    "Managing stress together"
  ];

  const sendMessage = async () => {
    if (!apiKey) {
      toast.error("Please set your API key first");
      return;
    }

    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage("");
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `As a warm, empathetic relationship coach, respond to: ${userMessage}

Provide guidance that is:
- Supportive and understanding
- Practical and actionable
- Personalized to their situation
- Encouraging yet realistic

Keep your response conversational and caring, like a trusted friend who's also a professional counselor.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.content[0].text,
        timestamp: new Date().toLocaleString()
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Sorry, I couldn't respond right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStarter = (starter) => {
    setCurrentMessage(starter);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Main Chat Interface - 75% */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Relationship Coach (Available 24/7)</h2>
          <p className="text-gray-600">Here to listen, understand, and guide</p>
        </div>

        {/* API Key Setup */}
        {!apiKey && (
          <Card className="p-4 mb-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-coral-600" />
              <h3 className="font-medium text-gray-900">Set up your private coach</h3>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Anthropic API key"
                className="flex-1"
              />
              <Button 
                onClick={() => apiKey && toast.success("Coach ready!")}
                disabled={!apiKey}
                className="bg-coral-500 hover:bg-coral-600"
              >
                Connect
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Get your key from{" "}
              <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-coral-600 hover:underline">
                Anthropic Console
              </a>
            </p>
          </Card>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 p-4 mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatHistory.length === 0 && apiKey && (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-coral-400" />
                  <p>Your relationship coach is here and ready to listen.</p>
                  <p className="text-sm">Share what's on your mind about your relationship.</p>
                </div>
              )}
              
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-coral-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Starters */}
        {chatHistory.length === 0 && apiKey && (
          <div className="mb-4">
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
        )}

        {/* Chat Input */}
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What's on your mind about your relationship?"
            disabled={!apiKey || loading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!apiKey || !currentMessage.trim() || loading}
            className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Minimal Sidebar - 25% */}
      <div className="w-80 space-y-4">
        {/* Status Check */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${apiKey ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <h3 className="font-medium text-gray-900">Your AI Coach Status</h3>
          </div>
          <p className="text-sm text-gray-600">
            {apiKey ? "Ready to chat" : "Complete setup to get started"}
          </p>
        </Card>

        {/* Trust Signal */}
        <Card className="p-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Private & Secure</h3>
          </div>
          <p className="text-sm text-gray-600">
            Your conversations stay between you and your AI coach
          </p>
        </Card>

        {/* Recent Topics */}
        {chatHistory.length > 0 && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-medium text-gray-900 mb-3">We've talked about</h3>
            <div className="space-y-2">
              {recentTopics.slice(0, 3).map((topic, index) => (
                <Badge key={index} variant="outline" className="w-full justify-start border-coral-200 text-coral-700">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {topic}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
