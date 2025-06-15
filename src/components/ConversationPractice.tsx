
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const CONVERSATION_TYPES = [
  { value: "difficult", label: "Difficult Conversation" },
  { value: "conflict", label: "Conflict Resolution" },
  { value: "support", label: "Offering Support" },
  { value: "boundaries", label: "Setting Boundaries" },
  { value: "appreciation", label: "Expressing Appreciation" },
  { value: "needs", label: "Communicating Needs" }
];

const ConversationPractice = () => {
  const [conversationType, setConversationType] = useState("");
  const [scenario, setScenario] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [practiceStarted, setPracticeStarted] = useState(false);

  const startPractice = async () => {
    if (!apiKey) {
      toast.error("Please enter your Anthropic API key in the AI Insights section first");
      return;
    }

    if (!conversationType || !scenario) {
      toast.error("Please select conversation type and describe the scenario");
      return;
    }

    setLoading(true);
    setPracticeStarted(true);

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
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are roleplaying as my partner in a ${conversationType} conversation practice. 

Scenario: ${scenario}

Please respond as my partner would, being realistic but constructive. After your response, provide brief coaching tips in parentheses about how I could improve my approach. Keep responses natural and conversational.

Start the conversation by setting the scene and saying something your partner might say to begin this discussion.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start practice');
      }

      const data = await response.json();
      setConversation([{
        id: Date.now(),
        role: 'partner',
        message: data.content[0].text,
        timestamp: new Date().toLocaleString()
      }]);
    } catch (error) {
      console.error('Error starting practice:', error);
      toast.error("Failed to start practice. Please check your API key.");
      setPracticeStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      message: userMessage,
      timestamp: new Date().toLocaleString()
    };

    setConversation([...conversation, newUserMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      const conversationHistory = [...conversation, newUserMessage]
        .map(msg => `${msg.role === 'user' ? 'Me' : 'Partner'}: ${msg.message}`)
        .join('\n\n');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `Continue this ${conversationType} conversation practice. 

Original scenario: ${scenario}

Conversation so far:
${conversationHistory}

Respond as my partner, then provide coaching feedback in parentheses about communication techniques I used well or could improve.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to continue conversation');
      }

      const data = await response.json();
      setConversation(prev => [...prev, {
        id: Date.now() + 1,
        role: 'partner',
        message: data.content[0].text,
        timestamp: new Date().toLocaleString()
      }]);
    } catch (error) {
      console.error('Error continuing conversation:', error);
      toast.error("Failed to continue conversation");
    } finally {
      setLoading(false);
    }
  };

  const resetPractice = () => {
    setConversation([]);
    setUserMessage("");
    setPracticeStarted(false);
    setConversationType("");
    setScenario("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversation Practice</h2>
        <p className="text-gray-600">Practice difficult conversations with AI guidance before having them in real life</p>
      </div>

      {!practiceStarted ? (
        <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="space-y-6">
            <div>
              <Label htmlFor="conversationType">Conversation Type</Label>
              <Select value={conversationType} onValueChange={setConversationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select conversation type" />
                </SelectTrigger>
                <SelectContent>
                  {CONVERSATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scenario">Scenario Description</Label>
              <Textarea
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Describe the specific situation you want to practice. Include context about your relationship, the issue at hand, and what you hope to achieve from this conversation."
                rows={4}
              />
            </div>

            <Button 
              onClick={startPractice}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
            >
              {loading ? "Starting Practice..." : "Start Practice Session"}
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Practice Session: {CONVERSATION_TYPES.find(t => t.value === conversationType)?.label}</h3>
            <Button variant="outline" onClick={resetPractice}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>

          {/* Conversation History */}
          <Card className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-lg max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {conversation.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">
                        {msg.role === 'user' ? 'You' : 'Partner'}
                      </span>
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Message Input */}
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex gap-4">
              <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your response..."
                rows={3}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                disabled={loading || !userMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConversationPractice;
