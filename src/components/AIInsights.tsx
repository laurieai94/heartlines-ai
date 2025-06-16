
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
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

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
        title: "✓ Ready to chat - Your AI knows you both",
        description: "Get personalized insights about your relationship dynamics",
        primaryCTA: "Start Your First Conversation",
        secondaryCTA: null
      };
    } else if (profilesComplete.your && !profilesComplete.partner) {
      return {
        status: "partial",
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: "⚠ AI knows you, but not your partner yet",
        description: "Add your partner's profile for relationship insights, or chat about personal growth and self-awareness",
        primaryCTA: "Chat About Yourself",
        secondaryCTA: "Add Partner Profile First"
      };
    } else {
      return {
        status: "incomplete",
        icon: <X className="w-5 h-5 text-red-500" />,
        title: "❌ Complete your profile first",
        description: "The AI needs to understand you before it can give personalized insights",
        primaryCTA: "Build Your Profile First",
        secondaryCTA: null
      };
    }
  };

  const statusInfo = getStatusInfo();

  const sampleQuestions = [
    {
      category: "Daily Relationship Stuff",
      examples: [
        "How do I bring up that they never do dishes without starting a fight?",
        "They seem stressed about work—how should I support them?",
        "Is it normal that we haven't had sex in three weeks?"
      ]
    },
    {
      category: "Communication Breakdowns",
      examples: [
        "We keep having the same fight about money. How do we break this cycle?",
        "They shut down when I try to talk about serious stuff. What do I do?",
        "I said something hurtful during our last fight. How do I fix this?"
      ]
    },
    {
      category: "Big Life Decisions",
      examples: [
        "Should we move in together? We've been dating for 8 months.",
        "They want kids, I'm unsure. How do we navigate this?",
        "Is couple's therapy worth it, or are we too far gone?"
      ]
    },
    {
      category: "The Messy Reality",
      examples: [
        "I think I'm falling out of love. Is this normal?",
        "I snooped through their phone and found something. Now what?",
        "My anxiety is ruining our relationship. How do I stop it?"
      ]
    }
  ];

  const realQuestions = [
    {
      title: "Communication Crisis",
      question: "We've been together 3 years but still can't fight without it becoming a screaming match. How do people argue without destroying each other?"
    },
    {
      title: "Life Transition",
      question: "I just got a job offer across the country. My partner is supportive but I can tell they're scared. How do we make this decision together?"
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

  const quickStartQuestions = [
    "How can I better support my partner when they're stressed?",
    "We keep fighting about the same things. How do we break this cycle?",
    "I'm feeling anxious about our relationship. Is this normal?",
    "How do I bring up difficult topics without starting a fight?"
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
      <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Your Personal Relationship Therapist</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get insights from AI that actually knows you, your partner, and your unique situation
        </p>
        <p className="text-lg text-gray-500 max-w-4xl mx-auto">
          Like having a therapist who's studied your relationship for months—except it's available 24/7, 
          knows all your patterns, and never judges your 3am relationship anxiety spirals.
        </p>
      </div>

      {/* Current Status */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {statusInfo.icon}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{statusInfo.title}</h3>
              <p className="text-gray-600">{statusInfo.description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => statusInfo.status === 'complete' || statusInfo.status === 'partial' ? setShowChat(true) : null}
              disabled={statusInfo.status === 'incomplete'}
            >
              {statusInfo.primaryCTA}
            </Button>
            {statusInfo.secondaryCTA && (
              <Button variant="outline">
                {statusInfo.secondaryCTA}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* What Makes This Different */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">AI That Actually Gets Your Relationship</CardTitle>
          <p className="text-gray-600">
            This isn't generic relationship advice. Our AI has read your profiles, understands your communication styles, 
            knows your stress triggers, and remembers that thing you mentioned about your ex three conversations ago. 
            It's like talking to someone who's been taking notes on your relationship this whole time.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Knows your communication styles</h4>
                  <p className="text-sm text-gray-600">Understands how you both fight, make up, and everything in between</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Remembers your patterns</h4>
                  <p className="text-sm text-gray-600">Tracks what you've tried, what worked, what spectacularly didn't</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Contextual advice</h4>
                  <p className="text-sm text-gray-600">Considers your life situation, stress levels, and relationship history</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold">No judgment zone</h4>
                  <p className="text-sm text-gray-600">Ask about the messy, complicated, embarrassing stuff</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Available 24/7</h4>
                  <p className="text-sm text-gray-600">3am relationship crisis? We're here for it</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What You Can Ask About */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Bring Us Your Relationship Questions (All of Them)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {sampleQuestions.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-semibold text-lg text-gray-900">{category.category}</h4>
                <div className="space-y-2">
                  {category.examples.map((example, exIndex) => (
                    <div 
                      key={exIndex}
                      className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleQuestionClick(example)}
                    >
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Your Personal Relationship Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-semibold">You ask anything</h4>
              <p className="text-sm text-gray-600">Type your question like you're texting a wise friend</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold">AI considers everything</h4>
              <p className="text-sm text-gray-600">Your profiles, relationship history, communication styles, current situation</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="font-semibold">Get personalized insights</h4>
              <p className="text-sm text-gray-600">Specific advice that fits your actual relationship, not generic tips</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <h4 className="font-semibold">Remember & adapt</h4>
              <p className="text-sm text-gray-600">Each conversation builds on the last, getting smarter about your relationship</p>
            </div>
          </div>

          {/* Sample Conversation */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-lg">Sample Conversation Preview</h4>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md">
                  "We had another fight about his ex and I don't know if I'm being crazy or if this is actually a problem"
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-lg max-w-md shadow-sm">
                  "Based on what you've shared about your attachment style and how conflicts usually go between you two, let's break this down. You mentioned feeling insecure when he talks about past relationships, and he tends to get defensive when you bring up concerns. This isn't about being 'crazy'—it's about getting on the same page about boundaries..."
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowChat(true)}
              disabled={statusInfo.status === 'incomplete'}
            >
              Try it yourself
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Trust */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-500" />
            Your Relationship Secrets Stay Secret
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">End-to-end privacy</h4>
                  <p className="text-sm text-gray-600">Your conversations stay between you and the AI</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">No judgment algorithms</h4>
                  <p className="text-sm text-gray-600">We don't flag, report, or share your relationship details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">You control sharing</h4>
                  <p className="text-sm text-gray-600">Choose what to share with your partner (or don't)</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Delete anytime</h4>
                  <p className="text-sm text-gray-600">Clear conversation history whenever you want</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Secure & encrypted</h4>
                  <p className="text-sm text-gray-600">Bank-level security for your relationship data</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Questions from Real Relationships */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Real Questions from Real Relationships</CardTitle>
          <p className="text-gray-600">(Anonymous examples from our community)</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {realQuestions.map((item, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuestionClick(item.question)}>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">"{item.question}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button 
              onClick={() => setShowChat(true)}
              disabled={statusInfo.status === 'incomplete'}
            >
              Ask your own question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
