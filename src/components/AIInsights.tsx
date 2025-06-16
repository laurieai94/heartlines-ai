
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Send,
  Lock,
  Clock,
  Heart,
  Brain,
  Users,
  Lightbulb,
  ArrowRight,
  Star
} from "lucide-react";

const AIInsights = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock profile completion status - this would come from actual state
  const profilesComplete = { your: true, partner: false }; // You can change this to test different states

  const getStatusInfo = () => {
    if (profilesComplete.your && profilesComplete.partner) {
      return {
        status: "complete",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        title: "Ready to chat - Your AI knows you both",
        description: "Get personalized insights about your relationship dynamics",
        primaryCTA: "Start Your First Conversation",
        secondaryCTA: null,
        badgeColor: "text-green-500 bg-green-50 border-green-200"
      };
    } else if (profilesComplete.your && !profilesComplete.partner) {
      return {
        status: "partial",
        icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
        title: "AI knows you, but not your partner yet",
        description: "Add your partner's profile for relationship insights, or chat about personal growth and self-awareness",
        primaryCTA: "Chat About Yourself",
        secondaryCTA: "Add Partner Profile First",
        badgeColor: "text-blue-500 bg-blue-50 border-blue-200"
      };
    } else {
      return {
        status: "incomplete",
        icon: <Clock className="w-5 h-5 text-gray-500" />,
        title: "Complete your profile first",
        description: "The AI needs to understand you before it can give personalized insights",
        primaryCTA: "Build Your Profile First",
        secondaryCTA: null,
        badgeColor: "text-gray-500 bg-gray-100 border-gray-200"
      };
    }
  };

  const statusInfo = getStatusInfo();

  const quickStartQuestions = [
    "How can I better support my partner when they're stressed?",
    "We keep fighting about the same things. How do we break this cycle?",
    "I'm feeling anxious about our relationship. Is this normal?",
    "How do I bring up difficult topics without starting a fight?"
  ];

  const realQuestions = [
    {
      title: "Communication Crisis",
      question: "We've been together 3 years but still can't fight without it becoming a screaming match. How do people argue without destroying each other?"
    },
    {
      title: "Life Transition",
      question: "I just got job offer across the country. My partner is supportive but I can tell they're scared. How do we make this decision together?"
    },
    {
      title: "Intimacy Issues",
      question: "Our sex life has been basically non-existent since we had the baby. We're both exhausted but I miss that connection. How do we get back to each other?"
    },
    {
      title: "Family Drama",
      question: "My partner's family is toxic and they don't see it. Every holiday becomes a nightmare. How do I support them without losing my mind?"
    }
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = "I understand you're dealing with a challenging situation. Based on what you've shared in your profile about your communication style and relationship patterns, let me offer some personalized insights...";
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuestionClick = (question: string) => {
    setMessage(question);
    if (!showChat) {
      setShowChat(true);
    }
  };

  if (showChat) {
    return (
      <div className="space-y-6">
        {/* Chat Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Relationship Chat</h1>
            <p className="text-gray-600">Your personal relationship intelligence companion</p>
          </div>
          <Button variant="outline" onClick={() => setShowChat(false)}>
            Back to Insights
          </Button>
        </div>

        {/* Chat Interface */}
        <Card className="h-96 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="font-medium">RealTalk AI</span>
              <Badge variant="outline" className="ml-auto">Online</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation about your relationship</p>
                <p className="text-sm">Ask anything - I know your situation and I'm here to help</p>
              </div>
            )}
            
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your relationship question..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Start Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Start Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {quickStartQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleQuestionClick(question)}
                >
                  "{question}"
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Your Relationship Coach (Available 24/7)</h2>
        <p className="text-gray-500">
          Get insights from AI that actually knows you, your partner, and your unique situation.
        </p>
      </div>

      {/* Current Status Card */}
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Relationship Assistant</h3>
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className={statusInfo.badgeColor}>
              {statusInfo.icon}
              {statusInfo.title}
            </Badge>
            <p className="text-gray-600 text-sm">{statusInfo.description}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              onClick={() => statusInfo.status !== 'incomplete' ? setShowChat(true) : null}
              disabled={statusInfo.status === 'incomplete'}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {statusInfo.primaryCTA}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {statusInfo.secondaryCTA && (
              <Button variant="outline" className="text-gray-700">
                {statusInfo.secondaryCTA}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* What Makes This Different */}
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            AI That Actually Gets Your Relationship
          </CardTitle>
          <p className="text-gray-600">
            This isn't generic relationship advice. Our AI has read your profiles, understands your communication styles, 
            knows your stress triggers, and remembers your conversation history.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Knows your communication styles</h4>
                  <p className="text-sm text-gray-600">Understands how you both fight, make up, and everything in between</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Remembers your patterns</h4>
                  <p className="text-sm text-gray-600">Tracks what you've tried, what worked, what didn't</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Contextual advice</h4>
                  <p className="text-sm text-gray-600">Considers your life situation, stress levels, and relationship history</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">No judgment zone</h4>
                  <p className="text-sm text-gray-600">Ask about the messy, complicated, embarrassing stuff</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Available 24/7</h4>
                  <p className="text-sm text-gray-600">3am relationship crisis? We're here for it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Completely private</h4>
                  <p className="text-sm text-gray-600">Your conversations stay between you and the AI</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Questions from Real Relationships */}
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Real Questions from Real Relationships</CardTitle>
          <p className="text-gray-600">(Anonymous examples from our community)</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {realQuestions.map((item, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-50 border-gray-200" 
                onClick={() => handleQuestionClick(item.question)}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">"{item.question}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => setShowChat(true)}
              disabled={statusInfo.status === 'incomplete'}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Ask Your Own Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Questions */}
      {statusInfo.status !== 'incomplete' && (
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl">Quick Start Questions</CardTitle>
            <p className="text-gray-600">Jump right in with these conversation starters</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickStartQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-4 px-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => handleQuestionClick(question)}
                >
                  <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  "{question}"
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIInsights;
