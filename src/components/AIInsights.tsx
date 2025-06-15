
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, Sparkles, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const AIInsights = () => {
  const [apiKey, setApiKey] = useState("");
  const [situation, setSituation] = useState("");
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (!apiKey) {
      toast.error("Please enter your Anthropic API key");
      return;
    }

    if (!situation) {
      toast.error("Please describe the situation");
      return;
    }

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
            content: `As a relationship counselor, analyze this situation and provide personalized insights: ${situation}

Please provide:
1. Understanding of the emotional dynamics
2. Specific actionable suggestions
3. Communication strategies
4. Ways to show love and support

Format your response as structured advice that's empathetic and practical.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      const newInsight = {
        id: Date.now(),
        situation,
        advice: data.content[0].text,
        timestamp: new Date().toLocaleString()
      };

      setInsights([newInsight, ...insights]);
      setSituation("");
      toast.success("AI insights generated successfully!");
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error("Failed to generate insights. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Relationship Insights</h2>
        <p className="text-gray-600">Get personalized advice based on your unique situation and relationship profiles</p>
      </div>

      {/* API Key Input */}
      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Anthropic API Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Anthropic API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Anthropic API key"
            />
            <p className="text-sm text-gray-500 mt-1">
              Get your API key from{" "}
              <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                Anthropic Console
              </a>
            </p>
          </div>
        </div>
      </Card>

      {/* Situation Input */}
      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-fuchsia-600" />
          <h3 className="text-lg font-semibold text-gray-900">Describe Your Situation</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="situation">What's happening in your relationship?</Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe the situation, challenge, or question you'd like guidance on..."
              rows={4}
            />
          </div>
          <Button 
            onClick={generateInsights}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
          >
            {loading ? "Generating Insights..." : "Get AI Insights"}
          </Button>
        </div>
      </Card>

      {/* Generated Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Your Personalized Insights</h3>
          {insights.map((insight) => (
            <Card key={insight.id} className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">AI Relationship Guidance</h4>
                    <span className="text-sm text-gray-500">{insight.timestamp}</span>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 italic">"{insight.situation}"</p>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <pre className="whitespace-pre-wrap font-sans">{insight.advice}</pre>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Example Scenarios */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-fuchsia-50 border-pink-200/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Scenarios to Try:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setSituation("My partner has been stressed about work lately and seems distant. How can I best support them without being overwhelming?")}
              className="w-full text-left justify-start h-auto py-3 px-4"
            >
              <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Supporting a stressed partner</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setSituation("We've been having the same argument repeatedly about household chores. How can we break this cycle and find a better solution?")}
              className="w-full text-left justify-start h-auto py-3 px-4"
            >
              <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Resolving recurring conflicts</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setSituation("I want to plan something special for my partner's birthday that really shows I understand and appreciate them. What would be meaningful?")}
              className="w-full text-left justify-start h-auto py-3 px-4"
            >
              <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Planning meaningful gestures</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setSituation("We're going through a long-distance period and struggling to maintain intimacy and connection. What are some strategies to stay close?")}
              className="w-full text-left justify-start h-auto py-3 px-4"
            >
              <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Long-distance relationship tips</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIInsights;
