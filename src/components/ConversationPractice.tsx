import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, RefreshCw, Heart, Lightbulb, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ConversationPracticeProps {
  profiles: {your: any[], partner: any[]};
  demographicsData: {your: any, partner: any};
}

const SCENARIO_STARTERS = [
  { emoji: "💰", title: "Money conversation", description: "bringing up the budget" },
  { emoji: "🏠", title: "Household responsibilities", description: "dishes are piling up again" },
  { emoji: "👨‍👩‍👧‍👦", title: "Family plans", description: "discussing kids/marriage timeline" },
  { emoji: "😰", title: "Support needed", description: "partner seems stressed about work" },
  { emoji: "🎯", title: "Future goals", description: "where do we see this relationship going" },
  { emoji: "🔄", title: "Recurring issue", description: "that thing you always fight about" }
];

const ConversationPractice = ({ profiles, demographicsData }: ConversationPracticeProps) => {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [conversation, setConversation] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [coachingFeedback, setCoachingFeedback] = useState([]);
  const [conversationMetrics, setConversationMetrics] = useState({
    emotionalSafety: "green",
    understanding: "yellow", 
    solutionFocus: "green",
    respectLevel: "green"
  });

  const partnerName = "Alex"; // This would come from profile data
  const partnerStyle = "Gets defensive about money, needs time to process"; // From profile

  const getPartnerResponse = (userMessage, scenario) => {
    const message = userMessage.toLowerCase();
    
    if (scenario.includes("money") || scenario.includes("budget")) {
      if (message.includes("budget") || message.includes("money")) {
        return "I just don't see why we need to change everything all at once. Can't we just keep doing what we're doing?";
      }
      if (message.includes("specific") || message.includes("what")) {
        return "I mean, I pay my share. I don't understand what the problem is exactly.";
      }
      return "Okay, but I really don't want to get into a big thing about this right now.";
    }
    
    if (scenario.includes("household") || scenario.includes("responsibilities")) {
      if (message.includes("dishes") || message.includes("chores")) {
        return "I've been really busy with work. I didn't realize it was bothering you that much.";
      }
      if (message.includes("help") || message.includes("system")) {
        return "Yeah, we can figure something out. What did you have in mind?";
      }
      return "I mean, I do help when I can. I just have different priorities sometimes.";
    }
    
    if (scenario.includes("family") || scenario.includes("future")) {
      if (message.includes("kids") || message.includes("marriage")) {
        return "That's a really big topic. I'm not sure I'm ready to make any big decisions right now.";
      }
      if (message.includes("timeline") || message.includes("when")) {
        return "I need more time to think about all this. Can we not rush into anything?";
      }
      return "I love you, but I just need to feel more stable before we take big steps.";
    }
    
    if (scenario.includes("support") || scenario.includes("stress")) {
      if (message.includes("how are you") || message.includes("feeling")) {
        return "I'm fine, just dealing with some stuff at work. Nothing I can't handle.";
      }
      if (message.includes("help") || message.includes("support")) {
        return "I appreciate it, but I just need some space to figure things out on my own right now.";
      }
      return "It's nothing you need to worry about. I'll be okay.";
    }
    
    // Default responses
    if (message.includes("sorry") || message.includes("understand")) {
      return "I appreciate you saying that. I'm not trying to be difficult.";
    }
    
    return "I hear what you're saying. I just need a minute to think about this.";
  };

  const getCoachingFeedback = (userMessage, partnerResponse) => {
    const feedback = [];
    const message = userMessage.toLowerCase();
    
    if (message.includes("i feel") || message.includes("i'm feeling")) {
      feedback.push({ type: "success", text: "Great use of 'I' statements!" });
    }
    
    if (message.includes("you never") || message.includes("you always")) {
      feedback.push({ type: "warning", text: "Try avoiding 'always' and 'never' - it can trigger defensiveness" });
    }
    
    if (message.includes("how are you") || message.includes("how do you feel")) {
      feedback.push({ type: "success", text: "Excellent! Asking about their feelings shows empathy" });
    }
    
    if (message.includes("we can") || message.includes("let's")) {
      feedback.push({ type: "success", text: "Great collaborative language!" });
    }
    
    if (partnerResponse.includes("defensive") || partnerResponse.includes("big thing")) {
      feedback.push({ type: "tip", text: "They seem overwhelmed - try slowing down and asking what they need" });
    }
    
    if (partnerResponse.includes("space") || partnerResponse.includes("time")) {
      feedback.push({ type: "tip", text: "Remember: Alex needs time to process. Consider suggesting a follow-up conversation" });
    }
    
    return feedback;
  };

  const startPractice = () => {
    if (!selectedScenario && !customScenario) {
      toast.error("Please select a scenario or describe your own");
      return;
    }
    
    setPracticeStarted(true);
    setConversation([]);
    setCoachingFeedback([{
      type: "tip",
      text: `Remember: ${partnerName} ${partnerStyle.toLowerCase()}. Take your time and stay curious about their perspective.`
    }]);
  };

  const sendMessage = () => {
    if (!userMessage.trim()) return;

    const scenario = selectedScenario || customScenario;
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      message: userMessage,
      timestamp: new Date().toLocaleString()
    };

    setConversation(prev => [...prev, newUserMessage]);
    setLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const partnerResponse = getPartnerResponse(userMessage, scenario);
      const feedback = getCoachingFeedback(userMessage, partnerResponse);
      
      const partnerMessage = {
        id: Date.now() + 1,
        type: 'partner',
        message: partnerResponse,
        timestamp: new Date().toLocaleString()
      };

      setConversation(prev => [...prev, partnerMessage]);
      setCoachingFeedback(prev => [...prev, ...feedback]);
      setLoading(false);
    }, 1000 + Math.random() * 1000);

    setUserMessage("");
  };

  const resetPractice = () => {
    setPracticeStarted(false);
    setConversation([]);
    setCoachingFeedback([]);
    setSelectedScenario("");
    setCustomScenario("");
    setUserMessage("");
  };

  if (!practiceStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Difficult Conversations Before They Happen</h2>
          <p className="text-lg text-gray-700 mb-2">Role-play with AI that acts like your partner, while getting real-time coaching</p>
          <p className="text-gray-600">Ever wish you could practice that difficult conversation before having it? Our AI becomes your partner based on their profile, while simultaneously coaching you on communication strategies.</p>
        </div>

        <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Quick Scenario Starters</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SCENARIO_STARTERS.map((scenario, index) => (
                  <Button
                    key={index}
                    variant={selectedScenario === `${scenario.title} - ${scenario.description}` ? "default" : "outline"}
                    onClick={() => setSelectedScenario(`${scenario.title} - ${scenario.description}`)}
                    className="p-4 h-auto text-left justify-start"
                  >
                    <div>
                      <div className="font-medium">{scenario.emoji} {scenario.title}</div>
                      <div className="text-sm opacity-70">{scenario.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="customScenario" className="text-base font-semibold">Custom Scenario</Label>
              <Textarea
                id="customScenario"
                value={customScenario}
                onChange={(e) => {
                  setCustomScenario(e.target.value);
                  setSelectedScenario("");
                }}
                placeholder="Describe the specific situation you want to practice..."
                rows={3}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={startPractice}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 w-full"
            >
              Start Practice Session
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Practice Difficult Conversations Before They Happen</h2>
          <p className="text-gray-600">Role-play with AI that acts like your partner, while getting real-time coaching</p>
        </div>
        <Button variant="outline" onClick={resetPractice}>
          <RefreshCw className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-250px)]">
        {/* Left Side - Partner Simulation (60% on large screens) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Chat Header */}
          <Card className="p-4 bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Practicing with {partnerName}</h3>
              <p className="text-sm text-gray-600"><strong>Scenario:</strong> {selectedScenario || customScenario}</p>
              <p className="text-sm text-gray-600"><strong>{partnerName}'s Style:</strong> {partnerStyle}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>💭</span>
                <span>This is AI simulating {partnerName} based on their profile. Responses may not perfectly match their actual reactions.</span>
              </div>
            </div>
          </Card>

          {/* Conversation */}
          <Card className="flex-1 p-4 bg-white/80 backdrop-blur-md border-0 shadow-lg overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversation.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {msg.type === 'user' ? 'You' : partnerName}
                        </span>
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Message Input */}
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex gap-4">
              <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your response..."
                rows={2}
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

        {/* Right Side - Live Coaching (40% on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Real-time Feedback */}
          <Card className="p-4 bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              How You're Doing
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {coachingFeedback.map((feedback, index) => (
                <div key={index} className={`flex items-start gap-2 p-2 rounded text-sm ${
                  feedback.type === 'success' ? 'bg-green-50 text-green-800' :
                  feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                  feedback.type === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  {feedback.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  {feedback.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  {feedback.type === 'tip' && <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  <span>{feedback.text}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Communication Strategy */}
          <Card className="p-4 bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-semibold mb-3">Keep In Mind</h3>
            <div className="space-y-2 text-sm">
              <div>• {partnerName} shuts down when overwhelmed - go slower</div>
              <div>• Their love language is acts of service - acknowledge what they do</div>
              <div>• They need logical reasons, not just emotional appeals</div>
              <div>• Past sensitivity around money topics - be extra gentle</div>
            </div>
          </Card>

          {/* Conversation Health Check */}
          <Card className="p-4 bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-semibold mb-3">Conversation Health Check</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Emotional Safety:</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Understanding:</span>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Solution Focus:</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Respect Level:</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </Card>

          {/* Suggested Responses */}
          <Card className="p-4 bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-semibold mb-3">Try Saying This</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-red-600 mb-1">Instead of: "You never help with dishes"</div>
                <div className="text-green-600">Try: "I'd love to figure out a system that works for both of us"</div>
              </div>
              <div>
                <div className="text-red-600 mb-1">Instead of: "You're being defensive"</div>
                <div className="text-green-600">Try: "I can see this is hard to talk about. Should we take a break?"</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConversationPractice;
